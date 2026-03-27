import { Roadmap, Topic, AppSettings } from "./types";
import seedData from "@/data/seed-data.json";

const STORAGE_KEYS = {
  ROADMAPS: "interview-prep-roadmaps",
  SETTINGS: "interview-prep-settings",
};

function generateId(): string {
  return Math.random().toString(36).slice(2, 11);
}

function now(): string {
  return new Date().toISOString();
}

function deepClone<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj));
}

export function initializeStore(): void {
  if (typeof window === "undefined") return;

  const existing = localStorage.getItem(STORAGE_KEYS.ROADMAPS);
  if (!existing) {
    const initialRoadmaps: Roadmap[] = seedData.roadmaps.map((r) => ({
      ...r,
      createdAt: now(),
      updatedAt: now(),
      topics: r.topics.map((t) => ({
        ...t,
        content: null,
        roadmapId: r.id,
        isCompleted: false,
        notes: null,
        createdAt: now(),
        updatedAt: now(),
      })),
    }));
    localStorage.setItem(STORAGE_KEYS.ROADMAPS, JSON.stringify(initialRoadmaps));
  }
}

export function getRoadmaps(): Roadmap[] {
  if (typeof window === "undefined") return [];
  const data = localStorage.getItem(STORAGE_KEYS.ROADMAPS);
  return data ? deepClone(JSON.parse(data)) : [];
}

export function getRoadmap(id: string): Roadmap | null {
  const roadmaps = getRoadmaps();
  return roadmaps.find((r) => r.id === id) || null;
}

export function getTopic(id: string): Topic | null {
  const roadmaps = getRoadmaps();
  for (const roadmap of roadmaps) {
    const topic = roadmap.topics.find((t) => t.id === id);
    if (topic) return topic;
  }
  return null;
}

export function getTopicWithRoadmap(id: string): { topic: Topic; roadmap: Roadmap } | null {
  const roadmaps = getRoadmaps();
  for (const roadmap of roadmaps) {
    const topic = roadmap.topics.find((t) => t.id === id);
    if (topic) return { topic, roadmap };
  }
  return null;
}

export function updateTopic(id: string, data: Partial<Topic>): Topic | null {
  if (typeof window === "undefined") return null;
  const roadmaps = getRoadmaps();
  for (const roadmap of roadmaps) {
    const topicIndex = roadmap.topics.findIndex((t) => t.id === id);
    if (topicIndex !== -1) {
      roadmap.topics[topicIndex] = {
        ...roadmap.topics[topicIndex],
        ...data,
        updatedAt: now(),
      };
      roadmap.updatedAt = now();
      localStorage.setItem(STORAGE_KEYS.ROADMAPS, JSON.stringify(roadmaps));
      return roadmap.topics[topicIndex];
    }
  }
  return null;
}

export function toggleTopicCompletion(id: string, isCompleted: boolean): void {
  updateTopic(id, { isCompleted });
}

export function updateTopicContent(id: string, content: string): void {
  updateTopic(id, { content });
}

export function updateTopicNotes(id: string, notes: string): void {
  updateTopic(id, { notes });
}

export function createRoadmap(name: string, description: string): Roadmap {
  if (typeof window === "undefined") throw new Error("Not in browser");
  const roadmaps = getRoadmaps();
  const newRoadmap: Roadmap = {
    id: generateId(),
    name,
    description,
    topics: [],
    createdAt: now(),
    updatedAt: now(),
  };
  roadmaps.push(newRoadmap);
  localStorage.setItem(STORAGE_KEYS.ROADMAPS, JSON.stringify(roadmaps));
  return newRoadmap;
}

export function createTopic(roadmapId: string, title: string, order: number): Topic | null {
  if (typeof window === "undefined") return null;
  const roadmaps = getRoadmaps();
  const roadmap = roadmaps.find((r) => r.id === roadmapId);
  if (!roadmap) return null;

  const newTopic: Topic = {
    id: generateId(),
    title,
    content: null,
    roadmapId,
    order,
    isCompleted: false,
    notes: null,
    createdAt: now(),
    updatedAt: now(),
  };
  roadmap.topics.push(newTopic);
  roadmap.updatedAt = now();
  localStorage.setItem(STORAGE_KEYS.ROADMAPS, JSON.stringify(roadmaps));
  return newTopic;
}

export function deleteRoadmap(id: string): void {
  if (typeof window === "undefined") return;
  const roadmaps = getRoadmaps();
  const filtered = roadmaps.filter((r) => r.id !== id);
  localStorage.setItem(STORAGE_KEYS.ROADMAPS, JSON.stringify(filtered));
}

export function deleteTopic(id: string): void {
  if (typeof window === "undefined") return;
  const roadmaps = getRoadmaps();
  for (const roadmap of roadmaps) {
    const topicIndex = roadmap.topics.findIndex((t) => t.id === id);
    if (topicIndex !== -1) {
      roadmap.topics.splice(topicIndex, 1);
      roadmap.updatedAt = now();
      localStorage.setItem(STORAGE_KEYS.ROADMAPS, JSON.stringify(roadmaps));
      return;
    }
  }
}

export function getSettings(): AppSettings {
  if (typeof window === "undefined") {
    return { minimaxApiKey: "", githubPat: "", githubRepo: "" };
  }
  const data = localStorage.getItem(STORAGE_KEYS.SETTINGS);
  return data
    ? JSON.parse(data)
    : { minimaxApiKey: "", githubPat: "", githubRepo: "" };
}

export function updateSettings(settings: Partial<AppSettings>): void {
  if (typeof window === "undefined") return;
  const current = getSettings();
  const updated = { ...current, ...settings };
  localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(updated));
}
