"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getTopicWithRoadmap } from "@/lib/store";
import { Topic, Roadmap } from "@/lib/types";
import { MarkdownRenderer } from "@/app/topics/[id]/MarkdownRenderer";
import { GenerateButton } from "@/app/topics/[id]/GenerateButton";

interface TopicPageProps {
  id: string;
}

export function TopicPage({ id }: TopicPageProps) {
  const [topic, setTopic] = useState<Topic | null>(null);
  const [roadmap, setRoadmap] = useState<Roadmap | null>(null);
  const [loading, setLoading] = useState(true);

  function loadTopic() {
    const data = getTopicWithRoadmap(id);
    if (data) {
      setTopic(data.topic);
      setRoadmap(data.roadmap);
    }
    setLoading(false);
  }

  useEffect(() => {
    loadTopic();
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-emerald-500 border-t-transparent" />
      </div>
    );
  }

  if (!topic || !roadmap) {
    return (
      <div className="text-center py-20">
        <h1 className="text-2xl font-bold">Topic not found</h1>
        <Link href="/my-prep/#" className="mt-4 text-emerald-600 hover:underline">
          Back to Dashboard
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <nav className="flex items-center gap-2 text-sm">
        <Link
          href="/my-prep/#"
          className="text-zinc-600 hover:text-emerald-600 dark:text-zinc-400 dark:hover:text-emerald-400"
        >
          Dashboard
        </Link>
        <span className="text-zinc-400">/</span>
        <Link
          href={`/my-prep/#/roadmaps/${topic.roadmapId}`}
          className="text-zinc-600 hover:text-emerald-600 dark:text-zinc-400 dark:hover:text-emerald-400"
        >
          {roadmap.name}
        </Link>
        <span className="text-zinc-400">/</span>
        <span className="text-zinc-900 dark:text-zinc-100">{topic.title}</span>
      </nav>

      <div className="rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold">{topic.title}</h1>
            <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
              {roadmap.name}
            </p>
          </div>
          <span
            className={`rounded-full px-3 py-1 text-sm font-medium ${
              topic.isCompleted
                ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
                : "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400"
            }`}
          >
            {topic.isCompleted ? "Completed" : "In Progress"}
          </span>
        </div>
      </div>

      {!topic.content ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-zinc-200 bg-white py-16 dark:border-zinc-800 dark:bg-zinc-900">
          <span className="text-6xl">🤖</span>
          <h2 className="mt-4 text-xl font-semibold">No content yet</h2>
          <p className="mt-2 max-w-md text-center text-zinc-600 dark:text-zinc-400">
            Generate AI-powered content for this topic to get started with your
            interview preparation.
          </p>
          <div className="mt-6">
            <GenerateButton topicId={topic.id} onGenerated={loadTopic} />
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
            <MarkdownRenderer content={topic.content} />
          </div>
          <div className="flex justify-end">
            <GenerateButton topicId={topic.id} onGenerated={loadTopic} />
          </div>
        </div>
      )}
    </div>
  );
}
