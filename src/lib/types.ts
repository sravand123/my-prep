export interface Topic {
  id: string;
  title: string;
  content: string | null;
  roadmapId: string;
  order: number;
  isCompleted: boolean;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Roadmap {
  id: string;
  name: string;
  description: string;
  topics: Topic[];
  createdAt: string;
  updatedAt: string;
}

export interface AppSettings {
  minimaxApiKey: string;
  githubPat: string;
  githubRepo: string;
}

export interface GitHubFile {
  path: string;
  content: string;
  message: string;
}
