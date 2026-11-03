import { cache } from "react";
import { notFound } from "next/navigation";
import Invitation from "@/components/Invitation";
import { getGuest } from "@/lib/store";
import { invite } from "@/invite.config";

export const dynamic = "force-dynamic";

const loadGuest = cache((id) => (/^[A-Za-z0-9]{6,16}$/.test(id) ? getGuest(id) : null));

export async function generateMetadata({ params }) {
  const guest = await loadGuest((await params).id);
  if (!guest) return {};
  const title = `Dear ${guest.name}, you're invited 💍`;
  const description = `${invite.eventTitle} of ${invite.bride} & ${invite.groom} — ${invite.dateLabel}. Tap to open your invitation.`;
  return { title, description, openGraph: { title, description, type: "website" }, robots: { index: false } };
}

export default async function GuestInvitation({ params }) {
  const guest = await loadGuest((await params).id);
  if (!guest) notFound();
  return <Invitation guest={{ id: guest.id, name: guest.name, pax: guest.pax, rsvp: guest.rsvp }} />;
}
