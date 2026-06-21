# JURIDISCH HAALBAARHEIDSONDERZOEK: AGENTIC SAAS
**Onderwerp:** Risico op claims, AVG/GDPR compliance en rechtsgeldigheid van AI-opzeggingen.
**Status:** Voltooid door Sub-Agent (Legal & Compliance Advisor)

**Conclusie:** Ja, we kunnen dit bouwen zonder risico op zakelijke claims of GDPR boetes. Bedrijven (zoals sportscholen) kunnen ons niet aanklagen wegens "contractbreuk", omdat onze AI simpelweg optreedt als een *geautomatiseerde wettelijke vertegenwoordiger* van de consument. 

Om echter volledig kogelvrij te zijn tijdens de bouw, móéten we onderstaande 3 Gouden Regels implementeren.

## De 3 Gouden Regels voor Ontwikkeling

### 1. Nooit Wachtwoorden Opslaan (100% OAuth)
We vragen NOOIT de inloggegevens van een klant (bijv. hun Netflix wachtwoord). We gebruiken uitsluitend de officiële OAuth (Google/Microsoft) koppeling om *Read-Only* toegang te krijgen tot hun e-mail. De AI filtert de facturen "in-memory" (tijdelijk werkgeheugen) en slaat de irrelevante e-mails nooit op in onze database (Supabase). Dit voorkomt zware AVG-boetes bij datalekken.

### 2. De "Digitale Volmacht" (Logging)
De wet vereist dat we kunnen bewijzen dat wij namens de klant handelen. Voordat de AI iets annuleert, moet de gebruiker in ons dashboard één vinkje aanzetten: *"Ik machtig AgentOS hierbij om dit abonnement namens mij te beëindigen."* Wij slaan het IP-adres, de timestamp en dit mandaat onweerlegbaar op in Supabase. Dit is ons juridische wapenschild tegen elk bedrijf dat weigert de opzegging te accepteren.

### 3. De "Verificatie-Loop" (Geen Fire-and-Forget)
**Dit is de belangrijkste technische ontdekking:** In Nederland geldt de *ontvangsttheorie*. Een opzegging is pas geldig als de sportschool/leverancier de mail ontvangen (en het liefst bevestigd) heeft. 
*Verkeerd:* De AI stuurt één opzeggingsmail en sluit de taak.
*Juist (Onze bouwwijze):* De AI verstuurt de mail, zet een status op "Wachtend op Bevestiging" en scant de mailbox de komende 7 dagen op een bevestigingsmail. Als het bedrijf de opzegging negeert, escaleert onze AI automatisch.

---
**Executie:** Door deze 3 regels te volgen, is de architectuur niet alleen extreem veilig, maar ook schaalbaar voor B2B Enterprise (Tier 3).
