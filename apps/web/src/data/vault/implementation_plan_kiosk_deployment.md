# SYSTEEM ARCHITECTUUR & DEVOPS OVERVIEW: 2-FASE IMPLEMENTATIE

## 1. Architectuur Overview
Dit systeem transformeert een standaard laptop naar een ondoordringbare, single-purpose enterprise kiosk via een gecontroleerde, risicovrije testfase. De architectuur is modulair opgebouwd waarbij de applicatielaag volledig gescheiden is van de OS-laag.

**Core Lagen:**
- **OS Layer (Windows):** Beheert rechten, netwerk, en kiosk policies (inactief in Fase 1).
- **Controller Layer (Orion AI Core):** Beheert geautomatiseerde taken, logging en systeemgezondheid.
- **Database Layer (SQLite):** Centrale opslag voor alle configuraties, state-tracking en rollback-points.
- **Backup & Recovery Engine:** Geautomatiseerde snapshotting tool (VSS/Powershell gebaseerd).

---

## 2. Modules
Het systeem bestaat uit vier onafhankelijke modules:
1. **Module: Telemetry & Logging** (Verzamelt CPU/RAM usage, crash logs, netwerkactiviteit).
2. **Module: Task Automation** (Draait scripts in dry-run via de Orion controller).
3. **Module: Snapshot & Vault** (Maakt incrementele backups van de database en kritieke mappen).
4. **Module: Policy Manager** (Beheert de registry keys voor lockdown, pas actief na goedkeuring).

---

## 3. Testfase (48 Uur Plan)
**Doel:** Bewijzen dat de applicatiestack (Next.js/Node/Ollama) stabiel draait zonder OS-restricties.
- **Uur 0 - 12:** Installatie van modules in "Audit Mode". Alle scripts rapporteren acties in plaats van ze uit te voeren (Dry-Run). Autostart wordt geactiveerd.
- **Uur 12 - 24:** Load testing. Genereren van zware AI-verzoeken om memory leaks en CPU-throttling te detecteren.
- **Uur 24 - 36:** Netwerk & Database stress test. Continu schrijven naar SQLite en verbinding simuleren.
- **Uur 36 - 48:** Simulatie van stroomuitval (Hard reboot) om de integriteit van de autostart-scripts en de database te valideren.

---

## 4. Test Metrics & Logging
Tijdens Fase 1 worden de volgende metrics continu vastgelegd in de SQLite database:
- **Stabiliteit:** Aantal onverwachte script crashes of Node.js restarts (Doel: 0).
- **Performance:** CPU pieken > 90% (tijdstip & duur) en RAM usage (Detectie van memory leaks in Ollama/Node).
- **Netwerk:** Connectie-drops met de Supabase bridge (Aantal retries nodig).
- **I/O:** Tijd benodigd voor het wegschrijven van geheugen naar SQLite.

---

## 5. Validatiecriteria
Na 48 uur wordt het validatie-rapport gegenereerd. De transitie naar Fase 2 gebeurt **uitsluitend** als:
- `CRASH_COUNT == 0` over de afgelopen 24 uur.
- `MEMORY_USAGE` blijft stabiel na load tests.
- Autostart scripts na de reboot 100% succesvol zijn geladen binnen 30 seconden.
- De Backup Engine succesvol 2 restore points heeft gemaakt zonder corruptie.

**Rapport Output Format:** "AANBEVELING: KLAAR VOOR KIOSK" of "AANBEVELING: NIET KLAAR (Reden...)".

---

## 6. Kiosk Mode Ontwerp (Alleen na goedkeuring Fase 1)
Als Fase 1 groen licht krijgt, activeert de Policy Manager de lockdown:
- **Shell Replacement:** De Windows Explorer.exe wordt vervangen door de Orion Nexus Frontend. Geen startmenu, geen taakbalk.
- **App Whitelisting:** Via AppLocker mogen uitsluitend Node.js, Ollama, Chrome (Kiosk mode) en specifieke Python scripts draaien.
- **Network Restrictions:** Firewall blokkeert alles, behalve poort 11434 (Ollama) en de benodigde poorten voor de Supabase bridge.
- **Recovery Backdoor:** Een geheime toetsencombinatie of een verborgen USB-stick trigger (met een encrypted key) start een nood-Powershell script dat de Explorer terughaalt.

---

## 7. Backup & Restore Systeem
- **Data (SQLite & Documenten):** Elk uur een incrementele backup (ZIP encryptie) naar een afgeschermde partitie.
- **Config (Registry & Scripts):** Eén dagelijkse export van alle settings.
- **Restore:** Een `RESTORE.bat` script dat de database terugdraait naar de laatste succesvolle timestamp.

---

## 8. Database Structuur
**Engine: SQLite (`system_core.db`)**
- `Config_Table` (Key, Value, LastUpdated) - Bevat alle settings (bijv. `kiosk_enabled = false`).
- `Log_Table` (Timestamp, Module, Level, Message) - De audit-trail.
- `Snapshot_Table` (SnapshotID, Path, Type, Status) - Voor rollback referenties.

---

## 9. Migratieplan (Voor de nieuwe laptop)
1. Draai het `EXPORT_ENV.ps1` script op de oude laptop. Dit bundelt de SQLite database, de config files en de Orion scripts in één versleutelde map.
2. Installeer op de nieuwe laptop de kale dependencies (Node, Python, Ollama).
3. Draai het `IMPORT_ENV.ps1` script op de nieuwe laptop.
4. **BELANGRIJK:** Start de nieuwe laptop **ALTIJD** eerst in Fase 1 (Test Mode) gedurende 24 uur om hardware-specifieke problemen (drivers, koeling) uit te sluiten, vóórdat Kiosk Mode wordt geactiveerd.

---

## 10. Fail-Safe Recovery
Als Kiosk Mode faalt (bijv. black screen of vastgelopen frontend):
1. De System Manager (een kleine achtergrond-service die onafhankelijk draait van Node) detecteert dat de UI 60 seconden niet reageert (Heartbeat failure).
2. De service forceert een automatische herstart.
3. Bij 3 gefaalde herstarts binnen 15 minuten, wordt een **Automatic Rollback** getriggerd: de `kiosk_enabled` flag wordt op `false` gezet in de database en de normale Windows Explorer wordt geladen bij de volgende boot.
