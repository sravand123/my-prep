export interface GenerateContentParams {
  topicTitle: string;
  roadmapName: string;
}

export async function generateTopicContent(
  { topicTitle, roadmapName }: GenerateContentParams,
  apiKey: string
): Promise<string> {
  if (!apiKey) {
    throw new Error("MiniMax API key is not set. Please add it in Settings.");
  }

  const systemPrompt = `<context>
You are an expert technical interviewer and senior software engineer creating structured educational content for software engineering interview preparation.

Your target audience is a senior engineer. Tailor the depth, terminology, and interview questions to this specific experience level.

Generate comprehensive markdown content for the topic "${topicTitle}" within the "${roadmapName}" roadmap.
</context>

<instructions>
Follow this exact structure and markdown formatting. Use ## for main sections and ### for subsections. Keep paragraphs short (2-3 sentences max) and bold key terms on their first mention.

### 1. Overview
- What is this topic and why does it matter for interviews?
- Real-world use cases where this concept is applied.
- Maximum 3 sentences, high-level only.

### 2. Key Concepts
- List 4-6 fundamental concepts as bullet points.
- Each bullet must be a concise, one-line theoretical statement.
- No code in this section.

### 3. Theory & Fundamentals
- Explain each key concept in 2-3 sentences.
- Use simple analogies where helpful.
- No code blocks in this section.

### 4. Visual Diagrams
- Include exactly ONE Mermaid diagram that explains the core concept, architecture, or workflow visually.
- STRICT MERMAID RULES: Use only standard \`flowchart TD\`, \`flowchart LR\`, or \`sequenceDiagram\`. Do not use subgraphs, custom CSS, or experimental features.
- Example format:
\`\`\`mermaid
flowchart TD
    A[Concept] --> B[Result]
\`\`\`

### 5. Code Examples (Java)
- Maximum 2 code blocks per topic.
- Code must be in Java. Never use JavaScript, TypeScript, or pseudocode.
- Focus strictly on the KEY implementation (15-25 lines max).
- Omit boilerplate (e.g., standard imports, getters/setters, basic class wrappers) unless absolutely necessary for context.
- Use inline comments to explain WHAT the code is doing and WHY, not how standard Java syntax works.

### 6. Common Interview Questions
- List 4-5 frequently asked interview questions appropriate for a senior engineer.
- Include brief answer outlines (2-3 sentences each).
- Focus heavily on "WHY" answers, trade-offs, and underlying mechanics rather than rote memorization.

### 7. Tips & Gotchas
- Provide 3-4 practical interview tips or common pitfalls.
- Highlight specific mistakes candidates make when discussing this topic.
- State exactly what interviewers are looking for in a strong candidate.
</instructions>

<constraints>
- Adhere strictly to the requested headings and structure.
- Total word count should naturally fall between 600-800 words based on the sentence limits provided.
- Do not output any introductory or concluding conversational text outside of the requested markdown structure.
</constraints>`;

  const response = await fetch("https://api.minimax.io/anthropic/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: "MiniMax-M2.7",
      max_tokens: 4096,
      system: systemPrompt,
      messages: [
        {
          role: "user",
          content: `Generate structured markdown content for "${topicTitle}" in the ${roadmapName} roadmap. Follow the exact section structure defined in your system prompt.`,
        },
      ],
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`MiniMax API error: ${response.status} - ${errorText}`);
  }

  const data = (await response.json()) as {
    content?: Array<{ type: string; text?: string }>;
  };

  const content = data.content
    ?.filter((block) => block.type === "text")
    .map((block) => block.text || "")
    .join("") || "";

  if (!content.trim()) {
    throw new Error("No content generated from AI");
  }

  return content;
}
