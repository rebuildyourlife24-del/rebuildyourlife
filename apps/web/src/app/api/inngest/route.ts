import { serve } from "inngest/next";
import { inngest } from "../../../inngest/client";
import { avatarRenderJob, bRollVideoJob, seoAuditJob, productHunterJob, brandLauncherJob, publishSocialPostJob } from "../../../inngest/functions";

export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [
    avatarRenderJob,
    bRollVideoJob,
    seoAuditJob,
    productHunterJob,
    brandLauncherJob,
    publishSocialPostJob
  ],
});
