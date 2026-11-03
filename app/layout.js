import { Great_Vibes, Cormorant_Garamond } from "next/font/google";
import { invite } from "@/invite.config";
import "./globals.css";

const script = Great_Vibes({ subsets: ["latin"], weight: "400", variable: "--font-script" });
const serif = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-serif",
});

const title = `${invite.bride} & ${invite.groom} · ${invite.eventTitle}`;
const description = `You're invited to the ${invite.eventTitle} of ${invite.bride} & ${invite.groom} — ${invite.dateLabel}. Tap to open.`;

export const metadata = {
  title,
  description,
  openGraph: { title, description, type: "website" },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#6f6c43",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${script.variable} ${serif.variable}`}>
      <body>{children}</body>
    </html>
  );
}
