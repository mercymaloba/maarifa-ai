"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Box,
  Divider,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Stack,
  Typography,
} from "@mui/material";
import { isActiveRoute, navigation } from "./navigation";
import { NavigationIcon } from "./NavigationIcon";

export const SIDEBAR_WIDTH = 256;

export function Sidebar({
  onNavigate,
  onClose,
}: {
  onNavigate?: () => void;
  onClose?: () => void;
}) {
  const pathname = usePathname();
  return (
    <Stack sx={{ height: "100%", bgcolor: "background.default" }}>
      <Stack
        direction="row"
        spacing={1.5}
        sx={{ px: 3, minHeight: 80, alignItems: "center" }}
      >
        <Box
          sx={{
            display: "grid",
            placeItems: "center",
            width: 36,
            height: 36,
            borderRadius: "10px",
            bgcolor: "primary.main",
            color: "white",
            fontWeight: 700,
          }}
        >
          M
        </Box>
        <Typography
          component={Link}
          href="/"
          onClick={onNavigate}
          sx={{
            textDecoration: "none",
            color: "text.primary",
            fontSize: 19,
            fontWeight: 700,
            flexGrow: 1,
          }}
        >
          Maarifa{" "}
          <Box component="span" sx={{ color: "primary.main" }}>
            AI
          </Box>
        </Typography>
        {onClose && (
          <IconButton
            aria-label="Close navigation"
            onClick={onClose}
            sx={{ display: { md: "none" } }}
          >
            <NavigationIcon name="close" />
          </IconButton>
        )}
      </Stack>
      <Divider />
      <Box
        component="nav"
        aria-label="Main navigation"
        sx={{ px: 2, py: 3, flexGrow: 1, overflowY: "auto" }}
      >
        <Typography
          variant="overline"
          color="text.secondary"
          sx={{ px: 1.5, fontSize: 10, letterSpacing: "0.12em" }}
        >
          Workspace
        </Typography>
        <List sx={{ mt: 1 }}>
          {navigation.map((item) => {
            const active = isActiveRoute(pathname, item.href);
            return (
              <ListItemButton
                key={item.href}
                component={Link}
                href={item.href}
                onClick={onNavigate}
                selected={active}
                aria-current={active ? "page" : undefined}
                sx={{
                  borderRadius: "10px",
                  mb: 0.75,
                  px: 1.5,
                  py: 1,
                  color: active ? "primary.main" : "text.secondary",
                  "&.Mui-selected": {
                    bgcolor: "rgba(79,70,229,0.08)",
                    "&:hover": { bgcolor: "rgba(79,70,229,0.12)" },
                  },
                }}
              >
                <ListItemIcon sx={{ minWidth: 36, color: "inherit" }}>
                  <NavigationIcon name={item.icon} />
                </ListItemIcon>
                <ListItemText
                  primary={item.label}
                  slotProps={{
                    primary: {
                      sx: { fontSize: 14, fontWeight: active ? 700 : 500 },
                    },
                  }}
                />
              </ListItemButton>
            );
          })}
        </List>
      </Box>
      <Box
        sx={{
          m: 2,
          p: 2,
          bgcolor: "background.paper",
          border: 1,
          borderColor: "divider",
          borderRadius: "12px",
        }}
      >
        <Typography variant="body2" sx={{ fontWeight: 700 }}>
          Your knowledge, connected.
        </Typography>
        <Typography
          variant="caption"
          color="text.secondary"
          sx={{ display: "block", mt: 0.5 }}
        >
          Find answers. Build understanding.
        </Typography>
      </Box>
    </Stack>
  );
}
