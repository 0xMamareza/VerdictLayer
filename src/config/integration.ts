export type IntegrationMode = "mock" | "genlayer";

// Keep runtime mode static until the real GenLayer client is implemented.
// Env-based mode switching will be added later after GenLayer integration is ready.
export const INTEGRATION_MODE: IntegrationMode = "mock";
