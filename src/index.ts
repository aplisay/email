import type { EmailClient, EmailClientConfig, EmailMessage, SendResult } from "./types.js";
import { configFromEnv } from "./config.js";
import { createProvider } from "./providers/index.js";

export type { Address, EmailMessage, SendResult, EmailProvider, EmailClient, EmailClientConfig } from "./types.js";
export { EmailError } from "./errors.js";
export { SUPPORTED_PROVIDERS, createProvider, createSmtp2goProvider, createConsoleProvider } from "./providers/index.js";
export { configFromEnv } from "./config.js";

/**
 * Create an email client. Reads EMAIL_SEND_TYPE / EMAIL_SEND_URL / EMAIL_SEND_KEY
 * (and an optional EMAIL_FROM_ADDRESS / EMAIL_FROM_NAME default sender) from the
 * environment; pass `overrides` to set them explicitly.
 *
 * @example
 *   import { createEmailClient } from "@aplisay/email";
 *   const email = createEmailClient();
 *   await email.send({ to: "a@b.com", subject: "Hi", text: "Hello" });
 */
export function createEmailClient(overrides: Partial<EmailClientConfig> = {}): EmailClient {
  const config: EmailClientConfig = { ...configFromEnv(), ...overrides };
  const provider = createProvider(config);

  return {
    provider: provider.name,
    send(message: EmailMessage): Promise<SendResult> {
      // Apply the default sender unless the message supplies its own.
      return provider.send(message.from ? message : { ...message, from: config.from });
    },
  };
}
