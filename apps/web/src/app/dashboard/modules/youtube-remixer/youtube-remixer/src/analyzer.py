"""
analyzer.py
Gebruikt de Claude API om de inhoud van een video (of set video's) te analyseren:
onderwerpen, toon, structuur, kernpunten en citeerbare quotes.
"""
import json
import os
from dataclasses import dataclass, field

import anthropic

from .youtube_fetcher import VideoData

MODEL = "claude-sonnet-4-6"


@dataclass
class VideoAnalysis:
    video_id: str
    title: str
    samenvatting: str
    hoofdonderwerpen: list[str]
    toon_van_stem: str
    structuur: str
    kernpunten: list[str]
    quotes: list[str] = field(default_factory=list)


class Analyzer:
    def __init__(self, api_key: str | None = None):
        self.client = anthropic.Anthropic(
            api_key=api_key or os.environ.get("ANTHROPIC_API_KEY")
        )

    def analyze_video(self, video: VideoData) -> VideoAnalysis:
        if not video.transcript:
            raise ValueError(
                f"Geen transcript beschikbaar voor '{video.title}' - "
                "analyse zonder transcript wordt niet ondersteund."
            )

        prompt = f"""Analyseer de onderstaande YouTube video op basis van titel, beschrijving en transcript.
Geef ALLEEN een JSON object terug, geen andere tekst, geen markdown code fences.

Titel: {video.title}
Kanaal: {video.channel_title}
Beschrijving: {video.description[:1000]}

Transcript:
{video.transcript[:12000]}

Geef een JSON object met exact deze velden:
{{
  "samenvatting": "een objectieve samenvatting van 3-5 zinnen",
  "hoofdonderwerpen": ["onderwerp 1", "onderwerp 2", "..."],
  "toon_van_stem": "beschrijving van de toon/stijl van de spreker",
  "structuur": "korte beschrijving van hoe de video is opgebouwd (intro/kern/afsluiting etc)",
  "kernpunten": ["belangrijkste punt 1", "belangrijkste punt 2", "..."],
  "quotes": ["maximaal 3 korte illustratieve fragmenten uit het transcript, elk onder de 15 woorden"]
}}"""

        response = self.client.messages.create(
            model=MODEL,
            max_tokens=1500,
            messages=[{"role": "user", "content": prompt}],
        )

        text = response.content[0].text.strip()
        text = text.removeprefix("```json").removeprefix("```").removesuffix("```").strip()
        data = json.loads(text)

        return VideoAnalysis(
            video_id=video.video_id,
            title=video.title,
            samenvatting=data["samenvatting"],
            hoofdonderwerpen=data["hoofdonderwerpen"],
            toon_van_stem=data["toon_van_stem"],
            structuur=data["structuur"],
            kernpunten=data["kernpunten"],
            quotes=data.get("quotes", []),
        )

    def analyze_channel(self, videos: list[VideoData]) -> list[VideoAnalysis]:
        """Analyseert meerdere video's; slaat video's zonder transcript over."""
        analyses = []
        for video in videos:
            if not video.transcript:
                print(f"Overslaan (geen transcript): {video.title}")
                continue
            try:
                analyses.append(self.analyze_video(video))
            except Exception as e:
                print(f"Fout bij analyseren van '{video.title}': {e}")
        return analyses

    def synthesize_channel_trends(self, analyses: list[VideoAnalysis]) -> dict:
        """Distilleert overkoepelende thema's en patronen uit meerdere video-analyses."""
        if not analyses:
            raise ValueError("Geen analyses om te combineren.")

        combined = "\n\n".join(
            f"Video: {a.title}\nOnderwerpen: {', '.join(a.hoofdonderwerpen)}\n"
            f"Samenvatting: {a.samenvatting}"
            for a in analyses
        )

        prompt = f"""Hieronder staan analyses van meerdere video's van hetzelfde kanaal.
Geef ALLEEN een JSON object terug, geen andere tekst.

{combined}

Geef een JSON object met:
{{
  "terugkerende_thema_s": ["thema 1", "thema 2", "..."],
  "algemene_toon_kanaal": "beschrijving van de algemene toon/stijl van het kanaal",
  "content_gaten_of_kansen": ["een observatie over wat nog niet behandeld is of verder uitgediept kan worden", "..."]
}}"""

        response = self.client.messages.create(
            model=MODEL,
            max_tokens=1000,
            messages=[{"role": "user", "content": prompt}],
        )
        text = response.content[0].text.strip()
        text = text.removeprefix("```json").removeprefix("```").removesuffix("```").strip()
        return json.loads(text)
