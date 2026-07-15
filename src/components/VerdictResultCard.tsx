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
    <article
      className={`result-card result-card-${result.verdict}`}
      aria-label={`${resultLabel} result`}
    >
      <div className="result-card-header">
        <div className="result-outcome">
          <p className="panel-label">
            <span className="result-signal" aria-hidden="true" />
            {resultLabel}
          </p>
          <h3>{result.verdict}</h3>
        </div>
        <span className={`verdict-pill verdict-pill-${result.verdict}`}>{result.confidence}</span>
      </div>

      <div className="result-narrative">
        <p className="result-section-label">Decision summary</p>
        <p className="result-summary">{result.summary}</p>
      </div>

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
