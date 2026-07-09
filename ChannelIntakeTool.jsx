"use client";

import { useState, useMemo } from "react";

/**
 * ChannelIntakeTool
 *
 * Drop-in React component for a Next.js dashboard. Generates platform-ready
 * bios/about-text (within each platform's character limit) and an editable
 * setup checklist, from a single set of brand fields.
 *
 * INTEGRATION NOTES
 * -----------------
 * - Pass `initialData` to pre-fill fields from your backend (e.g. the
 *   `BrandAssetProfile` record for a given BusinessUnit). Fields remain
 *   editable in the UI — treat AI-generated copy as a draft, not final.
 * - Pass `onSave(data)` to persist edits back to your API as the user types
 *   (debounce this yourself if you wire it to a live endpoint).
 * - Pass `onChecklistChange(progress)` if you want to sync checklist state
 *   (e.g. BusinessUnit.status) back to your database.
 * - Tailwind's default palette is used only (no arbitrary hex values), so it
 *   renders correctly without a custom Tailwind config.
 *
 * Example:
 *   <ChannelIntakeTool
 *     initialData={brandAssetProfile}
 *     onSave={(data) => fetch(`/api/business-units/${id}/brand-assets`, {
 *       method: "PUT", body: JSON.stringify(data)
 *     })}
 *   />
 */

const FIELD_DEFS = [
  { key: "companyName", label: "Bedrijfs-/merknaam", placeholder: "bijv. Noord Studio" },
  { key: "tagline", label: "Korte tagline", placeholder: "bijv. Slimme tools voor kleine bedrijven", maxLength: 120 },
  { key: "description", label: "Uitgebreide omschrijving", placeholder: "2-4 zinnen: wat je doet, voor wie, en wat het verschil maakt.", textarea: true },
  { key: "website", label: "Website", placeholder: "https://..." },
  { key: "email", label: "Zakelijk e-mailadres", placeholder: "hallo@bedrijf.nl" },
  { key: "phone", label: "Telefoonnummer", placeholder: "+31 6 ..." },
  { key: "location", label: "Plaats / regio", placeholder: "bijv. Utrecht, NL" },
  { key: "category", label: "Categorie / branche", placeholder: "bijv. Software, E-commerce, Advies" },
];

const DATA = {
  social: {
    label: "Social — organisch",
    items: [
      { name: "TikTok", limit: 80, kind: "bio", checklist: [
        "Telefoonnummer of e-mail voor verificatie",
        "Overschakelen naar Zakelijk account",
        "Vierkante profielfoto (min. 200×200px)",
        "Website-link toevoegen (na Pro-account)",
      ]},
      { name: "Instagram", limit: 150, kind: "bio", checklist: [
        "Telefoonnummer/e-mail verificatie",
        "Omzetten naar Bedrijfsaccount",
        "Categorie kiezen",
        "Contactknoppen instellen (e-mail/telefoon)",
      ]},
      { name: "YouTube", limit: 1000, kind: "about", checklist: [
        "Google-account nodig",
        "Kanaalnaam + uniek @handle",
        "Kanaalicoon en banner uploaden",
        "Telefoonverificatie voor volledige functies",
      ]},
      { name: "Facebook Pagina", limit: 255, kind: "about", checklist: [
        "Persoonlijk account nodig als paginabeheerder",
        "Paginacategorie kiezen",
        "Contactgegevens invullen",
        "Koppelen aan Meta Business Suite",
      ]},
      { name: "LinkedIn Bedrijfspagina", limit: 120, kind: "bio", checklist: [
        "Persoonlijk LinkedIn-account als admin",
        "Bedrijfswebsite (domeincontrole soms vereist)",
        "Logo + omslagfoto",
        "Branche en bedrijfsgrootte invullen",
      ]},
      { name: "X (Twitter)", limit: 160, kind: "bio", checklist: [
        "Telefoonnummerverificatie",
        "Profielfoto + headerafbeelding",
        "Website-link",
      ]},
      { name: "Pinterest", limit: 160, kind: "bio", checklist: [
        "Zakelijk account aanmaken/converteren",
        "Website claimen (meta-tag of DNS)",
        "Categorie kiezen",
      ]},
      { name: "Threads", limit: 150, kind: "bio", checklist: [
        "Vereist bestaand Instagram-account",
        "Profielfoto/bio kan worden overgenomen van IG",
      ]},
      { name: "Reddit", limit: 200, kind: "about", checklist: [
        "E-mailverificatie",
        "Karma opbouwen voor volledige postrechten",
        "Subreddit-regels checken vóór zelfpromotie",
      ]},
      { name: "Snapchat", limit: 80, kind: "bio", checklist: [
        "Telefoonverificatie",
        "Zakelijk account via Ads Manager voor extra functies",
      ]},
    ],
  },
  ads: {
    label: "Advertentie-accounts",
    items: [
      { name: "Meta Business Manager", checklist: [
        "KvK-nummer / bedrijfsregistratie",
        "Betaalmethode (creditcard)",
        "Soms identiteitsverificatie",
        "Domeinverificatie voor website-events",
      ]},
      { name: "Google Ads", checklist: [
        "Google-account",
        "Factuurgegevens bedrijf + betaalmethode",
        "Akkoord met advertentiebeleid (extra check bij bijv. gezondheid/financiën)",
      ]},
      { name: "TikTok Ads Manager", checklist: [
        "Bedrijfsgegevens invullen",
        "Betaalmethode",
        "Extra documenten bij gereguleerde branches",
      ]},
      { name: "LinkedIn Campaign Manager", checklist: [
        "Gekoppeld aan bestaande Bedrijfspagina",
        "Betaalmethode + factuuradres",
      ]},
      { name: "Pinterest Ads", checklist: [
        "Zakelijk account",
        "Betaalmethode",
      ]},
      { name: "Reddit Ads", checklist: [
        "Zakelijk account",
        "Betaalmethode",
        "Akkoord met content-beleid",
      ]},
      { name: "Microsoft/Bing Ads", checklist: [
        "Kan bestaand Google Ads-account importeren",
        "Betaalmethode",
      ]},
    ],
  },
  overig: {
    label: "Overig",
    items: [
      { name: "Google Bedrijfsprofiel", limit: 750, kind: "about", checklist: [
        "Bedrijfsnaam + adres of servicegebied",
        "Categorie kiezen",
        "Telefoonnummer",
        "Verificatie via post/telefoon/e-mail (kan dagen duren)",
      ]},
      { name: "Product Hunt", limit: 60, kind: "bio", checklist: [
        "Persoonlijk account",
        "Tagline (60 tekens)",
        "Beschrijving + afbeeldingen/gif",
      ]},
      { name: "WhatsApp Business", limit: 139, kind: "about", checklist: [
        "Uniek telefoonnummer (niet in gebruik bij gewone WhatsApp)",
        "Bedrijfsprofiel invullen (categorie, adres, openingstijden)",
      ]},
    ],
  },
};

