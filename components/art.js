// Hand-drawn SVG artwork used across the invitation.

const svgUrl = (svg) => `url("data:image/svg+xml,${encodeURIComponent(svg)}")`;

// Embossed leafy branches for the gate-fold doors.
const branch = (stroke, dx, dy) => `
  <g transform="translate(${dx} ${dy})" fill="none" stroke="${stroke}" stroke-width="1.6" stroke-linecap="round">
    <path d="M20 150 C40 120 55 95 90 70 C110 55 125 40 140 20"/>
    <path d="M50 112 C38 100 34 88 36 76 C48 84 54 96 50 112Z"/>
    <path d="M58 104 C70 98 82 98 92 104 C82 112 70 112 58 104Z"/>
    <path d="M78 82 C68 70 66 58 70 46 C80 56 84 68 78 82Z"/>
    <path d="M88 74 C100 70 112 72 120 80 C110 86 98 84 88 74Z"/>
    <path d="M110 52 C104 40 104 28 110 18 C118 28 118 40 110 52Z"/>
    <path d="M118 46 C128 44 138 46 146 54 C136 58 126 56 118 46Z"/>
    <path d="M150 170 C165 150 175 140 195 128"/>
    <path d="M168 150 C170 138 176 130 186 126 C186 138 180 146 168 150Z"/>
    <path d="M176 144 C186 146 192 152 196 160 C186 160 180 154 176 144Z"/>
  </g>`;

export const doorPattern = svgUrl(`
<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200">
  ${branch("rgba(40,38,15,0.35)", 1.2, 1.4)}
  ${branch("rgba(255,250,210,0.28)", 0, 0)}
</svg>`);

// Subtle paper grain.
export const paperGrain = svgUrl(`
<svg xmlns="http://www.w3.org/2000/svg" width="180" height="180">
  <filter id="n"><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" stitchTiles="stitch"/>
  <feColorMatrix values="0 0 0 0 0.45  0 0 0 0 0.3  0 0 0 0 0.2  0 0 0 0.09 0"/></filter>
  <rect width="100%" height="100%" filter="url(#n)"/>
</svg>`);

// Climbing floral vine for the side borders (tiles vertically).
export const vinePattern = svgUrl(`
<svg xmlns="http://www.w3.org/2000/svg" width="46" height="220" viewBox="0 0 46 220">
  <path d="M23 0 C10 30 36 55 23 110 C10 165 36 190 23 220" fill="none" stroke="#7b6a3c" stroke-width="1.3"/>
  <g fill="#8a8455">
    <ellipse cx="13" cy="26" rx="7" ry="3" transform="rotate(-35 13 26)"/>
    <ellipse cx="33" cy="50" rx="7" ry="3" transform="rotate(30 33 50)"/>
    <ellipse cx="14" cy="88" rx="7" ry="3" transform="rotate(-30 14 88)"/>
    <ellipse cx="32" cy="136" rx="7" ry="3" transform="rotate(35 32 136)"/>
    <ellipse cx="13" cy="170" rx="7" ry="3" transform="rotate(-35 13 170)"/>
    <ellipse cx="33" cy="200" rx="7" ry="3" transform="rotate(30 33 200)"/>
  </g>
  <g fill="#a7a06a" opacity="0.8">
    <ellipse cx="30" cy="20" rx="5" ry="2.2" transform="rotate(40 30 20)"/>
    <ellipse cx="15" cy="120" rx="5" ry="2.2" transform="rotate(-40 15 120)"/>
    <ellipse cx="31" cy="182" rx="5" ry="2.2" transform="rotate(40 31 182)"/>
  </g>
  <g>
    <circle cx="24" cy="68" r="7.5" fill="#e3a99a"/><circle cx="24" cy="68" r="4.6" fill="#d48c7c"/>
    <circle cx="24" cy="68" r="2" fill="#b96a5c"/>
    <circle cx="22" cy="152" r="6.5" fill="#f1d2b8"/><circle cx="22" cy="152" r="3.8" fill="#e6b896"/>
    <circle cx="22" cy="152" r="1.6" fill="#c99272"/>
    <circle cx="36" cy="96" r="2.6" fill="#e9b7a8"/><circle cx="9" cy="200" r="2.6" fill="#e9b7a8"/>
    <circle cx="9" cy="44" r="2.2" fill="#f4dcc8"/>
  </g>
</svg>`);

