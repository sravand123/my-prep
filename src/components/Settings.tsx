"use client";

import { useState, useEffect } from "react";
import { getSettings, updateSettings } from "@/lib/store";
import { AppSettings } from "@/lib/types";

export function Settings() {
  const [settings, setSettings] = useState<AppSettings>({
    minimaxApiKey: "",
    githubPat: "",
    githubRepo: "",
  });
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setSettings(getSettings());
  }, []);

  function handleSave() {
    updateSettings(settings);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <div className="mx-auto max-w-2xl space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="mt-1 text-zinc-600 dark:text-zinc-400">
          Configure your API keys and GitHub repository
        </p>
      </div>

      <div className="space-y-6 rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
              MiniMax API Key
            </label>
            <p className="mb-2 text-xs text-zinc-500">
              Get your API key from the MiniMax dashboard. Used for generating interview content.
            </p>
            <input
              type="password"
              value={settings.minimaxApiKey}
              onChange={(e) =>
                setSettings((s) => ({ ...s, minimaxApiKey: e.target.value }))
              }
              placeholder="sk-cp-..."
              className="w-full rounded-lg border border-zinc-300 px-4 py-2.5 font-mono text-sm dark:border-zinc-700 dark:bg-zinc-800"
            />
          </div>

          <div className="border-t border-zinc-200 pt-4 dark:border-zinc-800">
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
              GitHub Personal Access Token (PAT)
            </label>
            <p className="mb-2 text-xs text-zinc-500">
              Create a PAT with <code>repo</code> scope at GitHub Settings → Developer Settings → Personal access tokens.
            </p>
            <input
              type="password"
              value={settings.githubPat}
              onChange={(e) =>
                setSettings((s) => ({ ...s, githubPat: e.target.value }))
              }
              placeholder="ghp_..."
              className="w-full rounded-lg border border-zinc-300 px-4 py-2.5 font-mono text-sm dark:border-zinc-700 dark:bg-zinc-800"
            />
          </div>

          <div className="border-t border-zinc-200 pt-4 dark:border-zinc-800">
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
              GitHub Repository
            </label>
            <p className="mb-2 text-xs text-zinc-500">
              Format: <code>owner/repo</code>. The docs folder will be created/pushed to this repository.
            </p>
            <input
              type="text"
              value={settings.githubRepo}
              onChange={(e) =>
                setSettings((s) => ({ ...s, githubRepo: e.target.value }))
              }
              placeholder="username/interview-prep"
              className="w-full rounded-lg border border-zinc-300 px-4 py-2.5 font-mono text-sm dark:border-zinc-700 dark:bg-zinc-800"
            />
          </div>
        </div>

        <button
          onClick={handleSave}
          className="w-full rounded-lg bg-emerald-600 px-4 py-2.5 font-medium text-white transition-colors hover:bg-emerald-700"
        >
          {saved ? "✓ Saved!" : "Save Settings"}
        </button>
      </div>

      <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 dark:border-amber-900/50 dark:bg-amber-950/20">
        <p className="text-sm text-amber-800 dark:text-amber-200">
          <strong>Privacy Note:</strong> Your API keys are stored only in your browser's localStorage and are never sent to any server other than MiniMax for content generation.
        </p>
      </div>
    </div>
  );
}
