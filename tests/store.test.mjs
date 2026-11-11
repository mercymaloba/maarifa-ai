import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import { webcrypto } from "node:crypto";
import test from "node:test";
import vm from "node:vm";
import ts from "typescript";

// Compile the store with the project's existing TypeScript dependency.
// This keeps state tests independent of a browser or a running Next.js server.
const require = createRequire(import.meta.url);
const compiledModules = new Map();
function loadModule(path) {
  if (compiledModules.has(path)) return compiledModules.get(path);
  const source = readFileSync(new URL(path, import.meta.url), "utf8");
  const { outputText } = ts.transpileModule(source, {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2020,
    },
  });
  const compiledModule = { exports: {} };
  vm.runInNewContext(
    outputText,
    {
      module: compiledModule,
      exports: compiledModule.exports,
      crypto: webcrypto,
      setTimeout,
      require: (id) =>
        id === "./mock-data"
          ? loadModule("../src/store/mock-data.ts")
          : require(id),
    },
    { filename: path },
  );
  compiledModules.set(path, compiledModule.exports);
  return compiledModule.exports;
}
const { makeStore, actions, sendMockMessage, evaluateMockSuite } = loadModule(
  "../src/store/store.ts",
);

test("task changes are shared within a store and isolated between stores", () => {
  const store = makeStore();
  const separateStore = makeStore();
  store.dispatch(
    actions.addTask({
      id: "new-task",
      title: "Review sources",
      description: "",
      due: "2026-12-01",
      priority: "High",
      status: "To do",
    }),
  );
  store.dispatch(
    actions.updateTaskStatus({ id: "new-task", status: "Completed" }),
  );
  assert.equal(store.getState().workspace.tasks[0].status, "Completed");
  assert.equal(
    separateStore
      .getState()
      .workspace.tasks.some((task) => task.id === "new-task"),
    false,
  );
});

test("document uploads and simulated retries update the knowledge base", () => {
  const store = makeStore();
  store.dispatch(
    actions.addDocuments([
      {
        id: "new-doc",
        name: "Notes.txt",
        type: "TXT",
        size: "1 KB",
        status: "Ready",
        uploaded: "2026-11-11",
        text: "New knowledge",
        chunks: 1,
      },
    ]),
  );
  assert.equal(store.getState().workspace.documents[0].name, "Notes.txt");
  store.dispatch(actions.retryDocument("doc-5"));
  const document = store
    .getState()
    .workspace.documents.find((doc) => doc.id === "doc-5");
  assert.equal(document.status, "Ready");
  assert.ok(document.text.length > 0);
});

test("a reply completes in its original conversation after switching chats", async () => {
  const store = makeStore();
  const reply = store.dispatch(
    sendMockMessage("conv-1", "What are the product priorities?"),
  );
  assert.ok(
    store.getState().workspace.pendingConversationIds.includes("conv-1"),
  );
  store.dispatch(actions.selectConversation("conv-2"));
  await reply;
  const state = store.getState().workspace;
  assert.equal(state.activeConversationId, "conv-2");
  const message = state.conversations
    .find((chat) => chat.id === "conv-1")
    .messages.at(-1);
  assert.equal(message.role, "assistant");
  assert.equal(message.citations[0].documentId, "doc-1");
  assert.equal(state.pendingConversationIds.length, 0);
});

test("saved citation preferences affect new replies", async () => {
  const store = makeStore();
  store.dispatch(
    actions.savePreferences({
      ...store.getState().workspace.preferences,
      model: "mistral",
      citations: false,
    }),
  );
  await store.dispatch(
    sendMockMessage("conv-1", "What are the product priorities?"),
  );
  const state = store.getState().workspace;
  assert.equal(state.preferences.model, "mistral");
  assert.equal(state.conversations[0].messages.at(-1).citations.length, 0);
});

test("an unmatched question does not invent an answer or citation", async () => {
  const store = makeStore();
  store.dispatch(
    actions.addConversation({
      id: "new-chat",
      title: "New conversation",
      messages: [],
    }),
  );
  await store.dispatch(sendMockMessage("new-chat", "astronaut volcanoes"));
  const chat = store.getState().workspace.conversations[0];
  assert.equal(chat.title, "astronaut volcanoes");
  assert.match(
    chat.messages.at(-1).content,
    /couldn’t find a matching passage/,
  );
  assert.equal(chat.messages.at(-1).citations.length, 0);
});

test("duplicate evaluation requests only produce one run", async () => {
  const store = makeStore();
  const first = store.dispatch(evaluateMockSuite());
  const duplicate = store.dispatch(evaluateMockSuite());
  assert.equal(store.getState().workspace.evaluationRunning, true);
  await Promise.all([first, duplicate]);
  assert.equal(store.getState().workspace.evaluationRuns, 2);
  assert.equal(store.getState().workspace.evaluationRunning, false);
});