// Scalloped wax-style seal on the doors.
export function Seal({ initials }) {
  const n = 14;
  const R = 92;
  const r = 12;
  let d = "";
  for (let i = 0; i < n; i++) {
    const a0 = (i / n) * Math.PI * 2;
    const a1 = ((i + 1) / n) * Math.PI * 2;
    const p0 = [100 + R * Math.cos(a0), 100 + R * Math.sin(a0)];
    const p1 = [100 + R * Math.cos(a1), 100 + R * Math.sin(a1)];
    d += `${i === 0 ? "M" : "L"}${p0[0].toFixed(1)} ${p0[1].toFixed(1)} A${r} ${r} 0 0 1 ${p1[0].toFixed(1)} ${p1[1].toFixed(1)} `;
  }
  return (
    <svg viewBox="-8 -8 216 216" aria-hidden="true">
      <defs>
        <radialGradient id="sealFill" cx="45%" cy="40%" r="70%">
          <stop offset="0%" stopColor="#fbe3cf" />
          <stop offset="70%" stopColor="#f2c7a6" />
          <stop offset="100%" stopColor="#e3ad88" />
        </radialGradient>
      </defs>
      <path d={d + "Z"} fill="url(#sealFill)" stroke="#c9945f" strokeWidth="3" />
      <circle cx="100" cy="100" r="74" fill="none" stroke="#b9875a" strokeWidth="1.4" strokeDasharray="2 4" />
      <circle cx="100" cy="100" r="68" fill="none" stroke="#c9945f" strokeWidth="1" />
      <text x="100" y="66" textAnchor="middle" className="seal-text">TAP TO OPEN</text>
      <text x="100" y="112" textAnchor="middle" className="seal-mono">{initials}</text>
      <g fill="none" stroke="#9c6c45" strokeWidth="1.4" strokeLinecap="round">
        <path d="M100 124 L100 150" />
        <path d="M100 132 C90 126 82 128 78 136 C88 138 94 136 100 132Z" />
        <path d="M100 132 C110 126 118 128 122 136 C112 138 106 136 100 132Z" />
        <path d="M100 144 C93 141 88 143 85 148 C92 150 96 148 100 144Z" />
        <path d="M100 144 C107 141 112 143 115 148 C108 150 104 148 100 144Z" />
      </g>
    </svg>
  );
}

// Draped valance with pearl strings across the top of the hero.
export function Valance() {
  const swags = [
    [-20, 110],
    [90, 220],
    [200, 310],
    [290, 420],
  ];
  const pearls = [];
  swags.forEach(([x0, x1], s) => {
    const cx = (x0 + x1) / 2;
    for (let i = 1; i < 14; i++) {
      const t = i / 14;
      const x = (1 - t) * (1 - t) * x0 + 2 * (1 - t) * t * cx + t * t * x1;
      const y = 2 * (1 - t) * t * 104 + 4;
      pearls.push(<circle key={`${s}-${i}`} cx={x} cy={y} r="2.4" fill="url(#pearl)" />);
    }
  });
  return (
    <svg className="valance" viewBox="0 0 400 96" preserveAspectRatio="none" aria-hidden="true">
      <defs>
        <linearGradient id="swag" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#f6d8c0" />
          <stop offset="60%" stopColor="#efc4a4" />
          <stop offset="100%" stopColor="#e2ad8b" />
        </linearGradient>
        <radialGradient id="pearl" cx="35%" cy="35%" r="65%">
          <stop offset="0%" stopColor="#fffaf2" />
          <stop offset="100%" stopColor="#d9b48c" />
        </radialGradient>
      </defs>
      <rect x="0" y="0" width="400" height="10" fill="#e8b997" />
      {swags.map(([x0, x1], i) => {
        const cx = (x0 + x1) / 2;
        return (
          <g key={i}>
            <path d={`M${x0} 0 Q${cx} 104 ${x1} 0 Z`} fill="url(#swag)" stroke="#d9a07c" strokeWidth="0.8" />
            <path d={`M${x0 + 12} 4 Q${cx} 74 ${x1 - 12} 4`} fill="none" stroke="#d8a17f" strokeWidth="1" opacity="0.7" />
            <path d={`M${x0 + 26} 4 Q${cx} 48 ${x1 - 26} 4`} fill="none" stroke="#d8a17f" strokeWidth="1" opacity="0.55" />
            <path d={`M${x0 + 40} 4 Q${cx} 26 ${x1 - 40} 4`} fill="none" stroke="#d8a17f" strokeWidth="1" opacity="0.4" />
          </g>
        );
      })}
      {pearls}
    </svg>
  );
}

