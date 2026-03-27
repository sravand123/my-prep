import {
  getRoadmaps as storeGetRoadmaps,
  getRoadmap as storeGetRoadmap,
  getTopic as storeGetTopic,
  getTopicWithRoadmap as storeGetTopicWithRoadmap,
  toggleTopicCompletion as storeToggleTopicCompletion,
  updateTopicContent as storeUpdateTopicContent,
  updateTopicNotes as storeUpdateTopicNotes,
  createRoadmap as storeCreateRoadmap,
  createTopic as storeCreateTopic,
  deleteRoadmap as storeDeleteRoadmap,
  deleteTopic as storeDeleteTopic,
  getSettings,
} from "./store";
import { generateTopicContent } from "./ai";
import { Roadmap, Topic } from "./types";

export async function getRoadmaps(): Promise<Roadmap[]> {
  return storeGetRoadmaps();
}

export async function getRoadmap(id: string): Promise<Roadmap | null> {
  return storeGetRoadmap(id);
}

export async function getTopic(id: string): Promise<Topic | null> {
  return storeGetTopic(id);
}

export async function getTopicWithRoadmap(id: string) {
  return storeGetTopicWithRoadmap(id);
}

export async function toggleTopicCompletion(
  id: string,
  isCompleted: boolean
): Promise<void> {
  storeToggleTopicCompletion(id, isCompleted);
}

export async function updateTopicContent(
  id: string,
  content: string
): Promise<void> {
  storeUpdateTopicContent(id, content);
}

export async function updateTopicNotes(id: string, notes: string): Promise<void> {
  storeUpdateTopicNotes(id, notes);
}

export async function createRoadmap(
  name: string,
  description: string
): Promise<Roadmap> {
  return storeCreateRoadmap(name, description);
}

export async function createTopic(
  roadmapId: string,
  title: string,
  order: number
): Promise<Topic | null> {
  return storeCreateTopic(roadmapId, title, order);
}

export async function deleteRoadmap(id: string): Promise<void> {
  storeDeleteRoadmap(id);
}

export async function deleteTopic(id: string): Promise<void> {
  storeDeleteTopic(id);
}

export async function generateContent(topicId: string): Promise<string> {
  const settings = getSettings();
  if (!settings.minimaxApiKey) {
    throw new Error("MiniMax API key not set. Please add it in Settings.");
  }

  const topicData = storeGetTopicWithRoadmap(topicId);
  if (!topicData) {
    throw new Error("Topic not found");
  }

  const { topic, roadmap } = topicData;

  const content = await generateTopicContent(
    {
      topicTitle: topic.title,
      roadmapName: roadmap.name,
    },
    settings.minimaxApiKey
  );

  storeUpdateTopicContent(topicId, content);
  return content;
}
