import type { Metadata } from "next";
import { ChatScreen } from "../../features/chat/ChatScreen";

export const metadata: Metadata = { title: "Chat" };

export default function Page() {
  return <ChatScreen />;
}
