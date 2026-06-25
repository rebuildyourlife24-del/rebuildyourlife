import { Octokit } from '@octokit/rest';

// Deze credentials moeten in .env staan voor Vercel & lokaal
const githubToken = process.env.GITHUB_TOKEN;
const owner = process.env.GITHUB_OWNER || 'rebuildyourlife24-del';
const repo = process.env.GITHUB_REPO || 'REBUILDYOURLIFE123';

const octokit = new Octokit({
  auth: githubToken
});

export async function deployCodeToGithub(files: { path: string, content: string }[], commitMessage: string) {
  if (!githubToken) {
    throw new Error('Geen GITHUB_TOKEN gevonden in de environment variables. Hermes kan de codebase niet aanpassen.');
  }

  try {
    console.log(`[GITHUB] Ophalen van refs/heads/main...`);
    const { data: refData } = await octokit.git.getRef({
      owner,
      repo,
      ref: 'heads/main'
    });
    
    const commitSha = refData.object.sha;
    
    console.log(`[GITHUB] Ophalen van base tree SHA...`);
    const { data: commitData } = await octokit.git.getCommit({
      owner,
      repo,
      commit_sha: commitSha
    });
    
    const baseTreeSha = commitData.tree.sha;

    // Create blobs for each file
    const treePayload: any[] = [];
    
    for (const file of files) {
      console.log(`[GITHUB] Aanmaken van blob voor bestand: ${file.path}`);
      const { data: blobData } = await octokit.git.createBlob({
        owner,
        repo,
        content: file.content,
        encoding: 'utf-8'
      });
      
      treePayload.push({
        path: file.path,
        mode: '100644', // 100644 means file (blob)
        type: 'blob',
        sha: blobData.sha
      });
    }

    console.log(`[GITHUB] Nieuwe tree genereren...`);
    const { data: newTree } = await octokit.git.createTree({
      owner,
      repo,
      base_tree: baseTreeSha,
      tree: treePayload
    });

    console.log(`[GITHUB] Nieuwe commit aanmaken: "${commitMessage}"`);
    const { data: newCommit } = await octokit.git.createCommit({
      owner,
      repo,
      message: commitMessage,
      tree: newTree.sha,
      parents: [commitSha],
      author: {
        name: 'Hermes AI',
        email: 'hermes@sovereign-os.ai',
        date: new Date().toISOString()
      }
    });

    console.log(`[GITHUB] Main branch pointer updaten naar de nieuwe commit...`);
    await octokit.git.updateRef({
      owner,
      repo,
      ref: 'heads/main',
      sha: newCommit.sha
    });

    console.log(`[GITHUB] Succesvol! De Vercel pipeline is nu live getriggerd.`);
    return { success: true, commitSha: newCommit.sha, message: 'Code successfully deployed to GitHub. Vercel build is starting.' };

  } catch (error: any) {
    console.error(`[GITHUB] Fout bij pushen naar Github:`, error);
    throw new Error(`Kan niet deployen naar Github: ${error.message}`);
  }
}
