import type { ClaimVerdictResult } from "../types/verdict";

type VerdictResultCardProps = {
  result: ClaimVerdictResult;
  source?: "mock" | "genlayer";
};

function formatGeneratedAt(generatedAt: string): string {
  const generatedDate = new Date(generatedAt);

  if (Number.isNaN(generatedDate.getTime())) {
    return generatedAt;
  }

  return new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(generatedDate);
}

export function VerdictResultCard({ result, source = "mock" }: VerdictResultCardProps) {
  const resultLabel = source === "genlayer" ? "GenLayer verdict" : "Mock verdict";

  return (
    <article className="result-card" aria-label={`${resultLabel} result`}>
      <div className="result-card-header">
        <div>
          <p className="panel-label">{resultLabel}</p>
          <h3>{result.verdict}</h3>
        </div>
        <span className={`verdict-pill verdict-pill-${result.verdict}`}>{result.confidence}</span>
      </div>

      <p className="result-summary">{result.summary}</p>

      <dl className="result-details">
        <div>
          <dt>Sources checked</dt>
          <dd>{result.sourcesChecked}</dd>
        </div>
        <div>
          <dt>Generated</dt>
          <dd>{formatGeneratedAt(result.generatedAt)}</dd>
        </div>
      </dl>
    </article>
  );
}
