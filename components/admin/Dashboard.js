"use client";

import { useActionState, useEffect, useMemo, useRef, useState, useTransition } from "react";
import { invite } from "@/invite.config";
import { addGuest, deleteGuest, importGuests, logout, markSent, updateGuest } from "@/app/admin/actions";

const STATUS = {
  new: { label: "Not sent", tone: "grey" },
  sent: { label: "Sent", tone: "blue" },
  opened: { label: "Opened", tone: "amber" },
  coming: { label: "Coming", tone: "green" },
  declined: { label: "Can't come", tone: "red" },
};

const statusOf = (g) =>
  g.rsvp ? (g.rsvp.attending === "yes" ? "coming" : "declined") : g.openedAt ? "opened" : g.sentAt ? "sent" : "new";

const FILTERS = [
  ["all", "All"],
  ["new", "Not sent"],
  ["sent", "Sent, not opened"],
  ["opened", "Opened, no reply"],
  ["coming", "Coming"],
  ["declined", "Can't come"],
];

const prettyPhone = (p) => (p.length > 10 ? `+${p.slice(0, -10)} ${p.slice(-10, -5)} ${p.slice(-5)}` : p);

function When({ iso }) {
  if (!iso) return null;
  return (
    <span suppressHydrationWarning>
      {new Date(iso).toLocaleString("en-IN", { day: "numeric", month: "short", hour: "numeric", minute: "2-digit" })}
    </span>
  );
}

export default function Dashboard({ guests, rsvps }) {
  const [origin, setOrigin] = useState("");
  const [filter, setFilter] = useState("all");
  const [query, setQuery] = useState("");

  useEffect(() => setOrigin(window.location.origin), []);

  const stats = useMemo(() => {
    const s = { guests: guests.length, people: 0, sent: 0, opened: 0, coming: 0, declined: 0, awaiting: 0 };
    for (const g of guests) {
      s.people += g.pax;
      if (g.sentAt) s.sent++;
      if (g.openedAt) s.opened++;
      if (g.rsvp?.attending === "yes") s.coming += g.rsvp.count || 0;
      else if (g.rsvp) s.declined++;
      else s.awaiting++;
    }
    s.walkIn = rsvps.filter((r) => r.attending === "yes").reduce((n, r) => n + (r.count || 0), 0);
    return s;
  }, [guests, rsvps]);

  const shown = guests.filter((g) => {
    if (filter !== "all" && statusOf(g) !== filter) return false;
    const q = query.trim().toLowerCase();
    return !q || g.name.toLowerCase().includes(q) || g.phone.includes(q.replace(/\D/g, "") || "~");
  });

  return (
    <main className="admin">
      <header className="admin-head">
        <div>
          <h1>
            {invite.bride} &amp; {invite.groom}
          </h1>
          <p className="muted">
            {invite.eventTitle} · {invite.dateLabel}
          </p>
        </div>
        <div className="head-actions">
          <a className="a-btn" href="/" target="_blank" rel="noopener noreferrer">
            View invitation
          </a>
          <form action={logout}>
            <button className="a-btn">Sign out</button>
          </form>
        </div>
      </header>

      <section className="stats">
        <Stat value={stats.guests} label="Invites" sub={`${stats.people} people`} />
        <Stat value={stats.sent} label="Sent" />
        <Stat value={stats.opened} label="Opened" />
        <Stat value={stats.coming + stats.walkIn} label="People coming" tone="green" sub={stats.walkIn ? `incl. ${stats.walkIn} via general link` : null} />
        <Stat value={stats.declined} label="Can't come" tone="red" />
        <Stat value={stats.awaiting} label="Awaiting reply" />
      </section>

      <section className="admin-grid">
        <AddGuest />
        <ImportGuests />
      </section>

      <section className="admin-card">
        <div className="list-head">
          <h2>Guests</h2>
          <input className="search" type="search" placeholder="Search name or phone…" value={query} onChange={(e) => setQuery(e.target.value)} />
        </div>
        <div className="filters">
          {FILTERS.map(([key, label]) => (
            <button key={key} type="button" className={`chip ${filter === key ? "on" : ""}`} onClick={() => setFilter(key)}>
              {label}
              <span>{key === "all" ? guests.length : guests.filter((g) => statusOf(g) === key).length}</span>
            </button>
          ))}
        </div>

        {shown.length === 0 ? (
          <p className="muted empty">{guests.length ? "No guests match." : "No guests yet — add your first one above."}</p>
        ) : (
          <ul className="guests">
            {shown.map((g) => (
              <GuestRow key={g.id} guest={g} origin={origin} />
            ))}
          </ul>
        )}
      </section>

      {rsvps.length > 0 && (
        <section className="admin-card">
          <h2>Replies via the general link</h2>
          <p className="muted">From people who used the shared link instead of a personal one.</p>
          <ul className="guests">
            {rsvps.map((r) => (
              <li key={r.id} className="guest">
                <div className="g-main">
                  <div className="g-name">{r.name}</div>
                  <div className="g-meta">
                    <Badge status={r.attending === "yes" ? "coming" : "declined"} />
                    {r.attending === "yes" && <span>{r.count} people</span>}
                    <When iso={r.at} />
                  </div>
                  {r.message && <p className="g-msg">“{r.message}”</p>}
                </div>
              </li>
            ))}
          </ul>
        </section>
      )}
    </main>
  );
}

function Stat({ value, label, sub, tone }) {
  return (
    <div className={`stat ${tone || ""}`}>
      <b>{value}</b>
      <span>{label}</span>
      {sub && <small>{sub}</small>}
    </div>
  );
}

