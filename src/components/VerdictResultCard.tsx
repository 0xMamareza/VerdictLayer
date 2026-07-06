import type { ClaimVerdictResult } from "../types/verdict";

type VerdictResultCardProps = {
  result: ClaimVerdictResult;
};

function formatGeneratedAt(generatedAt: string): string {
  return new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(generatedAt));
}

export function VerdictResultCard({ result }: VerdictResultCardProps) {
  return (
    <article className="result-card" aria-label="Mock verdict result">
      <div className="result-card-header">
        <div>
          <p className="panel-label">Mock verdict</p>
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
