"use client";

import { useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import hljs from "highlight.js";

interface MarkdownRendererProps {
  content: string;
}

export function MarkdownRenderer({ content }: MarkdownRendererProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function renderMermaidAndHighlight() {
      if (typeof window === "undefined" || !containerRef.current) return;

      // Highlight.js syntax highlighting
      const codeBlocks = containerRef.current.querySelectorAll("pre code");
      codeBlocks.forEach((block) => {
        if (!block.classList.contains("hljs")) {
          hljs.highlightElement(block as HTMLElement);
        }
      });

      // Mermaid rendering
      const mermaid = (await import("mermaid")).default;
      mermaid.initialize({
        startOnLoad: false,
        theme: document.documentElement.classList.contains("dark")
          ? "dark"
          : "default",
        securityLevel: "loose",
      });

      const mermaidBlocks = containerRef.current.querySelectorAll("pre.mermaid");
      for (const block of mermaidBlocks) {
        const code = block.querySelector("code");
        if (code) {
          try {
            const id = `mermaid-${Math.random().toString(36).slice(2, 9)}`;
            const { svg } = await mermaid.render(id, code.textContent || "");
            block.innerHTML = svg;
            block.classList.add("mermaid-rendered");
          } catch (error) {
            console.error("Mermaid render error:", error);
          }
        }
      }
    }

    renderMermaidAndHighlight();
  }, [content]);

  return (
    <div ref={containerRef} className="prose prose-zinc dark:prose-invert max-w-none">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeHighlight]}
        components={{
          pre: ({ children, ...props }) => {
            const child = children as React.ReactElement<{ className?: string }>;
            if (child?.props?.className?.includes("language-mermaid")) {
              return (
                <pre {...props} className="mermaid bg-transparent p-0">
                  {children}
                </pre>
              );
            }
            return (
              <pre
                {...props}
                className="not-prose !mt-6 !mb-6 overflow-x-auto rounded-lg border border-zinc-200 dark:border-zinc-800"
              >
                {children}
              </pre>
            );
          },
          code: ({ className, children, ...props }) => {
            const isInline = !className;
            const match = className?.match(/language-(\w+)/);
            const language = match ? match[1] : "";

            if (isInline) {
              return (
                <code
                  {...props}
                  className="rounded bg-zinc-100 px-1.5 py-0.5 font-mono text-[0.875em] text-emerald-700 dark:bg-zinc-800 dark:text-emerald-400"
                >
                  {children}
                </code>
              );
            }

            return (
              <code className={`hljs language-${language}`} {...props}>
                {children}
              </code>
            );
          },
          h2: ({ children, ...props }) => (
            <h2
              {...props}
              className="mt-10 mb-4 flex items-center gap-3 text-xl font-bold before:h-1 before:w-8 before:rounded before:bg-emerald-500"
            >
              {children}
            </h2>
          ),
          h3: ({ children, ...props }) => (
            <h3 {...props} className="mt-6 mb-2 text-lg font-semibold text-zinc-800 dark:text-zinc-200">
              {children}
            </h3>
          ),
          ul: ({ children, ...props }) => (
            <ul {...props} className="my-3 list-inside list-disc space-y-1.5 text-zinc-700 dark:text-zinc-300">
              {children}
            </ul>
          ),
          ol: ({ children, ...props }) => (
            <ol {...props} className="my-3 list-inside list-decimal space-y-1.5 text-zinc-700 dark:text-zinc-300">
              {children}
            </ol>
          ),
          li: ({ children, ...props }) => (
            <li {...props} className="leading-relaxed">
              {children}
            </li>
          ),
          p: ({ children, ...props }) => (
            <p {...props} className="my-4 leading-relaxed text-zinc-700 dark:text-zinc-300">
              {children}
            </p>
          ),
          blockquote: ({ children, ...props }) => (
            <blockquote
              {...props}
              className="my-4 border-l-4 border-emerald-500 bg-emerald-50 py-3 pl-4 italic text-zinc-700 dark:bg-emerald-950/30 dark:text-zinc-300"
            >
              {children}
            </blockquote>
          ),
          table: ({ children, ...props }) => (
            <div className="my-6 overflow-x-auto">
              <table {...props} className="min-w-full divide-y divide-zinc-200 text-sm dark:divide-zinc-800">
                {children}
              </table>
            </div>
          ),
          th: ({ children, ...props }) => (
            <th {...props} className="px-4 py-2 text-left font-semibold text-zinc-900 dark:text-zinc-100">
              {children}
            </th>
          ),
          td: ({ children, ...props }) => (
            <td {...props} className="px-4 py-2 text-zinc-700 dark:text-zinc-300">
              {children}
            </td>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
