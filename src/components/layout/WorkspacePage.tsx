"use client";

import { Box, Paper, Typography } from "@mui/material";
import { navigation } from "./navigation";
import { NavigationIcon } from "./NavigationIcon";
import { PageHeading } from "./PageHeader";

export function WorkspacePage({
  section,
}: {
  section: (typeof navigation)[number]["href"];
}) {
  const item = navigation.find((entry) => entry.href === section)!;
  return (
    <>
      <PageHeading title={item.label} description={item.description} />
      <Paper
        variant="outlined"
        sx={{
          bgcolor: "background.default",
          borderRadius: "12px",
          p: { xs: 4, md: 7 },
          textAlign: "center",
        }}
      >
        <Box
          sx={{
            display: "inline-flex",
            p: 2,
            mb: 2,
            borderRadius: "12px",
            color: "primary.main",
            bgcolor: "rgba(17, 6, 233, 0.06)",
          }}
        >
          <NavigationIcon name={item.icon} />
        </Box>
        <Typography component="h2" variant="h6" sx={{ fontWeight: 700 }}>
          {section === "/"
            ? "Welcome to Maarifa AI"
            : `${item.label} workspace`}
        </Typography>
        <Typography
          color="text.secondary"
          sx={{ mt: 1, maxWidth: 420, mx: "auto" }}
        >
          {section === "/"
            ? "Your knowledge, conversations, and actions come together here. Choose a section in the sidebar to get started."
            : "This section is ready for its next chapter. Features and content will appear here as they are connected."}
        </Typography>
      </Paper>
    </>
  );
}
