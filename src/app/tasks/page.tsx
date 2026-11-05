import type { Metadata } from "next";
import { WorkspacePage } from "../../components/layout/WorkspacePage";

export const metadata: Metadata = { title: "Tasks" };

export default function Page() {
  return <WorkspacePage section="/tasks" />;
}
