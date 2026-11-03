"use server";

import { revalidatePath } from "next/cache";
import { isAdmin, signIn, signOut } from "@/lib/auth";
import { normalizePhone } from "@/lib/phone";
import * as store from "@/lib/store";

async function guard() {
  if (!(await isAdmin())) throw new Error("Not signed in");
}

const cleanName = (s) => String(s || "").trim().slice(0, 120);
const cleanPax = (n) => Math.min(50, Math.max(1, parseInt(n, 10) || 1));

export async function login(_prev, formData) {
  const ok = await signIn(String(formData.get("password") || ""));
  if (!ok) return { error: "Wrong password" };
  revalidatePath("/admin");
  return { error: null };
}

export async function logout() {
  await signOut();
  revalidatePath("/admin");
}

export async function addGuest(_prev, formData) {
  await guard();
  const name = cleanName(formData.get("name"));
  const phone = normalizePhone(formData.get("phone"));
  if (!name) return { error: "Please enter a name" };
  if (!phone) return { error: "Please enter a valid phone number" };
  await store.addGuests([{ name, phone, pax: cleanPax(formData.get("pax")) }]);
  revalidatePath("/admin");
  return { error: null, ok: Date.now() };
}

// One guest per line: "Name, Phone, Guests" (comma or tab separated; guests optional).
export async function importGuests(_prev, formData) {
  await guard();
  const lines = String(formData.get("list") || "").split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
  const guests = [];
  const skipped = [];
  for (const line of lines) {
    const parts = line.split(/\t|,/).map((p) => p.trim());
    const name = cleanName(parts[0]);
    const phone = normalizePhone(parts[1]);
    if (!name || !phone) {
      skipped.push(line);
      continue;
    }
    guests.push({ name, phone, pax: cleanPax(parts[2]) });
  }
  if (guests.length) await store.addGuests(guests);
  revalidatePath("/admin");
  return { added: guests.length, skipped, ok: Date.now() };
}

export async function updateGuest(id, data) {
  await guard();
  const name = cleanName(data.name);
  const phone = normalizePhone(data.phone);
  if (!name || !phone) return { error: "Name and a valid phone number are required" };
  await store.updateGuest(id, { name, phone, pax: cleanPax(data.pax) });
  revalidatePath("/admin");
  return { error: null };
}

export async function deleteGuest(id) {
  await guard();
  await store.deleteGuest(id);
  revalidatePath("/admin");
}

export async function markSent(id) {
  await guard();
  await store.markSent(id);
  revalidatePath("/admin");
}
