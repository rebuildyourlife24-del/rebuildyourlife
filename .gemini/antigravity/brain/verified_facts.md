# Verified Facts (Baseline Scan)

## GITHUB / REPO
- **Remote**: https://github.com/rebuildyourlife24-del/REBUILDYOURLIFE123.git
- **Branch**: main

## PROJECT STRUCTUUR
- **Package Manager**: npm
- **Workspace Tool**: turbo (version ^2.5.0)
- **Workspaces**: apps/*, packages/*
- **Apps**: agent-engine, alaacode-intelligence, api, backend-os, command-center, enterprise-os, orion-mobile, rd-admin, web
- **Packages**: database, shared

## DATABASE (Supabase / Prisma)
- Prisma wordt gebruikt in `packages/database`
- Er zijn RLS (Row Level Security) SQL bestanden gevonden (`rls.sql`, `check_rls.js`)

## VERCEL & ENVIRONMENT
- **Verwachte Env Variabelen**: DATABASE_URL, DIRECT_URL, JWT_SECRET, JWT_REFRESH_SECRET, JWT_EXPIRES_IN, JWT_REFRESH_EXPIRES_IN, OPENAI_API_KEY, OPENAI_MODEL, GOOGLE_GENERATIVE_AI_API_KEY, NODE_ENV, API_PORT, API_URL, NEXT_PUBLIC_API_URL, FRONTEND_URL, MOLLIE_API_KEY, SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, FROM_EMAIL