function truncate(text, limit) {
  if (!text) return "";
  if (text.length <= limit) return text;
  return text.slice(0, limit - 1).trim() + "…";
}

export default function ChannelIntakeTool({ initialData = {}, onSave, onChecklistChange }) {
  const [form, setForm] = useState({
    companyName: "", tagline: "", description: "", website: "",
    email: "", phone: "", location: "", category: "",
    ...initialData,
  });
  const [activeTab, setActiveTab] = useState("social");
  const [checked, setChecked] = useState({});
  const [copiedKey, setCopiedKey] = useState(null);

  function updateField(key, value) {
    const next = { ...form, [key]: value };
    setForm(next);
    onSave?.(next);
  }

  function toggleCheck(key) {
    const next = { ...checked, [key]: !checked[key] };
    setChecked(next);
    const total = Object.values(DATA).reduce((sum, s) => sum + s.items.reduce((a, i) => a + i.checklist.length, 0), 0);
    const done = Object.values(next).filter(Boolean).length;
    onChecklistChange?.({ done, total, pct: total ? Math.round((done / total) * 100) : 0 });
  }

  function contactLine() {
    return [form.website, form.email].filter(Boolean).join(" · ");
  }

  function textFor(item) {
    const base = form.tagline || form.description || "";
    if (item.kind === "bio") return truncate(base, item.limit);
    const longBase = form.description || form.tagline || "";
    let text = truncate(longBase, item.limit);
    const cl = contactLine();
    if (cl && text.length + cl.length + 3 <= item.limit) {
      text = text ? `${text}\n\n${cl}` : cl;
    }
    return text;
  }

  const progress = useMemo(() => {
    const total = Object.values(DATA).reduce((sum, s) => sum + s.items.reduce((a, i) => a + i.checklist.length, 0), 0);
    const done = Object.values(checked).filter(Boolean).length;
    return { done, total, pct: total ? Math.round((done / total) * 100) : 0 };
  }, [checked]);

  async function copy(text, key) {
    await navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 1500);
  }

  const section = DATA[activeTab];

  return (
    <div className="max-w-6xl mx-auto p-6 font-sans text-stone-900">
      <header className="flex items-baseline justify-between border-b-2 border-stone-900 pb-4 mb-7 flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Kanaal Intake Tool</h1>
          <p className="text-xs uppercase tracking-wider text-stone-500">
            Eén keer invullen → per platform klaar-om-te-plakken content + checklist
          </p>
        </div>
        <div className="text-xs font-mono text-stone-500">
          {progress.done} / {progress.total} stappen afgevinkt
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-[320px_1fr] gap-7 items-start">
        {/* LEFT: form */}
        <div className="bg-white border border-stone-200 rounded-md p-5 md:sticky md:top-5">
          <h2 className="text-sm font-semibold mb-3">Bedrijfsgegevens</h2>
          {FIELD_DEFS.map((f) => (
            <div className="mb-3.5" key={f.key}>
              <label className="block text-[11px] uppercase tracking-wider text-stone-500 font-semibold mb-1">
                {f.label}
              </label>
              {f.textarea ? (
                <textarea
                  className="w-full border border-stone-200 rounded px-2.5 py-2 text-sm min-h-[64px] focus:outline-none focus:ring-2 focus:ring-emerald-700"
                  placeholder={f.placeholder}
                  value={form[f.key] || ""}
                  onChange={(e) => updateField(f.key, e.target.value)}
                />
              ) : (
                <input
                  className="w-full border border-stone-200 rounded px-2.5 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-700"
                  placeholder={f.placeholder}
                  maxLength={f.maxLength}
                  value={form[f.key] || ""}
                  onChange={(e) => updateField(f.key, e.target.value)}
                />
              )}
              {f.maxLength && (
                <div className="text-[10px] text-stone-400 text-right mt-0.5">
                  {(form[f.key] || "").length}/{f.maxLength}
                </div>
              )}
            </div>
          ))}

          <div className="flex items-center gap-3 mt-4 pt-4 border-t border-dashed border-stone-200">
            <div className="w-12 h-12 rounded-full border-2 border-amber-600 flex items-center justify-center font-bold text-xs text-amber-600 -rotate-6 shrink-0">
              {progress.pct}%
            </div>
            <p className="text-xs text-stone-500 leading-relaxed">
              Voortgang checklist over alle kanalen: <b className="text-stone-900">{progress.done} van {progress.total}</b> stappen.
            </p>
          </div>
        </div>

        {/* RIGHT: generated output */}
        <div>
          <nav className="flex gap-1.5 mb-5 flex-wrap">
            {Object.entries(DATA).map(([key, s]) => (
              <button
                key={key}
                onClick={() => setActiveTab(key)}
                className={`font-mono text-xs px-3.5 py-2 rounded border ${
                  activeTab === key
                    ? "bg-stone-900 text-white border-stone-900"
                    : "bg-white text-stone-500 border-stone-200"
                }`}
              >
                {s.label}
              </button>
            ))}
          </nav>

          <div className="grid gap-4" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(290px, 1fr))" }}>
            {section.items.map((item, idx) => {
              const text = item.limit ? textFor(item) : null;
              const doneCount = item.checklist.filter((_, sIdx) => checked[`${activeTab}-${idx}-${sIdx}`]).length;
              const snippetKey = `${activeTab}-${idx}`;
              return (
                <div key={item.name} className="bg-white border border-stone-200 rounded-md p-4 flex flex-col gap-2.5">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-semibold">{item.name}</h3>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 whitespace-nowrap">
                      {doneCount}/{item.checklist.length} klaar
                    </span>
                  </div>

                  {item.limit && (
                    <>
                      <div className="flex justify-between text-[10px] uppercase tracking-wide text-stone-500">
                        <span>{item.kind === "bio" ? "Bio" : "About-tekst"}</span>
                        <span>{(text || "").length}/{item.limit}</span>
                      </div>
                      <div className="bg-stone-50 border border-stone-200 border-l-4 border-l-emerald-700 rounded px-2.5 py-2 font-mono text-xs whitespace-pre-wrap break-words">
                        {text || "(vul links je gegevens in)"}
                      </div>
                      <button
                        onClick={() => copy(text || "", snippetKey)}
                        className={`self-start font-mono text-[11px] border rounded px-2.5 py-1 ${
                          copiedKey === snippetKey
                            ? "bg-emerald-700 border-emerald-700 text-white"
                            : "border-stone-900 text-stone-900"
                        }`}
                      >
                        {copiedKey === snippetKey ? "Gekopieerd ✓" : "Kopieer"}
                      </button>
                    </>
                  )}

                  <ul className="flex flex-col gap-1.5 mt-1">
                    {item.checklist.map((step, sIdx) => {
                      const key = `${activeTab}-${idx}-${sIdx}`;
                      return (
                        <li key={key} className="flex items-start gap-2 text-xs text-stone-500">
                          <input
                            type="checkbox"
                            className="mt-0.5 accent-emerald-700 shrink-0"
                            checked={!!checked[key]}
                            onChange={() => toggleCheck(key)}
                          />
                          <span className={checked[key] ? "line-through text-stone-300" : ""}>{step}</span>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <footer className="mt-10 pt-4 border-t border-stone-200 text-xs text-stone-500 leading-relaxed">
        Let op: dit hulpmiddel genereert alleen tekst en toont wat elk platform vereist — het aanmaken en verifiëren
        van elk account blijft een handmatige stap per platform. Behandel AI-gegenereerde copy als concept: controleer
        elk model kort voordat je "Kopieer" gebruikt, vooral bij claims over gezondheid, financiën of resultaten.
      </footer>
    </div>
  );
}
