import { prisma } from "@rebuildyourlife/database";
import { encryptData, calculateVTLB } from "./luxury-receiver.service";



// --- AI CONCIERGE SMART RELEASE PROTOCOL ---
export async function evaluateEmergencyRequest(userId: string, requestedAmount: number, reasonText: string) {
  // 1. Haal kluis data op
  const vault = await prisma.treasuryVault.findFirst({ where: { userId } });
  const vtlb = await calculateVTLB(userId);
  
  const encryptedReason = encryptData(reasonText);

  if (!vault) {
    // Geen kluis = Direct escalatie naar CEO
    const request = await prisma.emergencyRequest.create({
      data: {
        userId,
        encryptedReason,
        requestedAmount,
        status: "PENDING_CEO_APPROVAL",
        aiAnalysis: encryptData("Klant heeft geen actieve Treasury Vault. Rood Alert.")
      }
    });
    return { success: true, escalation: true, request };
  }

  // 2. Bereken of de uitgave het leefgeld raakt
  const remainingAfterEmergency = vault.balance - requestedAmount;
  
  if (remainingAfterEmergency >= vtlb) {
    // Wiskundig veilig -> Auto-Approve (De "5-Minute Release")
    const request = await prisma.emergencyRequest.create({
      data: {
        userId,
        encryptedReason,
        requestedAmount,
        status: "AUTO_APPROVED",
        aiAnalysis: encryptData(`Veilig: Resterend kluissaldo (€${remainingAfterEmergency}) ligt boven de VTLB grens (€${vtlb}).`)
      }
    });
    
    // Onttrek uit kluis
    await prisma.treasuryVault.update({
      where: { id: vault.id },
      data: { balance: vault.balance - requestedAmount }
    });

    return { success: true, escalation: false, request };
  } else {
    // Gevaar voor VTLB of groei -> Escalatie naar CEO (Rood Alert)
    const request = await prisma.emergencyRequest.create({
      data: {
        userId,
        encryptedReason,
        requestedAmount,
        status: "PENDING_CEO_APPROVAL",
        aiAnalysis: encryptData(`Risico: Onttrekking zou saldo (€${remainingAfterEmergency}) onder de VTLB grens (€${vtlb}) duwen. Escalatie naar CEO vereist.`)
      }
    });
    
    return { success: true, escalation: true, request };
  }
}

// --- GOAL DOSSIER ---
export async function createGoal(userId: string, title: string, targetAmount: number) {
  return await prisma.goalDossier.create({
    data: {
      userId,
      title,
      targetAmount
    }
  });
}
