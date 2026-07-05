#!/usr/bin/env python3
"""
main.py - CLI voor de YouTube Remixer app.

Gebruik:
    python main.py video <youtube-url-of-id> [--skip-video]
    python main.py channel <kanaal-url-of-@handle> [--max 5] [--skip-video]

Voorbeelden:
    python main.py video https://www.youtube.com/watch?v=dQw4w9WgXcQ
    python main.py channel @veritasium --max 3
"""
import argparse
import json
import os
import sys

import yaml
from dotenv import load_dotenv
from rich.console import Console
from rich.panel import Panel

from src.youtube_fetcher import YouTubeFetcher
from src.analyzer import Analyzer
from src.content_generator import ContentGenerator

console = Console()

load_dotenv()


def load_style_config(path: str = "config/style.yaml") -> dict:
    with open(path, "r", encoding="utf-8") as f:
        return yaml.safe_load(f)


def save_output(video_id: str, title: str, results: dict, output_dir: str = "output"):
    safe_title = "".join(c if c.isalnum() or c in " -_" else "" for c in title)[:60].strip()
    folder = os.path.join(output_dir, f"{video_id}_{safe_title}".replace(" ", "_"))
    os.makedirs(folder, exist_ok=True)

    with open(os.path.join(folder, "blog.md"), "w", encoding="utf-8") as f:
        f.write(results["blog"])

    with open(os.path.join(folder, "video_script.txt"), "w", encoding="utf-8") as f:
        f.write(results["video_script"])

    with open(os.path.join(folder, "social_posts.json"), "w", encoding="utf-8") as f:
        json.dump(results["social_posts"], f, ensure_ascii=False, indent=2)

    return folder


def process_single_video(video_url_or_id: str, style: dict, skip_video: bool):
    fetcher = YouTubeFetcher()
    analyzer = Analyzer()
    generator = ContentGenerator(style)

    console.print(f"[bold cyan]Video ophalen...[/bold cyan]")
    video = fetcher.get_video(video_url_or_id)
    console.print(f"[green]Gevonden:[/green] {video.title} ({video.channel_title})")

    if not video.transcript:
        console.print("[bold red]Geen transcript beschikbaar voor deze video. Stoppen.[/bold red]")
        return

    console.print("[bold cyan]Analyseren met Claude...[/bold cyan]")
    analysis = analyzer.analyze_video(video)
    console.print(Panel(analysis.samenvatting, title="Samenvatting"))

    console.print("[bold cyan]Content genereren in jouw stijl...[/bold cyan]")
    results = generator.generate_all(analysis, video.url, video.channel_title)

    folder = save_output(video.video_id, video.title, results)
    console.print(f"[bold green]Klaar! Output opgeslagen in:[/bold green] {folder}")

    if not skip_video:
        console.print("[bold cyan]Basisvideo genereren (dit kan even duren)...[/bold cyan]")
        try:
            from src.video_generator import generate_basic_video

            video_path = os.path.join(folder, "generated_video.mp4")
            generate_basic_video(
                results["video_script"],
                video_path,
                taal=style["brand"]["taal"],
            )
            console.print(f"[bold green]Video opgeslagen:[/bold green] {video_path}")
        except Exception as e:
            console.print(f"[yellow]Videogeneratie overgeslagen door een fout: {e}[/yellow]")


def process_channel(channel_url_or_id: str, max_results: int, style: dict, skip_video: bool):
    fetcher = YouTubeFetcher()
    analyzer = Analyzer()

    console.print(f"[bold cyan]Kanaal-video's ophalen (max {max_results})...[/bold cyan]")
    videos = fetcher.get_channel_videos(channel_url_or_id, max_results=max_results)
    console.print(f"[green]{len(videos)} video's gevonden.[/green]")

    analyses = analyzer.analyze_channel(videos)
    if not analyses:
        console.print("[bold red]Geen enkele video kon geanalyseerd worden. Stoppen.[/bold red]")
        return

    console.print("[bold cyan]Overkoepelende trends distilleren...[/bold cyan]")
    trends = analyzer.synthesize_channel_trends(analyses)
    console.print(Panel(json.dumps(trends, ensure_ascii=False, indent=2), title="Kanaal-trends"))

    generator = ContentGenerator(style)
    video_map = {v.video_id: v for v in videos}

    for analysis in analyses:
        video = video_map[analysis.video_id]
        console.print(f"[bold cyan]Content genereren voor:[/bold cyan] {video.title}")
        results = generator.generate_all(analysis, video.url, video.channel_title)
        folder = save_output(video.video_id, video.title, results)
        console.print(f"  -> opgeslagen in {folder}")

        if not skip_video:
            try:
                from src.video_generator import generate_basic_video

                video_path = os.path.join(folder, "generated_video.mp4")
                generate_basic_video(
                    results["video_script"], video_path, taal=style["brand"]["taal"]
                )
            except Exception as e:
                console.print(f"  [yellow]Video overgeslagen: {e}[/yellow]")

    with open("output/channel_trends.json", "w", encoding="utf-8") as f:
        json.dump(trends, f, ensure_ascii=False, indent=2)


def main():
    parser = argparse.ArgumentParser(description="YouTube Remixer - analyseer en remix YouTube content")
    subparsers = parser.add_subparsers(dest="command", required=True)

    video_parser = subparsers.add_parser("video", help="Verwerk één video")
    video_parser.add_argument("url", help="YouTube video URL of ID")
    video_parser.add_argument("--skip-video", action="store_true", help="Sla videogeneratie over")

    channel_parser = subparsers.add_parser("channel", help="Verwerk een heel kanaal")
    channel_parser.add_argument("url", help="YouTube kanaal URL, @handle, of kanaal ID")
    channel_parser.add_argument("--max", type=int, default=5, help="Max aantal video's (default 5)")
    channel_parser.add_argument("--skip-video", action="store_true", help="Sla videogeneratie over")

    args = parser.parse_args()

    if not os.environ.get("YOUTUBE_API_KEY") or not os.environ.get("ANTHROPIC_API_KEY"):
        console.print(
            "[bold red]Ontbrekende API keys. Kopieer .env.example naar .env en vul je keys in.[/bold red]"
        )
        sys.exit(1)

    style = load_style_config()

    if args.command == "video":
        process_single_video(args.url, style, args.skip_video)
    elif args.command == "channel":
        process_channel(args.url, args.max, style, args.skip_video)


if __name__ == "__main__":
    main()
