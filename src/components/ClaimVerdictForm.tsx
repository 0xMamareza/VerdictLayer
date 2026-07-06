import { type FormEvent, useState } from "react";
import { verdictLayerClient } from "../lib/verdictLayerClient";
import type { ClaimVerdictResult } from "../types/verdict";
import { VerdictResultCard } from "./VerdictResultCard";

const emptySourceUrls: readonly string[] = ["", "", ""];

export function ClaimVerdictForm() {
  const [claim, setClaim] = useState<string>("");
  const [sourceUrls, setSourceUrls] = useState<string[]>([...emptySourceUrls]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [result, setResult] = useState<ClaimVerdictResult | null>(null);

  function updateSourceUrl(index: number, value: string): void {
    setSourceUrls((currentSourceUrls) =>
      currentSourceUrls.map((sourceUrl, sourceIndex) =>
        sourceIndex === index ? value : sourceUrl,
      ),
    );
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>): void {
    event.preventDefault();

    const trimmedClaim: string = claim.trim();
    const hasSourceUrl: boolean = sourceUrls.some((sourceUrl) => sourceUrl.trim().length > 0);

    if (trimmedClaim.length === 0) {
      setErrorMessage("Enter a claim to generate a mock verdict.");
      setResult(null);
      return;
    }

    if (!hasSourceUrl) {
      setErrorMessage("Add at least one source URL.");
      setResult(null);
      return;
    }

    setErrorMessage(null);
    setResult(
      verdictLayerClient.submitClaimVerdict({
        claim: trimmedClaim,
        sourceUrl1: sourceUrls[0] ?? "",
        sourceUrl2: sourceUrls[1] ?? "",
        sourceUrl3: sourceUrls[2] ?? "",
      }),
    );
  }

  return (
    <div className="claim-flow">
      <form className="claim-form" onSubmit={handleSubmit}>
        <label className="form-field">
          <span>Claim</span>
          <textarea
            value={claim}
            onChange={(event) => setClaim(event.target.value)}
            placeholder="Example: GenLayer testnet is live"
            rows={5}
          />
        </label>

        <div className="source-grid" aria-label="Evidence sources">
          {sourceUrls.map((sourceUrl, index) => (
            <label className="form-field" key={`source-url-${index + 1}`}>
              <span>Source URL {index + 1}</span>
              <input
                type="url"
                value={sourceUrl}
                onChange={(event) => updateSourceUrl(index, event.target.value)}
                placeholder="https://example.com/evidence"
              />
            </label>
          ))}
        </div>

        {errorMessage ? <p className="form-error">{errorMessage}</p> : null}

        <button className="module-button form-submit" type="submit">
          Generate Mock Verdict
        </button>
      </form>

      <p className="helper-text">
        This is a local mock verdict. GenLayer Intelligent Contract integration comes later.
      </p>

      {result ? <VerdictResultCard result={result} /> : null}
    </div>
  );
}
