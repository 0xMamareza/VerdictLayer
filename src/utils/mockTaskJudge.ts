import type { TaskVerdictInput, TaskVerdictResult, TaskVerdictStatus } from "../types/verdict";

function hasValue(value: string): boolean {
  return value.trim().length > 0;
}

function getRequirementsBonus(taskRequirements: string): number {
  const normalizedRequirements: string = taskRequirements.toLowerCase();

  if (
    normalizedRequirements.includes("screenshot") ||
    normalizedRequirements.includes("readme") ||
    normalizedRequirements.includes("demo")
  ) {
    return 10;
  }

  return 0;
}

function getStatus(score: number): TaskVerdictStatus {
  if (score >= 80) {
    return "accepted";
  }

  if (score >= 55) {
    return "needs_review";
  }

  if (score >= 25) {
    return "incomplete";
  }

  return "rejected";
}

function getFeedback(status: TaskVerdictStatus): string {
  if (status === "accepted") {
    return "The submission includes strong proof and appears ready for acceptance in this mock review.";
  }

  if (status === "needs_review") {
    return "The submission has useful proof but still needs a closer human review before acceptance.";
  }

  if (status === "incomplete") {
    return "The submission has partial evidence, but key proof is missing for a confident review.";
  }

  return "The submission does not provide enough proof to support the task requirements.";
}

function getMissingItems(input: TaskVerdictInput): string[] {
  const missingItems: string[] = [];

  if (!hasValue(input.contractAddress)) {
    missingItems.push("contract address");
  }

  if (!hasValue(input.transactionHash)) {
    missingItems.push("transaction hash");
  }

  if (!hasValue(input.githubRepoUrl)) {
    missingItems.push("GitHub repo URL");
  }

  if (input.explanation.trim().length < 80) {
    missingItems.push("detailed explanation");
  }

  return missingItems;
}

export function mockTaskJudge(input: TaskVerdictInput): TaskVerdictResult {
  let score = 0;

  if (hasValue(input.contractAddress)) {
    score += 25;
  }

  if (hasValue(input.transactionHash)) {
    score += 25;
  }

  if (hasValue(input.githubRepoUrl)) {
    score += 20;
  }

  if (input.explanation.trim().length >= 80) {
    score += 20;
  }

  score += getRequirementsBonus(input.taskRequirements);

  const status: TaskVerdictStatus = getStatus(score);

  return {
    status,
    score,
    feedback: getFeedback(status),
    missingItems: getMissingItems(input),
    generatedAt: input.generatedAt,
  };
}
