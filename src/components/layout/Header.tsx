"use client";

import { usePathname } from "next/navigation";
import { AppBar, Box, IconButton, Toolbar, Typography } from "@mui/material";
import { isActiveRoute, navigation } from "./navigation";
import { NavigationIcon } from "./NavigationIcon";
import { UserProfileMenu } from "./UserProfileMenu";

export function Header({ onOpenNavigation }: { onOpenNavigation: () => void }) {
  const pathname = usePathname();
  const current = navigation.find((item) => isActiveRoute(pathname, item.href));
  return (
    <AppBar
      position="sticky"
      elevation={0}
      color="transparent"
      sx={{
        bgcolor: "background.default",
        borderBottom: 1,
        borderColor: "divider",
      }}
    >
      <Toolbar
        sx={{ gap: 2, minHeight: { xs: 72, sm: 80 }, px: { xs: 2, md: 4 } }}
      >
        <IconButton
          aria-label="Open navigation"
          aria-controls="mobile-navigation"
          onClick={onOpenNavigation}
          edge="start"
          sx={{ display: { md: "none" } }}
        >
          <NavigationIcon name="menu" />
        </IconButton>
        <Typography
          variant="body2"
          sx={{ fontWeight: 500 }}
          color="text.secondary"
        >
          Workspace{" "}
          <Box component="span" sx={{ mx: 1.25, color: "divider" }}>
            /
          </Box>
          <Box component="span" sx={{ color: "text.primary" }}>
            {current?.label ?? "Maarifa AI"}
          </Box>
        </Typography>
        <Box sx={{ flexGrow: 1 }} />
        <UserProfileMenu />
      </Toolbar>
    </AppBar>
  );
}
