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

function Clouds() {
  const clouds = [
    { top: "8%", size: 140, duration: 60, delay: 0, opacity: 0.9 },
    { top: "15%", size: 90, duration: 45, delay: 5, opacity: 0.8 },
    { top: "5%", size: 110, duration: 70, delay: 15, opacity: 0.85 },
    { top: "22%", size: 70, duration: 50, delay: 8, opacity: 0.7 },
    { top: "12%", size: 160, duration: 80, delay: 25, opacity: 0.75 },
  ];
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {clouds.map((c, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            top: c.top,
            left: "-20%",
            width: c.size,
            height: c.size * 0.4,
            opacity: c.opacity,
            filter: "blur(6px)",
            animation: `drift ${c.duration}s linear ${c.delay}s infinite`,
          }}
        >
          <div className="w-full h-full bg-white rounded-full" style={{ boxShadow: "40px 5px 0 -10px white, -35px 8px 0 -8px white, 20px -12px 0 -5px white" }} />
        </div>
      ))}
    </div>
  );
}

function GrassField() {
  const blades = Array.from({ length: 140 });
  const flowers = Array.from({ length: 22 });
  const flowerColors = ["#ffffff", "#f5e663", "#e0b3f0", "#ffb3d9"];

  return (
    <div className="absolute bottom-0 left-0 w-full h-56 overflow-hidden pointer-events-none z-10">
      <div className="absolute bottom-0 w-full h-full bg-gradient-to-t from-green-950 via-green-800/70 to-transparent" />

      <div className="absolute bottom-0 w-full h-full flex items-end justify-around">
        {blades.slice(0, 70).map((_, i) => {
          const height = 50 + Math.random() * 60;
          const width = 3 + Math.random() * 2;
          const delay = Math.random() * 2;
          const duration = 2.5 + Math.random() * 1.5;
          const hue = 100 + Math.random() * 25;
          const lean = -15 + Math.random() * 10;
          return (
            <div
              key={`back-${i}`}
              style={{
                height: `${height}px`,
                width: `${width}px`,
                background: `linear-gradient(to top, hsl(${hue},45%,15%), hsl(${hue},55%,32%))`,
                borderRadius: "50% 50% 0 0",
                transformOrigin: "bottom center",
                transform: `rotate(${lean}deg)`,
                animation: `sway ${duration}s ease-in-out ${delay}s infinite alternate`,
                opacity: 0.85,
              }}
            />
          );
        })}
      </div>

      <div className="absolute bottom-2 w-full h-full flex items-end justify-around">
        {flowers.map((_, i) => {
          const height = 45 + Math.random() * 40;
          const delay = Math.random() * 2;
          const duration = 3 + Math.random() * 1.5;
          const color = flowerColors[i % flowerColors.length];
          const show = Math.random() > 0.4;
          return (
            <div
              key={`flower-${i}`}
              style={{
                height: `${height}px`,
                width: "2px",
                background: "hsl(110,40%,25%)",
                transformOrigin: "bottom center",
                animation: `sway ${duration}s ease-in-out ${delay}s infinite alternate`,
                position: "relative",
                visibility: show ? "visible" : "hidden",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  top: "-4px",
                  left: "-3px",
                  width: "8px",
                  height: "8px",
                  borderRadius: "50%",
                  background: color,
                  boxShadow: `0 0 4px ${color}`,
                }}
              />
            </div>
          );
        })}
      </div>

      <div className="absolute bottom-0 w-full h-full flex items-end justify-around">
        {blades.slice(70, 140).map((_, i) => {
          const height = 30 + Math.random() * 45;
          const width = 4 + Math.random() * 2;
          const delay = Math.random() * 2;
          const duration = 2 + Math.random() * 1.2;
          const hue = 95 + Math.random() * 30;
          const lean = -12 + Math.random() * 24;
          return (
            <div
              key={`front-${i}`}
              style={{
                height: `${height}px`,
                width: `${width}px`,
                background: `linear-gradient(to top, hsl(${hue},55%,20%), hsl(${hue},70%,48%))`,
                borderRadius: "50% 50% 0 0",
                transformOrigin: "bottom center",
                transform: `rotate(${lean}deg)`,
                animation: `sway ${duration}s ease-in-out ${delay}s infinite alternate`,
              }}
            />
          );
        })}
      </div>
    </div>
  );
}

