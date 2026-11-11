import type { Metadata } from "next";
import { EvaluationScreen } from "../../features/evaluation/EvaluationScreen";

export const metadata: Metadata = { title: "Evaluation" };

export default function Page() {
  return <EvaluationScreen />;
}
