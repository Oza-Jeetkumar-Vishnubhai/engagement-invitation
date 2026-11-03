"use client";

import { useEffect, useRef, useState } from "react";
import { invite } from "@/invite.config";
import { Seal, Valance, Garden, Divider, Icon, doorPattern, paperGrain, vinePattern } from "./art";
import { Reveal, Petals } from "./effects";
import ScratchHeart from "./ScratchHeart";

const initials = `${invite.bride[0]} | ${invite.groom[0]}`;

function googleCalendarUrl() {
  const start = new Date(invite.date);
  const end = new Date(start.getTime() + invite.durationHours * 3600_000);
  const fmt = (d) => d.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: `${invite.bride} & ${invite.groom} · ${invite.eventTitle}`,
    dates: `${fmt(start)}/${fmt(end)}`,
    details: invite.welcome,
    location: `${invite.venue.name}, ${invite.venue.address}`,
  });
  return `https://calendar.google.com/calendar/render?${params}`;
}

// `guest` is set on personal links (/i/[id]): { id, name, pax, rsvp }.
export default function Invitation({ guest = null }) {
  // closed → opening (doors + curtains animating) → open (scrollable)
  const [stage, setStage] = useState("closed");
  const [playing, setPlaying] = useState(false);
  const [musicOk, setMusicOk] = useState(Boolean(invite.music));
  const audioRef = useRef(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("locked", stage !== "open");
  }, [stage]);

  const open = () => {
    if (stage !== "closed") return;
    setStage("opening");
    if (guest) navigator.sendBeacon?.("/api/open", JSON.stringify({ id: guest.id }));
    const audio = audioRef.current;
    if (audio) {
      audio.volume = 0.6;
      audio.play().then(() => setPlaying(true)).catch(() => {});
    }
    setTimeout(() => setStage("open"), 3600);
  };

  const toggleMusic = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (audio.paused) audio.play().then(() => setPlaying(true)).catch(() => {});
    else {
      audio.pause();
      setPlaying(false);
    }
  };

  const opened = stage !== "closed";

  return (
    <main className="stage" style={{ "--door-pattern": doorPattern, "--grain": paperGrain, "--vine": vinePattern }}>
      <div className="card">
        {stage !== "open" && <Cover opening={opened} onOpen={open} guest={guest} />}

        <Hero opened={opened} />

        <div className="paper vined">
          <Welcome guest={guest} />
          <SaveTheDate />
          {invite.photo && <Photo />}
          <Countdown />
          <Events />
          <Venue />
          {invite.dressCode && <DressCode />}
          {invite.transport && <InfoBlock icon="car" title="Transportation" text={invite.transport} />}
          {invite.gifts && <InfoBlock icon="gift" title="Gifts" text={invite.gifts} />}
          <Rsvp guest={guest} />
          <Footer />
        </div>
      </div>

      {opened && <Petals />}

      {invite.music && (
        <>
          <audio ref={audioRef} src={invite.music} loop preload="none" onError={() => setMusicOk(false)} />
          {opened && musicOk && (
            <button type="button" className="music-toggle" onClick={toggleMusic} aria-label={playing ? "Pause music" : "Play music"}>
              <Icon name={playing ? "music" : "mute"} size={18} />
            </button>
          )}
        </>
      )}
    </main>
  );
}

function Cover({ opening, onOpen, guest }) {
  return (
    <div className={`cover ${opening ? "opening" : ""}`} onClick={onOpen} role="button" tabIndex={0} aria-label="Tap to open the invitation" onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && onOpen()}>
      <div className="door left">
        <span className="door-edge" />
      </div>
      <div className="door right">
        <span className="door-edge" />
      </div>
      <div className="seal">
        <Seal initials={initials} />
      </div>
      {guest && (
        <p className="cover-dear">
          <span>Dear {guest.name}</span>
        </p>
      )}
      <p className="cover-hint">You are cordially invited</p>
    </div>
  );
}

