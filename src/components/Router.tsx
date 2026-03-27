"use client";

import { useEffect, useState } from "react";
import { initializeStore } from "@/lib/store";
import Dashboard from "@/app/page";
import { RoadmapPage } from "@/app/roadmaps/[id]/RoadmapClient";
import { TopicPage } from "@/app/topics/[id]/TopicClient";
import { Settings } from "@/components/Settings";

type Route =
  | { type: "dashboard" }
  | { type: "roadmap"; id: string }
  | { type: "topic"; id: string }
  | { type: "settings" };

function parseHash(): Route {
  if (typeof window === "undefined") return { type: "dashboard" };

  const hash = window.location.hash.slice(1); // Remove #

  if (!hash || hash === "/") return { type: "dashboard" };
  if (hash === "/settings") return { type: "settings" };

  const roadmapMatch = hash.match(/^\/roadmaps\/([^/]+)$/);
  if (roadmapMatch) {
    return { type: "roadmap", id: roadmapMatch[1] };
  }

  const topicMatch = hash.match(/^\/topics\/([^/]+)$/);
  if (topicMatch) {
    return { type: "topic", id: topicMatch[1] };
  }

  return { type: "dashboard" };
}

export function Router() {
  const [route, setRoute] = useState<Route>({ type: "dashboard" });
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    initializeStore();
    setInitialized(true);
    setRoute(parseHash());

    function handleHashChange() {
      setRoute(parseHash());
    }

    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  if (!initialized) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-emerald-500 border-t-transparent" />
      </div>
    );
  }

  switch (route.type) {
    case "dashboard":
      return <Dashboard />;
    case "roadmap":
      return <RoadmapPage id={route.id} />;
    case "topic":
      return <TopicPage id={route.id} />;
    case "settings":
      return <Settings />;
  }
}