// Garden with fountain, cypress trees and rose bushes at the bottom of the hero.
export function Garden() {
  const roses = [
    [28, 150, "#f1d0c4"], [44, 142, "#e7a99b"], [62, 152, "#f6e2d4"], [86, 158, "#e7a99b"],
    [318, 154, "#f6e2d4"], [338, 144, "#e7a99b"], [356, 152, "#f1d0c4"], [374, 160, "#e7a99b"],
    [124, 160, "#f1d0c4"], [278, 160, "#f1d0c4"],
  ];
  return (
    <svg className="garden" viewBox="0 0 400 180" preserveAspectRatio="xMidYMax slice" aria-hidden="true">
      <defs>
        <linearGradient id="water" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#cfe0db" />
          <stop offset="100%" stopColor="#9fbdb5" />
        </linearGradient>
        <linearGradient id="stone" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#f5eadf" />
          <stop offset="100%" stopColor="#d9c6b2" />
        </linearGradient>
      </defs>
      {/* cypress trees */}
      {[[18, 40], [52, 60], [348, 58], [384, 38]].map(([x, top], i) => (
        <g key={i}>
          <path d={`M${x} ${top} C${x - 16} ${top + 50} ${x - 18} 140 ${x} 150 C${x + 18} 140 ${x + 16} ${top + 50} ${x} ${top}Z`} fill="#4f5a34" />
          <path d={`M${x} ${top + 10} C${x - 8} ${top + 50} ${x - 10} 130 ${x - 2} 146`} stroke="#6b7745" strokeWidth="2" fill="none" />
        </g>
      ))}
      {/* balustrade */}
      <rect x="70" y="118" width="260" height="6" rx="2" fill="url(#stone)" />
      {Array.from({ length: 14 }, (_, i) => (
        <rect key={i} x={76 + i * 18.6} y="124" width="8" height="18" rx="3" fill="url(#stone)" />
      ))}
      {/* urns */}
      {[90, 310].map((x) => (
        <g key={x}>
          <path d={`M${x - 10} 104 Q${x} 122 ${x + 10} 104 Z`} fill="url(#stone)" />
          <circle cx={x - 5} cy="98" r="7" fill="#6e7a48" />
          <circle cx={x + 5} cy="97" r="7" fill="#7f8b55" />
          <circle cx={x} cy="92" r="6" fill="#5f6b3c" />
          <circle cx={x - 3} cy="94" r="2.4" fill="#ecb2a2" />
          <circle cx={x + 4} cy="92" r="2.4" fill="#f6dcd0" />
        </g>
      ))}
      {/* fountain */}
      <ellipse cx="200" cy="156" rx="78" ry="16" fill="url(#stone)" />
      <ellipse cx="200" cy="153" rx="68" ry="11" fill="url(#water)" />
      <rect x="194" y="112" width="12" height="40" rx="3" fill="url(#stone)" />
      <ellipse cx="200" cy="112" rx="26" ry="6" fill="url(#stone)" />
      <ellipse cx="200" cy="110" rx="21" ry="4" fill="url(#water)" />
      <g className="fountain-water" fill="none" stroke="#bfe0e6" strokeWidth="1.6" strokeLinecap="round">
        <path d="M200 96 C188 92 180 100 176 110" />
        <path d="M200 96 C212 92 220 100 224 110" />
        <path d="M200 112 C178 112 162 126 154 148" />
        <path d="M200 112 C222 112 238 126 246 148" />
      </g>
      <path d="M200 88 L200 106" stroke="#d9c6b2" strokeWidth="5" strokeLinecap="round" />
      {/* bushes & roses */}
      <path d="M0 180 L0 150 C20 128 50 132 70 146 C90 136 120 142 140 160 L140 180Z" fill="#6c7845" />
      <path d="M400 180 L400 150 C380 128 350 132 330 146 C310 136 280 142 260 160 L260 180Z" fill="#6c7845" />
      <path d="M0 180 C40 158 80 162 110 176 L110 180Z" fill="#56623a" />
      <path d="M400 180 C360 158 320 162 290 176 L290 180Z" fill="#56623a" />
      {roses.map(([x, y, c], i) => (
        <g key={i}>
          <circle cx={x} cy={y} r="7" fill={c} />
          <circle cx={x} cy={y} r="4" fill="#d48c7c" opacity="0.5" />
          <circle cx={x} cy={y} r="1.6" fill="#b96a5c" opacity="0.7" />
        </g>
      ))}
    </svg>
  );
}

