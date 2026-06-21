# 🛡️ THE GODBRAIN VAULT (BACKUP PROTOCOL)

Een imperium kan niet draaien zonder een kogelvrije backup. Als de laptop crasht, of als we een fout maken in de code, moet er een "Kluis" (Vault) zijn waar je met 1 druk op de knop naar terug kunt grijpen.

Hier is het plan om deze Backup Kluis te bouwen:

## 1. De Fysieke Kluis Locatie
We maken een streng beveiligde, aparte map aan op je computer, bijvoorbeeld:
`C:\Users\hseml\Desktop\De Kluis\Godbrain_Backups`
*(Je kunt deze map later ook koppelen aan OneDrive, Google Drive of een externe harde schijf).*

## 2. De "Panic Button" (Backup Script)
Ik ga een meedogenloos script voor je schrijven genaamd `BACKUP_NAAR_KLUIS.bat`. Dit bestand plaatsen we direct in je hoofdmap.
Als je hier dubbel op klikt, gebeurt het volgende razendsnel op de achtergrond:
1.  **Codebase Lock:** Hij pakt de volledige broncode van je platform (maar negeert zware, onnodige mappen zoals `node_modules` en `.next` zodat de backup bliksemsnel is).
2.  **Database Schema Snap:** Hij pakt de exacte structuur van je database (`schema.prisma`).
3.  **Timestamped Zip:** Hij perst alles samen in een `.zip` bestand genaamd `Godbrain_Backup_Dag-Maand-Jaar_Tijd.zip`.
4.  **Vault Transfer:** Hij schiet dit zip-bestand direct in de fysieke "Kluis" map op je bureaublad.

## 3. Automatische Defensie (Optioneel)
Als de knop werkt, kan ik je later ook precies uitleggen hoe we Windows vertellen om dit script *elke nacht om 03:00 uur* zelfstandig in de achtergrond te draaien. Zo heb je altijd een verse backup als je 's ochtends wakker wordt.

---

> [!CAUTION]
> **Cloud Database Opgeslagen**
> Omdat we momenteel Supabase/PostgreSQL in de cloud gebruiken voor de daadwerkelijke data (gebruikers, saldo's, etc.), is die data al beveiligd tegen een lokale laptop-crash. Dit script focust zich puur op het redden van de broncode en architectuur, zodat je het platform in 5 minuten weer live hebt na een totale computer crash.

> [!TIP]
> **User Review Required**
> Wil je dat ik de `BACKUP_NAAR_KLUIS.bat` Panic Button nu direct voor je programmeer? Klik op **Proceed** om groen licht te geven.
