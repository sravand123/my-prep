"use client";

import { useEffect, useState } from "react";
import { initializeStore, getRoadmaps } from "@/lib/store";
import { Roadmap } from "@/lib/types";

export default function Dashboard() {
  const [roadmaps, setRoadmaps] = useState<Roadmap[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    initializeStore();
    setRoadmaps(getRoadmaps());
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-emerald-500 border-t-transparent" />
      </div>
    );
  }

  const totalTopics = roadmaps.reduce((acc, r) => acc + r.topics.length, 0);
  const completedTopics = roadmaps.reduce(
    (acc, r) => acc + r.topics.filter((t) => t.isCompleted).length,
    0
  );
  const progress = totalTopics > 0 ? Math.round((completedTopics / totalTopics) * 100) : 0;

  return (
    <div className="space-y-8">
      <section className="rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
        <h1 className="text-2xl font-bold">Welcome Back!</h1>
        <p className="mt-1 text-zinc-600 dark:text-zinc-400">
          Track your interview preparation progress
        </p>
        <div className="mt-6">
          <div className="flex items-center justify-between text-sm">
            <span className="font-medium">
              {completedTopics} / {totalTopics} topics completed
            </span>
            <span className="font-bold text-emerald-600 dark:text-emerald-400">
              {progress}%
            </span>
          </div>
          <div className="mt-2 h-3 overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-800">
            <div
              className="h-full rounded-full bg-emerald-500 transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </section>

      <section>
        <h2 className="mb-4 text-lg font-semibold">Your Roadmaps</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {roadmaps.map((roadmap) => {
            const roadmapCompleted = roadmap.topics.filter((t) => t.isCompleted).length;
            const roadmapProgress =
              roadmap.topics.length > 0
                ? Math.round((roadmapCompleted / roadmap.topics.length) * 100)
                : 0;

            return (
              <a
                key={roadmap.id}
                href={`/#/roadmaps/${roadmap.id}`}
                className="group rounded-xl border border-zinc-200 bg-white p-5 transition-all hover:border-emerald-500 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-emerald-500"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold group-hover:text-emerald-600 dark:group-hover:text-emerald-400">
                      {roadmap.name}
                    </h3>
                    <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                      {roadmap.description}
                    </p>
                  </div>
                  <span className="text-2xl">📖</span>
                </div>
                <div className="mt-4">
                  <div className="flex items-center justify-between text-xs text-zinc-500">
                    <span>
                      {roadmapCompleted}/{roadmap.topics.length} topics
                    </span>
                    <span className="font-medium text-emerald-600 dark:text-emerald-400">
                      {roadmapProgress}%
                    </span>
                  </div>
                  <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-800">
                    <div
                      className="h-full rounded-full bg-emerald-500 transition-all"
                      style={{ width: `${roadmapProgress}%` }}
                    />
                  </div>
                </div>
              </a>
            );
          })}
        </div>
      </section>
    </div>
  );
}
