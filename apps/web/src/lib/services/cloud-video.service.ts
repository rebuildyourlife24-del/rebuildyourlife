import { Octokit } from "@octokit/rest";

export class CloudVideoService {
  /**
   * Trigger GitHub Actions to render the video.
   * This is the real "Cloud in a Cloud" implementation.
   */
  public static async triggerCloudRender(config: any): Promise<void> {
    const githubToken = process.env.GITHUB_TOKEN;
    if (!githubToken) {
      throw new Error("GITHUB_TOKEN ontbreekt. Kan cloud render niet starten.");
    }

    const octokit = new Octokit({ auth: githubToken });
    const owner = "rebuildyourlife24-del";
    const repo = "REBUILDYOURLIFE123";

    console.log(`[CloudVideoService] Triggering GitHub Actions render on ${owner}/${repo}...`);

    await octokit.actions.createWorkflowDispatch({
      owner,
      repo,
      workflow_id: "video-render-engine.yml",
      ref: "main",
      inputs: {
        config: JSON.stringify(config)
      }
    });

    console.log(`[CloudVideoService] GitHub Actions workflow dispatched successfully!`);
  }
}
