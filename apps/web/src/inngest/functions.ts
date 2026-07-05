import { inngest } from "./client";
import { prisma } from "@rebuildyourlife/database";
import Replicate from "replicate";

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

export const avatarRenderJob = inngest.createFunction(
  { id: "avatar-render", retries: 0 },
  { event: "video/avatar.render" },
  async ({ event, step }) => {
    const { jobId, imageUrl, audioUrl, userId } = event.data;

    // 1. Mark as running
    await step.run("mark-running", async () => {
      return prisma.avatarRenderJob.update({
        where: { id: jobId },
        data: { status: "RUNNING" },
      });
    });

    try {
      // 2. Start Replicate Prediction (SadTalker)
      const prediction = await step.run("start-replicate", async () => {
        return replicate.predictions.create({
          version: process.env.SADTALKER_MODEL_VERSION || "cjwbw/sadtalker",
          input: {
            source_image: imageUrl,
            driven_audio: audioUrl,
          },
        });
      });

      // 3. Poll for completion
      let status = "starting";
      let videoUrl = null;
      let error = null;
      let currentPrediction = prediction;

      // We will poll up to 40 times (10 minutes)
      for (let i = 0; i < 40; i++) {
        await step.sleep(`wait-${i}`, "15s");

        const check = await step.run(`check-status-${i}`, async () => {
          return replicate.predictions.get(prediction.id);
        });

        status = check.status;
        if (status === "succeeded") {
          videoUrl = check.output;
          break;
        } else if (status === "failed" || status === "canceled") {
          error = check.error || "Replicate prediction failed or canceled";
          break;
        }
      }

      if (!videoUrl && !error) {
        error = "Timeout: Video rendering took longer than 10 minutes.";
      }

      // 4. Save result
      if (videoUrl) {
        await step.run("save-success", async () => {
          return prisma.avatarRenderJob.update({
            where: { id: jobId },
            data: { status: "DONE", videoUrl: videoUrl },
          });
        });
        return { success: true, videoUrl };
      } else {
        throw new Error(error || "Unknown error during rendering");
      }
    } catch (err: any) {
      // 5. Handle failure
      await step.run("save-error", async () => {
        return prisma.avatarRenderJob.update({
          where: { id: jobId },
          data: { status: "FAILED", error: err.message },
        });
      });
      throw err;
    }
  }
);

// B-Roll Video Generation Job (minimax/video-01)
export const bRollVideoJob = inngest.createFunction(
  { id: "b-roll-video", retries: 0 },
  { event: "video/broll.render" },
  async ({ event, step }) => {
    const { jobId, prompt, userId } = event.data;

    await step.run("mark-running", async () => {
      // In reality we would use a Prisma model like BRollRenderJob, but for now we mock it or use an existing one
      console.log(`Starting B-Roll Job ${jobId} for prompt: ${prompt}`);
    });

    try {
      const output = await step.run("start-minimax", async () => {
        // minimax/video-01 generates a 6 second video from a text prompt!
        return replicate.run("minimax/video-01", {
          input: { prompt }
        });
      });

      // replicate.run() automatically waits for completion! It's synchronous from our POV.
      const videoUrl = typeof output === 'string' ? output : (output as any)?.url?.();
      
      await step.run("save-success", async () => {
        console.log(`B-Roll completed: ${videoUrl}`);
      });
      return { success: true, videoUrl };

    } catch (err: any) {
      await step.run("save-error", async () => {
        console.error(`B-Roll failed: ${err.message}`);
      });
      throw err;
    }
  }
);
