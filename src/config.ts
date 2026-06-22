import type { EmailClientConfig } from "./types.js";

/**
 * Build client config from environment variables:
 *   EMAIL_SEND_TYPE   provider id (e.g. "smtp2go"); defaults to "console"
 *   EMAIL_SEND_URL    provider endpoint override (optional)
 *   EMAIL_SEND_KEY    provider API key
 *   EMAIL_FROM_ADDRESS / EMAIL_FROM_NAME   optional default sender
 */
export function configFromEnv(env: NodeJS.ProcessEnv = process.env): EmailClientConfig {
  const fromAddress = env.EMAIL_FROM_ADDRESS?.trim();
  return {
    type: env.EMAIL_SEND_TYPE?.trim() || undefined,
    url: env.EMAIL_SEND_URL?.trim() || undefined,
    key: env.EMAIL_SEND_KEY?.trim() || undefined,
    from: fromAddress
      ? { email: fromAddress, name: env.EMAIL_FROM_NAME?.trim() || undefined }
      : undefined,
  };
}
