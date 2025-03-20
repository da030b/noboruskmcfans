// src/pages/api/upcoming.json.ts
import type { APIRoute } from 'astro';

export const prerender = false;
export const revalidate = 3600; // 1時間ごとに再生成

export const GET: APIRoute = async () => {
  const channelId = 'UCkUfp0u4CK07r4bSWauIGFA';
  const apiKey = import.meta.env.YOUTUBE_API_KEY;
  const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${channelId}&eventType=upcoming&type=video&key=${apiKey}`;

  console.log(`Fetching URL: ${url}`); // ログ出力

  const res = await fetch(url);
  if (!res.ok) {
    console.error("Failed to fetch upcoming live events from YouTube");
    return new Response(
      JSON.stringify({ error: "Failed to fetch upcoming live events from YouTube" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
  const data = await res.json();
  const events = data.items || [];

  // 生成時刻をログに出力する
  const generatedAt = Date.now();
  console.log("Page generated at:", new Date(generatedAt).toLocaleString());

  return new Response(
    JSON.stringify({ items: events, generatedAt }),
    {
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=300"
      }
    }
  );
};
