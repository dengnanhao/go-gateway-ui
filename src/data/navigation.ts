import { IconAdjustments, IconDashboard } from "@tabler/icons-react";
import type { Icon } from "@tabler/icons-react";

export const navMainItems: NavItem[] = [
  {
    title: "仪表盘",
    url: "/admin/dashboard",
    icon: IconDashboard,
  },
  {
    title: "服务配置",
    url: "/admin/services",
    icon: IconAdjustments,
  },
];

export interface NavItem {
  title: string;
  url: string;
  icon?: Icon;
  children?: NavItem[];
}
