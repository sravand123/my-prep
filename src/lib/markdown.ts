import { Topic, Roadmap, GitHubFile } from "./types";

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export function generateMarkdownWithFrontmatter(
  topic: Topic,
  roadmap: Roadmap
): string {
  const frontmatter = [
    "---",
    `title: "${topic.title}"`,
    `roadmap: "${roadmap.name}"`,
    `isCompleted: ${topic.isCompleted}`,
    `generatedAt: "${new Date().toISOString()}"`,
    "---",
    "",
  ].join("\n");

  return frontmatter + (topic.content || "");
}

export function generateGitHubFiles(
  roadmap: Roadmap
): GitHubFile[] {
  const roadmapSlug = slugify(roadmap.name);

  return roadmap.topics
    .filter((topic) => topic.content)
    .map((topic) => {
      const topicSlug = slugify(topic.title);
      const path = `docs/${roadmapSlug}/${topicSlug}.md`;

      return {
        path,
        content: generateMarkdownWithFrontmatter(topic, roadmap),
        message: `docs: Add ${topic.title} (${roadmap.name})`,
      };
    });
}
