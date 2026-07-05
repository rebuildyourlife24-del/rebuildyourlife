"""
content_generator.py
Genereert NIEUWE, eigen content (blog, videoscript, social posts) geïnspireerd
op de analyse van een bronvideo - in de stijl/het thema dat jij in config/style.yaml
hebt gedefinieerd.

Belangrijk: dit is bedoeld voor het maken van origineel, getransformeerd werk
(commentaar, samenvatting, eigen interpretatie) - niet voor het herpubliceren
van andermans werk. Zet disclaimer.bronvermelding op true in style.yaml om
altijd netjes naar de bron te verwijzen.
"""
import os

import anthropic

from .analyzer import VideoAnalysis

MODEL = "claude-sonnet-4-6"


class ContentGenerator:
    def __init__(self, style_config: dict, api_key: str | None = None):
        self.style = style_config
        self.client = anthropic.Anthropic(
            api_key=api_key or os.environ.get("ANTHROPIC_API_KEY")
        )

    def _call_claude(self, prompt: str, max_tokens: int = 1200) -> str:
        response = self.client.messages.create(
            model=MODEL,
            max_tokens=max_tokens,
            messages=[{"role": "user", "content": prompt}],
        )
        return response.content[0].text.strip()

    def _bronvermelding(self, video_url: str, channel_title: str) -> str:
        if self.style.get("disclaimer", {}).get("bronvermelding", True):
            return f"\n\n_Geïnspireerd op een video van {channel_title}: {video_url}_"
        return ""

    def generate_blog(self, analysis: VideoAnalysis, video_url: str, channel_title: str) -> str:
        brand = self.style["brand"]
        blog_cfg = self.style["blog"]

        prompt = f"""Je schrijft een origineel blogartikel in het {brand['taal']}, geïnspireerd op
onderstaande analyse van een YouTube video. Schrijf GEEN samenvatting van de video zelf,
maar een eigen artikel dat de onderwerpen vanuit een eigen invalshoek behandelt.

Merk: {brand['naam']}
Doelgroep: {brand['doelgroep']}
Toon: {brand['toon']}
Aanspreekvorm: {brand['perspectief']}
Gewenste lengte: ongeveer {blog_cfg['gewenste_lengte_woorden']} woorden
Structuur: {blog_cfg['structuur']}
Extra instructies: {blog_cfg.get('extra_instructies', '')}

Bron-analyse:
- Hoofdonderwerpen: {', '.join(analysis.hoofdonderwerpen)}
- Samenvatting: {analysis.samenvatting}
- Kernpunten: {'; '.join(analysis.kernpunten)}

Schrijf nu het volledige artikel, inclusief titel."""

        blog_text = self._call_claude(prompt, max_tokens=2000)
        return blog_text + self._bronvermelding(video_url, channel_title)

    def generate_video_script(self, analysis: VideoAnalysis) -> str:
        brand = self.style["brand"]
        script_cfg = self.style["video_script"]

        prompt = f"""Schrijf een origineel voice-over script in het {brand['taal']} voor een
nieuwe korte video, geïnspireerd op onderstaande analyse. Dit is GEEN vertaling of
samenvatting van de originele video - het is een eigen stuk in een eigen stijl.

Merk: {brand['naam']}
Doelgroep: {brand['doelgroep']}
Toon: {brand['toon']}
Gewenste lengte: circa {script_cfg['gewenste_lengte_seconden']} seconden gesproken tekst
Structuur: {script_cfg['structuur']}
Stem/stijl: {script_cfg['voice'] if 'voice' in script_cfg else script_cfg.get('stem', '')}

Bron-analyse:
- Hoofdonderwerpen: {', '.join(analysis.hoofdonderwerpen)}
- Samenvatting: {analysis.samenvatting}
- Kernpunten: {'; '.join(analysis.kernpunten)}

Geef het script met tussen [haakjes] korte regie-aanwijzingen voor beeld,
en de gesproken tekst normaal uitgeschreven."""

        return self._call_claude(prompt, max_tokens=1500)

    def generate_social_posts(self, analysis: VideoAnalysis, video_url: str, channel_title: str) -> dict:
        brand = self.style["brand"]
        platforms = self.style["social"]["platforms"]
        posts = {}

        for platform in platforms:
            prompt = f"""Schrijf een originele social media post voor {platform['naam']} in het
{brand['taal']}, geïnspireerd op onderstaande analyse.

Merk: {brand['naam']}
Doelgroep: {brand['doelgroep']}
Toon: {brand['toon']}
Vereisten voor dit platform: {platform['lengte']}

Bron-analyse:
- Hoofdonderwerpen: {', '.join(analysis.hoofdonderwerpen)}
- Samenvatting: {analysis.samenvatting}
- Kernpunten: {'; '.join(analysis.kernpunten)}

Geef ALLEEN de post zelf, geen uitleg erbij."""

            post_text = self._call_claude(prompt, max_tokens=500)
            posts[platform["naam"]] = post_text + self._bronvermelding(video_url, channel_title)

        return posts

    def generate_all(self, analysis: VideoAnalysis, video_url: str, channel_title: str) -> dict:
        """Genereert blog, videoscript en social posts in één keer."""
        return {
            "blog": self.generate_blog(analysis, video_url, channel_title),
            "video_script": self.generate_video_script(analysis),
            "social_posts": self.generate_social_posts(analysis, video_url, channel_title),
        }
