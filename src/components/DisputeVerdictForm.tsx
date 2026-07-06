import { type FormEvent, useState } from "react";
import { verdictLayerClient } from "../lib/verdictLayerClient";
import type { DisputeVerdictResult } from "../types/verdict";
import { DisputeVerdictResultCard } from "./DisputeVerdictResultCard";

export function DisputeVerdictForm() {
  const [disputeTitle, setDisputeTitle] = useState<string>("");
  const [sideAClaim, setSideAClaim] = useState<string>("");
  const [sideBClaim, setSideBClaim] = useState<string>("");
  const [evidence, setEvidence] = useState<string>("");
  const [decisionRule, setDecisionRule] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [result, setResult] = useState<DisputeVerdictResult | null>(null);

  function validateInputs(): string | null {
    if (disputeTitle.trim().length === 0) {
      return "Enter a dispute title to generate a mock resolution.";
    }

    if (sideAClaim.trim().length === 0) {
      return "Enter Side A's claim.";
    }

    if (sideBClaim.trim().length === 0) {
      return "Enter Side B's claim.";
    }

    if (evidence.trim().length === 0) {
      return "Add evidence for the dispute.";
    }

    if (decisionRule.trim().length === 0) {
      return "Add a decision rule for the dispute.";
    }

    return null;
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>): void {
    event.preventDefault();

    const validationMessage: string | null = validateInputs();

    if (validationMessage) {
      setErrorMessage(validationMessage);
      setResult(null);
      return;
    }

    setErrorMessage(null);
    setResult(
      verdictLayerClient.submitDisputeVerdict({
        disputeTitle: disputeTitle.trim(),
        sideAClaim: sideAClaim.trim(),
        sideBClaim: sideBClaim.trim(),
        evidence: evidence.trim(),
        decisionRule: decisionRule.trim(),
      }),
    );
  }

  return (
    <div className="dispute-flow">
      <form className="claim-form" onSubmit={handleSubmit}>
        <label className="form-field">
          <span>Dispute title</span>
          <input
            type="text"
            value={disputeTitle}
            onChange={(event) => setDisputeTitle(event.target.value)}
            placeholder="Example: Milestone payment dispute"
          />
        </label>

        <div className="dispute-grid" aria-label="Dispute claims">
          <label className="form-field">
            <span>Side A claim</span>
            <textarea
              value={sideAClaim}
              onChange={(event) => setSideAClaim(event.target.value)}
              placeholder="Describe Side A's position."
              rows={5}
            />
          </label>

          <label className="form-field">
            <span>Side B claim</span>
            <textarea
              value={sideBClaim}
              onChange={(event) => setSideBClaim(event.target.value)}
              placeholder="Describe Side B's position."
              rows={5}
            />
          </label>
        </div>

        <label className="form-field">
          <span>Evidence</span>
          <textarea
            value={evidence}
            onChange={(event) => setEvidence(event.target.value)}
            placeholder="Paste the relevant evidence, messages, delivery notes, links, or agreement details."
            rows={6}
          />
        </label>

        <label className="form-field">
          <span>Decision rule</span>
          <textarea
            value={decisionRule}
            onChange={(event) => setDecisionRule(event.target.value)}
            placeholder="Describe the rule the resolver should apply."
            rows={4}
          />
        </label>

        {errorMessage ? <p className="form-error">{errorMessage}</p> : null}

        <button className="module-button form-submit" type="submit">
          Generate Mock Resolution
        </button>
      </form>

      <p className="helper-text">
        This is a local mock resolution. GenLayer Intelligent Contract integration comes later.
      </p>

      {result ? <DisputeVerdictResultCard result={result} /> : null}
    </div>
  );
}