function Hero({ opened }) {
  return (
    <section className={`hero ${opened ? "opened" : ""}`}>
      <Valance />
      <div className="curtain left" />
      <div className="curtain right" />
      <span className="tieback left" />
      <span className="tieback right" />

      <div className="hero-content">
        <Divider />
        <p className="tagline">{invite.tagline}</p>
        <p className="event-title">{invite.eventTitle}</p>
        <h1 className="name">{invite.bride}</h1>
        <p className="parents">{invite.brideParents}</p>
        <p className="amp">&amp;</p>
        <h1 className="name">{invite.groom}</h1>
        <p className="parents">{invite.groomParents}</p>
        <p className="hero-date">
          {invite.dayLabel} · {invite.dateLabel}
        </p>
      </div>

      <Garden />
      <div className="scroll-cue" aria-hidden="true">
        <span />
      </div>
    </section>
  );
}

function Section({ title, icon, children, className = "" }) {
  return (
    <section className={`section ${className}`}>
      <Reveal>
        {icon && (
          <div className="section-icon">
            <Icon name={icon} />
          </div>
        )}
        {title && <h2 className="script-title">{title}</h2>}
        <Divider />
      </Reveal>
      {children}
    </section>
  );
}

function Welcome({ guest }) {
  return (
    <section className="section">
      <Reveal>
        <Divider />
        {guest && <p className="dear">Dear {guest.name},</p>}
        <p className="welcome">{invite.welcome}</p>
        <Divider />
      </Reveal>
    </section>
  );
}

function SaveTheDate() {
  const [revealed, setRevealed] = useState(false);
  return (
    <section className="section">
      <Reveal>
        <h2 className="script-title">{revealed ? "Our forever begins" : "Scratch to Reveal"}</h2>
        <Divider />
      </Reveal>
      <Reveal delay={150}>
        <ScratchHeart onReveal={() => setRevealed(true)}>
          <p className="h-small">You&apos;re Invited!</p>
          <p className="h-date">{invite.dateLabel}</p>
          <p className="h-small">{invite.dayLabel}</p>
          <p className="h-time">{invite.timeLabel}</p>
        </ScratchHeart>
      </Reveal>
      <div className={`save-wrap ${revealed ? "show" : ""}`}>
        <a className="btn" href={googleCalendarUrl()} target="_blank" rel="noopener noreferrer">
          <Icon name="calendar" size={18} /> Save the Date
        </a>
      </div>
    </section>
  );
}

function Photo() {
  const [ok, setOk] = useState(true);
  const imgRef = useRef(null);

  // The image may fail before hydration, when onError isn't attached yet.
  useEffect(() => {
    const img = imgRef.current;
    if (img?.complete && img.naturalWidth === 0) setOk(false);
  }, []);

  if (!ok) return null;
  return (
    <section className="section">
      <Reveal className="photo-frame">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img ref={imgRef} src={invite.photo} alt={`${invite.bride} & ${invite.groom}`} onError={() => setOk(false)} />
      </Reveal>
    </section>
  );
}

