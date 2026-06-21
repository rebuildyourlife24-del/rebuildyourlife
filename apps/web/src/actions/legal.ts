"use server";

export async function scanEmailForDebts() {
  // Simuleert de Godbrain die de IMAP folder leest en via GPT-4 facturen eruit filtert.
  // We wachten even om een "scan" te simuleren.
  await new Promise(r => setTimeout(r, 2000));

  return [
    {
      id: "scan-001",
      creditorName: "Intrum Justitia",
      originalAmount: 120.00,
      illegalCollectionFees: 40.00,
      totalClaimed: 160.00,
      status: "DETECTED",
      aiRecommendation: "Betwist de incassokosten (onrechtmatig toegevoegd). Bied €120,- aan als finale kwijting.",
      extractedFromEmail: "Herinnering 3 - Dossier 99482",
      dateFound: new Date().toISOString()
    },
    {
      id: "scan-002",
      creditorName: "KPN Zakelijk",
      originalAmount: 85.50,
      illegalCollectionFees: 15.00,
      totalClaimed: 100.50,
      status: "DETECTED",
      aiRecommendation: "Aanmaning KPN. Eis opschorting i.v.m. betwisting van de verbinding voordat we tot schikking overgaan.",
      extractedFromEmail: "Laatste Aanmaning: KPN Internet",
      dateFound: new Date().toISOString()
    }
  ];
}

export async function executeNegotiationProtocol(debtId: string, actionType: string) {
  // Simuleert het opstellen en verzenden van een juridisch antwoord via e-mail
  await new Promise(r => setTimeout(r, 3000));

  if (actionType === "DISPUTE_FEES") {
    return {
      success: true,
      message: "E-mail verzonden naar schuldeiser. Incassokosten zijn officieel betwist op basis van de WIK (Wet Incassokosten). Dossier is nu 'In Afwachting van Reactie'."
    };
  }

  if (actionType === "FINAL_SETTLEMENT") {
    return {
      success: true,
      message: "Harde schikking van 30% voorgesteld onder voorwaarde van finale kwijting. Reactie termijn van 14 dagen ingesteld."
    };
  }

  return { success: false, message: "Onbekend protocol." };
}