function Badge({ status }) {
  const s = STATUS[status];
  return <span className={`badge ${s.tone}`}>{s.label}</span>;
}

function AddGuest() {
  const formRef = useRef(null);
  const [state, action, pending] = useActionState(addGuest, { error: null });

  useEffect(() => {
    if (state.ok) {
      formRef.current?.reset();
      formRef.current?.elements.name.focus();
    }
  }, [state.ok]);

  return (
    <form ref={formRef} className="admin-card" action={action}>
      <h2>Add a guest</h2>
      <label>
        Name as it should appear
        <input name="name" placeholder="e.g. Mehta Uncle & Family" required maxLength={120} />
      </label>
      <div className="row">
        <label className="grow">
          WhatsApp number
          <input name="phone" type="tel" placeholder="98765 43210" required />
        </label>
        <label className="pax">
          People
          <input name="pax" type="number" min="1" max="50" defaultValue="2" />
        </label>
      </div>
      {state.error && <p className="error">{state.error}</p>}
      <button className="a-btn primary" disabled={pending}>
        {pending ? "Adding…" : "Add guest"}
      </button>
    </form>
  );
}

function ImportGuests() {
  const formRef = useRef(null);
  const [state, action, pending] = useActionState(importGuests, { added: 0, skipped: [] });

  useEffect(() => {
    if (state.ok && !state.skipped.length) formRef.current?.reset();
  }, [state.ok, state.skipped.length]);

  return (
    <form ref={formRef} className="admin-card" action={action}>
      <h2>Add many at once</h2>
      <label>
        One guest per line: <i>Name, Phone, People</i> — or paste straight from Excel
        <textarea name="list" rows={5} placeholder={"Mehta Uncle & Family, 9876543210, 4\nRiya Didi, 9123456780, 2"} required />
      </label>
      {state.ok && (
        <p className={state.skipped.length ? "error" : "success"}>
          Added {state.added}.{" "}
          {state.skipped.length > 0 && `Skipped ${state.skipped.length} line(s) without a valid name/phone: ${state.skipped.slice(0, 3).join(" | ")}`}
        </p>
      )}
      <button className="a-btn primary" disabled={pending}>
        {pending ? "Importing…" : "Import list"}
      </button>
    </form>
  );
}

function GuestRow({ guest: g, origin }) {
  const [editing, setEditing] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState(null);
  const [pending, start] = useTransition();
  const link = `${origin}/i/${g.id}`;
  const waUrl = `https://wa.me/${g.phone}?text=${encodeURIComponent(invite.whatsappMessage({ name: g.name, link }))}`;
  const status = statusOf(g);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(link);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      window.prompt("Copy this link:", link);
    }
  };

  if (editing) {
    return (
      <li className="guest editing">
        <form
          className="edit-form"
          onSubmit={(e) => {
            e.preventDefault();
            const f = new FormData(e.currentTarget);
            start(async () => {
              const res = await updateGuest(g.id, { name: f.get("name"), phone: f.get("phone"), pax: f.get("pax") });
              if (res.error) setError(res.error);
              else setEditing(false);
            });
          }}
        >
          <input name="name" defaultValue={g.name} required maxLength={120} />
          <input name="phone" defaultValue={g.phone} required type="tel" />
          <input name="pax" defaultValue={g.pax} type="number" min="1" max="50" />
          <button className="a-btn primary" disabled={pending}>
            Save
          </button>
          <button type="button" className="a-btn" onClick={() => setEditing(false)}>
            Cancel
          </button>
          {error && <p className="error">{error}</p>}
        </form>
      </li>
    );
  }

  return (
    <li className={`guest ${pending ? "busy" : ""}`}>
      <div className="g-main">
        <div className="g-name">{g.name}</div>
        <div className="g-meta">
          <Badge status={status} />
          <span>{prettyPhone(g.phone)}</span>
          <span>
            {g.pax} {g.pax === 1 ? "person" : "people"} invited
          </span>
        </div>
        <div className="g-times">
          {g.sentAt && (
            <span>
              Sent <When iso={g.sentAt} />
            </span>
          )}
          {g.openedAt && (
            <span>
              Opened <When iso={g.openedAt} />
              {g.openCount > 1 && ` · ${g.openCount}×`}
            </span>
          )}
          {g.rsvp && (
            <span>
              Replied <When iso={g.rsvp.at} />
              {g.rsvp.attending === "yes" && ` · ${g.rsvp.count} coming`}
            </span>
          )}
        </div>
        {g.rsvp?.message && <p className="g-msg">“{g.rsvp.message}”</p>}
      </div>
      <div className="g-actions">
        <a
          className="a-btn whatsapp"
          href={origin ? waUrl : undefined}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => start(() => markSent(g.id))}
        >
          {g.sentAt ? "Send again" : "Send on WhatsApp"}
        </a>
        <button type="button" className="a-btn" onClick={copy}>
          {copied ? "Copied!" : "Copy link"}
        </button>
        <a className="a-btn" href={link} target="_blank" rel="noopener noreferrer">
          Preview
        </a>
        <button type="button" className="a-btn" onClick={() => setEditing(true)}>
          Edit
        </button>
        <button
          type="button"
          className="a-btn danger"
          onClick={() => confirm(`Delete ${g.name}? Their link will stop working.`) && start(() => deleteGuest(g.id))}
        >
          Delete
        </button>
      </div>
    </li>
  );
}
