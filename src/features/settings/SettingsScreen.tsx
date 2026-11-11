"use client";
import { useState, type FormEvent } from "react";
import {
  Alert,
  Box,
  Button,
  FormControlLabel,
  MenuItem,
  Slider,
  Stack,
  Switch,
  TextField,
  Typography,
} from "@mui/material";
import { actions } from "../../store/store";
import { defaultPreferences } from "../../store/mock-data";
import { useAppDispatch, useAppSelector } from "../../store/StoreProvider";
import { PageHeading } from "../../components/layout/PageHeader";
import { Panel, responsiveColumns } from "../../components/ui/WorkspaceUI";
import { SuccessState } from "../../components/ui/FeedbackStates";

export function SettingsScreen() {
  const preferences = useAppSelector((s) => s.workspace.preferences);
  const dispatch = useAppDispatch();
  const [draft, setDraft] = useState(preferences);
  const [success, setSuccess] = useState(false);
  const dirty = JSON.stringify(draft) !== JSON.stringify(preferences);
  const save = (e: FormEvent) => {
    e.preventDefault();
    dispatch(actions.savePreferences(draft));
    setSuccess(true);
  };
  return (
    <Box component="form" onSubmit={save}>
      <PageHeading
        title="Settings"
        description="A workspace that works your way. Configure models, retrieval, and agent behavior."
        actions={
          <Button type="submit" variant="contained" disabled={!dirty}>
            Save preferences
          </Button>
        }
      />
      <Alert severity="info" sx={{ mb: 3 }}>
        Preferences are stored in Redux for this demo session and reset on
        reload. Model, agent, and security settings do not configure a live
        service.
      </Alert>
      {success && (
        <SuccessState
          message="Preferences saved for this session. Chat now uses your model label and citation preference."
          onClose={() => setSuccess(false)}
        />
      )}
      <Box sx={responsiveColumns}>
        <Panel title="Model">
          <Stack spacing={3}>
            <TextField
              select
              label="Chat model"
              value={draft.model}
              onChange={(e) => setDraft({ ...draft, model: e.target.value })}
            >
              {["llama3.2", "mistral", "qwen2.5"].map((m) => (
                <MenuItem key={m} value={m}>
                  {m}
                </MenuItem>
              ))}
            </TextField>
            <Box>
              <Typography id="temperature-label" variant="body2">
                Temperature · {draft.temperature}
              </Typography>
              <Slider
                aria-labelledby="temperature-label"
                min={0}
                max={1}
                step={0.1}
                value={draft.temperature}
                valueLabelDisplay="auto"
                onChange={(_, value) =>
                  setDraft({ ...draft, temperature: value as number })
                }
              />
              <Typography variant="caption" color="text.secondary">
                Lower values favor focused, consistent responses.
              </Typography>
            </Box>
          </Stack>
        </Panel>
        <Panel title="Retrieval">
          <Stack spacing={3}>
            <TextField
              select
              label="Retrieved chunks (top K)"
              value={draft.topK}
              onChange={(e) =>
                setDraft({ ...draft, topK: Number(e.target.value) })
              }
            >
              {[3, 5, 10, 15].map((n) => (
                <MenuItem key={n} value={n}>
                  {n} chunks
                </MenuItem>
              ))}
            </TextField>
            <TextField
              select
              label="Chunk size"
              value={draft.chunkSize}
              onChange={(e) =>
                setDraft({ ...draft, chunkSize: Number(e.target.value) })
              }
            >
              {[256, 512, 1024].map((n) => (
                <MenuItem key={n} value={n}>
                  {n} characters
                </MenuItem>
              ))}
            </TextField>
            <FormControlLabel
              control={
                <Switch
                  checked={draft.citations}
                  onChange={(_, checked) =>
                    setDraft({ ...draft, citations: checked })
                  }
                />
              }
              label="Include citations in new chat replies"
            />
          </Stack>
        </Panel>
        <Panel title="Agents">
          <Stack spacing={2}>
            <FormControlLabel
              control={
                <Switch
                  checked={draft.agentsEnabled}
                  onChange={(_, checked) =>
                    setDraft({ ...draft, agentsEnabled: checked })
                  }
                />
              }
              label="Enable agent workflows"
            />
            <FormControlLabel
              control={
                <Switch
                  disabled={!draft.agentsEnabled}
                  checked={draft.requireApproval}
                  onChange={(_, checked) =>
                    setDraft({ ...draft, requireApproval: checked })
                  }
                />
              }
              label="Require approval before actions"
            />
            <TextField
              select
              disabled={!draft.agentsEnabled}
              label="Maximum execution steps"
              value={draft.maxSteps}
              onChange={(e) =>
                setDraft({ ...draft, maxSteps: Number(e.target.value) })
              }
            >
              {[5, 10, 20].map((n) => (
                <MenuItem key={n} value={n}>
                  {n} steps
                </MenuItem>
              ))}
            </TextField>
            <Typography variant="caption" color="text.secondary">
              Demo preferences for a future agent service.
            </Typography>
          </Stack>
        </Panel>
        <Panel title="Security & privacy">
          <Stack spacing={3}>
            <FormControlLabel
              control={
                <Switch
                  checked={draft.redactSensitive}
                  onChange={(_, checked) =>
                    setDraft({ ...draft, redactSensitive: checked })
                  }
                />
              }
              label="Redact sensitive data before model requests"
            />
            <TextField
              select
              label="Activity retention"
              value={draft.retentionDays}
              onChange={(e) =>
                setDraft({ ...draft, retentionDays: Number(e.target.value) })
              }
            >
              {[7, 30, 90].map((n) => (
                <MenuItem key={n} value={n}>
                  {n} days
                </MenuItem>
              ))}
            </TextField>
            <Typography variant="caption" color="text.secondary">
              No redaction or retention policy is enforced in the mock
              workspace.
            </Typography>
          </Stack>
        </Panel>
      </Box>
      <Stack
        direction="row"
        spacing={1}
        sx={{ mt: 3, justifyContent: "flex-end", flexWrap: "wrap", gap: 1 }}
      >
        <Button
          onClick={() => {
            setDraft({ ...defaultPreferences });
            setSuccess(false);
          }}
        >
          Restore default values
        </Button>
        <Button
          disabled={!dirty}
          onClick={() => {
            setDraft(preferences);
            setSuccess(false);
          }}
        >
          Discard changes
        </Button>
        <Button type="submit" variant="contained" disabled={!dirty}>
          Save preferences
        </Button>
      </Stack>
    </Box>
  );
}
