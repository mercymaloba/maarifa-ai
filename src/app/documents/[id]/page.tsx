import type { Metadata } from "next";
import { Suspense } from "react";
import { LoadingState } from "../../../components/ui/FeedbackStates";
import { DocumentDetailsScreen } from "../../../features/document/DocumentDetailsScreen";
export const metadata: Metadata = { title: "Document details" };
async function DocumentContent({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <DocumentDetailsScreen id={id} />;
}

export default function Page({ params }: { params: Promise<{ id: string }> }) {
  return <Suspense fallback={<LoadingState label="Loading document…" />}><DocumentContent params={params} /></Suspense>;
}
