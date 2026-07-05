"""
youtube_fetcher.py
Haalt metadata, kanaalinformatie en transcripten op van YouTube video's.
"""
import os
import re
from dataclasses import dataclass, field
from typing import Optional

from googleapiclient.discovery import build
from youtube_transcript_api import YouTubeTranscriptApi
from youtube_transcript_api._errors import TranscriptsDisabled, NoTranscriptFound


@dataclass
class VideoData:
    video_id: str
    title: str
    description: str
    channel_title: str
    published_at: str
    view_count: int
    transcript: str = ""
    url: str = ""


def _extract_video_id(url_or_id: str) -> str:
    """Haalt het video ID uit een volledige URL of geeft de ID terug als die al kaal is."""
    patterns = [
        r"(?:v=|\/)([0-9A-Za-z_-]{11}).*",
        r"^([0-9A-Za-z_-]{11})$",
    ]
    for pattern in patterns:
        match = re.search(pattern, url_or_id)
        if match:
            return match.group(1)
    raise ValueError(f"Kon geen geldig video ID vinden in: {url_or_id}")


def _extract_channel_identifier(url: str) -> tuple[str, str]:
    """
    Bepaalt het type kanaal-identifier (handle, id, of username) uit een URL.
    Geeft terug: (type, waarde) waarbij type een van 'id', 'handle', 'username' is.
    """
    if "/channel/" in url:
        return "id", url.split("/channel/")[1].split("/")[0]
    if "/@" in url:
        return "handle", "@" + url.split("/@")[1].split("/")[0]
    if "/c/" in url or "/user/" in url:
        key = "/c/" if "/c/" in url else "/user/"
        return "username", url.split(key)[1].split("/")[0]
    # Als het al een kale handle of ID lijkt
    if url.startswith("@"):
        return "handle", url
    return "id", url


class YouTubeFetcher:
    def __init__(self, api_key: Optional[str] = None):
        self.api_key = api_key or os.environ.get("YOUTUBE_API_KEY")
        if not self.api_key:
            raise ValueError(
                "Geen YOUTUBE_API_KEY gevonden. Zet deze in je .env bestand."
            )
        self.youtube = build("youtube", "v3", developerKey=self.api_key)

    def get_video(self, url_or_id: str, include_transcript: bool = True) -> VideoData:
        """Haalt alle relevante data van één video op, inclusief transcript."""
        video_id = _extract_video_id(url_or_id)

        response = (
            self.youtube.videos()
            .list(part="snippet,statistics", id=video_id)
            .execute()
        )
        items = response.get("items", [])
        if not items:
            raise ValueError(f"Video niet gevonden: {url_or_id}")

        snippet = items[0]["snippet"]
        stats = items[0].get("statistics", {})

        transcript_text = ""
        if include_transcript:
            transcript_text = self._get_transcript(video_id)

        return VideoData(
            video_id=video_id,
            title=snippet["title"],
            description=snippet.get("description", ""),
            channel_title=snippet["channelTitle"],
            published_at=snippet["publishedAt"],
            view_count=int(stats.get("viewCount", 0)),
            transcript=transcript_text,
            url=f"https://www.youtube.com/watch?v={video_id}",
        )

    def _get_transcript(self, video_id: str) -> str:
        """Probeert eerst Nederlands, dan Engels, dan de eerste beschikbare taal."""
        try:
            try:
                transcript = YouTubeTranscriptApi.get_transcript(
                    video_id, languages=["nl", "nl-NL"]
                )
            except NoTranscriptFound:
                try:
                    transcript = YouTubeTranscriptApi.get_transcript(
                        video_id, languages=["en", "en-US"]
                    )
                except NoTranscriptFound:
                    transcript_list = YouTubeTranscriptApi.list_transcripts(video_id)
                    first_available = next(iter(transcript_list))
                    transcript = first_available.fetch()
            return " ".join(chunk["text"] for chunk in transcript)
        except TranscriptsDisabled:
            return ""
        except Exception:
            return ""

    def _resolve_channel_id(self, url_or_id: str) -> str:
        """Zet een handle/username/URL om naar een kanaal ID."""
        id_type, value = _extract_channel_identifier(url_or_id)

        if id_type == "id":
            return value

        if id_type == "handle":
            response = (
                self.youtube.channels()
                .list(part="id", forHandle=value.lstrip("@"))
                .execute()
            )
        else:  # username
            response = (
                self.youtube.channels()
                .list(part="id", forUsername=value)
                .execute()
            )

        items = response.get("items", [])
        if not items:
            raise ValueError(f"Kanaal niet gevonden: {url_or_id}")
        return items[0]["id"]

    def get_channel_videos(
        self, channel_url_or_id: str, max_results: int = 10, include_transcripts: bool = True
    ) -> list[VideoData]:
        """Haalt de meest recente video's van een kanaal op."""
        channel_id = self._resolve_channel_id(channel_url_or_id)

        channel_response = (
            self.youtube.channels().list(part="contentDetails", id=channel_id).execute()
        )
        channel_items = channel_response.get("items", [])
        if not channel_items:
            raise ValueError(f"Kanaal niet gevonden: {channel_url_or_id}")

        uploads_playlist_id = channel_items[0]["contentDetails"]["relatedPlaylists"][
            "uploads"
        ]

        playlist_response = (
            self.youtube.playlistItems()
            .list(
                part="contentDetails",
                playlistId=uploads_playlist_id,
                maxResults=min(max_results, 50),
            )
            .execute()
        )

        video_ids = [
            item["contentDetails"]["videoId"] for item in playlist_response.get("items", [])
        ]

        videos = []
        for vid in video_ids:
            try:
                videos.append(self.get_video(vid, include_transcript=include_transcripts))
            except Exception as e:
                print(f"Waarschuwing: kon video {vid} niet volledig ophalen ({e})")
        return videos
