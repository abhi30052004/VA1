import { Instagram, Linkedin, Globe, Megaphone, MessageCircle, AtSign } from "lucide-react";

// Shared template metadata used by the sidebar, header, and forms.
export const TEMPLATE_LIST = [
  {
    id: "instagram",
    label: "Instagram Caption",
    badge: "Caption",
    // description: "Hooks + hashtags.",
    icon: Instagram,
    actionLabel: "Caption"
  },
  {
    id: "facebook",
    label: "Facebook Post",
    badge: "Post",
    // description: "Readable social copy.",
    icon: MessageCircle,
    actionLabel: "Post"
  },
  {
    id: "x",
    label: "X Post",
    badge: "Short post",
    // description: "Sharper short-form copy.",
    icon: AtSign,
    actionLabel: "Post"
  },
  {
    id: "linkedin",
    label: "LinkedIn Post",
    badge: "Professional",
    // description: "Authority-focused copy.",
    icon: Linkedin,
    actionLabel: "Post"
  },
  {
    id: "website",
    label: "Website Copy",
    badge: "Section",
    // description: "Headlines and sections.",
    icon: Globe,
    actionLabel: "Copy"
  },
  {
    id: "ad",
    label: "Ad Copy",
    badge: "Ad line",
    // description: "Promo-focused lines.",
    icon: Megaphone,
    actionLabel: "Ad"
  }
];

export const TEMPLATE_META = TEMPLATE_LIST.reduce((accumulator, item) => {
  accumulator[item.id] = item;
  return accumulator;
}, {});

export function stripHtml(value = "") {
  return value
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, " ")
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/\s+/g, " ")
    .trim();
}

export function countWords(value = "") {
  const cleaned = stripHtml(value);
  return cleaned ? cleaned.split(/\s+/).length : 0;
}

export function formatHistoryDate(value) {
  if (!value) return "Unknown time";

  return new Date(value).toLocaleString([], {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit"
  });
}

export function textToEditorHtml(value = "") {
  if (!value) return "";

  if (/<\/?[a-z][\s\S]*>/i.test(value)) {
    return value;
  }

  const escaped = value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#39;");

  return escaped
    .split(/\n{2,}/)
    .map((block) => `<p>${block.replace(/\n/g, "<br />")}</p>`)
    .join("");
}
