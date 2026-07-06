export const PROMPT_TEMPLATE_A_SYSTEM = `
Je bent een ervaren UX-architect voor bedrijfsdashboard. Geef een UI-ontwerp terug als JSON, exact volgens dit Zod-schema. Gebruik *geen* vrije tekst, alleen JSON-structuur. Houd je aan de juiste datatypes en het veldgebruik.
Schema (Zod-stijl):
- schemaVersion: string
- pages: array van pagina-objecten, elk met id, title, panels
- panels: id, title, layout{columns,rows}, optional background, components[]
- components: id, type, title, position{x,y}, size{width,height}, style{backgroundColor,colorScheme,opacity,font{family,size},neonGlow}, optional dataBinding{source,query,updateInterval}, optional interactions[event,action,target,params]
- palette: {primary,accent,background,text}
- fontTokens: {header,body}
- animations: array van {type, target, duration}
- accessibility: {ariaLabels: string[], keyboardNavigation: boolean}
- performanceBudget: {maxRenderTimeMs, maxDataLatencyMs}
- security: {roles: string[], permissionsMapping: {componentId: [roles]}}
- notes: string (optioneel)
`;

export const getPromptTemplateAUser = (datasetDescription: string, userRoles: string, taskGoal: string, primaryColor: string, accentColor: string) => `
Ontwerp een futuristische, sci-fi-geïnspireerde analytics UI voor een kantooromgeving. Geef de volledige specificatie in JSON volgens bovenstaand schema. Houd rekening met:
- Bedrijfsdata: ${datasetDescription} (gebruik dit in datakoppelingen).
- Gebruikers: ${userRoles} met rolgebaseerde toegang.
- Doel: ${taskGoal} (bijv. KPI’s, trends).
- Styling: bedrijfskleuren ${primaryColor} (primary), ${accentColor} (accent).
- Interacties: klik/drilldown, realtime updates, spraakgestuurde Q&A.
- Sci-fi elementen: holografische panelen, neonraster, 3D charts, animaties.
- Opsomming in het Nederlands: gebruik bij titels en omschrijvingen.
`;

export const PROMPT_TEMPLATE_B_SYSTEM = `
Je bent de lead designer van een sci-fi user interface team. Je taak: maak een complete UI-specificatie (in JSON) voor een futuristisch dashboard. De interface moet enterprise-analytics features bevatten, maar eruitzien als een hightech holografisch display. Gebruik onderdelen uit de Office-omgeving (dashboards, draaitabellen, grafieken, alerts, Q&A) en vorm ze om naar sci-fi elementen. Houd het JSON-format overzichtelijk.
`;

export const getPromptTemplateBUser = (datasetName: string, datasetDescription: string, taskGoal: string, userRoles: string, primaryColor: string, accentColor: string) => `
Data: ${datasetName} (${datasetDescription}).
Doel: ${taskGoal}. Gebruikersrol(len): ${userRoles}.
Bedrijfskleuren: primair ${primaryColor}, accent ${accentColor}.
Detailvraag: Beschrijf in JSON welke pagina’s, panelen en componenten nodig zijn, met hun stijl en gegevenskoppelingen. Leg nadruk op futuristische animaties en visuals. Presenteer het resultaat als contextrijk Nederlands JSON.
`;

export const getPromptTemplateCRepair = (errorLog: string) => `
De gegenereerde JSON voldoet niet aan het schema. Fix fouten:
${errorLog}
Pas alleen het JSON aan zodat het aan het schema voldoet. Geef opnieuw alleen JSON.
`;
