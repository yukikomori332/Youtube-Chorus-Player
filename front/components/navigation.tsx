"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Mail, Home, FileText, Shield } from "lucide-react";
import { cn } from "@/lib/utils";
import type { IconId, NavItem } from "@/types/navigation";

// ── 型定義 ────────────────────────────────────────────────
const ICON_MAP = {
  Home,
  Mail,
  FileText,
  Shield,
} as const satisfies Record<IconId, React.ElementType>;

// ── コンポーネント ────────────────────────────────────────
interface NavigationProps {
  items: NavItem[];
}

export function Navigation({ items }: NavigationProps) {
  const pathname = usePathname();

  return (
    <div className="flex items-center gap-1">
      {/* ナビゲーション */}
      {items.map((item) => {
        const Icon = ICON_MAP[item.icon];
        const isActive = pathname === item.href;

        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors",
              isActive
                ? "bg-accent text-accent-foreground"
                : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
            )}
          >
            <Icon className="h-4 w-4" />
            <span className="hidden sm:inline">{item.label}</span>
          </Link>
        );
      })}
    </div>
  );
}
