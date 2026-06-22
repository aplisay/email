import type { EmailClientConfig } from "./types.js";
/**
 * Build client config from environment variables:
 *   EMAIL_SEND_TYPE   provider id (e.g. "smtp2go"); defaults to "console"
 *   EMAIL_SEND_URL    provider endpoint override (optional)
 *   EMAIL_SEND_KEY    provider API key
 *   EMAIL_FROM_ADDRESS / EMAIL_FROM_NAME   optional default sender
 */
export declare function configFromEnv(env?: NodeJS.ProcessEnv): EmailClientConfig;
