import { useEffect, useMemo, useState } from 'react'
import { MoonIcon, SunIcon } from 'lucide-react'
import { useLocation } from 'react-router'

import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { SidebarTrigger } from '@/components/ui/sidebar'
import { navMainItems } from '@/layouts/menus'
import type { NavItem } from '@/layouts/menus'

export function SiteHeader() {
  const { pathname } = useLocation()
  const [theme, setTheme] = useState<'light' | 'dark'>(() => getInitialTheme())

  useEffect(() => {
    applyTheme(theme)
  }, [theme])

  const heading = useMemo(() => {
    const items = getBreadcrumbItems({
      items: navMainItems,
      pathname
    })
    return items.length > 0 ? items.map((item) => item.title).join('>') : defaultHeading
  }, [pathname])

  const toggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark'
    applyTheme(next)
    setTheme(next)
  }

  return (
    <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mx-2 data-[orientation=vertical]:h-4" />
        <h1 className="text-base font-medium">{heading}</h1>
        <div className="ml-auto flex items-center gap-2">
          <Button variant="ghost" size="sm" className="hidden sm:flex" onClick={toggleTheme} aria-pressed={theme === 'dark'}>
            {theme === 'dark' ? <SunIcon className="size-4" /> : <MoonIcon className="size-4" />}
          </Button>
        </div>
      </div>
    </header>
  )
}

function getBreadcrumbItems({ items, pathname }: { items: NavItem[]; pathname: string }): NavItem[] {
  if (!items.length || !pathname) return []

  const normalizedPath = normalizePath(pathname)

  for (const item of items) {
    const matches = isPathMatch({
      pathname: normalizedPath,
      url: item.url
    })

    if (matches) {
      const childTrail = item.children
        ? getBreadcrumbItems({
            items: item.children,
            pathname: normalizedPath
          })
        : []

      if (childTrail.length > 0) return [item, ...childTrail]
      return [item]
    }

    if (item.children && item.children.length > 0) {
      const nestedTrail = getBreadcrumbItems({
        items: item.children,
        pathname: normalizedPath
      })
      if (nestedTrail.length > 0) return [item, ...nestedTrail]
    }
  }

  return []
}

function isPathMatch({ pathname, url }: { pathname: string; url: string }): boolean {
  if (!url) return false
  if (pathname === url) return true
  return pathname.startsWith(`${url}/`)
}

function normalizePath(pathname: string): string {
  if (!pathname) return '/'
  if (pathname.length === 1) return pathname
  return pathname.endsWith('/') ? pathname.slice(0, -1) : pathname
}

const defaultHeading = 'Documents'

function applyTheme(theme: 'light' | 'dark') {
  if (typeof document === 'undefined') return
  const root = document.documentElement
  if (theme === 'dark') {
    root.classList.add('dark')
  } else {
    root.classList.remove('dark')
  }
  localStorage.setItem('theme', theme)
}

function getInitialTheme(): 'light' | 'dark' {
  if (typeof window === 'undefined') return 'light'
  const stored = localStorage.getItem('theme')
  if (stored === 'dark' || stored === 'light') return stored
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
  return prefersDark ? 'dark' : 'light'
}
