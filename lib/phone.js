import { invite } from "@/invite.config";

// Normalises to WhatsApp's format: country code + number, digits only (e.g. 919876543210).
// A bare 10-digit number gets the default country code. Returns null if it doesn't look valid.
export function normalizePhone(input) {
  let digits = String(input || "").replace(/\D/g, "").replace(/^0+/, "");
  if (digits.length === 10) digits = invite.defaultCountryCode + digits;
  return digits.length >= 10 && digits.length <= 15 ? digits : null;
}
