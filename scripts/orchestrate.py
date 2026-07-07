import sys
import os
import asyncio
import subprocess

sys.path.append(os.path.join(os.path.dirname(__file__), '../apps/backend-os'))
from syndicate.guardian import deployment_guardian

def run_command(command: str, description: str):
    print(f"\n[Orchestrator] Running {description}...")
    try:
        # We use shell=True and check=True to abort on failure
        subprocess.run(command, shell=True, check=True)
        print(f"[PASS] {description} Passed.")
    except subprocess.CalledProcessError:
        print(f"[FAIL] {description} Failed. Deployment Aborted.")
        sys.exit(1)

def get_git_diff() -> str:
    # Try to get uncommitted changes first
    result = subprocess.run("git diff", shell=True, capture_output=True, text=True)
    diff = result.stdout.strip()
    if not diff:
        # If no uncommitted changes, get the last commit's diff
        result = subprocess.run("git diff HEAD~1 HEAD", shell=True, capture_output=True, text=True)
        diff = result.stdout.strip()
    # Limit diff size to prevent token explosion
    return diff[:30000] if diff else ""

async def main():
    print("\n" + "="*50)
    print("[START] ENTERPRISE DEPLOYMENT ORCHESTRATOR")
    print("="*50 + "\n")

    # Step 1: Requirements & Static Validation
    run_command("npm run lint --if-present", "Static Code Analysis (ESLint)")
    run_command("npm run build", "Build Verification (TypeScript & Next.js)")

    # Step 2: AI Multi-Agent Code Review & Risk Assessment
    print("\n[AI] [Orchestrator] Extracting Git Diff for AI Audit...")
    diff_text = get_git_diff()
    
    if not diff_text:
        print("[WARNING] No code changes detected. Bypassing AI Review.")
        verdict = {"score": 100, "verdict": "APPROVED", "reason": "No changes to review."}
    else:
        verdict = await deployment_guardian(diff_text)
        
        print("\n" + "-"*40)
        print("[REPORT] GUARDIAN DEPLOYMENT VERDICT")
        print("-"*40)
        print(f"Score: {verdict.get('score')}/100")
        print(f"Decision: {verdict.get('verdict')}")
        print(f"Reason: {verdict.get('reason')}")
        print("-"*40 + "\n")

    # Step 3: Deployment Approval
    if verdict.get("score", 0) < 90 or verdict.get("verdict") == "REJECTED":
        print("[FAIL] [Orchestrator] DEPLOYMENT BLOCKED by Deployment Guardian.")
        print("The AI Review team has flagged risks in your codebase. Please fix them before deploying.")
        sys.exit(1)
        
    print("[PASS] [Orchestrator] DEPLOYMENT APPROVED by Deployment Guardian.")
    
    # Step 4: Staging / Production Deployment (Vercel)
    # Using our flawlessly configured vercel push
    run_command("npx vercel --prod --yes", "Production Deployment (Canary/Vercel)")
    print("\n[DONE] [Orchestrator] Flawless Enterprise Deployment Complete!")

if __name__ == "__main__":
    asyncio.run(main())
