import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    const { repoUrl } = await req.json();

    const match = repoUrl.match(/github\.com\/([^\/]+)\/([^\/]+)/);

    if (!match) {
        return NextResponse.json({ error: "Invalid GitHub URL" }, { status: 400 });
    }

    const [, owner, repo] = match;
    const token = process.env.GITHUB_TOKEN;

    try {
        const headers: Record<string, string> = {};
        if (token) {
            headers["Authorization"] = `Bearer ${token}`;
        }

        // First get the default branch name
        const repoInfoRes = await fetch(`https://api.github.com/repos/${owner}/${repo}`, { headers });
        if (!repoInfoRes.ok) {
            return NextResponse.json({ error: "Repo not found" }, { status: repoInfoRes.status });
        }
        const repoInfo = await repoInfoRes.json();
        const defaultBranch = repoInfo.default_branch;

        // Now fetch the file tree
        const treeRes = await fetch(
            `https://api.github.com/repos/${owner}/${repo}/git/trees/${defaultBranch}?recursive=1`,
            { headers }
        );

        if (!treeRes.ok) {
            return NextResponse.json({ error: "Failed to fetch file tree" }, { status: treeRes.status });
        }

        const data = await treeRes.json();

        const files = data.tree
            .filter((item: any) => item.type === "blob")
            .map((item: any) => item.path);

        return NextResponse.json({ owner, repo, files, defaultBranch });
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch repo" }, { status: 500 });
    }
}