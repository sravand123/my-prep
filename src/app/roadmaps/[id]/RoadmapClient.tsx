"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getRoadmap } from "@/lib/store";
import { TopicToggle } from "@/app/roadmaps/[id]/TopicToggle";
import { PushToGitHub } from "@/components/PushToGitHub";
import { Roadmap } from "@/lib/types";

interface RoadmapPageProps {
  id: string;
}

export function RoadmapPage({ id }: RoadmapPageProps) {
  const [roadmap, setRoadmap] = useState<Roadmap | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const data = getRoadmap(id);
    setRoadmap(data);
    setLoading(false);
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-emerald-500 border-t-transparent" />
      </div>
    );
  }

  if (!roadmap) {
    return (
      <div className="text-center py-20">
        <h1 className="text-2xl font-bold">Roadmap not found</h1>
        <Link href="/" className="mt-4 text-emerald-600 hover:underline">
          Back to Dashboard
        </Link>
      </div>
    );
  }

  const completedCount = roadmap.topics.filter((t) => t.isCompleted).length;
  const progress =
    roadmap.topics.length > 0
      ? Math.round((completedCount / roadmap.topics.length) * 100)
      : 0;

  return (
    <div className="space-y-6">
      <Link
        href="/"
        className="inline-flex items-center gap-1 text-sm text-zinc-600 hover:text-emerald-600 dark:text-zinc-400 dark:hover:text-emerald-400"
      >
        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Back to Dashboard
      </Link>

      <div className="rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold">{roadmap.name}</h1>
            <p className="mt-1 text-zinc-600 dark:text-zinc-400">
              {roadmap.description}
            </p>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-4xl">📚</span>
            <PushToGitHub roadmap={roadmap} />
          </div>
        </div>
        <div className="mt-6">
          <div className="flex items-center justify-between text-sm">
            <span className="text-zinc-600 dark:text-zinc-400">
              {completedCount} of {roadmap.topics.length} topics completed
            </span>
            <span className="font-bold text-emerald-600 dark:text-emerald-400">
              {progress}%
            </span>
          </div>
          <div className="mt-2 h-3 overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-800">
            <div
              className="h-full rounded-full bg-emerald-500 transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>

      <section>
        <h2 className="mb-4 text-lg font-semibold">Topics</h2>
        <div className="space-y-2">
          {roadmap.topics.map((topic, index) => (
            <Link
              key={topic.id}
              href={`/#/topics/${topic.id}`}
              className={`flex items-center gap-4 rounded-xl border border-zinc-200 bg-white p-4 transition-all hover:border-emerald-500 hover:shadow-sm dark:border-zinc-800 dark:bg-zinc-900 ${
                topic.isCompleted ? "opacity-75" : ""
              }`}
            >
              <TopicToggle topicId={topic.id} isCompleted={topic.isCompleted} />
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-zinc-400">
                    {index + 1}.
                  </span>
                  <h3
                    className={`font-medium ${
                      topic.isCompleted ? "line-through" : ""
                    }`}
                  >
                    {topic.title}
                  </h3>
                </div>
                {topic.content && (
                  <p className="mt-1 text-sm text-zinc-500 line-clamp-1">
                    {topic.content.slice(0, 100)}...
                  </p>
                )}
              </div>
              <div className="flex items-center gap-2">
                {topic.content ? (
                  <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
                    Content Ready
                  </span>
                ) : (
                  <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">
                    Needs AI Gen
                  </span>
                )}
                <svg
                  className="h-5 w-5 text-zinc-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
