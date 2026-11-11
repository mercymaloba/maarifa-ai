"use client";
import type { ReactNode } from "react";
import { Box, Chip, Paper, Stack, Typography } from "@mui/material";

export function Panel({ title, action, children }: { title?: string; action?: ReactNode; children: ReactNode }) {
  return <Paper variant="outlined" sx={{ bgcolor: "background.default", borderRadius: "12px", overflow: "hidden" }}>{title && <Stack direction="row" sx={{ p: 2.5, alignItems: "center", justifyContent: "space-between", gap: 2, borderBottom: 1, borderColor: "divider" }}><Typography component="h2" variant="subtitle1" sx={{ fontWeight: 700 }}>{title}</Typography>{action}</Stack>}<Box sx={{ p: 2.5 }}>{children}</Box></Paper>;
}
export function StatusChip({ status }: { status: string }) {
  const color = ["Ready", "Completed", "Passed"].includes(status) ? "success" : ["Failed", "High"].includes(status) ? "error" : ["Processing", "Running", "In progress"].includes(status) ? "primary" : "default";
  return <Chip size="small" label={status} color={color} variant="outlined" sx={{ fontSize: 12, fontWeight: 500 }} />;
}
export function MetricCard({ label, value, detail }: { label: string; value: string | number; detail: string }) {
  return <Panel><Typography color="text.secondary" variant="body2">{label}</Typography><Typography variant="h4" sx={{ my: 1, fontWeight: 700, letterSpacing: "-0.04em" }}>{value}</Typography><Typography variant="caption" color="text.secondary">{detail}</Typography></Panel>;
}
export const responsiveColumns = { display: "grid", gridTemplateColumns: { xs: "1fr", lg: "1fr 1fr" }, gap: 3 };
