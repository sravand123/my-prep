"use client";

import { useState } from "react";
import { toggleTopicCompletion } from "@/lib/store";

interface TopicToggleProps {
  topicId: string;
  isCompleted: boolean;
}

export function TopicToggle({ topicId, isCompleted: initialIsCompleted }: TopicToggleProps) {
  const [isCompleted, setIsCompleted] = useState(initialIsCompleted);
  const [isLoading, setIsLoading] = useState(false);

  function handleToggle() {
    setIsLoading(true);
    try {
      toggleTopicCompletion(topicId, !isCompleted);
      setIsCompleted(!isCompleted);
    } catch (error) {
      console.error("Failed to toggle topic:", error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <button
      onClick={handleToggle}
      disabled={isLoading}
      className={`flex h-6 w-6 items-center justify-center rounded-full border-2 transition-all ${
        isCompleted
          ? "border-emerald-500 bg-emerald-500 text-white"
          : "border-zinc-300 hover:border-emerald-500 dark:border-zinc-600"
      } ${isLoading ? "opacity-50" : ""}`}
    >
      {isCompleted && (
        <svg
          className="h-3.5 w-3.5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={3}
            d="M5 13l4 4L19 7"
          />
        </svg>
      )}
    </button>
  );
}
