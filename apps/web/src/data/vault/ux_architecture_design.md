# Orion Core - Interaction Architecture
*Design Document by Senior UX Architect*

## The Philosophy: A Living AI Entity
The goal is to transition the interface from a "Sci-Fi Dashboard" to a "Living Entity". Orion is not a tool you use; Orion is an intelligent coworker that never sleeps. The UI must reflect continuous processing, situational awareness, and deep integration.

---

## 1. System States & Feedback Matrix

### State 1: IDLE (Monitoring)
*The system is resting but actively monitoring data streams.*
- **Animations:** 
  - Slow, rhythmic breathing effect on the central hologram (cyan glow expands/contracts every 4 seconds).
  - Background stars drift at 0.1x speed.
- **Transitions:** Baseline state.
- **Sound Concepts:** A very low, almost imperceptible low-pass filtered hum. Like a server room deep underwater.
- **UI Reactions:** Command Bar is semi-transparent (40% opacity). Agent Cards slowly cycle their localized statuses (e.g., "Monitoring SEO", "Cashflow stable").
- **Hologram Reactions:** The AI nodes in the brain constellation drift slowly, occasionally forming loose connections.

### State 2: THINKING (Processing Input)
*The user has submitted a command. Orion is analyzing.*
- **Animations:** 
  - Background dims by 40% to bring focus to the center.
  - Hologram pulse accelerates to a "heartbeat" rhythm (1.5s intervals).
  - Floating words from the prompt physically detach from the input bar and fly into the central hologram.
- **Transitions:** Smooth 300ms fade to dimmed background.
- **Sound Concepts:** A rising, subtle synth chord (like a deep inhale), followed by soft, rapid clicking (processing data).
- **UI Reactions:** Command Bar glows bright cyan. A progress bar appears: `ORION PROCESSING █░░░░`. Agent cards fade slightly to indicate centralized processing.
- **Hologram Reactions:** The neural nodes inside the brain spin rapidly; bright lines shoot between them indicating complex calculations.

### State 3: EXECUTING (Action Phase)
*Orion is actively performing the requested task.*
- **Animations:** 
  - A sweeping radar line moves across the screen.
  - The background stars accelerate (warp-speed effect, 2x speed).
- **Transitions:** Fast, energetic snap from THINKING.
- **Sound Concepts:** A continuous, steady mid-frequency hum with occasional digital "chirps" as milestones are reached.
- **UI Reactions:** The Command Bar updates progressively: `DATA COLLECTED` -> `INSIGHTS GENERATED`. Specific Agent Cards involved in the task light up and pulse.
- **Hologram Reactions:** Core brightness increases by 200%. The brain cavity fills with a dense, structured grid of light, showing absolute focus.

### State 4: COMPLETED (Mission Success)
*The task is done. Results are ready.*
- **Animations:** 
  - A subtle shockwave (ripple effect) emits from the central hologram across the screen.
  - Background stars decelerate back to idle.
- **Transitions:** Crisp, rewarding flash (100ms) followed by a 2-second fade back to IDLE.
- **Sound Concepts:** A soft, satisfying, low-pitched confirmation chime (like a high-end luxury car locking).
- **UI Reactions:** Command bar flashes green momentarily: `MISSION COMPLETE`. The results are displayed.
- **Hologram Reactions:** The brain flashes bright white/cyan once, then settles back into the slow breathing rhythm.

### State 5: ALERT (Attention Required)
*Orion has detected an anomaly or requires urgent user input.*
- **Animations:** 
  - UI borders pulse with a deep, warning amber/orange (not aggressive red, but urgent).
  - Subtle camera shake effect on the main container.
- **Transitions:** Abrupt override of current state.
- **Sound Concepts:** A double-pulse low frequency thud.
- **UI Reactions:** The specific Agent Card causing the alert expands slightly and glows amber. 
- **Hologram Reactions:** The neural nodes turn amber and cluster tightly together in the center of the brain.

---

## 2. Layered Interaction Architecture

### Layer 1: Ambient Life
- **Floating Particles:** Tiny, blurred cyan dots float infinitely in the background z-index.
- **Radar Sweeps:** Every 30 seconds, a very faint 5% opacity radar sweep crosses the screen.
- **Energy Ring:** The hologram is surrounded by a faint, rotating SVG dashed circle that never stops moving.

### Layer 2: AI Presence
- **Autonomous Notifications:** Instead of popups, text materializes organically near the hologram:
  - *T+0:00* -> `ORION OBSERVING`
  - *T+0:45* -> `DETECTED NEW TREND`
  - *T+1:30* -> `SYNCHRONIZING 14 DATABASES`
- These fade in (3s), hold (4s), and fade out (3s).

### Layer 3: Spatial Interface (Desktop)
- **Hover Connections:** When the user hovers over the "SEO Agent" card on the right, an animated SVG light-beam draws itself from the card directly into the central AIBrain. 
- **Feedback Text:** Text appears along the beam: `[SEO DATA STREAM ACTIVE]`.

---

## 3. Platform Architecture

### Desktop Behavior
The desktop utilizes the full width for a spatial command center.
- **Left:** Contextual logs and active windows.
- **Center:** The living Orion hologram. Always the focal point.
- **Right:** The Agent ecosystem. Constantly updating mini-dashboards.
- **Bottom:** The Command Bar. Wide, accessible, and glowing on focus.

### Mobile Behavior (App Experience)
Mobile is NOT a scaled-down desktop. It is a native swipe experience (`snap-x`).
- **Fixed Header:** `[ ORION CORE ]` is always visible.
- **Fixed Center:** The Hologram sits fixed in the upper half of the screen.
- **Fixed Footer:** The Command Bar is always thumb-accessible at the bottom.
- **Swipeable Carousel (The Middle):**
  - *Swipe Left (Agent View):* The living list of autonomous agents.
  - *Center (Mission View):* The data flowing into the hologram.
  - *Swipe Right (Analytics View):* Deep dive into the numbers.

---

*This architecture transforms the static interface into a Minority Report / Jarvis hybrid, where motion and state transitions provide 90% of the perceived intelligence.*
