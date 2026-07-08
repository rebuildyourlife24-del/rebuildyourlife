import os

base_dir = r"C:\Users\hseml\.gemini\antigravity\scratch\rebuildyourlife\.gemini"
brain_dir = os.path.join(base_dir, "antigravity", "brain")
skills_dir = os.path.join(base_dir, "config", "skills")

os.makedirs(brain_dir, exist_ok=True)
os.makedirs(skills_dir, exist_ok=True)

brain_files = {
    "verified_facts.md": "# Verified Facts\nAlleen bewezen, geciteerde feiten.\n",
    "unverified_hypotheses.md": "# Unverified Hypotheses\nVermoedens, expliciet gelabeld als ongetoetst.\n",
    "decisions_log.md": "# Decisions Log\nElke architecturale keuze + waarom.\n",
    "failure_log.md": "# Failure Log\nWat faalde, root cause, fix.\n",
    "contradiction_log.md": "# Contradiction Log\nWaar nieuwe info oude aanname tegenspreekt.\n"
}

for fname, content in brain_files.items():
    with open(os.path.join(brain_dir, fname), "w", encoding="utf-8") as f:
        f.write(content)

skills = [
    "01-ai-constitution", "02-system-prompt", "03-engineering-constitution",
    "04-business-constitution", "05-security-constitution", "06-deployment-constitution",
    "07-agentic-os", "08-reasoning-engine", "09-review-engine", "10-self-reflection-engine",
    "11-upcp-universal-protocol"
]

for s in skills:
    s_dir = os.path.join(skills_dir, s)
    os.makedirs(s_dir, exist_ok=True)
    content = f"---\nname: {s}\ndescription: Metaframework Skill for {s}\n---\n# {s}\n## Inhoud (nog te schrijven)\n"
    with open(os.path.join(s_dir, "SKILL.md"), "w", encoding="utf-8") as f:
        f.write(content)

print("Bootstrap Meta-router successfully completed.")
