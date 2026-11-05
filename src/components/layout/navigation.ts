export const navigation = [
  {
    label: "Dashboard",
    href: "/",
    icon: "dashboard",
    description: "Your knowledge workspace, at a glance.",
  },
  {
    label: "Chat",
    href: "/chat",
    icon: "chat",
    description: "Ask questions and explore your knowledge with AI.",
  },
  {
    label: "Documents",
    href: "/documents",
    icon: "documents",
    description: "Manage the documents that power your knowledge.",
  },
  {
    label: "Tasks",
    href: "/tasks",
    icon: "tasks",
    description: "Turn insights into action and keep track of your work.",
  },
  {
    label: "Agent Activity",
    href: "/activity",
    icon: "activity",
    description: "Follow your agents’ work across the workspace.",
  },
  {
    label: "Evaluation",
    href: "/evaluation",
    icon: "evaluation",
    description: "Review the quality and performance of your AI responses.",
  },
  {
    label: "Settings",
    href: "/settings",
    icon: "settings",
    description: "Make Maarifa AI work for you.",
  },
] as const;

export type NavigationIconName = (typeof navigation)[number]["icon"];

export function isActiveRoute(pathname: string, href: string) {
  return href === "/"
    ? pathname === "/"
    : pathname === href || pathname.startsWith(`${href}/`);
}
