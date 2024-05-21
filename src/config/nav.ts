import { type NavItem, type SideNavItem } from "~/types"

export const mainNavItems: NavItem[] = [
  // {
  //   title: "Contact us",
  //   path: "/contact",
  // },
  // {
  //   title: "FAQ",
  //   path: "/faq",
  // },
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
      { icon: "CalendarCheck", label: "Events", path: "/dashboard/events" },
      { icon: "Users", label: "Staffs", path: "/dashboard/staffs" },
      { icon: "MessagesSquare", label: "Chats", path: "/dashboard/chats" },
      { icon: "ListTodo", label: "Kanban", path: "/dashboard/kanban" },
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
