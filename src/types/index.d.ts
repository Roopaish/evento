import type { Task as PrismaTask } from "@prisma/client"

import { type IconType } from "@/components/ui/icons"

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

export interface IUser {
  id: string
  name: string
  email: string
  image: string | null
}

export type Task = PrismaTask & {
  createdBy: IUser
  assignedTo: IUser[]
}

export type Event = {
  id: number
  title: string
  participants: IUser[]
  createdBy: IUser
}
