import { type FormEvent, useState } from "react";
import { verdictLayerClient } from "../lib/verdictLayerClient";
import type { TaskVerdictResult } from "../types/verdict";
import { TaskVerdictResultCard } from "./TaskVerdictResultCard";

export function TaskVerdictForm() {
  const [taskTitle, setTaskTitle] = useState<string>("");
  const [taskRequirements, setTaskRequirements] = useState<string>("");
  const [contractAddress, setContractAddress] = useState<string>("");
  const [transactionHash, setTransactionHash] = useState<string>("");
  const [githubRepoUrl, setGithubRepoUrl] = useState<string>("");
  const [explanation, setExplanation] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [result, setResult] = useState<TaskVerdictResult | null>(null);

  function hasProofField(): boolean {
    return [contractAddress, transactionHash, githubRepoUrl, explanation].some(
      (value) => value.trim().length > 0,
    );
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault();

    const trimmedTaskTitle: string = taskTitle.trim();
    const trimmedTaskRequirements: string = taskRequirements.trim();

    if (trimmedTaskTitle.length === 0) {
      setErrorMessage("Enter a task title to generate a mock review.");
      setSubmitError(null);
      setResult(null);
      return;
    }

    if (trimmedTaskRequirements.length === 0) {
      setErrorMessage("Enter task requirements to generate a mock review.");
      setSubmitError(null);
      setResult(null);
      return;
    }

    if (!hasProofField()) {
      setErrorMessage("Add at least one proof field before generating a mock review.");
      setSubmitError(null);
      setResult(null);
      return;
    }

    setErrorMessage(null);
    setSubmitError(null);
    setIsSubmitting(true);

    try {
      const nextResult: TaskVerdictResult = await verdictLayerClient.submitTaskVerdict({
        taskTitle: trimmedTaskTitle,
        taskRequirements: trimmedTaskRequirements,
        contractAddress,
        transactionHash,
        githubRepoUrl,
        explanation,
      });
      setResult(nextResult);
    } catch (error: unknown) {
      setSubmitError(error instanceof Error ? error.message : "Unable to generate mock review.");
      setResult(null);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="task-flow">
      <form className="claim-form" onSubmit={handleSubmit}>
        <label className="form-field">
          <span>Task title</span>
          <input
            type="text"
            value={taskTitle}
            onChange={(event) => setTaskTitle(event.target.value)}
            placeholder="Example: Deploy verification contract"
          />
        </label>

        <label className="form-field">
          <span>Task requirements</span>
          <textarea
            value={taskRequirements}
            onChange={(event) => setTaskRequirements(event.target.value)}
            placeholder="Describe acceptance criteria, proof requirements, demo, README, or screenshots."
            rows={5}
          />
        </label>

        <div className="proof-grid" aria-label="Submission proof">
          <label className="form-field">
            <span>Contract address</span>
            <input
              type="text"
              value={contractAddress}
              onChange={(event) => setContractAddress(event.target.value)}
              placeholder="0x..."
            />
          </label>

          <label className="form-field">
            <span>Transaction hash</span>
            <input
              type="text"
              value={transactionHash}
              onChange={(event) => setTransactionHash(event.target.value)}
              placeholder="0x..."
            />
          </label>

          <label className="form-field">
            <span>GitHub repo URL</span>
            <input
              type="url"
              value={githubRepoUrl}
              onChange={(event) => setGithubRepoUrl(event.target.value)}
              placeholder="https://github.com/example/repo"
            />
          </label>
        </div>

        <label className="form-field">
          <span>Explanation</span>
          <textarea
            value={explanation}
            onChange={(event) => setExplanation(event.target.value)}
            placeholder="Explain what was built, how it satisfies the task, and where reviewers should look."
            rows={5}
          />
        </label>

        {errorMessage ? <p className="form-error">{errorMessage}</p> : null}
        {submitError ? <p className="form-error">{submitError}</p> : null}

        <button className="module-button form-submit" type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Reviewing..." : "Generate Mock Review"}
        </button>
      </form>

      <p className="helper-text">
        This is a local mock review. GenLayer Intelligent Contract integration comes later.
      </p>
      <p className="helper-text">
        Async-ready: this flow is prepared for future wallet-signed GenLayer transactions.
      </p>

      {result ? <TaskVerdictResultCard result={result} /> : null}
    </div>
  );
}
