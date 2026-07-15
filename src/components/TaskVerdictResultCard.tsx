import type { TaskVerdictResult } from "../types/verdict";

type TaskVerdictResultCardProps = {
  result: TaskVerdictResult;
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

function formatStatus(status: TaskVerdictResult["status"]): string {
  return status.replace("_", " ");
}

export function TaskVerdictResultCard({
  result,
  source = "mock",
}: TaskVerdictResultCardProps) {
  const resultLabel = source === "genlayer" ? "GenLayer task review" : "Mock review";

  return (
    <article
      className={`result-card result-card-${result.status}`}
      aria-label={`${resultLabel} result`}
    >
      <div className="result-card-header">
        <div className="result-outcome">
          <p className="panel-label">
            <span className="result-signal" aria-hidden="true" />
            {resultLabel}
          </p>
          <h3>{formatStatus(result.status)}</h3>
        </div>
        <span className={`verdict-pill verdict-pill-${result.status}`}>{result.score}/100</span>
      </div>

      <div className="result-narrative">
        <p className="result-section-label">Review feedback</p>
        <p className="result-summary">{result.feedback}</p>
      </div>

      <div className="missing-items-panel">
        <h4>Missing items</h4>
        {result.missingItems.length > 0 ? (
          <ul>
            {result.missingItems.map((missingItem) => (
              <li key={missingItem}>{missingItem}</li>
            ))}
          </ul>
        ) : (
          <p>No key proof gaps detected.</p>
        )}
      </div>

      <dl className="result-details">
        <div>
          <dt>Score</dt>
          <dd>{result.score}/100</dd>
        </div>
        <div>
          <dt>Generated</dt>
          <dd>{formatGeneratedAt(result.generatedAt)}</dd>
        </div>
      </dl>
    </article>
  );
}
