import { CostCalculator } from "@/components/cost-calculator";

const comparisonRows = [
  {
    attribute: "Primary use case",
    speechToText:
      "Streaming or batch transcription of audio into accurate text with low latency.",
    gemini:
      "Multimodal reasoning on transcripts, rubric scoring, personalised feedback.",
  },
  {
    attribute: "Billing unit",
    speechToText: "15-second audio blocks (rounded up).",
    gemini: "1M input / output tokens (roughly 750k / 250k words).",
  },
  {
    attribute: "Latency & throughput",
    speechToText: "Real time and batch modes, automatic scaling.",
    gemini:
      "Sub-second (1.5 Flash) to multi-second (1.5 Pro). Concurrency quotas apply.",
  },
  {
    attribute: "Accuracy drivers",
    speechToText:
      "Acoustic model, language model, sample rate, background noise.",
    gemini:
      "Transcript quality + prompt engineering + rubric clarity; relies on good transcription.",
  },
  {
    attribute: "Operational complexity",
    speechToText:
      "Simple REST/gRPC call; deterministic usage; aligns with existing ORF pipeline.",
    gemini:
      "Requires prompt templates, evaluation datasets, guardrails and monitoring.",
  },
  {
    attribute: "Cost predictability",
    speechToText:
      "High – directly proportional to audio minutes recorded.",
    gemini:
      "Variable – depends on prompt size, transcript length, and response length.",
  },
  {
    attribute: "Best fit in ORF flow",
    speechToText:
      "Baseline transcription of student reading samples (Stage 1).",
    gemini:
      "Automated scoring, error classification, personalised feedback (Stage 2).",
  },
];

const quickSignals = [
  {
    title: "Choose Speech-to-Text",
    description:
      "Use it where you need the raw transcript fast and at predictable cost. Ideal for capturing FLN evidence uniformly across 1.4M learners.",
    bullets: [
      "Low-latency 15s billing keeps transcription at ≈$0.024/min.",
      "Supports offline batch processing in case of intermittent connectivity.",
      "Pairs with lightweight rubric heuristics when GenAI is optional.",
    ],
  },
  {
    title: "Layer Gemini on top",
    description:
      "Gemini becomes cost-effective once you need automated comprehension scoring, error tagging, or narrative feedback for teachers.",
    bullets: [
      "Use Gemini 1.5 Flash for rubric scoring at scale; ~20× cheaper than 1.5 Pro.",
      "Pre-train prompts with representative student audio + transcripts.",
      "Cache or reuse feedback templates to control output tokens.",
    ],
  },
];

const implementationPhases = [
  {
    label: "Phase 1 · Baseline transcription (Weeks 1–3)",
    items: [
      "Collect 3–5 hours of representative student recordings per language.",
      "Benchmark Standard vs Enhanced STT on word-error-rate for each region.",
      "Instrument storage pipeline with anonymisation and retention controls.",
    ],
  },
  {
    label: "Phase 2 · Gemini scoring pilot (Weeks 3–6)",
    items: [
      "Design rubric prompts (accuracy, fluency, pronunciation, error types).",
      "Fine-tune sampling – at least 1,000 scored transcripts for evaluation.",
      "Run evaluator loop comparing Gemini outputs with expert raters.",
    ],
  },
  {
    label: "Phase 3 · Production scale-up (Weeks 6–10)",
    items: [
      "Set up quota management: separate projects for STT ingestion & Gemini reasoning.",
      "Automate billing dashboards using Cloud Billing export + Looker Studio.",
      "Roll-out gradual deployment: 10% → 30% → 100% districts with feedback survey.",
    ],
  },
];

