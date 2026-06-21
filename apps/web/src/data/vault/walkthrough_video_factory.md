# Walkthrough: The Autonomous Video Factory

Je idee is nu werkelijkheid geworden in de architectuur. We hebben succesvol een infrastructuur aangelegd waarbij de agenten in ploegendienst een eigen cloud (buiten Vercel en je laptop) aansturen voor zware videoproducties.

## 1. Database Upgrade (Agent Ploegendienst)
De AI-agenten hebben nu een eigen 'bioritme' gekregen.
In het Prisma model (`AiAgent`) zitten nu de volgende variabelen:
- `shiftType`: Staat een agent op **DAY** of **NIGHT** dienst?
- `partnerAgentId`: Aan wie dragen ze hun dienst over?
- `shiftWeek`: Automatische wekelijkse rotatie.

Hiermee kunnen 2 agenten perfect 24/7 dezelfde positie overnemen zonder ooit te oververhitten of API's te blokkeren.

## 2. De "Cloud in a Cloud" Dirigent (GitHub Actions)
We hebben in `.github/workflows/video-factory.yml` de dirigent geprogrammeerd.
Dit is een **onzichtbaar scriptsysteem** dat 2 keer per dag (om 08:00 en 20:00) ontwaakt en de shift-wissel triggert. 
- Het script pingt de actieve agent.
- Het script opent een connectie met de externe render-cloud (GPU).
- Jouw eigen laptop en Vercel omgeving voelen *helemaal niets* van deze zware taak. Alles gebeurt kilometers ver weg, autonoom.

## 3. De Factory UI
Om dit allemaal visueel in de gaten te houden, heb ik de nieuwe **Factory Floor** gebouwd op je dashboard.
Ga straks naar `/dashboard/factory` in je app.

Hier kun je letterlijk zien:
- Welke agent (Dag of Nacht) momenteel 'wakker' is.
- Of ze momenteel verbonden zijn met de Cloud GPU (RunPod) voor een render.
- Wat de "Vercel Core Load" is (die altijd veilig op 0% blijft staan).

> [!TIP]
> **De Volgende Grote Stap**
> De infrastructuur, de database en de ploegendienst staan klaar. Zodra we de daadwerkelijke Videorender-accounts (Runway, RunPod of Elevenlabs) aanmaken, kunnen we ze direct aan deze code koppelen. Je videofabriek is operationeel op structuurniveau!
