"use client";

import { useState } from "react";

export default function Home() {
  const [repoUrl, setRepoUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<{
    owner: string;
    repo: string;
    files: string[];
  } | null>(null);

  const handleSubmit = async () => {
    setError("");
    setResult(null);
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

      {error && (
        <p className="text-red-500 mb-4">{error}</p>
      )}

      {result && (
        <div className="w-full max-w-2xl bg-gray-900 rounded p-4 max-h-[500px] overflow-y-auto">
          <h2 className="text-lg font-semibold mb-2">
            {result.owner}/{result.repo} — {result.files.length} files
          </h2>
          <ul className="text-sm text-gray-300 space-y-1">
            {result.files.map((file) => (
              <li key={file}>{file}</li>
            ))}
          </ul>
        </div>
      )}
    </main>
  );
}