const dueDiligence = [
  {
    title: "Data protection",
    detail:
      "Enable Cloud Storage CMEK + Vertex AI VPC Service Controls to keep student audio within Indian regions where possible.",
  },
  {
    title: "Caching strategy",
    detail:
      "Store transcripts and Gemini responses for 24 hours to avoid double billing on retries or teacher replays.",
  },
  {
    title: "Quality monitoring",
    detail:
      "Create monthly quality panel with sampled transcripts to track drift in accuracy and rubric alignment.",
  },
  {
    title: "Cost governance",
    detail:
      "Set Cloud Billing budget alerts at 60/80/100% of forecast; review per-student spend after each assessment cycle.",
  },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <main className="mx-auto flex max-w-6xl flex-col gap-16 px-6 py-16 md:px-10 lg:px-12">
        <section className="rounded-3xl border border-slate-800/70 bg-slate-900/60 p-8 shadow-2xl shadow-slate-950/50 backdrop-blur">
          <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
            <div className="max-w-3xl space-y-4">
              <p className="text-xs uppercase tracking-[0.4em] text-sky-300">
                AP ORF · GenAI rapid response
              </p>
              <h1 className="text-4xl font-semibold leading-tight text-slate-50 md:text-5xl">
                Speech-to-Text vs Gemini for 1.4M student ORF assessments
              </h1>
              <p className="text-lg text-slate-300">
                Pragmatic guidance to help you give AP a confident answer within
                the day: where each API fits, how to budget at FLN scale, and the
                next three conversations to line up.
              </p>
            </div>
            <aside className="grid gap-3 rounded-2xl border border-slate-700/60 bg-slate-950/60 p-5 text-sm text-slate-300">
              <div className="flex items-center justify-between text-xs uppercase tracking-widest text-slate-400">
                <span>Deployment scale</span>
                <span>Indicative</span>
              </div>
              <div>
                <p className="text-3xl font-semibold text-sky-200">
                  14,00,000
                </p>
                <p className="mt-1 text-xs text-slate-400">
                  learners across districts
                </p>
              </div>
              <div className="border-t border-slate-800/60 pt-3 text-xs text-slate-400">
                Ready for: Leadership brief, procurement call, and technical deep
                dive with AP&apos;s ORF squad.
              </div>
            </aside>
          </div>
          <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-2xl border border-slate-800/60 bg-slate-950/70 p-5 text-sm">
              <p className="text-xs uppercase tracking-widest text-sky-300">
                What AP asked
              </p>
              <p className="mt-3 text-slate-200">
                “Which API should we integrate into the ORF tool and how do we
                estimate cost per minute when Gemini pricing is token-based?”
              </p>
            </div>
            <div className="rounded-2xl border border-slate-800/60 bg-slate-950/70 p-5 text-sm">
              <p className="text-xs uppercase tracking-widest text-sky-300">
                Quick steer
              </p>
              <p className="mt-3 text-slate-200">
                Default to Speech-to-Text for ingestion, then selectively call
                Gemini 1.5 Flash where automated scoring delivers measurable
                teacher time savings.
              </p>
            </div>
            <div className="rounded-2xl border border-slate-800/60 bg-slate-950/70 p-5 text-sm">
              <p className="text-xs uppercase tracking-widest text-sky-300">
                Follow-up contact
              </p>
              <p className="mt-3 text-slate-200">
                Loop in <span className="font-semibold">Asha · GenAI Delivery</span>{" "}
                for the rubric evaluation workshop and{" "}
                <span className="font-semibold">Tanmay · Cloud Architect</span> for
                quota and billing guardrails.
              </p>
            </div>
          </div>
        </section>

        <section className="grid gap-8 lg:grid-cols-2">
          {quickSignals.map((signal) => (
            <article
              key={signal.title}
              className="flex flex-col gap-4 rounded-3xl border border-slate-800/60 bg-slate-900/70 p-8 shadow-lg shadow-slate-950/40"
            >
              <h2 className="text-2xl font-semibold text-sky-200">
                {signal.title}
              </h2>
              <p className="text-sm text-slate-300">{signal.description}</p>
              <ul className="space-y-3 text-sm text-slate-200">
                {signal.bullets.map((bullet) => (
                  <li key={bullet} className="flex gap-3">
                    <span className="mt-1 h-2 w-2 flex-shrink-0 rounded-full bg-sky-400" />
                    <span>{bullet}</span>
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </section>

        <section className="rounded-3xl border border-slate-800/70 bg-slate-900/70 p-8 shadow-xl shadow-slate-950/40">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <h2 className="text-3xl font-semibold text-slate-50">
                Where each API shines
              </h2>
              <p className="mt-2 max-w-2xl text-sm text-slate-300">
                Speech-to-Text is the recorder; Gemini is the scorer. Share this
                slide with AP so they can spot which workloads trigger the higher
                Gemini spend.
              </p>
            </div>
            <p className="text-xs uppercase tracking-widest text-sky-300">
              Decision ledger
            </p>
          </div>
          <div className="mt-6 overflow-x-auto rounded-2xl border border-slate-800/60">
            <table className="min-w-full divide-y divide-slate-800/60">
              <thead className="bg-slate-950/80 text-left text-xs uppercase tracking-wider text-slate-400">
                <tr>
                  <th className="px-6 py-4">Dimension</th>
                  <th className="px-6 py-4 text-sky-200">Speech-to-Text API</th>
                  <th className="px-6 py-4 text-sky-200">Gemini 1.5</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/40 text-sm text-slate-200">
                {comparisonRows.map((row) => (
                  <tr key={row.attribute} className="bg-slate-950/40">
                    <td className="align-top px-6 py-5 text-slate-400">
                      {row.attribute}
                    </td>
                    <td className="px-6 py-5">{row.speechToText}</td>
                    <td className="px-6 py-5">{row.gemini}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <CostCalculator />

        <section className="rounded-3xl border border-slate-800/70 bg-slate-900/70 p-8 shadow-xl shadow-slate-950/50">
          <h2 className="text-3xl font-semibold text-slate-50">
            Implementation runway
          </h2>
          <p className="mt-2 text-sm text-slate-300">
            Three pragmatic phases keep procurement, pedagogy, and tech teams in
            lockstep while we scale from pilot to statewide operations.
          </p>
          <div className="mt-6 grid gap-6 lg:grid-cols-3">
            {implementationPhases.map((phase) => (
              <article
                key={phase.label}
                className="flex flex-col gap-4 rounded-2xl border border-slate-800/60 bg-slate-950/60 p-6"
              >
                <h3 className="text-sm font-semibold uppercase tracking-wide text-sky-200">
                  {phase.label}
                </h3>
                <ul className="space-y-3 text-sm text-slate-200">
                  {phase.items.map((item) => (
                    <li key={item} className="flex gap-3">
                      <span className="mt-1 h-2 w-2 flex-shrink-0 rounded-full bg-sky-400" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </section>

        <section className="rounded-3xl border border-slate-800/70 bg-slate-900/70 p-8 shadow-lg shadow-slate-950/40">
          <div className="flex flex-col gap-4 md:flex-row md:justify-between">
            <div>
              <h2 className="text-3xl font-semibold text-slate-50">
                Due-diligence checklist before AP&apos;s call
              </h2>
              <p className="mt-2 text-sm text-slate-300">
                Mention at least two of these on the call so AP knows we have the
                operational angles under control.
              </p>
            </div>
            <p className="text-xs uppercase tracking-widest text-sky-300">
              Risk radar
            </p>
          </div>
          <div className="mt-6 grid gap-6 md:grid-cols-2">
            {dueDiligence.map((item) => (
              <article
                key={item.title}
                className="rounded-2xl border border-slate-800/60 bg-slate-950/70 p-6"
              >
                <h3 className="text-lg font-semibold text-sky-200">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm text-slate-300">{item.detail}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="mb-12 rounded-3xl border border-slate-800/70 bg-slate-950/70 p-8 shadow-xl shadow-slate-950/50">
          <div className="grid gap-6 lg:grid-cols-[2fr,1fr]">
            <div className="space-y-4">
              <h2 className="text-3xl font-semibold text-slate-50">
                What to say back to the team today
              </h2>
              <p className="text-sm text-slate-300">
                “We&apos;ll integrate Google Speech-to-Text for baseline
                transcription (≈₹3 per student) and optionally layer Gemini 1.5
                Flash wherever automated scoring is required. End-to-end program
                cost with current assumptions is ≈₹40 lakh; let&apos;s review after
                the pilot and lock quotas before production.”
              </p>
              <p className="text-sm text-slate-400">
                Share the Vercel link so AP can try the sliders themselves before
                finalising budgets.
              </p>
            </div>
            <aside className="rounded-2xl border border-sky-500/40 bg-sky-500/10 p-6 text-sm text-slate-100">
              <h3 className="text-xs uppercase tracking-widest text-sky-200">
                Ready for the call
              </h3>
              <p className="mt-3">
                Get <span className="font-semibold">Asha</span> and{" "}
                <span className="font-semibold">Tanmay</span> on a 30-minute huddle
                with AP&apos;s product owner. Bring this workspace plus sample
                transcripts to walk through the calculator and pipeline.
              </p>
            </aside>
          </div>
        </section>
      </main>
    </div>
  );
}
