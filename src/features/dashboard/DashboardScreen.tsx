"use client";
import Link from "next/link";
import { Box, Button, Divider, Stack, Typography } from "@mui/material";
import { useAppSelector } from "../../store/StoreProvider";
import { PageHeading } from "../../components/layout/PageHeader";
import {
  MetricCard,
  Panel,
  StatusChip,
  responsiveColumns,
} from "../../components/ui/WorkspaceUI";
import { EmptyState } from "../../components/ui/FeedbackStates";

export function DashboardScreen() {
  const { documents, tasks, conversations, agentRuns } = useAppSelector(
    (s) => s.workspace,
  );
  return (
    <>
      <PageHeading
        title="Hello, welcome back."
        description="A little clarity for your next big idea. Here’s what’s happening in your workspace."
        actions={
          <Button component={Link} href="/chat" variant="contained">
            Start a conversation
          </Button>
        }
      />
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr 1fr", lg: "repeat(4, 1fr)" },
          gap: 2,
          mb: 3,
        }}
      >
        <MetricCard
          label="Documents"
          value={documents.length}
          detail={`${documents.filter((d) => d.status === "Ready").length} ready for retrieval`}
        />
        <MetricCard
          label="Open tasks"
          value={tasks.filter((t) => t.status !== "Completed").length}
          detail={`${tasks.filter((t) => t.status === "Completed").length} completed`}
        />
        <MetricCard
          label="Conversations"
          value={conversations.length}
          detail="Explore your knowledge"
        />
        <MetricCard
          label="Agent executions"
          value={agentRuns.length}
          detail={`${agentRuns.filter((r) => r.status === "Running").length} currently running · mock data`}
        />
      </Box>
      <Panel title="Quick actions">
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", sm: "repeat(3, 1fr)" },
            gap: 2,
          }}
        >
          {[
            {
              title: "Ask your knowledge",
              detail: "Get an answer with sources",
              href: "/chat",
            },
            {
              title: "Add documents",
              detail: "Grow your knowledge base",
              href: "/documents",
            },
            {
              title: "Create a task",
              detail: "Turn an idea into action",
              href: "/tasks",
            },
          ].map((a) => (
            <Button
              key={a.href}
              component={Link}
              href={a.href}
              variant="outlined"
              sx={{
                p: 2.5,
                textAlign: "left",
                justifyContent: "flex-start",
                borderColor: "divider",
              }}
            >
              <Box>
                <Typography sx={{ fontWeight: 700 }}>{a.title} ↗</Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mt: 0.5 }}
                >
                  {a.detail}
                </Typography>
              </Box>
            </Button>
          ))}
        </Box>
      </Panel>
      <Box sx={{ ...responsiveColumns, mt: 3 }}>
        <Panel
          title="Recent documents"
          action={
            <Button component={Link} href="/documents" size="small">
              View all
            </Button>
          }
        >
          {documents.length ? (
            documents.slice(0, 4).map((d, i) => (
              <Box key={d.id}>
                {i > 0 && <Divider sx={{ my: 2 }} />}
                <Stack
                  direction="row"
                  sx={{
                    justifyContent: "space-between",
                    alignItems: "center",
                    gap: 2,
                  }}
                >
                  <Box sx={{ minWidth: 0 }}>
                    <Typography
                      component={Link}
                      href={`/documents/${d.id}`}
                      sx={{
                        color: "text.primary",
                        textDecoration: "none",
                        fontWeight: 500,
                        overflowWrap: "anywhere",
                        "&:hover": { color: "primary.main" },
                      }}
                    >
                      {d.name}
                    </Typography>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{ display: "block", mt: 0.5 }}
                    >
                      {d.type} · {d.size} · {d.uploaded}
                    </Typography>
                  </Box>
                  <StatusChip status={d.status} />
                </Stack>
              </Box>
            ))
          ) : (
            <EmptyState description="Upload your first document to get started." />
          )}
        </Panel>
        <Panel
          title="Recent tasks"
          action={
            <Button component={Link} href="/tasks" size="small">
              View all
            </Button>
          }
        >
          {tasks.length ? (
            tasks.slice(0, 4).map((t, i) => (
              <Box key={t.id}>
                {i > 0 && <Divider sx={{ my: 2 }} />}
                <Stack
                  direction="row"
                  sx={{
                    justifyContent: "space-between",
                    alignItems: "center",
                    gap: 2,
                  }}
                >
                  <Box>
                    <Typography
                      component={Link}
                      href="/tasks"
                      sx={{
                        color: "text.primary",
                        textDecoration: "none",
                        fontWeight: 500,
                      }}
                    >
                      {t.title}
                    </Typography>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{ display: "block", mt: 0.5 }}
                    >
                      Due {t.due} · {t.priority} priority
                    </Typography>
                  </Box>
                  <StatusChip status={t.status} />
                </Stack>
              </Box>
            ))
          ) : (
            <EmptyState description="Create a task to start making progress." />
          )}
        </Panel>
      </Box>
    </>
  );
}
