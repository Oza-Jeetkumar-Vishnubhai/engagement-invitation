import { addRsvp, getGuest, saveGuestRsvp } from "@/lib/store";

export async function POST(req) {
  let body;
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: "Invalid request" }, { status: 400 });
  }

  const attending = body.attending === "yes" ? "yes" : body.attending === "no" ? "no" : null;
  const message = String(body.message || "").trim().slice(0, 1000) || null;
  if (!attending) return Response.json({ error: "Please tell us if you can come" }, { status: 400 });

  try {
    if (typeof body.id === "string" && body.id) {
      const guest = await getGuest(body.id);
      if (!guest) return Response.json({ error: "Invitation not found" }, { status: 404 });
      const count = attending === "yes" ? Math.min(Math.max(parseInt(body.count, 10) || 1, 1), Math.max(guest.pax, 1)) : 0;
      await saveGuestRsvp(guest.id, { attending, count, message });
    } else {
      const name = String(body.name || "").trim().slice(0, 120);
      if (!name) return Response.json({ error: "Please enter your name" }, { status: 400 });
      const count = attending === "yes" ? Math.min(Math.max(parseInt(body.count, 10) || 1, 1), 20) : 0;
      await addRsvp({ name, attending, count, message });
    }
    return Response.json({ ok: true });
  } catch (err) {
    console.error("RSVP failed", err);
    return Response.json({ error: "Could not save your reply, please try again" }, { status: 500 });
  }
}
