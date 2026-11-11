"use client";
import Link from "next/link";
import { useState } from "react";
import {
  Alert,
  Box,
  Button,
  Chip,
  Stack,
  Tab,
  Tabs,
  Typography,
} from "@mui/material";
import { actions } from "../../store/store";
import { useAppDispatch, useAppSelector } from "../../store/StoreProvider";
import { PageHeading } from "../../components/layout/PageHeader";
import { Panel, StatusChip, responsiveColumns } from "../../components/ui/WorkspaceUI";
import { EmptyState, ErrorState, SuccessState } from "../../components/ui/FeedbackStates";

export function DocumentDetailsScreen({ id }: { id: string }) {
  const doc = useAppSelector((s) =>
    s.workspace.documents.find((d) => d.id === id),
  );
  const dispatch = useAppDispatch();
  const [tab, setTab] = useState(0);
  const [success, setSuccess] = useState(false);
  if (!doc)
    return (
      <EmptyState
        title="Document not found"
        description="This document may only have existed in an earlier demo session."
        action={
          <Button component={Link} href="/documents">
            Back to documents
          </Button>
        }
      />
    );
  const chunks = doc.text ? (doc.text.match(/[\s\S]{1,512}/g) ?? []) : [];
  const completeExtraction = () => {
    dispatch(actions.retryDocument(doc.id));
    setSuccess(true);
  };
  return (
    <>
      <Button component={Link} href="/documents" sx={{ mb: 2 }}>
        ← All documents
      </Button>
      <PageHeading
        title={doc.name}
        description={`${doc.type} · ${doc.size} · Added ${doc.uploaded}`}
        actions={<StatusChip status={doc.status} />}
      />
      {success && (
        <SuccessState
          message="Simulated extraction completed. Sample text is now available."
          onClose={() => setSuccess(false)}
        />
      )}
      {doc.status === "Failed" && (
        <ErrorState
          message="Text extraction failed: this scanned PDF requires OCR. Retry uses demo text."
          onRetry={completeExtraction}
        />
      )}
      {doc.status === "Processing" && (
        <Alert
          severity="info"
          sx={{ mb: 2 }}
          action={
            <Button color="inherit" onClick={completeExtraction}>
              Simulate completion
            </Button>
          }
        >
          This PDF is awaiting extraction in the demo workflow.
        </Alert>
      )}
      <Tabs
        value={tab}
        onChange={(_, v: number) => setTab(v)}
        variant="scrollable"
        scrollButtons="auto"
        aria-label="Document detail tabs"
        sx={{ mb: 3, borderBottom: 1, borderColor: "divider" }}
      >
        {["Overview", "Extracted Text", "Chunks", "Embeddings"].map(
          (label, i) => (
            <Tab
              key={label}
              label={label}
              id={`document-tab-${i}`}
              aria-controls={`document-panel-${i}`}
            />
          ),
        )}
      </Tabs>
      <Box
        role="tabpanel"
        id={`document-panel-${tab}`}
        aria-labelledby={`document-tab-${tab}`}
      >
        {tab === 0 && (
          <Box sx={responsiveColumns}>
            <Panel title="Document information">
              <Stack spacing={2}>
                {[
                  ["File name", doc.name],
                  ["Format", doc.type],
                  ["File size", doc.size],
                  ["Uploaded", doc.uploaded],
                  ["Ingestion status", doc.status],
                ].map(([label, value]) => (
                  <Box key={label}>
                    <Typography variant="caption" color="text.secondary">
                      {label}
                    </Typography>
                    <Typography variant="body2" sx={{ mt: 0.5 }}>
                      {value}
                    </Typography>
                  </Box>
                ))}
              </Stack>
            </Panel>
            <Panel title="Knowledge readiness">
              <Typography variant="h3" sx={{ fontWeight: 700, mb: 1 }}>
                {doc.chunks}
              </Typography>
              <Typography color="text.secondary">
                Indexed chunks · sample metadata
              </Typography>
              <Typography sx={{ mt: 3, lineHeight: 1.8 }}>
                Ready documents can be referenced in chat. The text and chunk
                previews here show the content available in this demo session.
              </Typography>
              <Button
                component={Link}
                href="/chat"
                variant="outlined"
                disabled={doc.status !== "Ready"}
                sx={{ mt: 3 }}
              >
                Ask a question
              </Button>
            </Panel>
          </Box>
        )}
        {tab === 1 && (
          <Panel title="Extracted text">
            {doc.text ? (
              <Typography
                component="pre"
                sx={{
                  whiteSpace: "pre-wrap",
                  overflowWrap: "anywhere",
                  fontFamily: "inherit",
                  lineHeight: 1.9,
                  fontSize: 14,
                  m: 0,
                }}
              >
                {doc.text}
              </Typography>
            ) : (
              <EmptyState
                title="No extracted text yet"
                description="Complete the simulated extraction to preview document content."
              />
            )}
          </Panel>
        )}
        {tab === 2 && (
          <Panel title={`Chunk previews (${chunks.length})`}>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Preview uses 512-character segments. Seeded index counts are
              illustrative.
            </Typography>
            {chunks.length ? (
              chunks.map((chunk, i) => (
                <Box
                  key={i}
                  sx={{
                    p: 2.5,
                    mb: 2,
                    bgcolor: "background.paper",
                    border: 1,
                    borderColor: "divider",
                    borderRadius: "10px",
                  }}
                >
                  <Chip
                    size="small"
                    label={`Chunk ${i + 1}`}
                    sx={{ mb: 1.5 }}
                  />
                  <Typography
                    variant="body2"
                    sx={{ whiteSpace: "pre-wrap", lineHeight: 1.8 }}
                  >
                    {chunk}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {chunk.length} characters · offsets {i * 512}–
                    {i * 512 + chunk.length}
                  </Typography>
                </Box>
              ))
            ) : (
              <EmptyState description="Chunks will appear after text extraction." />
            )}
          </Panel>
        )}
        {tab === 3 && (
          <Panel title="Embedding index">
            {doc.status === "Ready" ? (
              <>
                <Alert severity="info" sx={{ mb: 3 }}>
                  Illustrative embedding metadata. No vectors have been
                  generated or sent to a model.
                </Alert>
                <Stack spacing={2}>
                  {[
                    ["Embedding model", "nomic-embed-text"],
                    ["Dimensions", "768"],
                    ["Distance metric", "Cosine similarity"],
                    ["Indexed vectors (mock)", String(doc.chunks)],
                    ["Namespace", `workspace/${doc.id}`],
                  ].map(([label, value]) => (
                    <Box key={label}>
                      <Typography color="text.secondary" variant="caption">
                        {label}
                      </Typography>
                      <Typography variant="body2">{value}</Typography>
                    </Box>
                  ))}
                </Stack>
              </>
            ) : (
              <EmptyState description="Embedding metadata is available once the document is ready." />
            )}
          </Panel>
        )}
      </Box>
    </>
  );
}
