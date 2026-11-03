// ✏️  Edit everything about the invitation here — names, date, venue, events, RSVP.
// Remove any optional section (photo, dressCode, transport, gifts) by setting it to null.

export const invite = {
  eventTitle: "Ring Ceremony",
  tagline: "We're getting engaged",

  bride: "Priya",
  brideParents: "Daughter of Mr. & Mrs. Sharma",
  groom: "Rohan",
  groomParents: "Son of Mr. & Mrs. Mehta",

  // Used for the countdown and "Save the Date" (keep the +05:30 for IST).
  date: "2026-12-13T18:00:00+05:30",
  durationHours: 5,
  dateLabel: "December 13, 2026",
  dayLabel: "Sunday",
  timeLabel: "6:00 PM onwards",

  welcome:
    "With hearts full of joy and the blessings of our elders, we warmly invite you and your family to celebrate the engagement of Priya & Rohan as they exchange rings and begin their journey together. Your presence will make this occasion truly special.",

  // Optional: put a photo at public/couple.jpg (or set to null to hide).
  photo: "/couple.jpg",

  events: [
    { title: "Guest Arrival & Welcome", time: "Dec 13, 2026 · 6:00 PM", note: "Tea, snacks & warm hugs" },
    { title: "Ring Ceremony", time: "Dec 13, 2026 · 7:00 PM", note: "The moment we've all been waiting for" },
    { title: "Dinner & Celebrations", time: "Dec 13, 2026 · 8:30 PM", note: "Music, dance and dinner" },
  ],

  venue: {
    name: "The Grand Palace Banquet",
    address: "MG Road, City Centre, Ahmedabad",
    mapsUrl: "https://maps.google.com/?q=The+Grand+Palace+Banquet",
  },

  dressCode: {
    note: "Come dressed in festive Indian wear — pastels and ivory are most welcome.",
    women: "Saree, lehenga or anarkali in soft pastels",
    men: "Kurta, bandhgala or Indo-western",
  },

  transport: "Ample parking is available at the venue. For outstation guests, pickup from the railway station can be arranged — just let us know.",

  gifts: "Your love, blessings and presence are the greatest gifts we could ever ask for.",

  rsvp: {
    // WhatsApp number with country code, digits only (e.g. "919876543210").
    // RSVP replies open WhatsApp to this number. Leave "" to just show a thank-you.
    whatsapp: "",
    deadline: "Kindly respond by December 5, 2026",
  },

  hosts: "With love & blessings — The Sharma Family",

  // Optional background music: put an mp3 at public/music.mp3 (or set to null).
  music: "/music.mp3",
};
