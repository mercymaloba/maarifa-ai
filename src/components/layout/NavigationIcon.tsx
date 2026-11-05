"use client";

import { SvgIcon } from "@mui/material";
import type { NavigationIconName } from "./navigation";

const paths: Record<NavigationIconName | "menu" | "close" | "chevron", string> =
  {
    dashboard: "M3 3h7v7H3z M14 3h7v7h-7z M3 14h7v7H3z M14 14h7v7h-7z",
    chat: "M21 11.5a8.5 8.5 0 0 1-8.5 8.5H4l-2 2V11.5A8.5 8.5 0 0 1 10.5 3h2A8.5 8.5 0 0 1 21 11.5Z M7 9h9 M7 13h6",
    documents: "M14 2H5v20h14V7z M14 2v6h5 M8 12h8 M8 16h6",
    tasks: "M9 5h12 M9 12h12 M9 19h12 M2 5l2 2 3-4 M2 12l2 2 3-4 M2 19l2 2 3-4",
    activity: "M2 12h4l3-8 6 16 3-8h4",
    evaluation: "M4 20V10h4v10 M10 20V4h4v16 M16 20v-7h4v7 M2 20h20",
    settings:
      "M9 3h6l1 3 3 1 2 5-2 5-3 1-1 3H9l-1-3-3-1-2-5 2-5 3-1z M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0",
    menu: "M3 6h18 M3 12h18 M3 18h18",
    close: "m6 6 12 12 M6 18 18 6",
    chevron: "m7 10 5 5 5-5",
  };

export function NavigationIcon({ name }: { name: keyof typeof paths }) {
  return (
    <SvgIcon sx={{ fontSize: 21 }}>
      <path
        d={paths[name]}
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </SvgIcon>
  );
}
