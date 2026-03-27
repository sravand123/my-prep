"use client";

import { useState } from "react";
import { pushMarkdownFiles } from "@/lib/github";
import { generateGitHubFiles } from "@/lib/markdown";
import { getSettings, getRoadmap } from "@/lib/store";
import { Roadmap } from "@/lib/types";

interface PushToGitHubProps {
  roadmap: Roadmap;
}

export function PushToGitHub({ roadmap }: PushToGitHubProps) {
  const [isPushing, setIsPushing] = useState(false);
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null);

  async function handlePush() {
    const settings = getSettings();
    if (!settings.githubPat || !settings.githubRepo) {
      setResult({
        success: false,
        message: "GitHub PAT or repo not configured. Add them in Settings.",
      });
      return;
    }

    setIsPushing(true);
    setResult(null);

    try {
      const files = generateGitHubFiles(roadmap);
      if (files.length === 0) {
        setResult({
          success: false,
          message: "No topics with content to push. Generate content first.",
        });
        return;
      }

      const pushResult = await pushMarkdownFiles(files, settings.githubRepo, settings.githubPat);

      if (pushResult.success) {
        setResult({
          success: true,
          message: `Successfully pushed ${files.length} file(s) to GitHub!`,
        });
      } else {
        setResult({
          success: false,
          message: pushResult.error || "Failed to push to GitHub",
        });
      }
    } catch (error) {
      setResult({
        success: false,
        message: error instanceof Error ? error.message : "Unknown error",
      });
    } finally {
      setIsPushing(false);
    }
  }

  const contentCount = roadmap.topics.filter((t) => t.content).length;

  return (
    <div className="space-y-3">
      <button
        onClick={handlePush}
        disabled={isPushing || contentCount === 0}
        className="inline-flex items-center gap-2 rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-800 disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
      >
        {isPushing ? (
          <>
            <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            Pushing...
          </>
        ) : (
          <>
            <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
            </svg>
            Push to GitHub ({contentCount} files)
          </>
        )}
      </button>

      {result && (
        <div
          className={`rounded-lg px-4 py-2 text-sm ${
            result.success
              ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400"
              : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
          }`}
        >
          {result.message}
        </div>
      )}
    </div>
  );
}
