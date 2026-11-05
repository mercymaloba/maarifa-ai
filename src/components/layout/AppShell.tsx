"use client";

import { useState, type ReactNode } from "react";
import { Box, Drawer } from "@mui/material";
import { Header } from "./Header";
import { Sidebar, SIDEBAR_WIDTH } from "./sidebar";

export function AppShell({ children }: { children: ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const closeNavigation = () => setMobileOpen(false);
  return (
    <Box
      sx={{ display: "flex", minHeight: "100dvh", bgcolor: "background.paper" }}
    >
      <Box
        component="a"
        href="#main-content"
        sx={{
          position: "fixed",
          left: 16,
          top: -100,
          zIndex: 1500,
          bgcolor: "background.default",
          p: 2,
          borderRadius: 1,
          "&:focus": { top: 16 },
        }}
      >
        Skip to content
      </Box>
      <Box
        component="aside"
        sx={{ width: { md: SIDEBAR_WIDTH }, flexShrink: 0 }}
      >
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: "none", md: "block" },
            "& .MuiDrawer-paper": {
              width: SIDEBAR_WIDTH,
              boxSizing: "border-box",
            },
          }}
        >
          <Sidebar />
        </Drawer>
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={closeNavigation}
          sx={{
            display: { xs: "block", md: "none" },
            "& .MuiDrawer-paper": {
              width: SIDEBAR_WIDTH,
              boxSizing: "border-box",
            },
          }}
          slotProps={{ paper: { id: "mobile-navigation" } }}
        >
          <Sidebar onNavigate={closeNavigation} onClose={closeNavigation} />
        </Drawer>
      </Box>
      <Box sx={{ flexGrow: 1, minWidth: 0 }}>
        <Header onOpenNavigation={() => setMobileOpen(true)} />
        <Box
          component="main"
          id="main-content"
          tabIndex={-1}
          sx={{
            width: "100%",
            maxWidth: 1440,
            mx: "auto",
            p: { xs: 2.5, sm: 3, md: 5 },
            outline: "none",
          }}
        >
          {children}
        </Box>
      </Box>
    </Box>
  );
}
