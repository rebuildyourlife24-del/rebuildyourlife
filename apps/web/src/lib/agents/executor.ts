import { db } from '../db';

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

        default:
          throw new Error(`Unsupported actionType: ${action.title}`);
      }

      // Markeer als VOLTOOID
      await db.agentAction.update({
        where: { id: action.id },
        data: {
          status: 'COMPLETED',
          result: JSON.stringify(resultData),
          executedAt: new Date()
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
          result: JSON.stringify({ error: error.message }),
          executedAt: new Date()
        }
      });
    }
  }

  return { executed: successCount, total: approvedActions.length };
}
