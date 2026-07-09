import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';

const prisma = new PrismaClient();
const AUDIT_LOG_PATH = path.join(__dirname, "../../../deployment_audit.log");

// Helper to log externally (Point 7)
function auditLog(action: string, details: string) {
  const logLine = `[${new Date().toISOString()}] [${action}] ${details}\n`;
  fs.appendFileSync(AUDIT_LOG_PATH, logLine);
  console.log(logLine.trim());
}

async function runFactoryWorker() {
  auditLog("SYSTEM", "Business Model Factory (BMF) Worker Initiated.");

  // Point 6: Master Kill Switch
  if (process.env.MASTER_KILL_SWITCH === "true") {
    auditLog("FATAL", "MASTER_KILL_SWITCH is enabled. Factory shutting down immediately.");
    return;
  }

  // Point 5: Dry-Run Mode (Always default to true for safety)
  const isDryRun = true; 

  // Point 2.5: Global Tempo Limit on New Models
  const newlyCreatedToday = await prisma.businessUnit.count({
    where: {
      createdAt: { gte: new Date(Date.now() - 24 * 60 * 60 * 1000) } // Last 24 hours
    }
  });

  if (newlyCreatedToday >= 2) {
    auditLog("TEMPO_LIMIT", `Max 2 new models per dag bereikt. BMF stopt om "scale-explosie" te voorkomen.`);
    return;
  }

  console.log("🔍 Searching for VALIDATED Revenue Intelligence Genomes...");
  const pendingGenome = await prisma.revenueIntelligenceGenome.findFirst({
    where: { status: "VALIDATED" }
  });

  if (!pendingGenome) {
    console.log("✅ No VALIDATED models found for deployment.");
    return;
  }

  auditLog("DEPLOY", `Processing Genome: ${pendingGenome.modelName}`);

  // Create Business Unit
  const unit = await prisma.businessUnit.create({
    data: {
      genomeId: pendingGenome.id,
      status: "PROVISIONING"
    }
  });

  // Example Action: Buy Domain
  const requestedAction = "BUY_DOMAIN";
  const estimatedCost = 12.50; // In EUR

  // Point 3: Rate Limiting
  const recentLogs = await prisma.deploymentLog.count({
    where: {
      action: requestedAction,
      createdAt: { gte: new Date(Date.now() - 60 * 60 * 1000) } // Last 1 hour
    }
  });

  if (recentLogs >= 2) {
    auditLog("RATE_LIMIT", `Max 2 domains per hour allowed. Skipping ${requestedAction}.`);
    return;
  }

  // Point 4: Approval-Gate
  if (estimatedCost >= 10.00) {
    auditLog("APPROVAL_GATE", `Action ${requestedAction} costs €${estimatedCost} (>= €10). Requesting human approval.`);
    
    await prisma.financialActionRequest.create({
      data: {
        unitId: unit.id,
        actionType: requestedAction,
        estimatedCost: estimatedCost,
        provider: "NAMECHEAP",
        status: "PENDING"
      }
    });

    console.log(`🛑 Action paused. Please approve request in FinancialActionRequest table.`);
  } else {
    // Action < €10
    if (isDryRun) {
      auditLog("DRY_RUN", `Would execute ${requestedAction} for €${estimatedCost}. Skipping real API call.`);
    } else {
      // Real API execution would go here using isolated sub-account keys
      auditLog("EXECUTE", `Executed ${requestedAction} for €${estimatedCost}.`);
    }

    await prisma.deploymentLog.create({
      data: {
        unitId: unit.id,
        action: requestedAction,
        provider: "NAMECHEAP",
        status: "SUCCESS",
        details: "Dry-run execution recorded."
      }
    });
  }

  auditLog("SYSTEM", "BMF Iteration Completed.");
}

runFactoryWorker()
  .catch(e => {
    auditLog("ERROR", e.message);
    console.error(e);
  })
  .finally(async () => await prisma.$disconnect());
