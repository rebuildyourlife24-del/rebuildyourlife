import { db } from '../db';
import { TrafficWorker } from '../services/workers/traffic-worker.service';
import { SupplyChainWorker } from '../services/workers/supply-chain-worker.service';
import { SupportWorker } from '../services/workers/support-worker.service';
import { ContentWorker } from '../services/workers/content-worker.service';

/**
 * Sovereign OS Action Executor
 * Dit is de "handen" van het systeem. Hermes of andere sub-agents plaatsen acties
 * in de wachtrij (status: PENDING). Zodra Orion (de mens) op "Approve" klikt in het dashboard,
 * krijgt de actie status "APPROVED" en pakt deze executor het op.
 */
export async function executePendingActions() {
  console.log('[EXECUTOR] Scanning for APPROVED actions in queue...');

  const approvedActions = await db.agentAction.findMany({
    where: {
      status: 'APPROVED'
    }
  });

  if (approvedActions.length === 0) {
    console.log('[EXECUTOR] No approved actions found.');
    return { executed: 0 };
  }

  let successCount = 0;

  for (const action of approvedActions) {
    try {
      console.log(`[EXECUTOR] Executing action ${action.id} of type ${action.title}...`);
      
      let resultData: any = {};

      // Parse payload if available
      let payload = {};
      if (action.payload) {
        payload = JSON.parse(action.payload as string);
      }

      switch (action.title) {
        case 'SEND_EMAIL':
          // Logica om via Resend of SendGrid een mail te sturen
          console.log(`[EXECUTOR] Sending email to ${(payload as any).to}...`);
          // simulate success
          resultData = { sent: true, provider: 'mock_resend' };
          break;

        case 'POST_SOCIAL':
          // Logica om een tweet of LinkedIn post te doen
          console.log(`[EXECUTOR] Posting to ${(payload as any).platform}...`);
          resultData = { posted: true, url: 'https://social.mock/post/123' };
          break;

        case 'SYSTEM_CONFIG':
          // Pas interne database of omgeving variabelen aan
          console.log(`[EXECUTOR] Updating system config...`);
          resultData = { updated: true };
          break;

        case 'OPPORTUNITY':
          console.log(`[EXECUTOR] Wealth Generator has verified Opportunity: ${(payload as any).title}`);
          const adminUser = await db.user.findFirst();
          if (!adminUser) throw new Error("No user found to link opportunity to.");
          
          const newOpp = await db.opportunityReport.create({
            data: {
              userId: adminUser.id,
              title: (payload as any).title || 'Autonoom Gegenereerd Verdienmodel',
              niche: (payload as any).niche || 'Finance/Tech',
              summary: (payload as any).summary || 'Geen samenvatting',
              goodROI: (payload as any).goodROI || 10,
              betterROI: (payload as any).betterROI || 50,
              bestROI: (payload as any).bestROI || 200,
              status: 'APPROVED'
            }
          });
          resultData = { opportunityId: newOpp.id };
          break;

        case 'TELEGRAM_ALERT':
          console.log(`[EXECUTOR] Sending TELEGRAM ALERT...`);
          const botToken = process.env.TELEGRAM_BOT_TOKEN;
          const chatId = process.env.TELEGRAM_CHAT_ID;
          
          if (!botToken || !chatId) {
            console.warn("[EXECUTOR] TELEGRAM_BOT_TOKEN of TELEGRAM_CHAT_ID mist. Fallback naar server log.");
            console.log("TELEGRAM MESSAGE: ", (payload as any).message);
            resultData = { sent: false, reason: "Missing keys", fallbackLog: true };
          } else {
            const telegramUrl = `https://api.telegram.org/bot${botToken}/sendMessage`;
            const tgRes = await fetch(telegramUrl, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                chat_id: chatId,
                text: `🚨 *HERMES ALERT*\n\n${(payload as any).message}`,
                parse_mode: "Markdown"
              })
            });
            if (!tgRes.ok) throw new Error("Failed to send Telegram message");
            resultData = { sent: true, platform: "Telegram" };
          }
          break;

        case 'DEPLOY_CODE':
          console.log(`[EXECUTOR] Hermes deploying code via GitHub...`);
          const { deployCodeToGithub } = await import('../services/github.service');
          
          if (!payload || !(payload as any).files || !(payload as any).commitMessage) {
            throw new Error("Invalid payload for DEPLOY_CODE. Required: files and commitMessage");
          }

          const deployResult = await deployCodeToGithub((payload as any).files, (payload as any).commitMessage);
          resultData = deployResult;
          break;

        case 'SWARM_TRAFFIC':
          console.log(`[EXECUTOR] Swarm Traffic Worker initiating...`);
          resultData = await TrafficWorker.deployCampaign(
            (payload as any).productId,
            (payload as any).budget || 100,
            (payload as any).regions || ['NL', 'BE']
          );
          break;

        case 'SWARM_SUPPLY':
          console.log(`[EXECUTOR] Swarm Supply Chain Worker initiating...`);
          resultData = await SupplyChainWorker.fulfillOrder(
            (payload as any).orderId,
            (payload as any).productData,
            (payload as any).customerAddress
          );
          break;

        case 'SWARM_SUPPORT':
          console.log(`[EXECUTOR] Swarm Support Worker initiating...`);
          resultData = await SupportWorker.handleTicket(
            (payload as any).ticketId,
            (payload as any).customerMessage,
            (payload as any).language || 'NL'
          );
          break;

        case 'SWARM_CONTENT':
          console.log(`[EXECUTOR] Swarm Content Worker initiating...`);
          resultData = await ContentWorker.generateProductListing(
            (payload as any).productUrl,
            (payload as any).targetLanguage || 'NL'
          );
          break;

        default:
          throw new Error(`Unsupported actionType: ${action.title}`);
      }

      // Markeer als VOLTOOID
      await db.agentAction.update({
        where: { id: action.id },
        data: {
          status: 'COMPLETED',
          executedAt: new Date()
          // payload kan eventueel geupdate worden met resultData als nodig
        }
      });
      
      successCount++;
      console.log(`[EXECUTOR] Action ${action.id} COMPLETED.`);

    } catch (error: any) {
      console.error(`[EXECUTOR] Failed to execute action ${action.id}:`, error);
      
      // Markeer als MISLUKT
      await db.agentAction.update({
        where: { id: action.id },
        data: {
          status: 'FAILED',
          errorMessage: error.message,
          executedAt: new Date()
        }
      });
    }
  }

  return { executed: successCount, total: approvedActions.length };
}
