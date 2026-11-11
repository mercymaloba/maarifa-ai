"use client";
import { useState } from "react";
import {
  Alert,
  Box,
  Button,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useAppSelector } from "../../store/StoreProvider";
import { PageHeading } from "../../components/layout/PageHeader";
import { Panel, StatusChip } from "../../components/ui/WorkspaceUI";
import { EmptyState } from "../../components/ui/FeedbackStates";

export function ActivityScreen() {
  const runs = useAppSelector((s) => s.workspace.agentRuns);
  const [selectedId, setSelectedId] = useState(runs[0]?.id);
  const [filter, setFilter] = useState("All");
  const filtered = runs.filter((r) => filter === "All" || r.status === filter);
  const selected = filtered.find((r) => r.id === selectedId) ?? filtered[0];
  return (
    <>
      <PageHeading
        title="Agent Activity"
        description="See the work behind the answer. Follow each execution from request to result."
      />
      <Alert severity="info" sx={{ mb: 3 }}>
        Sample execution history. Running states are illustrative; no background
        agents are active.
      </Alert>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            lg: "minmax(280px, 1fr) minmax(0, 1.4fr)",
          },
          gap: 3,
        }}
      >
        <Panel title="Execution history">
          <TextField
            select
            fullWidth
            size="small"
            label="Execution status"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            sx={{ mb: 2 }}
          >
            {["All", "Running", "Completed", "Failed"].map((s) => (
              <MenuItem key={s} value={s}>
                {s}
              </MenuItem>
            ))}
          </TextField>
          {filtered.length ? (
            <Stack spacing={1.5}>
              {filtered.map((run) => (
                <Button
                  key={run.id}
                  onClick={() => setSelectedId(run.id)}
                  variant="outlined"
                  aria-pressed={selected?.id === run.id}
                  sx={{
                    textAlign: "left",
                    justifyContent: "flex-start",
                    p: 2,
                    borderColor:
                      selected?.id === run.id ? "primary.main" : "divider",
                    bgcolor:
                      selected?.id === run.id
                        ? "rgba(79,70,229,.04)"
                        : "transparent",
                  }}
                >
                  <Box sx={{ width: "100%" }}>
                    <Stack
                      direction="row"
                      sx={{ justifyContent: "space-between", gap: 1, mb: 1 }}
                    >
                      <Typography variant="caption" color="text.secondary">
                        {run.id}
                      </Typography>
                      <StatusChip status={run.status} />
                    </Stack>
                    <Typography
                      variant="body2"
                      sx={{ fontWeight: 700, color: "text.primary" }}
                    >
                      {run.task}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {run.name} · {run.duration}
                    </Typography>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{ display: "block", mt: 1 }}
                    >
                      {run.time}
                    </Typography>
                  </Box>
                </Button>
              ))}
            </Stack>
          ) : (
            <EmptyState description="No executions match this status." />
          )}
        </Panel>
        <Panel title="Execution timeline">
          {selected ? (
            <>
              <Typography
                component="h2"
                variant="h6"
                sx={{ fontWeight: 700, mb: 1 }}
              >
                {selected.task}
              </Typography>
              <Typography color="text.secondary" variant="body2" sx={{ mb: 4 }}>
                {selected.name} · {selected.id} · {selected.duration}
              </Typography>
              {selected.steps.map((step, i) => (
                <Stack key={step.title} direction="row" spacing={2}>
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                    }}
                  >
                    <Box
                      sx={{
                        width: 30,
                        height: 30,
                        borderRadius: "50%",
                        display: "grid",
                        placeItems: "center",
                        bgcolor:
                          step.status === "Failed"
                            ? "error.light"
                            : "rgba(79,70,229,.1)",
                        color:
                          step.status === "Failed"
                            ? "error.contrastText"
                            : "primary.main",
                        fontWeight: 700,
                        fontSize: 13,
                      }}
                    >
                      {i + 1}
                    </Box>
                    {i < selected.steps.length - 1 && (
                      <Box
                        sx={{
                          width: 2,
                          flex: 1,
                          minHeight: 40,
                          bgcolor: "divider",
                        }}
                      />
                    )}
                  </Box>
                  <Box sx={{ pb: 4, flex: 1 }}>
                    <Stack
                      direction="row"
                      sx={{ gap: 1, alignItems: "center", flexWrap: "wrap" }}
                    >
                      <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                        {step.title}
                      </Typography>
                      <StatusChip status={step.status} />
                    </Stack>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ mt: 1, lineHeight: 1.8 }}
                    >
                      {step.detail}
                    </Typography>
                  </Box>
                </Stack>
              ))}
              {selected.status === "Failed" && (
                <Alert severity="error">
                  The execution stopped at text extraction. Open the failed
                  document to try the simulated ingestion flow.
                </Alert>
              )}
            </>
          ) : (
            <EmptyState description="Select an execution to inspect its timeline." />
          )}
        </Panel>
      </Box>
    </>
  );
}
