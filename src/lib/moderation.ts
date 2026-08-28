/**
 * Contact-info / off-platform-contact detection.
 *
 * This is a best-effort heuristic filter, not a guarantee. It normalizes the
 * message in a few ways (strip spacing between single letters, expand
 * "[at]"/"(dot)" style obfuscation, convert spelled-out digits) and then
 * checks the normalized text against phone/email/URL/handle patterns and a
 * keyword list of known off-platform channels. Tune KEYWORDS and the regexes
 * as real violation attempts show up in the moderation log.
 */

export type ModerationResult = {
  blocked: boolean;
  reason: string | null;
  matches: string[];
};

const PLATFORM_KEYWORDS = [
  "telegram",
  "whatsapp",
  "whats app",
  "discord",
  "skype",
  "instagram",
  "insta",
  "facebook",
  "linkedin",
  "snapchat",
  "wechat",
  "viber",
  "signal app",
  "gmail",
  "outlook",
  "protonmail",
  "hotmail",
  "yahoo mail",
  "wallet address",
  "usdt",
  "trc20",
  "erc20",
  "binance id",
  "paypal.me",
  "t.me",
  "wa.me",
];

const NUMBER_WORDS: Record<string, string> = {
  zero: "0",
  one: "1",
  two: "2",
  three: "3",
  four: "4",
  five: "5",
  six: "6",
  seven: "7",
  eight: "8",
  nine: "9",
  oh: "0",
};

function collapseLetterSpacing(text: string): string {
  // Turns "t e l e g r a m" or "t.e.l.e.g.r.a.m" into "telegram" so spaced-out
  // obfuscation still matches the keyword list.
  return text.replace(/\b(?:[a-zA-Z][\s.\-_]){2,}[a-zA-Z]\b/g, (match) =>
    match.replace(/[\s.\-_]/g, "")
  );
}

function expandNumberWords(text: string): string {
  const pattern = new RegExp(`\\b(${Object.keys(NUMBER_WORDS).join("|")})\\b`, "gi");
  return text.replace(pattern, (word) => NUMBER_WORDS[word.toLowerCase()] ?? word);
}

function expandObfuscatedEmail(text: string): string {
  return text
    .replace(/\s*\[\s*at\s*\]\s*|\s*\(\s*at\s*\)\s*|\s+at\s+/gi, "@")
    .replace(/\s*\[\s*dot\s*\]\s*|\s*\(\s*dot\s*\)\s*|\s+dot\s+/gi, ".");
}

function normalize(raw: string) {
  const lowered = raw.toLowerCase();
  const collapsed = collapseLetterSpacing(lowered);
  const numbersExpanded = expandNumberWords(collapsed);
  const emailExpanded = expandObfuscatedEmail(numbersExpanded);
  return emailExpanded;
}

// Developers are allowed to share Google Meet links specifically (that's the
// one sanctioned way to hop on a call) — everything else off-platform is
// still blocked. Strip these out before running the URL/keyword checks so a
// message that's *only* a Meet link and ordinary text sails through.
const ALLOWED_LINK_RE = /(https?:\/\/)?(meet\.google\.com|g\.co\/meet)\/[a-z0-9\-?=&_.]+/gi;

function stripAllowedLinks(text: string): string {
  return text.replace(ALLOWED_LINK_RE, " ");
}

const EMAIL_RE = /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}/i;
const URL_RE = /(https?:\/\/|www\.)[^\s]+/i;
const HANDLE_RE = /(^|\s)@[a-z0-9_]{3,}/i;
// Loose international phone match: 7-15 digits, allowing separators.
const PHONE_RE = /(\+?\d[\d\-\s().]{6,}\d)/;

function digitsOnly(s: string) {
  return s.replace(/\D/g, "");
}

export function moderateMessage(rawText: string): ModerationResult {
  const normalized = normalize(rawText);
  const text = stripAllowedLinks(normalized);
  const matches: string[] = [];

  const emailMatch = text.match(EMAIL_RE);
  if (emailMatch) matches.push(`email-like pattern`);

  const urlMatch = text.match(URL_RE);
  if (urlMatch) matches.push(`link`);

  const handleMatch = text.match(HANDLE_RE);
  if (handleMatch) matches.push(`@handle`);

  const phoneCandidate = text.match(PHONE_RE);
  if (phoneCandidate) {
    const digits = digitsOnly(phoneCandidate[0]);
    if (digits.length >= 7 && digits.length <= 15) {
      matches.push(`phone-number-like pattern`);
    }
  }

  for (const kw of PLATFORM_KEYWORDS) {
    if (text.includes(kw)) {
      matches.push(`mentions "${kw}"`);
    }
  }

  const blocked = matches.length > 0;
  return {
    blocked,
    reason: blocked ? matches.join(", ") : null,
    matches,
  };
}