function Countdown() {
  const [left, setLeft] = useState(null);

  useEffect(() => {
    const target = new Date(invite.date).getTime();
    const tick = () => setLeft(Math.max(0, target - Date.now()));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  const units = left === null ? null : [
    ["Days", Math.floor(left / 86400000)],
    ["Hours", Math.floor(left / 3600000) % 24],
    ["Minutes", Math.floor(left / 60000) % 60],
    ["Seconds", Math.floor(left / 1000) % 60],
  ];

  return (
    <Section title="Counting Down to Forever">
      <Reveal className="countdown" delay={120}>
        {(units || [["Days"], ["Hours"], ["Minutes"], ["Seconds"]]).map(([label, v]) => (
          <div className="unit" key={label}>
            <span className="num">{v === undefined ? "--" : String(v).padStart(2, "0")}</span>
            <span className="lbl">{label}</span>
          </div>
        ))}
      </Reveal>
      {left === 0 && <p className="note">The big day is here! 💍</p>}
    </Section>
  );
}

function Events() {
  return (
    <Section title="Celebrations" icon="clock">
      <ol className="timeline">
        {invite.events.map((ev, i) => (
          <Reveal as="li" key={ev.title} delay={i * 120}>
            <span className="dot" />
            <h3>{ev.title}</h3>
            <p className="ev-time">{ev.time}</p>
            {ev.note && <p className="ev-note">{ev.note}</p>}
          </Reveal>
        ))}
      </ol>
    </Section>
  );
}

function Venue() {
  return (
    <Section title="Venue" icon="pin">
      <Reveal delay={120}>
        <h3 className="venue-name">{invite.venue.name}</h3>
        <p className="venue-addr">{invite.venue.address}</p>
        <a className="btn" href={invite.venue.mapsUrl} target="_blank" rel="noopener noreferrer">
          View on Google Maps
        </a>
      </Reveal>
    </Section>
  );
}

function DressCode() {
  const { note, women, men } = invite.dressCode;
  return (
    <Section title="Dress Code" icon="dress">
      <Reveal delay={120}>
        <p className="body-text">{note}</p>
        <div className="dress-grid">
          <div>
            <h3>Women</h3>
            <p>{women}</p>
          </div>
          <div>
            <h3>Men</h3>
            <p>{men}</p>
          </div>
        </div>
      </Reveal>
    </Section>
  );
}

function InfoBlock({ icon, title, text }) {
  return (
    <Section title={title} icon={icon}>
      <Reveal delay={120}>
        <p className="body-text">{text}</p>
      </Reveal>
    </Section>
  );
}

function Rsvp({ guest }) {
  const previous = guest?.rsvp;
  const [attending, setAttending] = useState(previous?.attending ?? "");
  const [status, setStatus] = useState("idle"); // idle | sending | sent
  const [error, setError] = useState(null);
  const maxGuests = guest ? Math.max(guest.pax, 1) : 20;

  const submit = async (e) => {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    setStatus("sending");
    setError(null);
    try {
      const res = await fetch("/api/rsvp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: guest?.id,
          name: f.get("name"),
          attending,
          count: f.get("count"),
          message: f.get("message"),
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Could not send your reply, please try again");
      setStatus("sent");
    } catch (err) {
      setError(err.message);
      setStatus("idle");
    }
  };

  return (
    <Section title="Will you join us?">
      <Reveal delay={120}>
        <p className="note">{invite.rsvp.deadline}</p>
        {status === "sent" ? (
          <p className="thanks">
            {attending === "yes"
              ? "Thank you! We can't wait to celebrate with you. 💐"
              : "Thank you for letting us know — you'll be missed. 💐"}
          </p>
        ) : (
          <form className="rsvp" onSubmit={submit}>
            {previous && (
              <p className="note">
                You replied {previous.attending === "yes" ? `“joyfully attending” for ${previous.count}` : "“can't make it”"}. You can
                update it below.
              </p>
            )}
            {!guest && (
              <label>
                Your Name
                <input name="name" required placeholder="Your full name" autoComplete="name" maxLength={120} />
              </label>
            )}
            <label>
              Will you be attending?
              <select name="attending" required value={attending} onChange={(e) => setAttending(e.target.value)}>
                <option value="" disabled>
                  Select…
                </option>
                <option value="yes">Yes, with joy</option>
                <option value="no">Sorry, can&apos;t make it</option>
              </select>
            </label>
            {attending === "yes" && (
              <label>
                Number of guests{guest && maxGuests > 1 ? ` (up to ${maxGuests})` : ""}
                <input
                  name="count"
                  type="number"
                  min="1"
                  max={maxGuests}
                  defaultValue={previous?.count || (guest ? maxGuests : 1)}
                />
              </label>
            )}
            <label>
              Message
              <textarea name="message" rows={3} placeholder="Leave your wishes…" maxLength={1000} defaultValue={previous?.message || ""} />
            </label>
            {error && <p className="rsvp-error">{error}</p>}
            <button type="submit" className="btn" disabled={status === "sending"}>
              {status === "sending" ? "Sending…" : previous ? "Update RSVP" : "Send RSVP"}
            </button>
          </form>
        )}
      </Reveal>
    </Section>
  );
}

function Footer() {
  const [copied, setCopied] = useState(false);

  const share = async () => {
    const data = { title: `${invite.bride} & ${invite.groom} · ${invite.eventTitle}`, url: window.location.href };
    try {
      if (navigator.share) await navigator.share(data);
      else {
        await navigator.clipboard.writeText(data.url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    } catch {}
  };

  return (
    <footer className="section footer">
      <Reveal>
        <Divider />
        <p className="footer-names">
          {invite.bride} &amp; {invite.groom}
        </p>
        <p className="body-text">{invite.hosts}</p>
        <button type="button" className="btn ghost" onClick={share}>
          <Icon name="share" size={16} /> {copied ? "Link copied!" : "Share invitation"}
        </button>
      </Reveal>
    </footer>
  );
}
