// src/utils/fetchUpcomingLive.ts
export async function fetchUpcomingLive() {
  const channelId = 'UCkUfp0u4CK07r4bSWauIGFA';
  const apiKey = import.meta.env.YOUTUBE_API_KEY;
  const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${channelId}&eventType=upcoming&type=video&key=${apiKey}`;

  const res = await fetch(url);
  if (!res.ok) {
    throw new Error("Failed to fetch upcoming live events from YouTube");
  }
  const data = await res.json();
  return data.items || [];
}
