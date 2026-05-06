export const ICON_IDS = ["Home", "Mail", "FileText", "Shield"] as const;
export type IconId = (typeof ICON_IDS)[number];

export interface NavItem {
  href: string;
  label: string;
  icon: IconId;
}
