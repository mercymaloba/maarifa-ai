"use client";
import Link from "next/link";
import { useRef, useState, type FormEvent } from "react";
import {
  Alert,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
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
import { actions } from "../../store/store";
import type { KnowledgeDocument } from "../../store/mock-data";
import { PageHeading } from "../../components/layout/PageHeader";
import { Panel, StatusChip } from "../../components/ui/WorkspaceUI";
import { EmptyState, ErrorState, SuccessState } from "../../components/ui/FeedbackStates";

export function DocumentsScreen() {
  const documents = useAppSelector((s) => s.workspace.documents);
  const dispatch = useAppDispatch();
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("All");
  const [type, setType] = useState("All");
  const [open, setOpen] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [busy, setBusy] = useState(false);
  const fileInput = useRef<HTMLInputElement>(null);
  const filtered = documents.filter(
    (d) =>
      d.name.toLowerCase().includes(query.toLowerCase()) &&
      (status === "All" || d.status === status) &&
      (type === "All" || d.type === type),
  );
  const upload = async (event: FormEvent) => {
    event.preventDefault();
    setError("");
    if (!files.length) {
      setError("Select at least one file.");
      return;
    }
    if (
      files.some(
        (f) =>
          !/\.(pdf|txt|md)$/i.test(f.name) ||
          f.size > 10 * 1024 * 1024 ||
          f.size === 0,
      )
    ) {
      setError(
        "Choose non-empty PDF, TXT, or Markdown files, up to 10 MB each.",
      );
      return;
    }
    setBusy(true);
    try {
      const added = await Promise.all(
        files.map(async (file): Promise<KnowledgeDocument> => {
          const isPdf = /\.pdf$/i.test(file.name);
          const text = isPdf ? "" : await file.text();
          return {
            id: crypto.randomUUID(),
            name: file.name,
            type: file.name.split(".").pop()!.toUpperCase(),
            size:
              file.size >= 1024 * 1024
                ? `${(file.size / 1024 / 1024).toFixed(1)} MB`
                : `${Math.max(1, Math.round(file.size / 1024))} KB`,
            status: isPdf ? "Processing" : "Ready",
            uploaded: new Date().toISOString().slice(0, 10),
            text,
            chunks: isPdf ? 0 : Math.max(1, Math.ceil(text.length / 512)),
          };
        }),
      );
      dispatch(actions.addDocuments(added));
      setOpen(false);
      setFiles([]);
      setSuccess(
        `${added.length} document${added.length > 1 ? "s" : ""} added to this demo session. PDFs use simulated extraction in Document Details.`,
      );
    } catch {
      setError(
        "The selected files could not be read. Please select them again.",
      );
    } finally {
      setBusy(false);
    }
  };
  return (
    <>
      <PageHeading
        title="Documents"
        description="A home for your team’s knowledge. Upload, organize, and explore your sources."
        actions={
          <Button
            variant="contained"
            onClick={() => {
              setOpen(true);
              setFiles([]);
              setError("");
            }}
          >
            + Upload documents
          </Button>
        }
      />
      {success && (
        <SuccessState message={success} onClose={() => setSuccess("")} />
      )}
      <Panel>
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={2}
          sx={{ mb: 3 }}
        >
          <TextField
            size="small"
            label="Search documents"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            sx={{ flex: 1 }}
          />
          <TextField
            select
            size="small"
            label="Status"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            sx={{ minWidth: 150 }}
          >
            {["All", "Ready", "Processing", "Failed"].map((s) => (
              <MenuItem key={s} value={s}>
                {s}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            select
            size="small"
            label="File type"
            value={type}
            onChange={(e) => setType(e.target.value)}
            sx={{ minWidth: 130 }}
          >
            {["All", "PDF", "TXT", "MD"].map((t) => (
              <MenuItem key={t} value={t}>
                {t}
              </MenuItem>
            ))}
          </TextField>
        </Stack>
        <Typography variant="caption" color="text.secondary">
          {filtered.length} of {documents.length} documents
        </Typography>
        {filtered.length ? (
          <TableContainer>
            <Table aria-label="Documents" sx={{ minWidth: 660 }}>
              <TableHead>
                <TableRow>
                  {["Name", "Type / Size", "Status", "Uploaded", "Chunks"].map(
                    (h) => (
                      <TableCell key={h}>{h}</TableCell>
                    ),
                  )}
                </TableRow>
              </TableHead>
              <TableBody>
                {filtered.map((d) => (
                  <TableRow key={d.id} hover>
                    <TableCell>
                      <Typography
                        component={Link}
                        href={`/documents/${d.id}`}
                        sx={{
                          color: "text.primary",
                          fontSize: 14,
                          fontWeight: 500,
                          textDecoration: "none",
                          "&:hover": { color: "primary.main" },
                        }}
                      >
                        {d.name}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      {d.type} · {d.size}
                    </TableCell>
                    <TableCell>
                      <StatusChip status={d.status} />
                    </TableCell>
                    <TableCell>{d.uploaded}</TableCell>
                    <TableCell>{d.chunks || "—"}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        ) : (
          <EmptyState
            title="No documents found"
            description="Try another search or upload a document."
            action={
              <Button
                onClick={() => {
                  setQuery("");
                  setStatus("All");
                  setType("All");
                }}
              >
                Clear filters
              </Button>
            }
          />
        )}
      </Panel>
      <Dialog
        open={open}
        onClose={() => {
          if (!busy) setOpen(false);
        }}
        fullWidth
        maxWidth="sm"
        aria-labelledby="upload-title"
      >
        <Box component="form" onSubmit={upload}>
          <DialogTitle id="upload-title">Upload documents</DialogTitle>
          <DialogContent>
            <Alert severity="info" sx={{ mb: 3 }}>
              Files stay in this browser session. TXT and Markdown can be read
              locally; PDF extraction is simulated.
            </Alert>
            {error && <ErrorState message={error} />}
            <Box
              sx={{
                mt: 2,
                p: 4,
                border: "2px dashed",
                borderColor: "divider",
                borderRadius: "12px",
                textAlign: "center",
              }}
            >
              <input
                ref={fileInput}
                type="file"
                multiple
                accept=".pdf,.txt,.md"
                aria-label="Choose documents"
                onChange={(e) => {
                  setFiles(Array.from(e.target.files ?? []));
                  setError("");
                }}
                style={{ display: "none" }}
              />
              <Button
                variant="outlined"
                onClick={() => fileInput.current?.click()}
              >
                Choose files
              </Button>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                PDF, TXT, Markdown · Up to 10 MB per file
              </Typography>
            </Box>
            {files.map((f, i) => (
              <Typography
                key={`${f.name}-${i}`}
                variant="body2"
                sx={{ mt: 1, overflowWrap: "anywhere" }}
              >
                {f.name}
              </Typography>
            ))}
          </DialogContent>
          <DialogActions sx={{ p: 3 }}>
            <Button disabled={busy} onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button
              disabled={busy || !files.length}
              type="submit"
              variant="contained"
            >
              {busy ? "Reading files…" : "Add to workspace"}
            </Button>
          </DialogActions>
        </Box>
      </Dialog>
    </>
  );
}
