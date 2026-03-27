import { GitHubFile } from "./types";

interface GitHubContent {
  name: string;
  path: string;
  sha: string;
}

export interface PushResult {
  success: boolean;
  commitSha?: string;
  error?: string;
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

async function getFileSha(
  repo: string,
  path: string,
  pat: string
): Promise<string | null> {
  const [owner, reponame] = repo.split("/");
  const url = `https://api.github.com/repos/${owner}/${reponame}/contents/${path}`;

  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${pat}`,
      Accept: "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28",
    },
  });

  if (response.status === 404) return null;
  if (!response.ok) {
    const error = await response.text();
    throw new Error(`GitHub API error: ${response.status} - ${error}`);
  }

  const data = (await response.json()) as GitHubContent;
  return data.sha || null;
}

export async function pushMarkdownFiles(
  files: GitHubFile[],
  repo: string,
  pat: string
): Promise<PushResult> {
  if (!repo || !pat) {
    return { success: false, error: "GitHub repo or PAT not configured" };
  }

  const [owner, reponame] = repo.split("/");
  if (!owner || !reponame) {
    return { success: false, error: "Invalid repo format. Use 'owner/repo'" };
  }

  try {
    for (const file of files) {
      const sha = await getFileSha(repo, file.path, pat);
      const url = `https://api.github.com/repos/${owner}/${reponame}/contents/${file.path}`;

      const body: Record<string, unknown> = {
        message: file.message,
        content: btoa(unescape(encodeURIComponent(file.content))),
      };

      if (sha) {
        body.sha = sha;
      }

      const response = await fetch(url, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${pat}`,
          Accept: "application/vnd.github+json",
          "Content-Type": "application/json",
          "X-GitHub-Api-Version": "2022-11-28",
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        const error = await response.text();
        return {
          success: false,
          error: `Failed to push ${file.path}: ${response.status} - ${error}`,
        };
      }
    }

    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}
