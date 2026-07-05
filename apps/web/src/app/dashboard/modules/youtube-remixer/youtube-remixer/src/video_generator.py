"""
video_generator.py
Optionele module: zet een videoscript om in een eenvoudige video met
gesproken narratie (TTS) en tekst-slides. Geen AI-beeldgeneratie nodig,
werkt volledig lokaal/gratis. Voor iets professioneler oogende video's
kun je zelf later stockbeelden of AI-gegenereerde afbeeldingen toevoegen
in de plek van de tekstslides (zie generate_basic_video hieronder).
"""
import os
import re

from gtts import gTTS
from moviepy.editor import (
    AudioFileClip,
    ColorClip,
    CompositeVideoClip,
    TextClip,
    concatenate_videoclips,
)

LANG_MAP = {
    "Nederlands": "nl",
    "Engels": "en",
}


def _split_into_scenes(script: str) -> list[str]:
    """
    Splitst een script grofweg op in scenes op basis van regie-aanwijzingen
    tussen [haakjes] of op dubbele newlines. Elke scene wordt een slide.
    """
    # Verwijder regie-aanwijzingen zelf uit de gesproken tekst, maar gebruik
    # ze wel als scene-markers.
    parts = re.split(r"\[[^\]]*\]", script)
    scenes = [p.strip() for p in parts if p.strip()]
    if not scenes:
        scenes = [script.strip()]
    return scenes


def generate_basic_video(
    script: str,
    output_path: str,
    taal: str = "Nederlands",
    video_size: tuple[int, int] = (1280, 720),
    bg_color: tuple[int, int, int] = (20, 20, 30),
    text_color: str = "white",
) -> str:
    """
    Genereert een eenvoudige video: elke scene wordt voorgelezen (TTS) met een
    bijpassende tekstslide. Retourneert het pad naar het gegenereerde bestand.
    """
    lang_code = LANG_MAP.get(taal, "en")
    scenes = _split_into_scenes(script)

    tmp_dir = os.path.join(os.path.dirname(output_path), "_tmp_audio")
    os.makedirs(tmp_dir, exist_ok=True)

    clips = []
    for i, scene_text in enumerate(scenes):
        audio_path = os.path.join(tmp_dir, f"scene_{i}.mp3")
        tts = gTTS(text=scene_text, lang=lang_code)
        tts.save(audio_path)

        audio_clip = AudioFileClip(audio_path)
        duration = audio_clip.duration

        background = ColorClip(size=video_size, color=bg_color, duration=duration)
        text_clip = (
            TextClip(
                scene_text,
                fontsize=40,
                color=text_color,
                size=(video_size[0] - 160, None),
                method="caption",
            )
            .set_position("center")
            .set_duration(duration)
        )

        scene_clip = CompositeVideoClip([background, text_clip]).set_audio(audio_clip)
        clips.append(scene_clip)

    final_video = concatenate_videoclips(clips, method="compose")
    final_video.write_videofile(output_path, fps=24, codec="libx264", audio_codec="aac")

    # Opruimen tijdelijke audio bestanden
    for f in os.listdir(tmp_dir):
        os.remove(os.path.join(tmp_dir, f))
    os.rmdir(tmp_dir)

    return output_path
