import { markOpened } from "@/lib/store";

// Called when a guest taps the seal on their personal invitation.
export async function POST(req) {
  try {
    const { id } = JSON.parse(await req.text());
    if (typeof id === "string" && /^[A-Za-z0-9]{6,16}$/.test(id)) await markOpened(id);
  } catch {}
  return new Response(null, { status: 204 });
}
