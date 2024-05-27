import { type NavItem, type SideNavItem } from "@/types"

export const mainNavItems: (NavItem & { showWhenLoggedIn?: boolean })[] = [
  {
    label: "Find Event",
    path: "/search",
    showWhenLoggedIn: true,
  },
  {
    label: "Create Event",
    path: "/dashboard/events/add",
    showWhenLoggedIn: true,
  },
  {
    label: "Login",
    path: "/login",
    showWhenLoggedIn: false,
  },
  {
    label: "Register",
    path: "/register",
    showWhenLoggedIn: false,
  },
]

export const userSideNavItems: SideNavItem[] = [
  {
    title: "Overview",
    data: [
      {
        icon: "LayoutGrid",
        label: "Dashboard",
        path: "/dashboard",
      },
      { icon: "Users", label: "Staffs", path: "/dashboard/staffs" },
      { icon: "CalendarCheck", label: "Kanban", path: "/dashboard/kanban" },
      { icon: "MessagesSquare", label: "Chats", path: "/dashboard/chats" },
    ],
  },
  {
    title: "Account",
    data: [{ icon: "User", label: "Profile", path: "/dashboard/profile" }],
  },
]

export const profileDropdownItems = userSideNavItems.flatMap((nav) => nav.data)

export const dashboardRoutes = userSideNavItems.flatMap((nav) =>
  nav.data.flatMap((d) => d.path)
)
