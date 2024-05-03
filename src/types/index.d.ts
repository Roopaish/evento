import { type IconType } from "~/components/ui/icons"

export interface NavItem {
  icon?: IconType
  label: string
  path: string
}

export interface SiteConfig {
  name: string
  description: string
  url: string
  ogImage: string
}

export interface SideNavItem {
  title: string
  data: NavItem[]
}

interface APIResponse<T> {
  data: T
  success: boolean
  message: string
}
