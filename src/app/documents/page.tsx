import type { Metadata } from "next";
import { WorkspacePage } from "../../components/layout/WorkspacePage";

export const metadata: Metadata = { title: "Documents" };

export default function Page() {
  return <WorkspacePage section="/documents" />;
}
