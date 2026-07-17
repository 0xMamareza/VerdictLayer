import type { DisputeVerdictResult } from "../types/verdict";

type DisputeVerdictResultCardProps = {
  result: DisputeVerdictResult;
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

function formatVerdict(verdict: DisputeVerdictResult["verdict"]): string {
  return verdict.replace("_", " ");
}

export function DisputeVerdictResultCard({
  result,
  source = "mock",
}: DisputeVerdictResultCardProps) {
  const resultLabel = source === "genlayer" ? "GenLayer dispute resolution" : "Mock resolution";

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
          <h3>{formatVerdict(result.verdict)}</h3>
        </div>
        <span className={`verdict-pill verdict-pill-${result.verdict}`}>{result.confidence}</span>
      </div>

      <div className="result-narrative">
        <p className="result-section-label">Decision reason</p>
        <p className="result-summary">{result.reason}</p>
      </div>

      <div className="resolution-panel">
        <h4>Recommended resolution</h4>
        <p>{result.recommendedResolution}</p>
      </div>

      <dl className="result-details">
        <div>
          <dt>Confidence</dt>
          <dd>{result.confidence}</dd>
        </div>
        <div>
          <dt>Generated</dt>
          <dd>{formatGeneratedAt(result.generatedAt)}</dd>
        </div>
      </dl>
    </article>
  );
}
