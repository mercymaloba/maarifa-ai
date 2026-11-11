"use client";
import type { ReactNode } from "react";
import { Alert, Box, Button, Skeleton, Stack, Typography } from "@mui/material";

export function LoadingState({ label = "Loading workspace…" }: { label?: string }) {
  return <Box role="status" aria-label={label} sx={{ p: 3 }}><Typography color="text.secondary" sx={{ mb: 2 }}>{label}</Typography><Stack spacing={1.5}>{[0, 1, 2].map(i => <Skeleton key={i} variant="rounded" height={64} />)}</Stack></Box>;
}
export function EmptyState({ title = "Nothing here yet", description, action }: { title?: string; description: string; action?: ReactNode }) {
  return <Box sx={{ textAlign: "center", py: 6, px: 3 }}><Typography component="h2" variant="h6" sx={{ fontWeight: 700 }}>{title}</Typography><Typography color="text.secondary" sx={{ mt: 1, mb: 2 }}>{description}</Typography>{action}</Box>;
}
export function ErrorState({ message = "Something went wrong.", onRetry }: { message?: string; onRetry?: () => void }) {
  return <Alert severity="error" action={onRetry ? <Button color="inherit" size="small" onClick={onRetry}>Retry</Button> : undefined}>{message}</Alert>;
}
export function SuccessState({ message, onClose }: { message: string; onClose?: () => void }) {
  return <Alert severity="success" onClose={onClose} sx={{ mb: 2 }}>{message}</Alert>;
}
