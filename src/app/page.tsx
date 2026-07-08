"use client";

import { useState } from "react";

type TreeNode = {
  name: string;
  path: string;
  isFile: boolean;
  children: TreeNode[];
};

function buildTree(files: string[]): TreeNode[] {
  const root: TreeNode[] = [];

  for (const filePath of files) {
    const parts = filePath.split("/");
    let currentLevel = root;
    let currentPath = "";

    parts.forEach((part, index) => {
      currentPath = currentPath ? `${currentPath}/${part}` : part;
      const isFile = index === parts.length - 1;

      let existing = currentLevel.find((node) => node.name === part);

      if (!existing) {
        existing = { name: part, path: currentPath, isFile, children: [] };
        currentLevel.push(existing);
      }

      currentLevel = existing.children;
    });
  }

  return root;
}

function explainFile(path: string): string {
  const name = path.split("/").pop() || path;
  const lower = name.toLowerCase();

  if (lower === "package.json") return "Lists the project's dependencies and scripts.";
  if (lower === "package-lock.json") return "Locks exact versions of installed dependencies.";
  if (lower === "readme.md") return "Documentation explaining what this project is and how to use it.";
  if (lower === "tsconfig.json") return "TypeScript compiler configuration.";
  if (lower === ".gitignore") return "Lists files/folders Git should not track.";
  if (lower === "next.config.ts" || lower === "next.config.js") return "Configuration for the Next.js framework.";
  if (lower.includes("eslint")) return "Configuration for code linting/style rules.";
  if (lower.includes("postcss")) return "Configuration for CSS processing.";
  if (lower === "layout.tsx") return "Defines the shared layout/wrapper for pages in this folder.";
  if (lower === "page.tsx" || lower === "page.jsx") return "Defines the UI for this route/page.";
  if (lower === "route.ts" || lower === "route.js") return "Backend API endpoint — handles requests for this route.";
  if (lower === "globals.css") return "Global CSS styles applied across the whole app.";
  if (lower.endsWith(".svg")) return "An image/icon in vector format.";
  if (lower.endsWith(".ico")) return "The site's favicon (browser tab icon).";
  if (lower.endsWith(".css")) return "Stylesheet — controls visual appearance.";
  if (lower.endsWith(".test.ts") || lower.endsWith(".test.tsx") || lower.endsWith(".spec.ts")) return "Automated test file.";
  if (lower.endsWith(".md")) return "Markdown documentation file.";
  if (lower.endsWith(".env") || lower.startsWith(".env")) return "Stores environment variables / secrets (not committed to Git).";
  if (lower.endsWith(".ts") || lower.endsWith(".tsx")) return "TypeScript source file — contains application logic.";
  if (lower.endsWith(".js") || lower.endsWith(".jsx")) return "JavaScript source file — contains application logic.";
  if (lower.endsWith(".json")) return "Structured data/configuration file.";
  if (lower.endsWith(".yml") || lower.endsWith(".yaml")) return "Configuration file, often used for CI/CD or deployment settings.";
  if (lower.endsWith(".png") || lower.endsWith(".jpg") || lower.endsWith(".jpeg")) return "An image asset.";

  return "A project file.";
}

function TreeItem({
  node,
  onSelect,
  selectedPath,
}: {
  node: TreeNode;
  onSelect: (path: string) => void;
  selectedPath: string | null;
}) {
  const [open, setOpen] = useState(true);

  if (node.isFile) {
    return (
      <div
        onClick={() => onSelect(node.path)}
        className={`pl-4 py-0.5 text-sm cursor-pointer rounded ${selectedPath === node.path
            ? "bg-blue-900 text-white"
            : "text-gray-300 hover:bg-gray-800"
          }`}
      >
        📄 {node.name}
      </div>
    );
  }

  return (
    <div className="pl-4">
      <div
        className="py-0.5 text-sm text-blue-300 cursor-pointer select-none"
        onClick={() => setOpen(!open)}
      >
        {open ? "📂" : "📁"} {node.name}
      </div>
      {open && (
        <div>
          {node.children.map((child) => (
            <TreeItem
              key={child.path}
              node={child}
              onSelect={onSelect}
              selectedPath={selectedPath}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default function Home() {
  const [repoUrl, setRepoUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<{
    owner: string;
    repo: string;
    files: string[];
  } | null>(null);
  const [selectedPath, setSelectedPath] = useState<string | null>(null);

  const handleSubmit = async () => {
    setError("");
    setResult(null);
    setSelectedPath(null);
    setLoading(true);

    try {
      const res = await fetch("/api/fetch-repo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ repoUrl }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Something went wrong");
      } else {
        setResult(data);
      }
    } catch (err) {
      setError("Failed to fetch repo");
    } finally {
      setLoading(false);
    }
  };

  const tree = result ? buildTree(result.files) : [];

  return (
    <main className="flex min-h-screen flex-col items-center bg-black text-white p-8">
      <h1 className="text-3xl font-bold mb-6 mt-12">Repo Mapper</h1>
      <p className="text-gray-400 mb-8">Paste a GitHub repo URL to visualize it</p>

      <div className="flex gap-2 w-full max-w-md mb-8">
        <input
          type="text"
          value={repoUrl}
          onChange={(e) => setRepoUrl(e.target.value)}
          placeholder="https://github.com/user/repo"
          className="flex-1 px-4 py-2 rounded bg-gray-900 border border-gray-700 text-white focus:outline-none focus:border-blue-500"
        />
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="px-4 py-2 bg-blue-600 rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? "Loading..." : "Map It"}
        </button>
      </div>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      {result && (
        <div className="flex gap-4 w-full max-w-4xl">
          <div className="flex-1 bg-gray-900 rounded p-4 max-h-[500px] overflow-y-auto">
            <h2 className="text-lg font-semibold mb-3">
              {result.owner}/{result.repo} — {result.files.length} files
            </h2>
            {tree.map((node) => (
              <TreeItem
                key={node.path}
                node={node}
                onSelect={setSelectedPath}
                selectedPath={selectedPath}
              />
            ))}
          </div>

          <div className="flex-1 bg-gray-900 rounded p-4 max-h-[500px]">
            <h2 className="text-lg font-semibold mb-3">File Info</h2>
            {selectedPath ? (
              <div>
                <p className="text-sm text-blue-300 mb-2 break-all">{selectedPath}</p>
                <p className="text-sm text-gray-300">{explainFile(selectedPath)}</p>
              </div>
            ) : (
              <p className="text-sm text-gray-500">Click a file on the left to see what it does.</p>
            )}
          </div>
        </div>
      )}
    </main>
  );
}