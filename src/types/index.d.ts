import { type IconType } from "~/components/ui/icons"

export type NavItem = {
  icon?: IconType
  label: string
  path: string
}

export type SiteConfig = {
  name: string
  description: string
  url: string
  ogImage: string
}

export type SideNavItem = { title: string; data: NavItem[] }

type APIResponse<T> = {
  data: T
  success: boolean
  message: string
}
