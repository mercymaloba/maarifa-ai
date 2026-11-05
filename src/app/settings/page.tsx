import type { Metadata } from "next";
import { WorkspacePage } from "../../components/layout/WorkspacePage";

export const metadata: Metadata = { title: "Settings" };

export default function Page() {
  return <WorkspacePage section="/settings" />;
}
