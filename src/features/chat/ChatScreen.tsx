"use client";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import {
  Alert,
  Avatar,
  Box,
  Button,
  Chip,
  Divider,
  List,
  ListItemButton,
  ListItemText,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { actions, sendMockMessage } from "../../store/store";
import { useAppDispatch, useAppSelector } from "../../store/StoreProvider";
import { PageHeading } from "../../components/layout/PageHeader";
import { Panel } from "../../components/ui/WorkspaceUI";
import { EmptyState, LoadingState } from "../../components/ui/FeedbackStates";

export function ChatScreen() {
  const dispatch = useAppDispatch();
  const {
    conversations,
    activeConversationId,
    documents,
    preferences,
    pendingConversationIds,
  } = useAppSelector((s) => s.workspace);
  const conversation = conversations.find((c) => c.id === activeConversationId);
  const [input, setInput] = useState("");
  const sending = pendingConversationIds.includes(activeConversationId);
  const end = useRef<HTMLDivElement>(null);
  useEffect(() => {
    end.current?.scrollIntoView({ block: "nearest", behavior: "smooth" });
  }, [conversation?.messages.length, sending]);
  const newChat = () =>
    dispatch(
      actions.addConversation({
        id: crypto.randomUUID(),
        title: "New conversation",
        messages: [],
      }),
    );
  const send = () => {
    const question = input.trim();
    if (!question || !conversation || sending) return;
    void dispatch(sendMockMessage(conversation.id, question));
    setInput("");
  };
  return (
    <>
      <PageHeading
        title="Chat"
        description="A conversation with your knowledge. Every answer starts with evidence."
        actions={
          <Chip label={`Model: ${preferences.model}`} variant="outlined" />
        }
      />
      <Alert severity="info" sx={{ mb: 3 }}>
        Demo workspace: replies are matched to sample document passages. No
        model or external service is called.
      </Alert>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", lg: "250px minmax(0, 1fr)" },
          gap: 3,
        }}
      >
        <Panel title="Conversations">
          <Button fullWidth variant="outlined" onClick={newChat} sx={{ mb: 2 }}>
            + New conversation
          </Button>
          <List sx={{ maxHeight: { xs: 180, lg: 560 }, overflowY: "auto" }}>
            {conversations.map((c) => (
              <ListItemButton
                key={c.id}
                selected={c.id === activeConversationId}
                onClick={() => dispatch(actions.selectConversation(c.id))}
                sx={{ borderRadius: 1, mb: 0.5 }}
              >
                <ListItemText
                  primary={c.title}
                  secondary={`${c.messages.length} messages`}
                  slotProps={{
                    primary: { sx: { fontSize: 14, fontWeight: 500 } },
                  }}
                />
              </ListItemButton>
            ))}
          </List>
        </Panel>
        <Panel title={conversation?.title ?? "New conversation"}>
          <Box
            role="log"
            aria-label="Conversation messages"
            aria-live="polite"
            sx={{ minHeight: 300, maxHeight: 540, overflowY: "auto", pr: 1 }}
          >
            {!conversation?.messages.length && (
              <EmptyState
                title="What would you like to discover?"
                description="Ask about your documents, compare ideas, or find a specific detail."
                action={
                  <Button
                    onClick={() => setInput("What are our product priorities?")}
                  >
                    Try a sample question
                  </Button>
                }
              />
            )}
            {conversation?.messages.map((m) => (
              <Stack
                key={m.id}
                direction="row"
                spacing={1.5}
                sx={{ mb: 3, alignItems: "flex-start" }}
              >
                <Avatar
                  sx={{
                    width: 32,
                    height: 32,
                    fontSize: 12,
                    bgcolor:
                      m.role === "assistant" ? "primary.main" : "grey.200",
                    color: m.role === "assistant" ? "white" : "text.primary",
                  }}
                >
                  {m.role === "assistant" ? "AI" : "You"}
                </Avatar>
                <Box sx={{ minWidth: 0, flex: 1 }}>
                  <Typography variant="caption" sx={{ fontWeight: 700 }}>
                    {m.role === "assistant" ? "Maarifa AI" : "You"}
                  </Typography>
                  <Box
                    sx={{
                      mt: 0.5,
                      p: 2,
                      borderRadius: "12px",
                      bgcolor:
                        m.role === "assistant"
                          ? "background.paper"
                          : "rgba(79,70,229,.05)",
                    }}
                  >
                    <Typography
                      sx={{
                        whiteSpace: "pre-wrap",
                        overflowWrap: "anywhere",
                        lineHeight: 1.8,
                        fontSize: 14,
                      }}
                    >
                      {m.content}
                    </Typography>
                  </Box>
                  {m.citations?.map((c, i) => (
                    <Box
                      key={`${c.documentId}-${i}`}
                      sx={{
                        mt: 1.5,
                        borderLeft: 2,
                        borderColor: "primary.main",
                        pl: 1.5,
                      }}
                    >
                      <Typography
                        component={Link}
                        href={`/documents/${c.documentId}`}
                        variant="caption"
                        sx={{ color: "primary.main", fontWeight: 700 }}
                      >
                        [{i + 1}]{" "}
                        {documents.find((d) => d.id === c.documentId)?.name ??
                          "Source document"}
                      </Typography>
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{ display: "block", mt: 0.5 }}
                      >
                        {c.quote}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              </Stack>
            ))}
            {sending && <LoadingState label="Finding a sample passage…" />}
            <div ref={end} />
          </Box>
          <Divider sx={{ my: 2 }} />
          <Box
            component="form"
            onSubmit={(e) => {
              e.preventDefault();
              send();
            }}
          >
            <TextField
              fullWidth
              multiline
              minRows={2}
              maxRows={6}
              label="Ask your knowledge"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (
                  e.key === "Enter" &&
                  !e.shiftKey &&
                  !e.nativeEvent.isComposing
                ) {
                  e.preventDefault();
                  send();
                }
              }}
            />
            <Stack
              direction="row"
              sx={{
                mt: 1.5,
                justifyContent: "space-between",
                gap: 1,
                alignItems: "center",
              }}
            >
              <Typography variant="caption" color="text.secondary">
                Enter to send · Shift + Enter for a new line
              </Typography>
              <Button
                type="submit"
                variant="contained"
                disabled={sending || !input.trim()}
              >
                {sending ? "Replying…" : "Send message"}
              </Button>
            </Stack>
          </Box>
        </Panel>
      </Box>
    </>
  );
}
