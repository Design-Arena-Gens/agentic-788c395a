"use client";

import { useMemo, useState } from "react";

type SpeechPricingOption = {
  id: string;
  label: string;
  ratePerMinuteUSD: number;
  summary: string;
};

type GeminiPricingOption = {
  id: string;
  name: string;
  inputPerMillionUSD: number;
  outputPerMillionUSD: number;
  bestFor: string;
};

const speechPricing: SpeechPricingOption[] = [
  {
    id: "standard",
    label: "Speech-to-Text Standard (default)",
    ratePerMinuteUSD: 0.024,
    summary: "Packaged model for short queries and average accents.",
  },
  {
    id: "enhanced",
    label: "Speech-to-Text Enhanced",
    ratePerMinuteUSD: 0.036,
    summary: "Higher accuracy for children and noisy classrooms.",
  },
];

const geminiPricing: GeminiPricingOption[] = [
  {
    id: "flash",
    name: "Gemini 1.5 Flash",
    inputPerMillionUSD: 0.35,
    outputPerMillionUSD: 1.05,
    bestFor:
      "High-volume scoring and rubric alignment where latency matters most.",
  },
  {
    id: "pro",
    name: "Gemini 1.5 Pro",
    inputPerMillionUSD: 7,
    outputPerMillionUSD: 21,
    bestFor:
      "Rich narrative feedback or multi-turn prompting with complex rubrics.",
  },
];

const numberFormat = new Intl.NumberFormat("en-IN");

const currencyFormatUSD = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

const currencyFormatINR = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

