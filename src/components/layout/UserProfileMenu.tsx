"use client";

import Link from "next/link";
import { useState } from "react";
import {
  Avatar,
  Box,
  ButtonBase,
  Divider,
  Menu,
  MenuItem,
  Typography,
} from "@mui/material";
import { NavigationIcon } from "./NavigationIcon";

export function UserProfileMenu() {
  const [anchor, setAnchor] = useState<HTMLElement | null>(null);
  const open = Boolean(anchor);
  return (
    <>
      <ButtonBase
        id="profile-button"
        aria-label="Open user profile menu"
        aria-haspopup="menu"
        aria-controls={open ? "profile-menu" : undefined}
        aria-expanded={open ? "true" : undefined}
        onClick={(event) => setAnchor(event.currentTarget)}
        sx={{ p: 0.75, gap: 1.25, borderRadius: "10px" }}
      >
        <Avatar
          sx={{
            width: 34,
            height: 34,
            bgcolor: "rgba(79,70,229,0.1)",
            color: "primary.main",
            fontSize: 14,
            fontWeight: 700,
          }}
        >
          U
        </Avatar>
        <Box sx={{ display: { xs: "none", sm: "block" }, textAlign: "left" }}>
          <Typography variant="body2" sx={{ fontWeight: 700 }}>
            Your workspace
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Personal account
          </Typography>
        </Box>
        <NavigationIcon name="chevron" />
      </ButtonBase>
      <Menu
        id="profile-menu"
        anchorEl={anchor}
        open={open}
        onClose={() => setAnchor(null)}
        slotProps={{
          list: { "aria-labelledby": "profile-button" },
          paper: { sx: { minWidth: 220, mt: 1 } },
        }}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Box sx={{ px: 2, py: 1 }}>
          <Typography variant="body2" sx={{ fontWeight: 700 }}>
            Personal workspace
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Maarifa AI
          </Typography>
        </Box>
        <Divider />
        <MenuItem
          component={Link}
          href="/settings"
          onClick={() => setAnchor(null)}
        >
          Profile & settings
        </MenuItem>
      </Menu>
    </>
  );
}
