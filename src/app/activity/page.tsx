import type { Metadata } from "next";
import { ActivityScreen } from "../../features/activity/ActivityScreen";

export const metadata: Metadata = { title: "Agent Activity" };

export default function Page() {
  return <ActivityScreen />;
}
