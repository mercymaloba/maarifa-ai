# maarifa-ai

An AI-powered knowledge assistant that retrieves information from your documents, answers with evidence, and helps turn insights into action

## Development

```sh
pnpm install
pnpm dev
```

```sh
pnpm lint
pnpm exec tsc --noEmit
pnpm test
pnpm build
```

## Mock workspace

The Dashboard, Chat, Documents, Document Details, Tasks, Agent Activity,
Evaluation, and Settings screens use sample data. No backend, model, or agent
service is called. Changes last for the current browser session and reset on
reload.

- `src/features`: interactive screens grouped by dashboard, chat, document, tasks, activity, evaluation, and settings.
- `src/components/layout`: shared shell, navigation, and page headings.
- `src/components/ui`: shared panels, metrics, status badges, and loading,
  empty, error, and success states.
- `src/store`: typed Redux Toolkit store, mock data, React provider, and
  simulated asynchronous workflows. Each provider creates an isolated store.
- `tests/store.test.mjs`: state and simulated workflow tests using Node's test
  runner and the existing TypeScript compiler.

Documents accept PDF, TXT, and Markdown files up to 10 MB each. Text files are
read locally; PDFs use an explicitly simulated extraction action. Chat matches
questions against ready document passages and links citations to document
details. Evaluation replays fixed sample results. Settings save session
preferences; the model label and citation switch affect new chat replies,
while retrieval, agent, and security preferences are placeholders for future
backend integration.

The Redux provider uses Next.js `io()` within a Suspense boundary because Redux
generates internal action identifiers during initialization. This preserves
request-time server rendering with Cache Components enabled.
