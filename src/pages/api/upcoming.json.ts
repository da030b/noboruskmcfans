// src/pages/api/upcoming.json.ts
import type { APIRoute } from 'astro';
import { fetchUpcomingLive } from '../../utils/fetchUpcomingLive';

export const prerender = false;
export const revalidate = 3600;

export const GET: APIRoute = async () => {
  const events = await fetchUpcomingLive();
  return new Response(JSON.stringify({ items: events, generatedAt: Date.now() }), {
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=300"
    }
  });
};
