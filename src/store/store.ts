import {
  configureStore,
  createSlice,
  type PayloadAction,
} from "@reduxjs/toolkit";
import {
  documents,
  tasks,
  conversations,
  agentRuns,
  testCases,
  defaultPreferences,
  type KnowledgeDocument,
  type Task,
  type TaskStatus,
  type Conversation,
  type Message,
  type Preferences,
} from "./mock-data";

const workspaceSlice = createSlice({
  name: "workspace",
  initialState: {
    documents,
    tasks,
    conversations,
    agentRuns,
    testCases,
    preferences: defaultPreferences,
    activeConversationId: "conv-1",
    evaluationRuns: 1,
    pendingConversationIds: [] as string[],
    evaluationRunning: false,
  },
  reducers: {
    addDocuments(state, action: PayloadAction<KnowledgeDocument[]>) {
      state.documents.unshift(...action.payload);
    },
    retryDocument(state, action: PayloadAction<string>) {
      const doc = state.documents.find((d) => d.id === action.payload);
      if (doc) {
        doc.status = "Ready";
        doc.text =
          "Demo extraction completed. This is sample document text produced by the mock ingestion workflow.";
        doc.chunks = 1;
      }
    },
    addTask(state, action: PayloadAction<Task>) {
      state.tasks.unshift(action.payload);
    },
    updateTaskStatus(
      state,
      action: PayloadAction<{ id: string; status: TaskStatus }>,
    ) {
      const task = state.tasks.find((t) => t.id === action.payload.id);
      if (task) task.status = action.payload.status;
    },
    addConversation(state, action: PayloadAction<Conversation>) {
      state.conversations.unshift(action.payload);
      state.activeConversationId = action.payload.id;
    },
    selectConversation(state, action: PayloadAction<string>) {
      state.activeConversationId = action.payload;
    },
    addMessage(
      state,
      action: PayloadAction<{ conversationId: string; message: Message }>,
    ) {
      const conversation = state.conversations.find(
        (c) => c.id === action.payload.conversationId,
      );
      if (conversation) {
        if (!conversation.messages.length)
          conversation.title = action.payload.message.content.slice(0, 40);
        conversation.messages.push(action.payload.message);
      }
    },
    savePreferences(state, action: PayloadAction<Preferences>) {
      state.preferences = action.payload;
    },
    runEvaluation(state) {
      state.evaluationRuns += 1;
    },
    beginReply(state, action: PayloadAction<string>) {
      state.pendingConversationIds.push(action.payload);
    },
    finishReply(state, action: PayloadAction<string>) {
      state.pendingConversationIds = state.pendingConversationIds.filter(
        (id) => id !== action.payload,
      );
    },
    setEvaluationRunning(state, action: PayloadAction<boolean>) {
      state.evaluationRunning = action.payload;
    },
  },
});
export const actions = workspaceSlice.actions;
export const makeStore = () =>
  configureStore({ reducer: { workspace: workspaceSlice.reducer } });
export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];

// Keep simulated work in the store so route navigation does not cancel it.
export const sendMockMessage =
  (conversationId: string, question: string) =>
  async (dispatch: AppDispatch, getState: () => RootState) => {
    const { documents, preferences, pendingConversationIds } =
      getState().workspace;
    if (!question.trim() || pendingConversationIds.includes(conversationId))
      return;
    dispatch(actions.beginReply(conversationId));
    dispatch(
      actions.addMessage({
        conversationId,
        message: {
          id: crypto.randomUUID(),
          role: "user",
          content: question.trim(),
        },
      }),
    );
    const words = question.toLowerCase().match(/[a-z]{4,}/g) ?? [];
    const scored = documents
      .filter((d) => d.status === "Ready" && d.text)
      .map((doc) => ({
        doc,
        score: words.filter((word) =>
          `${doc.name} ${doc.text}`.toLowerCase().includes(word),
        ).length,
      }))
      .sort((a, b) => b.score - a.score);
    const source = scored[0]?.score ? scored[0].doc : undefined;
    const paragraph =
      source?.text
        .split("\n\n")
        .find((text) =>
          words.some((word) => text.toLowerCase().includes(word)),
        ) ?? source?.text.split("\n\n")[0];
    await new Promise((resolve) => setTimeout(resolve, 600));
    dispatch(
      actions.addMessage({
        conversationId,
        message: {
          id: crypto.randomUUID(),
          role: "assistant",
          content: paragraph
            ? `Demo response from ${source!.name}:\n\n${paragraph}`
            : "I couldn’t find a matching passage in the mock knowledge base. Try asking about product priorities, annual leave, remote work, or customer research.",
          citations:
            source && paragraph && preferences.citations
              ? [{ documentId: source.id, quote: paragraph }]
              : [],
        },
      }),
    );
    dispatch(actions.finishReply(conversationId));
  };

export const evaluateMockSuite =
  () => async (dispatch: AppDispatch, getState: () => RootState) => {
    if (getState().workspace.evaluationRunning) return;
    dispatch(actions.setEvaluationRunning(true));
    await new Promise((resolve) => setTimeout(resolve, 900));
    dispatch(actions.runEvaluation());
    dispatch(actions.setEvaluationRunning(false));
  };
