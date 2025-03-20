// 例: fetchUpcomingLive.ts
export async function fetchUpcomingLive() {
  const channelId = 'UCkUfp0u4CK07r4bSWauIGFA';
  const apiKey = import.meta.env.YOUTUBE_API_KEY;
  const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${channelId}&eventType=upcoming&type=video&key=${apiKey}`;

  console.log("Fetching upcoming live events:", url);

  try {
    const res = await fetch(url);
    console.log("Response status:", res.status);

    if (!res.ok) {
      // ここでエラー内容をログ出力
      const errorText = await res.text();
      console.error("Error response body:", errorText);
      // エラーを投げる
      throw new Error("Failed to fetch upcoming live events from YouTube");
    }

    const data = await res.json();
    console.log("Data length:", data.items?.length ?? 0);
    return data.items || [];

  } catch (err) {
    console.error("Unexpected error in fetchUpcomingLive:", err);
    // ここで少し待つことでログがフラッシュされる可能性が高まる
    await new Promise(r => setTimeout(r, 100));
    throw err;
  }
}
