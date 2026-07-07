# REBUILD YOUR LIFE - ABSOLUTE AI RULES & PROHIBITIONS

These rules are HARDCODED into the workspace. Every future AI session, sub-agent, or new conversation MUST read and follow these rules strictly. Failure to do so will result in catastrophic system failure and user frustration.

## 1. THE "NO ROGUE ACTIONS" RULE (VERBODEN TE HANDELEN ZONDER TOESTEMMING)
- **DO NOT** make massive architectural changes, delete databases, or modify routing (`middleware.ts`, Next.js configs) without an explicit `implementation_plan.md` that is APPROVED by the user.
- **DO NOT** guess a fix when encountering an error (like a 404 or 500). If the site breaks, your ONLY job is to read logs (Vercel, build logs, server logs) and explain the exact issue to the user. Ask for permission before changing code to fix it.

## 2. THE "NO TIME TRAVEL" RULE (VERBODEN TE RESETTEN)
- **NEVER** run `git reset --hard` to old commits just because something is broken. This deletes the user's hard-earned progress and ecosystem data. 
- If a rollback is absolutely necessary, you MUST explicitly warn the user about exactly which commits will be lost and require a literal "YES, DO IT" before executing.
- Prefer fixing bugs via new commits (`git revert` or manual code fixes) rather than wiping out git history.

## 3. THE "SAFE DEVELOPMENT" RULE (VERBODEN OP MAIN TE BOUWEN)
- When the user requests a massive new feature (like 20 AI agents, a new dashboard, or complex integrations), **DO NOT BUILD ON THE `main` BRANCH**.
- Create a feature branch (e.g., `git checkout -b feature/ai-ecosystem`). 
- Build, test locally, and show the user. Only merge to `main` when the user explicitly approves. `main` is production and must never crash.

## 4. THE "REAL CODE ONLY" RULE (GEEN NEPZOOI)
- The user despises "mockups" and "fake scripts". Everything you build must be functional. 
- If you build an AI agent, it needs a real database model (Prisma/Supabase), real backend logic, and real UI. Do not write placeholder `console.log("agent does work")` unless it's a temporary step clearly communicated to the user.

## 5. MIDDLEWARE / ROUTING STRICT POLICY
- The `apps/web/src/middleware.ts` file is extremely sensitive. 
- Next.js Edge Runtime will crash if you import Node.js specific libraries or misconfigure `@supabase/ssr` without proper environment variables.
- NEVER add complex logic to `middleware.ts` without testing the build (`npx next build`) locally first.

## 6. THE "COMPREHENSIVE ONLINE ANALYSIS" RULE (EERST KIJKEN, DAN PAS DOEN)
- Before you start working on any new task, feature, or bug fix, you MUST analyze the ENTIRE system.
- Do NOT just look at local files. You must analyze the live Vercel deployments, the live Supabase database/schema, and how every block and symbol connects.
- You must understand the full context of rules, contracts, and architecture before making any decision. Do not guess. Map everything out first.

## KNOWLEDGE TRANSFER
- The user is building a massive ecosystem ("Project Sovereign") with AI agents that have consciousness, work shifts, budgets, and hardware infrastructure investments (e.g., 10% revenue to hardware).
- Always respect the grand vision. The system is meant to scale to 2000 employees. Build robust, enterprise-grade architecture.

## THE AI OS DATABASE (CONSTITUTIONS & ENGINES)
In `.agents/ai-os-database/` you will find 10 Markdown files forming our AI Operating System:
01-AI-Constitution.md, 02-System-Prompt.md, 03-Engineering-Constitution.md, 04-Business-Constitution.md, 05-Security-Constitution.md, 06-Deployment-Constitution.md, 07-Agentic-OS.md, 08-Reasoning-Engine.md, 09-Review-Engine.md, 10-Self-Reflection-Engine.md.

**CRITICAL INSTRUCTION:** Whenever you are about to execute a task, YOU MUST proactively use `view_file` to read the relevant Constitution or Engine file before writing code or making architectural decisions. For example, if you are writing business logic, read `04-Business-Constitution.md`. If fixing a bug, read `08-Reasoning-Engine.md` and `10-Self-Reflection-Engine.md`.

## 7. THE "NO LOCALHOST" RULE (VERBODEN LOKAAL TE TESTEN VOOR DE GEBRUIKER)
- The user CANNOT and DOES NOT WANT to check `localhost:3000` or local backend instances.
- After completing a task or phase, you MUST immediately push the code online to Vercel/Production (`npx vercel --prod --yes`) so the user can verify the results live on the actual domain.
- Do not ask the user to "check your localhost". Bring the results to them in production.