export function CostCalculator() {
  const [students, setStudents] = useState(1_400_000);
  const [sessionsPerStudent, setSessionsPerStudent] = useState(1.15);
  const [minutesPerSession, setMinutesPerSession] = useState(1.2);
  const [speechPlan, setSpeechPlan] = useState<SpeechPricingOption["id"]>(
    speechPricing[0].id,
  );
  const [geminiModel, setGeminiModel] = useState<GeminiPricingOption["id"]>(
    geminiPricing[0].id,
  );
  const [analysisMultiplier, setAnalysisMultiplier] = useState(0.35);
  const [usdToInr, setUsdToInr] = useState(83);

  const {
    totalMinutes,
    totalHours,
    sttCostUSD,
    sttCostINR,
    geminiCostUSD,
    geminiCostINR,
    combinedCostUSD,
    combinedCostINR,
    perStudentINR,
    inputTokensMillions,
    outputTokensMillions,
    speechRate,
    chosenGemini,
  } = useMemo(() => {
    const totalSessions = students * sessionsPerStudent;
    const meetingsMinutes = totalSessions * minutesPerSession;
    const minutesRounded = Math.max(meetingsMinutes, 0);
    const hours = minutesRounded / 60;

    const speechRateOption =
      speechPricing.find((option) => option.id === speechPlan) ??
      speechPricing[0];

    const sttCost = minutesRounded * speechRateOption.ratePerMinuteUSD;

    const geminiOption =
      geminiPricing.find((option) => option.id === geminiModel) ??
      geminiPricing[0];

    const tokensPerMinute = 150; // derived from ~110 wpm / 0.75 words per token
    const inputTokens = minutesRounded * tokensPerMinute;
    const outputTokens = Math.max(
      inputTokens * analysisMultiplier,
      tokensPerMinute * minutesRounded * 0.05,
    );

    const inputTokensMillions = inputTokens / 1_000_000;
    const outputTokensMillions = outputTokens / 1_000_000;

    const geminiCost =
      inputTokensMillions * geminiOption.inputPerMillionUSD +
      outputTokensMillions * geminiOption.outputPerMillionUSD;

    const combinedCostUSD = sttCost + geminiCost;
    const combinedCostINR = combinedCostUSD * usdToInr;

    const perStudent = combinedCostINR / Math.max(students, 1);

    return {
      totalMinutes: minutesRounded,
      totalHours: hours,
      sttCostUSD: sttCost,
      sttCostINR: sttCost * usdToInr,
      geminiCostUSD: geminiCost,
      geminiCostINR: geminiCost * usdToInr,
      combinedCostUSD,
      combinedCostINR,
      perStudentINR: perStudent,
      inputTokensMillions,
      outputTokensMillions,
      speechRate: speechRateOption,
      chosenGemini: geminiOption,
    };
  }, [
    students,
    sessionsPerStudent,
    minutesPerSession,
    speechPlan,
    geminiModel,
    analysisMultiplier,
    usdToInr,
  ]);

  return (
    <section className="rounded-3xl border border-slate-700/60 bg-slate-900/60 p-8 shadow-xl shadow-slate-950/40 backdrop-blur">
      <div className="flex flex-col gap-2">
        <h2 className="text-2xl font-semibold text-sky-200">
          Run cost scenarios in seconds
        </h2>
        <p className="text-sm text-slate-300">
          Adjust the assumptions below to see how Speech-to-Text and Gemini
          costs move. Figures are indicative; Google bills in 15-second
          increments for STT and per million tokens for Gemini.
        </p>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <div className="space-y-5">
          <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-400">
            Volume assumptions
          </h3>
          <NumberInput
            label="Students assessed"
            value={students}
            min={1}
            step={10_000}
            onChange={(val) => setStudents(val)}
          />
          <NumberInput
            label="Average sessions per student"
            value={sessionsPerStudent}
            min={1}
            step={0.05}
            onChange={(val) => setSessionsPerStudent(val)}
          />
          <NumberInput
            label="Average audio length (minutes)"
            value={minutesPerSession}
            min={0.25}
            step={0.05}
            onChange={(val) => setMinutesPerSession(val)}
          />
          <NumberInput
            label="USD → INR exchange rate"
            value={usdToInr}
            min={10}
            step={0.5}
            onChange={(val) => setUsdToInr(val)}
          />
        </div>

        <div className="space-y-5">
          <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-400">
            Model choices
          </h3>

          <SelectInput
            label="Speech-to-Text plan"
            value={speechPlan}
            onChange={setSpeechPlan}
            options={speechPricing.map((option) => ({
              value: option.id,
              label: option.label,
              description: option.summary,
            }))}
          />

          <SelectInput
            label="Gemini model"
            value={geminiModel}
            onChange={setGeminiModel}
            options={geminiPricing.map((option) => ({
              value: option.id,
              label: option.name,
              description: option.bestFor,
            }))}
          />

          <NumberInput
            label="Gemini output load vs. transcript (e.g. rubric + feedback ratio)"
            value={analysisMultiplier}
            min={0.05}
            step={0.05}
            onChange={(val) => setAnalysisMultiplier(val)}
          />

          <div className="rounded-2xl border border-slate-700/70 bg-slate-900/80 p-4 text-xs text-slate-300">
            <p>
              <span className="font-semibold text-sky-200">
                Transcript token estimate
              </span>{" "}
              assumes 110 wpm student reading speed, 0.75 words per token. Adjust
              multiplier if you expect richer narrative feedback from Gemini.
            </p>
          </div>
        </div>
      </div>

      <div className="mt-8 grid gap-6 md:grid-cols-2">
        <BreakdownCard
          title="Speech-to-Text"
          subtitle={speechRate.summary}
          usd={sttCostUSD}
          inr={sttCostINR}
          rows={[
            {
              label: "Rate per minute (USD)",
              value: `$${speechRate.ratePerMinuteUSD.toFixed(3)}`,
            },
            {
              label: "Total minutes",
              value: `${numberFormat.format(Math.round(totalMinutes))} min`,
            },
            {
              label: "Total hours",
              value: totalHours.toLocaleString(undefined, {
                maximumFractionDigits: 1,
              }),
            },
          ]}
        />

        <BreakdownCard
          title="Gemini inference"
          subtitle={chosenGemini.bestFor}
          usd={geminiCostUSD}
          inr={geminiCostINR}
          rows={[
            {
              label: "Input tokens (M)",
              value: inputTokensMillions.toLocaleString(undefined, {
                maximumFractionDigits: 2,
              }),
            },
            {
              label: "Output tokens (M)",
              value: outputTokensMillions.toLocaleString(undefined, {
                maximumFractionDigits: 2,
              }),
            },
            {
              label: "Input cost/M tokens",
              value: currencyFormatUSD.format(
                chosenGemini.inputPerMillionUSD,
              ),
            },
          ]}
          footer={{
            label: "Output cost/M tokens",
            value: currencyFormatUSD.format(chosenGemini.outputPerMillionUSD),
          }}
        />
      </div>

      <div className="mt-8 rounded-3xl border border-sky-400/30 bg-sky-500/10 p-6 text-slate-100">
        <h3 className="text-xl font-semibold text-sky-100">
          Combined program estimate
        </h3>
        <div className="mt-4 grid gap-6 md:grid-cols-3">
          <SummaryStat
            label="Total program cost"
            primary={currencyFormatUSD.format(combinedCostUSD)}
            secondary={`≈ ${currencyFormatINR.format(combinedCostINR)}`}
          />
          <SummaryStat
            label="Per-student run rate"
            primary={currencyFormatINR.format(perStudentINR)}
            secondary={`USD ${(combinedCostUSD / Math.max(students, 1)).toFixed(2)}`}
          />
          <SummaryStat
            label="Workload baseline"
            primary={`${numberFormat.format(
              Math.round(totalMinutes),
            )} audio minutes`}
            secondary={`${numberFormat.format(
              Math.round(totalMinutes / 60),
            )} hours of media`}
          />
        </div>
      </div>
    </section>
  );
}