function TreeItem({
  node, onSelect, selectedPath, depth = 0,
}: { node: TreeNode; onSelect: (path: string) => void; selectedPath: string | null; depth?: number }) {
  const [open, setOpen] = useState(true);

  if (node.isFile) {
    return (
      <div
        onClick={() => onSelect(node.path)}
        className={`flex items-center gap-2.5 py-2 px-3 text-sm cursor-pointer rounded-lg transition-all duration-150 font-medium ${selectedPath === node.path
            ? "bg-white/40 text-emerald-950 shadow-[0_0_15px_rgba(0,0,0,0.1)]"
            : "text-emerald-900 hover:bg-white/20"
          }`}
        style={{ marginLeft: `${depth * 14}px` }}
      >
        <span className="text-xs">📄</span>
        <span className="truncate">{node.name}</span>
      </div>
    );
  }

  return (
    <div>
      <div
        className="flex items-center gap-2 py-2 px-3 text-sm text-amber-800 cursor-pointer select-none hover:bg-white/20 rounded-lg transition-all duration-150 font-bold"
        style={{ marginLeft: `${depth * 14}px` }}
        onClick={() => setOpen(!open)}
      >
        <span className={`text-xs transition-transform duration-150 ${open ? "rotate-90" : ""}`}>▶</span>
        <span>{open ? "📂" : "📁"}</span>
        <span>{node.name}</span>
      </div>
      {open && (
        <div>
          {node.children.map((child) => (
            <TreeItem key={child.path} node={child} onSelect={onSelect} selectedPath={selectedPath} depth={depth + 1} />
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
  const [result, setResult] = useState<{ owner: string; repo: string; files: string[] } | null>(null);
  const [selectedPath, setSelectedPath] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (!repoUrl.trim()) return;
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
    <>
      <style jsx global>{`
        @keyframes sway {
          0% { transform: rotate(-6deg); }
          100% { transform: rotate(6deg); }
        }
        @keyframes drift {
          0% { transform: translateX(0); }
          100% { transform: translateX(140vw); }
        }
        .natural-scroll::-webkit-scrollbar {
          width: 10px;
        }
        .natural-scroll::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 10px;
        }
        .natural-scroll::-webkit-scrollbar-thumb {
          background: linear-gradient(180deg, #8B5A2B, #4a7c2f);
          border-radius: 10px;
          border: 2px solid rgba(255, 255, 255, 0.15);
        }
        .natural-scroll::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(180deg, #6b4423, #3a6324);
        }
      `}</style>

      <main
        className="relative min-h-screen text-white flex flex-col items-center px-6 py-16 overflow-hidden"
        style={{
          background: "linear-gradient(to bottom, #3a8fd9 0%, #7ec3e8 35%, #bfe3d0 60%, #4a9e5c 75%)",
        }}
      >
        <Clouds />

        <div className="relative z-20 w-full flex flex-col items-center">
          <div className="text-center mb-10">
            <h1 className="text-4xl font-bold tracking-tight mb-2 text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.3)]">
              Repo Mapper
            </h1>
            <p className="text-white/90 text-sm font-medium drop-shadow-[0_1px_4px_rgba(0,0,0,0.3)]">
              Paste a GitHub repo URL and explore its structure
            </p>
          </div>

          <div className="flex gap-2 w-full max-w-xl mb-10">
            <input
              type="text"
              value={repoUrl}
              onChange={(e) => setRepoUrl(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
              placeholder="https://github.com/user/repo"
              className="flex-1 px-4 py-3 rounded-2xl bg-white/20 backdrop-blur-2xl border border-white/40 text-white placeholder-white/70 focus:outline-none focus:border-white focus:shadow-[0_0_20px_rgba(255,255,255,0.3)] transition-all text-sm"
            />
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="px-6 py-3 rounded-2xl bg-white/25 backdrop-blur-2xl border border-white/40 font-semibold hover:bg-white/35 hover:shadow-[0_0_25px_rgba(255,255,255,0.3)] disabled:opacity-40 transition-all flex items-center gap-2"
            >
              {loading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  Loading
                </>
              ) : (
                "Map It →"
              )}
            </button>
          </div>

          {error && (
            <div className="w-full max-w-xl mb-6 px-4 py-3 rounded-2xl bg-red-500/20 backdrop-blur-xl border border-red-300/50 text-white text-sm">
              {error}
            </div>
          )}

          {result && (
            <div className="flex gap-4 w-full max-w-5xl mb-40">
              <div className="natural-scroll flex-1 bg-white/15 backdrop-blur-2xl border border-white/30 rounded-3xl p-6 max-h-[480px] overflow-y-auto shadow-[0_8px_32px_rgba(0,0,0,0.2)]">
                <div className="flex items-center justify-between mb-4 pb-3 border-b border-emerald-900/25">
                  <h2 className="text-sm font-bold text-emerald-950">
                    {result.owner}/{result.repo}
                  </h2>
                  <span className="text-xs text-emerald-900 bg-white/40 px-2 py-1 rounded-full">
                    {result.files.length} files
                  </span>
                </div>
                {tree.map((node) => (
                  <TreeItem key={node.path} node={node} onSelect={setSelectedPath} selectedPath={selectedPath} />
                ))}
              </div>

              <div className="natural-scroll flex-1 bg-white/15 backdrop-blur-2xl border border-white/30 rounded-3xl p-6 max-h-[480px] overflow-y-auto shadow-[0_8px_32px_rgba(0,0,0,0.2)]">
                <h2 className="text-sm font-bold text-emerald-950 mb-4 pb-3 border-b border-emerald-900/25">
                  File Info
                </h2>
                {selectedPath ? (
                  <div>
                    <p className="text-sm text-amber-800 mb-3 break-all font-mono font-semibold">{selectedPath}</p>
                    <p className="text-sm text-emerald-900 leading-relaxed">{explainFile(selectedPath)}</p>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-40 text-center">
                    <span className="text-2xl mb-2 opacity-70">👈</span>
                    <p className="text-sm text-emerald-800/70">Click a file to see what it does</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        <GrassField />
      </main>
    </>
  );
}