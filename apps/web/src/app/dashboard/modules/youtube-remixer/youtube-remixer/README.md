# YouTube Remixer

Analyseert een YouTube-video of -kanaal en genereert daar **nieuwe, eigen content**
van in jouw stijl: een blogpost, een videoscript (+ optioneel een basisvideo met
gesproken narratie), en social media posts voor LinkedIn/Instagram/X.

## ⚠️ Belangrijk: auteursrecht

Deze tool is gebouwd om **originele content te genereren die geïnspireerd is** op
de analyse van een bronvideo (thema's, structuur, toon) — niet om bestaande video's
1-op-1 te kopiëren, vertalen of herpubliceren. Let hierop:

- Gebruik dit voor commentaar, samenvattingen, reviews of eigen interpretaties.
- Zet `disclaimer.bronvermelding: true` in `config/style.yaml` (staat standaard aan)
  zodat elke output netjes naar de originele video verwijst.
- Herpubliceer nooit transcripten of scripts van anderen woordelijk als jouw eigen werk.
- Check de licentie/Creative Commons-status en YouTube's "reused content"-beleid
  voordat je iets publiceert, zeker als je het gaat monetizen.

## Setup

1. Installeer dependencies:
   ```bash
   pip install -r requirements.txt
   ```

2. Kopieer `.env.example` naar `.env` en vul je API keys in:
   ```bash
   cp .env.example .env
   ```
   - **YOUTUBE_API_KEY**: aanmaken via [Google Cloud Console](https://console.cloud.google.com/apis/credentials)
     (activeer daar de "YouTube Data API v3")
   - **ANTHROPIC_API_KEY**: aanmaken via [console.anthropic.com](https://console.anthropic.com/settings/keys)

3. Pas `config/style.yaml` aan naar jouw eigen merk/stijl/thema.

## Gebruik

**Eén video verwerken:**
```bash
python main.py video https://www.youtube.com/watch?v=VIDEO_ID
```

**Heel kanaal verwerken (laatste N video's):**
```bash
python main.py channel @naamvanhetkanaal --max 5
```

**Zonder videogeneratie (sneller, alleen tekst-output):**
```bash
python main.py video https://www.youtube.com/watch?v=VIDEO_ID --skip-video
```

## Output

Voor elke video komt er een map in `output/` met:
- `blog.md` — blogpost/nieuwsbrief in jouw stijl
- `video_script.txt` — script voor een nieuwe video
- `social_posts.json` — posts voor LinkedIn, Instagram en X
- `generated_video.mp4` — (optioneel) basisvideo met gesproken narratie + tekstslides

Bij kanaal-verwerking komt er ook `output/channel_trends.json` met overkoepelende
thema's en content-kansen over alle verwerkte video's heen.

## Projectstructuur

```
youtube-remixer/
├── main.py                  # CLI entry point
├── config/
│   └── style.yaml           # jouw eigen thema/stijl-configuratie
├── src/
│   ├── youtube_fetcher.py    # ophalen video/kanaal data + transcripten
│   ├── analyzer.py           # analyse met Claude API
│   ├── content_generator.py  # genereren blog/script/social in eigen stijl
│   └── video_generator.py    # optioneel: TTS + tekstslides naar mp4
├── requirements.txt
└── .env.example
```

## Uitbreidingsideeën

- **Betere video's**: vervang de tekstslides in `video_generator.py` door
  AI-gegenereerde afbeeldingen (bv. via een image-API) of stockbeelden.
- **Automatisch nieuwe uploads volgen**: draai `channel`-commando periodiek
  (bv. via een cronjob) en sla verwerkte video-ID's op om duplicaten te voorkomen.
- **Web-interface**: een simpele Flask/FastAPI-laag bovenop dezelfde `src/`-modules
  voor een browser-based versie in plaats van de CLI.
- **Meertaligheid**: zet `brand.taal` in `style.yaml` op een andere taal —
  de prompts en TTS passen automatisch mee (TTS ondersteunt momenteel nl/en).
