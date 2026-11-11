"use client";
import Link from "next/link";
import { useState } from "react";
import {
  Alert,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  LinearProgress,
  MenuItem,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import { useAppDispatch, useAppSelector } from "../../store/StoreProvider";
import { evaluateMockSuite } from "../../store/store";
import type { TestCase } from "../../store/mock-data";
import { PageHeading } from "../../components/layout/PageHeader";
import { MetricCard, Panel, StatusChip } from "../../components/ui/WorkspaceUI";
import { EmptyState, SuccessState } from "../../components/ui/FeedbackStates";

export function EvaluationScreen() {
  const {
    testCases,
    evaluationRuns,
    documents,
    evaluationRunning: running,
  } = useAppSelector((s) => s.workspace);
  const dispatch = useAppDispatch();
  const [filter, setFilter] = useState("All");
  const [selected, setSelected] = useState<TestCase | null>(null);
  const [success, setSuccess] = useState(false);
  const passed = testCases.filter((t) => t.passed).length;
  const average = Math.round(
    testCases.reduce((n, t) => n + t.score, 0) / (testCases.length || 1),
  );
  const filtered = testCases.filter(
    (t) => filter === "All" || (filter === "Passed" ? t.passed : !t.passed),
  );
  const run = async () => {
    setSuccess(false);
    await dispatch(evaluateMockSuite());
    setSuccess(true);
  };
  return (
    <>
      <PageHeading
        title="Evaluation"
        description="Measure what matters. Check how well your answers stand up to the evidence."
        actions={
          <Button variant="contained" disabled={running} onClick={run}>
            {running ? "Running sample suite…" : "Run mock evaluation"}
          </Button>
        }
      />
      <Alert severity="info" sx={{ mb: 3 }}>
        These are fixed demo results. Running the suite replays the sample test
        cases; no live model is evaluated.
      </Alert>
      {success && (
        <SuccessState
          message={`Mock evaluation #${evaluationRuns} complete: ${passed} of ${testCases.length} test cases passed.`}
          onClose={() => setSuccess(false)}
        />
      )}
      {running && (
        <LinearProgress aria-label="Running mock evaluation" sx={{ mb: 3 }} />
      )}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr 1fr", lg: "repeat(4, 1fr)" },
          gap: 2,
          mb: 3,
        }}
      >
        <MetricCard
          label="Pass rate"
          value={`${Math.round((passed / (testCases.length || 1)) * 100)}%`}
          detail={`${passed} of ${testCases.length} cases passed`}
        />
        <MetricCard
          label="Answer quality"
          value={`${average}%`}
          detail="Mean sample quality score"
        />
        <MetricCard
          label="Average latency"
          value={`${(testCases.reduce((n, t) => n + parseFloat(t.latency), 0) / (testCases.length || 1)).toFixed(2)}s`}
          detail="Sample response time"
        />
        <MetricCard
          label="Evaluation runs"
          value={evaluationRuns}
          detail="Current demo session"
        />
      </Box>
      <Panel
        title="Test cases"
        action={
          <TextField
            select
            size="small"
            label="Result"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            sx={{ minWidth: 120 }}
          >
            {["All", "Passed", "Failed"].map((s) => (
              <MenuItem key={s} value={s}>
                {s}
              </MenuItem>
            ))}
          </TextField>
        }
      >
        {filtered.length ? (
          <TableContainer>
            <Table aria-label="Evaluation test cases" sx={{ minWidth: 650 }}>
              <TableHead>
                <TableRow>
                  {["Question", "Result", "Score", "Latency", "Details"].map(
                    (h) => (
                      <TableCell key={h}>{h}</TableCell>
                    ),
                  )}
                </TableRow>
              </TableHead>
              <TableBody>
                {filtered.map((test) => (
                  <TableRow key={test.id} hover>
                    <TableCell sx={{ maxWidth: 300 }}>
                      {test.question}
                    </TableCell>
                    <TableCell>
                      <StatusChip status={test.passed ? "Passed" : "Failed"} />
                    </TableCell>
                    <TableCell>{test.score}%</TableCell>
                    <TableCell>{test.latency}</TableCell>
                    <TableCell>
                      <Button size="small" onClick={() => setSelected(test)}>
                        View result
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        ) : (
          <EmptyState description="No test cases match this result filter." />
        )}
      </Panel>
      <Dialog
        open={!!selected}
        onClose={() => setSelected(null)}
        fullWidth
        maxWidth="sm"
        aria-labelledby="result-title"
      >
        <DialogTitle id="result-title">Test result details</DialogTitle>
        <DialogContent>
          {selected && (
            <Stack spacing={3}>
              <StatusChip status={selected.passed ? "Passed" : "Failed"} />
              {[
                ["Question", selected.question],
                ["Expected answer", selected.expected],
                ["Actual answer", selected.actual],
                ["Quality score", `${selected.score}% · Pass threshold 80%`],
              ].map(([label, value]) => (
                <Box key={label}>
                  <Typography variant="caption" color="text.secondary">
                    {label}
                  </Typography>
                  <Typography sx={{ mt: 0.5, lineHeight: 1.8 }}>
                    {value}
                  </Typography>
                </Box>
              ))}
              <Button
                component={Link}
                href={`/documents/${selected.documentId}`}
              >
                Source:{" "}
                {documents.find((d) => d.id === selected.documentId)?.name}
              </Button>
              {!selected.passed && (
                <Alert severity="warning">
                  The response overstates the remote work policy. The source
                  allows up to three days each week.
                </Alert>
              )}
            </Stack>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSelected(null)}>Close</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
