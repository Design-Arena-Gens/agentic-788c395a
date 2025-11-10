## FLN API Decision Workspace

This Next.js application helps the AP ORF team compare Google Speech-to-Text and Gemini APIs for large-scale Foundational Literacy & Numeracy (FLN) assessments. It blends narrative guidance with an interactive calculator so stakeholders can interrogate cost drivers in real time.

### Key features
- Snapshot comparison between Speech-to-Text and Gemini workloads.
- Interactive cost calculator with configurable student counts, session lengths, exchange rates, and model selections.
- Implementation roadmap and risk checklist tailored for 14 lakh learner assessments.

### Local development
```bash
npm install
npm run dev
```
Open `http://localhost:3000` to explore the workspace.

### Production build
```bash
npm run build
npm run start
```

### Deployment
The project is optimised for Vercel. Use the provided CLI command:
```bash
vercel deploy --prod --yes --token $VERCEL_TOKEN --name agentic-788c395a
```

### Stack
- Next.js App Router + TypeScript
- Tailwind CSS with design tokens tuned for a dark analyst dashboard
