import { serve } from "inngest/next";
import { inngest } from "../../../inngest/client";
import { avatarRenderJob, bRollVideoJob, seoAuditJob, productHunterJob, brandLauncherJob, publishSocialPostJob, dailyRoasValidationJob, executeAgentTask, cashflowCouncilJob, continuityCouncilJob, growthCouncilJob } from "../../../inngest/functions";
import { panopticonObserverJob } from "../../../inngest/council-observer";
import { councilSleepCycleJob } from "../../../inngest/memory-consolidation";
import { processDocumentJob } from "../../../inngest/knowledge-ingestion";

export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [
    avatarRenderJob,
    bRollVideoJob,
    seoAuditJob,
    productHunterJob,
    brandLauncherJob,
    publishSocialPostJob,
    dailyRoasValidationJob,
    cashflowCouncilJob,
    continuityCouncilJob,
    growthCouncilJob,
    panopticonObserverJob,
    councilSleepCycleJob,
    processDocumentJob,
    executeAgentTask
  ],
});
