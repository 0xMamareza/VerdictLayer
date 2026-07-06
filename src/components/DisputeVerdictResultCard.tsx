import type { DisputeVerdictResult } from "../types/verdict";

type DisputeVerdictResultCardProps = {
  result: DisputeVerdictResult;
};

function formatGeneratedAt(generatedAt: string): string {
  return new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(generatedAt));
}

function formatVerdict(verdict: DisputeVerdictResult["verdict"]): string {
  return verdict.replace("_", " ");
}

export function DisputeVerdictResultCard({ result }: DisputeVerdictResultCardProps) {
  return (
    <article className="result-card" aria-label="Mock dispute resolution result">
      <div className="result-card-header">
        <div>
          <p className="panel-label">Mock resolution</p>
          <h3>{formatVerdict(result.verdict)}</h3>
        </div>
        <span className={`verdict-pill verdict-pill-${result.verdict}`}>{result.confidence}</span>
      </div>

      <p className="result-summary">{result.reason}</p>

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
