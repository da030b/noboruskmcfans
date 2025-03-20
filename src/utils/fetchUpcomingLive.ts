// src/utils/fetchUpcomingLive.ts
export async function fetchUpcomingLive() {
  const channelId = 'UCkUfp0u4CK07r4bSWauIGFA';
  const apiKey = import.meta.env.YOUTUBE_API_KEY;
  const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${channelId}&eventType=upcoming&type=video&key=${apiKey}`;

  console.log("Requesting URL:", url);
  const res = await fetch(url);
  console.log("Response status:", res.status);
  if (!res.ok) {
    const text = await res.text();
    console.error("Response body:", text);
    throw new Error("Failed to fetch upcoming live events from YouTube");
  }
  const data = await res.json();
  return data.items || [];
}
