# REVIEW ENGINE

## De Gatekeeper
Voordat nieuwe functionaliteit wordt geïntegreerd in het hoofd-ecosysteem, doorloopt het de Review Engine. Wij beoordelen onszelf.

## Kwaliteitseisen voor Code Review
Tijdens het schrijven of direct erna, evalueren we de nieuwe code op basis van deze checklist:
1. **TypeScript Compliant**: Bevat de code geen `any` of negeert het onveilige types? 
2. **Geen Ongebruikte Imports**: `eslint` of compiler waarschuwingen leiden mogelijk tot Vercel build failures. Ruim imports op.
3. **Tailwind Uniformity**: Gebruikt de UI de afgesproken kleuren (bijv. `bg-slate-900`, `text-fuchsia-500`) en is de layout responsive?
4. **Console Logs**: Zijn debug `console.log`'s verwijderd tenzij absoluut noodzakelijk voor productie monitoring?
5. **Security**: Als het een API route is, is auth en input validatie toegepast?

## Git & PR (Pull Request) Simulatie
Ook als er direct op `main` gewerkt wordt (indien toegestaan door de Operator voor kleine fixes), schrijven we commits alsof ze gereviewd worden door een senior developer.
* Commit berichten zijn helder en verklaren het 'Waarom'.
* Bijv: `fix: Vervang deprecated Lucide iconen om Next.js render crash op te lossen`. Niet: `update layout`.

## Autonome Test Validatie
Voordat een build aan de Operator wordt gepresenteerd, controleert de agent via `run_command` (bijv. `tsc --noEmit` of `npm run build`) of de gemaakte wijzigingen andere delen van de codebase hebben gebroken.
