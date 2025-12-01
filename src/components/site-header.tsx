import { useLocation } from "react-router";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { navMainItems } from "@/layouts/menus";
import type { NavItem } from "@/layouts/menus";

export function SiteHeader() {
  const { pathname } = useLocation();
  const breadcrumbItems = getBreadcrumbItems({
    items: navMainItems,
    pathname,
  });
  const heading =
    breadcrumbItems.length > 0
      ? breadcrumbItems.map((item) => item.title).join(">")
      : defaultHeading;

  return (
    <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mx-2 data-[orientation=vertical]:h-4"
        />
        <h1 className="text-base font-medium">{heading}</h1>
        <div className="ml-auto flex items-center gap-2">
          <Button variant="ghost" asChild size="sm" className="hidden sm:flex">
            <a
              href="#"
              rel="noopener noreferrer"
              target="_blank"
              className="dark:text-foreground"
            >
              设置
            </a>
          </Button>
        </div>
      </div>
    </header>
  );
}

function getBreadcrumbItems({
  items,
  pathname,
}: {
  items: NavItem[];
  pathname: string;
}): NavItem[] {
  if (!items.length || !pathname) return [];

  const normalizedPath = normalizePath(pathname);

  for (const item of items) {
    const matches = isPathMatch({
      pathname: normalizedPath,
      url: item.url,
    });

    if (matches) {
      const childTrail = item.children
        ? getBreadcrumbItems({
            items: item.children,
            pathname: normalizedPath,
          })
        : [];

      if (childTrail.length > 0) return [item, ...childTrail];
      return [item];
    }

    if (item.children && item.children.length > 0) {
      const nestedTrail = getBreadcrumbItems({
        items: item.children,
        pathname: normalizedPath,
      });
      if (nestedTrail.length > 0) return [item, ...nestedTrail];
    }
  }

  return [];
}

function isPathMatch({
  pathname,
  url,
}: {
  pathname: string;
  url: string;
}): boolean {
  if (!url) return false;
  if (pathname === url) return true;
  return pathname.startsWith(`${url}/`);
}

function normalizePath(pathname: string): string {
  if (!pathname) return "/";
  if (pathname.length === 1) return pathname;
  return pathname.endsWith("/") ? pathname.slice(0, -1) : pathname;
}

const defaultHeading = "Documents";
