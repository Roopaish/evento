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
      { icon: "Users", label: "Team", path: "/dashboard/team" },
      { icon: "Ticket", label: "Tickets", path: "/dashboard/tickets" },
      {
        icon: "Globe",
        label: "Emails and Domain",
        path: "/dashboard/marketing",
      },
      {
        icon: "BarChartBig",
        label: "Analytics",
        path: "/dashboard/analytics",
      },
    ],
  },
  {
    title: "Account",
    data: [
      { icon: "User", label: "Profile", path: "/dashboard/profile" },
      {
        icon: "ListChecks",
        label: "Applied Jobs",
        path: "/dashboard/applied-jobs",
      },
      {
        icon: "ShoppingCart",
        label: "My Orders",
        path: "/dashboard/my-orders",
      },
    ],
  },
]

export const profileDropdownItems = userSideNavItems.flatMap((nav) => nav.data)

export const dashboardRoutes = userSideNavItems.flatMap((nav) =>
  nav.data.flatMap((d) => d.path)
)