type NumberInputProps = {
  label: string;
  value: number;
  min?: number;
  step?: number;
  onChange: (value: number) => void;
};

function NumberInput({ label, value, min, step, onChange }: NumberInputProps) {
  return (
    <label className="block space-y-2 text-sm">
      <span className="text-slate-300">{label}</span>
      <input
        className="w-full rounded-xl border border-slate-700/60 bg-slate-950/70 px-4 py-2 text-right text-lg font-semibold text-slate-100 outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-400/40"
        type="number"
        value={Number.isFinite(value) ? value : 0}
        min={min}
        step={step}
        onChange={(event) => {
          const nextValue = Number(event.target.value);
          if (Number.isFinite(nextValue)) {
            onChange(nextValue);
          }
        }}
      />
    </label>
  );
}

type SelectInputProps = {
  label: string;
  value: string;
  options: { value: string; label: string; description?: string }[];
  onChange: (value: string) => void;
};

function SelectInput({ label, value, options, onChange }: SelectInputProps) {
  return (
    <label className="block space-y-2 text-sm">
      <span className="text-slate-300">{label}</span>
      <select
        className="w-full rounded-xl border border-slate-700/60 bg-slate-950/70 px-4 py-3 text-sm font-medium text-slate-200 outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-400/40"
        value={value}
        onChange={(event) => onChange(event.target.value)}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {options
        .filter((option) => option.value === value)
        .map((option) =>
          option.description ? (
            <p key={option.value} className="text-xs text-slate-400">
              {option.description}
            </p>
          ) : null,
        )}
    </label>
  );
}

type BreakdownCardProps = {
  title: string;
  subtitle: string;
  usd: number;
  inr: number;
  rows: { label: string; value: string }[];
  footer?: { label: string; value: string };
};

function BreakdownCard({
  title,
  subtitle,
  usd,
  inr,
  rows,
  footer,
}: BreakdownCardProps) {
  return (
    <div className="flex flex-col gap-4 rounded-3xl border border-slate-700/60 bg-slate-900/70 p-6">
      <div>
        <h3 className="text-lg font-semibold text-sky-100">{title}</h3>
        <p className="mt-1 text-xs text-slate-400">{subtitle}</p>
      </div>
      <div className="text-2xl font-semibold text-white">
        {currencyFormatUSD.format(usd)}
      </div>
      <div className="text-sm text-slate-300">
        ≈ {currencyFormatINR.format(inr)}
      </div>
      <dl className="mt-2 space-y-2 text-sm text-slate-300">
        {rows.map((row) => (
          <div key={row.label} className="flex justify-between gap-4">
            <dt className="text-slate-400">{row.label}</dt>
            <dd className="font-medium text-slate-100">{row.value}</dd>
          </div>
        ))}
        {footer ? (
          <div className="flex justify-between gap-4 border-t border-slate-700/50 pt-3">
            <dt className="text-slate-400">{footer.label}</dt>
            <dd className="font-medium text-slate-100">{footer.value}</dd>
          </div>
        ) : null}
      </dl>
    </div>
  );
}

type SummaryStatProps = {
  label: string;
  primary: string;
  secondary: string;
};

function SummaryStat({ label, primary, secondary }: SummaryStatProps) {
  return (
    <div className="rounded-2xl border border-slate-600/60 bg-slate-900/80 p-4">
      <p className="text-xs uppercase tracking-widest text-slate-400">
        {label}
      </p>
      <p className="mt-2 text-xl font-semibold text-white">{primary}</p>
      <p className="text-sm text-slate-300">{secondary}</p>
    </div>
  );
}
