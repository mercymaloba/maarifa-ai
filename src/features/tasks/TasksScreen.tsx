"use client";
import { useState, type FormEvent } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { actions } from "../../store/store";
import { useAppDispatch, useAppSelector } from "../../store/StoreProvider";
import type { Task, TaskStatus } from "../../store/mock-data";
import { PageHeading } from "../../components/layout/PageHeader";
import { Panel, StatusChip } from "../../components/ui/WorkspaceUI";
import { EmptyState, SuccessState } from "../../components/ui/FeedbackStates";
const statuses: TaskStatus[] = ["To do", "In progress", "Completed"];

export function TasksScreen() {
  const tasks = useAppSelector((s) => s.workspace.tasks);
  const dispatch = useAppDispatch();
  const [filter, setFilter] = useState("All");
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [success, setSuccess] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [due, setDue] = useState("");
  const [priority, setPriority] = useState<Task["priority"]>("Medium");
  const filtered = tasks.filter(
    (t) =>
      (filter === "All" || t.status === filter) &&
      `${t.title} ${t.description}`.toLowerCase().includes(query.toLowerCase()),
  );
  const create = (e: FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !due) return;
    dispatch(
      actions.addTask({
        id: crypto.randomUUID(),
        title: title.trim(),
        description: description.trim(),
        due,
        priority,
        status: "To do",
      }),
    );
    setOpen(false);
    setTitle("");
    setDescription("");
    setDue("");
    setPriority("Medium");
    setFilter("All");
    setQuery("");
    setSuccess("Task created. It is also available on your dashboard.");
  };
  return (
    <>
      <PageHeading
        title="Tasks"
        description="From insight to impact. Keep the next step in sight."
        actions={
          <Button variant="contained" onClick={() => setOpen(true)}>
            + Create task
          </Button>
        }
      />
      {success && (
        <SuccessState message={success} onClose={() => setSuccess("")} />
      )}
      <Stack
        direction={{ xs: "column", sm: "row" }}
        spacing={1}
        sx={{ mb: 3, alignItems: { sm: "center" } }}
      >
        {["All", ...statuses].map((s) => (
          <Button
            key={s}
            variant={filter === s ? "contained" : "outlined"}
            onClick={() => setFilter(s)}
          >
            {s} ({tasks.filter((t) => s === "All" || t.status === s).length})
          </Button>
        ))}
        <TextField
          size="small"
          label="Search tasks"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          sx={{ flex: 1 }}
        />
      </Stack>
      <Stack spacing={2}>
        {filtered.length ? (
          filtered.map((t) => (
            <Panel key={t.id}>
              <Stack
                direction={{ xs: "column", sm: "row" }}
                spacing={2}
                sx={{ justifyContent: "space-between" }}
              >
                <Box sx={{ flex: 1 }}>
                  <Stack
                    direction="row"
                    spacing={1.5}
                    sx={{ alignItems: "center", flexWrap: "wrap", mb: 1 }}
                  >
                    <Typography
                      component="h2"
                      variant="subtitle1"
                      sx={{ fontWeight: 700 }}
                    >
                      {t.title}
                    </Typography>
                    <StatusChip status={t.priority} />
                  </Stack>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mb: 2 }}
                  >
                    {t.description || "No description provided."}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Due {t.due}
                  </Typography>
                </Box>
                <TextField
                  select
                  size="small"
                  label="Task status"
                  value={t.status}
                  onChange={(e) => {
                    dispatch(
                      actions.updateTaskStatus({
                        id: t.id,
                        status: e.target.value as TaskStatus,
                      }),
                    );
                    setSuccess(
                      `“${t.title}” updated to ${e.target.value.toLowerCase()}.`,
                    );
                  }}
                  sx={{ minWidth: 160, alignSelf: { sm: "center" } }}
                >
                  {statuses.map((s) => (
                    <MenuItem key={s} value={s}>
                      {s}
                    </MenuItem>
                  ))}
                </TextField>
              </Stack>
            </Panel>
          ))
        ) : (
          <Panel>
            <EmptyState
              title="No matching tasks"
              description="Change your filters or create a new task."
              action={
                <Button
                  onClick={() => {
                    setFilter("All");
                    setQuery("");
                  }}
                >
                  Clear filters
                </Button>
              }
            />
          </Panel>
        )}
      </Stack>
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        fullWidth
        maxWidth="sm"
        aria-labelledby="task-title"
      >
        <Box component="form" onSubmit={create}>
          <DialogTitle id="task-title">Create a task</DialogTitle>
          <DialogContent>
            <Stack spacing={3} sx={{ pt: 1 }}>
              <TextField
                autoFocus
                required
                label="Task title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                slotProps={{ htmlInput: { maxLength: 120 } }}
              />
              <TextField
                label="Description"
                multiline
                minRows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
              <TextField
                required
                type="date"
                label="Due date"
                value={due}
                onChange={(e) => setDue(e.target.value)}
                slotProps={{ inputLabel: { shrink: true } }}
              />
              <TextField
                select
                label="Priority"
                value={priority}
                onChange={(e) =>
                  setPriority(e.target.value as Task["priority"])
                }
              >
                {["Low", "Medium", "High"].map((p) => (
                  <MenuItem key={p} value={p}>
                    {p}
                  </MenuItem>
                ))}
              </TextField>
            </Stack>
          </DialogContent>
          <DialogActions sx={{ p: 3 }}>
            <Button onClick={() => setOpen(false)}>Cancel</Button>
            <Button
              type="submit"
              variant="contained"
              disabled={!title.trim() || !due}
            >
              Create task
            </Button>
          </DialogActions>
        </Box>
      </Dialog>
    </>
  );
}
