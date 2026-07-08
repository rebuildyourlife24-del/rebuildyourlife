import os
import json

base_dir = r"C:\Users\hseml\.gemini\antigravity\scratch\rebuildyourlife"
brain_file = os.path.join(base_dir, ".gemini", "antigravity", "brain", "verified_facts.md")

facts = ["# Verified Facts (Baseline Scan)"]
facts.append("\n## GITHUB / REPO")
facts.append("- **Remote**: https://github.com/rebuildyourlife24-del/REBUILDYOURLIFE123.git")
facts.append("- **Branch**: main")

facts.append("\n## PROJECT STRUCTUUR")
try:
    with open(os.path.join(base_dir, "package.json"), "r") as f:
        pkg = json.load(f)
        facts.append(f"- **Package Manager**: npm")
        facts.append(f"- **Workspace Tool**: turbo (version {pkg.get('dependencies', {}).get('turbo', 'unknown')})")
        facts.append("- **Workspaces**: apps/*, packages/*")
except Exception as e:
    facts.append("- Fout bij lezen root package.json")

apps = []
if os.path.exists(os.path.join(base_dir, "apps")):
    for app in os.listdir(os.path.join(base_dir, "apps")):
        if os.path.isdir(os.path.join(base_dir, "apps", app)):
            apps.append(app)
facts.append(f"- **Apps**: {', '.join(apps)}")

packages = []
if os.path.exists(os.path.join(base_dir, "packages")):
    for pkg in os.listdir(os.path.join(base_dir, "packages")):
        if os.path.isdir(os.path.join(base_dir, "packages", pkg)):
            packages.append(pkg)
facts.append(f"- **Packages**: {', '.join(packages)}")

facts.append("\n## DATABASE (Supabase / Prisma)")
facts.append("- Prisma wordt gebruikt in `packages/database`")
facts.append("- Er zijn RLS (Row Level Security) SQL bestanden gevonden (`rls.sql`, `check_rls.js`)")

facts.append("\n## VERCEL & ENVIRONMENT")
env_keys = []
try:
    with open(os.path.join(base_dir, ".env.example"), "r") as f:
        for line in f:
            if "=" in line and not line.startswith("#"):
                env_keys.append(line.split("=")[0].strip())
    facts.append(f"- **Verwachte Env Variabelen**: {', '.join(env_keys)}")
except Exception as e:
    facts.append("- Geen .env.example gevonden of leesfout.")

with open(brain_file, "w", encoding="utf-8") as f:
    f.write("\n".join(facts))

print("Baseline scan written to verified_facts.md")
