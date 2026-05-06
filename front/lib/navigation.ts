import type { NavItem } from "@/types/navigation";

export const ALL_NAV_ITEMS = [
  { href: "/", label: "ホーム", icon: "Home" },
  { href: "/contact", label: "お問い合わせ", icon: "Mail" },
  { href: "/term", label: "利用規約", icon: "FileText" },
  { href: "/privacy", label: "プライバシー", icon: "Shield" },
] as const satisfies NavItem[];
