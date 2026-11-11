import type { Metadata } from "next";
import { DocumentsScreen } from "../../features/document/DocumentsScreen";

export const metadata: Metadata = { title: "Documents" };

export default function Page() {
  return <DocumentsScreen />;
}
