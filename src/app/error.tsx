"use client";
import { ErrorState } from "../components/ui/FeedbackStates";
export default function Error({ reset }: { reset: () => void }) {
  return <ErrorState message="This screen could not be loaded. Please try again." onRetry={reset} />;
}