export function Divider() {
  return (
    <div className="divider" aria-hidden="true">
      <span />
      <svg viewBox="0 0 24 22" width="14" height="13">
        <path d="M12 21 C5 15 1 11 1 6.5 C1 3.4 3.4 1 6.4 1 C8.6 1 10.6 2.3 12 4.2 C13.4 2.3 15.4 1 17.6 1 C20.6 1 23 3.4 23 6.5 C23 11 19 15 12 21Z" fill="currentColor" />
      </svg>
      <span />
    </div>
  );
}

const paths = {
  ring: "M12 8 L9 4 H15 Z M12 9 A6.5 6.5 0 1 0 12.01 9 Z M12 11 A4.5 4.5 0 1 1 11.99 11 Z",
  pin: "M12 2 C8 2 5 5 5 9 C5 14 12 22 12 22 C12 22 19 14 19 9 C19 5 16 2 12 2Z M12 6.5 A2.5 2.5 0 1 1 11.99 6.5Z",
  clock: "M12 2 A10 10 0 1 0 12.01 2Z M12 6 V12 L16 14",
  dress: "M9 2 L15 2 L14 7 L18 21 H6 L10 7 Z M9 2 L12 5 L15 2",
  car: "M3 15 L5 9 C5.4 8 6.2 7.5 7 7.5 H17 C17.8 7.5 18.6 8 19 9 L21 15 V18 H3Z M7 18 V20 M17 18 V20 M3 13 H21",
  gift: "M3 9 H21 V13 H3Z M5 13 V21 H19 V13 M12 9 V21 M12 9 C10 5 6 5 7 8 C7.5 9 12 9 12 9 C12 9 16.5 9 17 8 C18 5 14 5 12 9",
  calendar: "M4 5 H20 V21 H4Z M4 10 H20 M8 3 V7 M16 3 V7",
  music: "M9 18 V5 L20 3 V16 M6 15 A3 3 0 1 0 6.01 15 M17 13 A3 3 0 1 0 17.01 13",
  mute: "M4 9 H8 L13 5 V19 L8 15 H4Z M16 9 L21 15 M21 9 L16 15",
  share: "M18 2 A3 3 0 1 0 18.01 2 M6 9 A3 3 0 1 0 6.01 9 M18 16 A3 3 0 1 0 18.01 16 M8.6 10.5 L15.4 6.5 M8.6 13.5 L15.4 17.5",
};

export function Icon({ name, size = 22 }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d={paths[name]} />
    </svg>
  );
}
