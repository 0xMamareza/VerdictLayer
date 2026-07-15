const WALLET_REJECTION_MESSAGE =
  "Transaction was rejected in your wallet. No transaction was submitted.";
const GENERIC_ERROR_MESSAGE = "GenLayer transaction failed. Please try again.";
const MAX_MESSAGE_LENGTH = 240;

type CollectedErrorDetails = {
  codes: Array<number | string>;
  names: string[];
  shortMessages: string[];
  messages: string[];
  details: string[];
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function pushUnique(values: string[], value: unknown): void {
  if (typeof value !== "string") {
    return;
  }

  const normalizedValue = value.trim();

  if (normalizedValue.length > 0 && !values.includes(normalizedValue)) {
    values.push(normalizedValue);
  }
}

function collectErrorDetails(
  error: unknown,
  collected: CollectedErrorDetails,
  seen: Set<object>,
  depth: number,
): void {
  if (depth > 4) {
    return;
  }

  if (typeof error === "string") {
    pushUnique(collected.messages, error);
    return;
  }

  if (!isRecord(error) || seen.has(error)) {
    return;
  }

  seen.add(error);

  if (typeof error.code === "number" || typeof error.code === "string") {
    collected.codes.push(error.code);
  }

  pushUnique(collected.names, error.name);
  pushUnique(collected.shortMessages, error.shortMessage);
  pushUnique(collected.messages, error.message);

  if (typeof error.details === "string") {
    pushUnique(collected.details, error.details);
  } else if (isRecord(error.details)) {
    collectErrorDetails(error.details, collected, seen, depth + 1);
  }

  if (isRecord(error.cause) || typeof error.cause === "string") {
    collectErrorDetails(error.cause, collected, seen, depth + 1);
  }
}

function isWalletRejection(collected: CollectedErrorDetails): boolean {
  const hasRejectionCode = collected.codes.some((code) => {
    const normalizedCode = String(code).trim().toLowerCase();
    return normalizedCode === "4001" || normalizedCode === "action_rejected";
  });

  if (hasRejectionCode) {
    return true;
  }

  const errorText = [
    ...collected.names,
    ...collected.shortMessages,
    ...collected.messages,
    ...collected.details,
  ]
    .join(" ")
    .toLowerCase();
  const compactErrorText = errorText.replace(/[^a-z0-9]/g, "");

  return (
    errorText.includes("user rejected") ||
    errorText.includes("request rejected") ||
    errorText.includes("rejected the request") ||
    errorText.includes("user denied") ||
    errorText.includes("denied transaction") ||
    compactErrorText.includes("userrejected") ||
    compactErrorText.includes("requestrejected") ||
    compactErrorText.includes("rejectedrequest") ||
    compactErrorText.includes("userdenied") ||
    compactErrorText.includes("actionrejected")
  );
}

function cleanMessage(message: string): string {
  const firstLine = message.split(/\r?\n/, 1)[0] ?? "";
  const withoutTechnicalSuffix = firstLine.replace(/\s*(?:Details|Version):.*$/i, "");
  const withoutSdkVersions = withoutTechnicalSuffix.replace(
    /\b[a-z][a-z0-9_-]*@\d+(?:\.\d+){1,3}(?:[-+][a-z0-9.-]+)?\b/gi,
    "",
  );
  const conciseMessage = withoutSdkVersions.replace(/\s+/g, " ").trim();

  if (conciseMessage.length <= MAX_MESSAGE_LENGTH) {
    return conciseMessage;
  }

  return `${conciseMessage.slice(0, MAX_MESSAGE_LENGTH - 3).trimEnd()}...`;
}

export function getUserFacingGenLayerError(error: unknown): string {
  const collected: CollectedErrorDetails = {
    codes: [],
    names: [],
    shortMessages: [],
    messages: [],
    details: [],
  };

  collectErrorDetails(error, collected, new Set<object>(), 0);

  if (isWalletRejection(collected)) {
    return WALLET_REJECTION_MESSAGE;
  }

  const preferredMessage =
    collected.shortMessages[0] ?? collected.messages[0] ?? collected.details[0];

  if (!preferredMessage) {
    return GENERIC_ERROR_MESSAGE;
  }

  const cleanPreferredMessage = cleanMessage(preferredMessage);
  return cleanPreferredMessage.length > 0 ? cleanPreferredMessage : GENERIC_ERROR_MESSAGE;
}
