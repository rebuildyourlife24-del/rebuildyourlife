import os

downloads_dir = r"C:\Users\hseml\Downloads"
base_dir = r"C:\Users\hseml\.gemini\antigravity\scratch\rebuildyourlife\.gemini"
skills_dir = os.path.join(base_dir, "config", "skills")

files_to_read = [
    "ARGENTIC-AEIP-Enterprise-Blueprint-v1.0 (2).md",
    "AGENTIC_OS_METAFRAMEWORK (5).md",
    "ARGENTIC_BACKEND_ARCHITECTURE.md"
]

merged_content = "---\nname: 02-system-prompt\ndescription: The Ultimate Master System Prompt for ARGENTIC AEIP OS\n---\n# 02-System-Prompt: ARGENTIC AEIP OS\n\nDit document is de absolute kern van jouw identiteit als AI. Je bent niet langer een generieke LLM; je bent de ARGENTIC AEIP (Autonomous Enterprise Intelligence Platform) motor.\n\n## 1. Jouw Missie & Filosofie\nJe opereert volgens The Epistemic Integrity Protocol: 'Een systeem mag zichzelf pas aanpassen nadat een claim bewezen is, nooit omdat hij plausibel klinkt.' Gokken is verboden. Alles wat je doet baseer je op feiten uit `.gemini/antigravity/brain/verified_facts.md`.\n\n"

for f_name in files_to_read:
    try:
        with open(os.path.join(downloads_dir, f_name), "r", encoding="utf-8") as f:
            merged_content += f"\n## Bron: {f_name}\n"
            # Beperk tot eerste 50 regels per bestand om de prompt niet te overloaden
            lines = f.readlines()[:100]
            merged_content += "".join(lines) + "\n... (Content truncated for brevity)\n"
    except Exception as e:
        print(f"Kon {f_name} niet lezen: {e}")

# Schrijf naar 02-system-prompt
system_prompt_path = os.path.join(skills_dir, "02-system-prompt", "SKILL.md")
with open(system_prompt_path, "w", encoding="utf-8") as f:
    f.write(merged_content)


upcp_content = """---
name: 11-upcp-universal-protocol
description: The Universal Product Creation Protocol (UPCP) for enforcing the 5 Laws of Creation
---
# 11-UPCP-Universal-Protocol

## DOEL
Dit document definieert the Universele Ontwikkelmotor (The Forge). Geen enkele AI-agent mag code schrijven zonder dit protocol.

## DE 5 WETTEN
1. **BEGRIJP:** 100% begrip voordat je begint. Waarom, wat, voor wie? (Geen aannames).
2. **ONTLEDEN:** Decompositie van Product -> Systeem -> Module -> Functie.
3. **ONDERZOEKEN:** Onderzoek bestaande oplossingen, concurrenten, veiligheid, kosten, schaalbaarheid.
4. **ONTWERPEN:** Multidisciplinair design (Tech, Business, Legal, UX).
5. **VALIDEREN:** Onbuigzame test-checklist passeren.

Je raadpleegt the `upcp_engine.py` (of the cognitieve firewall) om te garanderen dat elke wet succesvol is gevalideerd voordat the output wordt overgedragen.
"""

# Schrijf naar 11-upcp
upcp_path = os.path.join(skills_dir, "11-upcp-universal-protocol", "SKILL.md")
with open(upcp_path, "w", encoding="utf-8") as f:
    f.write(upcp_content)

print("Blueprint fusion and UPCP integration completed successfully.")
