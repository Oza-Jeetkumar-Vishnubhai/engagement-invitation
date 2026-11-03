// Guest + RSVP storage.
// Uses Neon Postgres when DATABASE_URL (or POSTGRES_URL) is set — Vercel adds this when you
// connect a Neon database. In local development without it, data goes to .data/db.json.

import { neon } from "@neondatabase/serverless";
import { randomBytes } from "crypto";
import fs from "fs";
import path from "path";

const url = process.env.DATABASE_URL || process.env.POSTGRES_URL;

export const storeReady = () => Boolean(url) || process.env.NODE_ENV !== "production";

const ID_CHARS = "abcdefghijkmnpqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ23456789";
export function newId(length = 8) {
  return Array.from(randomBytes(length), (b) => ID_CHARS[b % ID_CHARS.length]).join("");
}

const iso = (v) => (v ? new Date(v).toISOString() : null);

const toGuest = (r) => ({
  id: r.id,
  name: r.name,
  phone: r.phone,
  pax: r.pax,
  createdAt: iso(r.created_at),
  sentAt: iso(r.sent_at),
  openedAt: iso(r.opened_at),
  openCount: r.open_count,
  rsvp: r.rsvp_status
    ? { attending: r.rsvp_status, count: r.rsvp_count, message: r.rsvp_message, at: iso(r.rsvp_at) }
    : null,
});

const toRsvp = (r) => ({
  id: r.id,
  name: r.name,
  attending: r.attending,
  count: r.count,
  message: r.message,
  at: iso(r.created_at),
});

/* ---------- Postgres ---------- */

let sql;
let schema;

function pg() {
  sql ??= neon(url);
  schema ??= (async () => {
    await sql`create table if not exists guests (
      id text primary key,
      name text not null,
      phone text not null,
      pax int not null default 1,
      created_at timestamptz not null default now(),
      sent_at timestamptz,
      opened_at timestamptz,
      open_count int not null default 0,
      rsvp_status text,
      rsvp_count int,
      rsvp_message text,
      rsvp_at timestamptz
    )`;
    await sql`create table if not exists rsvps (
      id text primary key,
      name text not null,
      attending text not null,
      count int not null default 1,
      message text,
      created_at timestamptz not null default now()
    )`;
  })().catch((err) => {
    schema = null;
    throw err;
  });
  return schema.then(() => sql);
}

const pgStore = {
  async listGuests() {
    const db = await pg();
    return (await db`select * from guests order by created_at desc`).map(toGuest);
  },
  async getGuest(id) {
    const db = await pg();
    const [row] = await db`select * from guests where id = ${id}`;
    return row ? toGuest(row) : null;
  },
  async addGuests(list) {
    const db = await pg();
    const rows = list.map((g) => ({ ...g, id: newId() }));
    await db`insert into guests (id, name, phone, pax)
      select * from unnest(${rows.map((r) => r.id)}::text[], ${rows.map((r) => r.name)}::text[],
                           ${rows.map((r) => r.phone)}::text[], ${rows.map((r) => r.pax)}::int[])`;
    return rows.length;
  },
  async updateGuest(id, { name, phone, pax }) {
    const db = await pg();
    await db`update guests set name = ${name}, phone = ${phone}, pax = ${pax} where id = ${id}`;
  },
  async deleteGuest(id) {
    const db = await pg();
    await db`delete from guests where id = ${id}`;
  },
  async markSent(id) {
    const db = await pg();
    await db`update guests set sent_at = now() where id = ${id}`;
  },
  async markOpened(id) {
    const db = await pg();
    await db`update guests set opened_at = coalesce(opened_at, now()), open_count = open_count + 1 where id = ${id}`;
  },
  async saveGuestRsvp(id, { attending, count, message }) {
    const db = await pg();
    const rows = await db`update guests
      set rsvp_status = ${attending}, rsvp_count = ${count}, rsvp_message = ${message}, rsvp_at = now()
      where id = ${id} returning id`;
    return rows.length > 0;
  },
  async addRsvp({ name, attending, count, message }) {
    const db = await pg();
    await db`insert into rsvps (id, name, attending, count, message)
      values (${newId(10)}, ${name}, ${attending}, ${count}, ${message})`;
  },
  async listRsvps() {
    const db = await pg();
    return (await db`select * from rsvps order by created_at desc`).map(toRsvp);
  },
};

/* ---------- Local JSON file (development only) ---------- */

const FILE = path.join(process.cwd(), ".data", "db.json");

function readFile() {
  try {
    return JSON.parse(fs.readFileSync(FILE, "utf8"));
  } catch {
    return { guests: [], rsvps: [] };
  }
}

function writeFile(data) {
  fs.mkdirSync(path.dirname(FILE), { recursive: true });
  fs.writeFileSync(FILE, JSON.stringify(data, null, 2));
}

function edit(fn) {
  const data = readFile();
  const result = fn(data);
  writeFile(data);
  return result;
}

const now = () => new Date().toISOString();

const fileStore = {
  async listGuests() {
    return readFile().guests.map(toGuest).sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  },
  async getGuest(id) {
    const row = readFile().guests.find((g) => g.id === id);
    return row ? toGuest(row) : null;
  },
  async addGuests(list) {
    return edit((d) => {
      for (const g of list) d.guests.push({ id: newId(), name: g.name, phone: g.phone, pax: g.pax, created_at: now(), open_count: 0 });
      return list.length;
    });
  },
  async updateGuest(id, { name, phone, pax }) {
    edit((d) => Object.assign(d.guests.find((g) => g.id === id) || {}, { name, phone, pax }));
  },
  async deleteGuest(id) {
    edit((d) => (d.guests = d.guests.filter((g) => g.id !== id)));
  },
  async markSent(id) {
    edit((d) => Object.assign(d.guests.find((g) => g.id === id) || {}, { sent_at: now() }));
  },
  async markOpened(id) {
    edit((d) => {
      const g = d.guests.find((x) => x.id === id);
      if (g) {
        g.opened_at ??= now();
        g.open_count = (g.open_count || 0) + 1;
      }
    });
  },
  async saveGuestRsvp(id, { attending, count, message }) {
    return edit((d) => {
      const g = d.guests.find((x) => x.id === id);
      if (!g) return false;
      Object.assign(g, { rsvp_status: attending, rsvp_count: count, rsvp_message: message, rsvp_at: now() });
      return true;
    });
  },
  async addRsvp({ name, attending, count, message }) {
    edit((d) => d.rsvps.push({ id: newId(10), name, attending, count, message, created_at: now() }));
  },
  async listRsvps() {
    return readFile().rsvps.map(toRsvp).reverse();
  },
};

function store() {
  if (url) return pgStore;
  if (process.env.NODE_ENV === "production") {
    throw new Error("No database connected. Add a Neon database to the Vercel project (it sets DATABASE_URL).");
  }
  return fileStore;
}

export const listGuests = () => store().listGuests();
export const getGuest = (id) => store().getGuest(id);
export const addGuests = (list) => store().addGuests(list);
export const updateGuest = (id, data) => store().updateGuest(id, data);
export const deleteGuest = (id) => store().deleteGuest(id);
export const markSent = (id) => store().markSent(id);
export const markOpened = (id) => store().markOpened(id);
export const saveGuestRsvp = (id, data) => store().saveGuestRsvp(id, data);
export const addRsvp = (data) => store().addRsvp(data);
export const listRsvps = () => store().listRsvps();
