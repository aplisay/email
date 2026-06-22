/** A single email address, as a bare string ("a@b.com" or "Name <a@b.com>")
 *  or a structured object. */
export type Address = string | { email: string; name?: string };

export interface EmailMessage {
  /** Sender. Optional if a default `from` was given to the client. */
  from?: Address;
  to: Address | Address[];
  cc?: Address | Address[];
  bcc?: Address | Address[];
  replyTo?: Address;
  subject: string;
  /** Plain-text body (always required — the accessible, deliverable baseline). */
  text: string;
  /** Optional HTML body. */
  html?: string;
  /** Extra custom headers. */
  headers?: Record<string, string>;
}

export interface SendResult {
  /** Provider that handled the send (e.g. "smtp2go"). */
  provider: string;
  /** Provider message id, when available. */
  id?: string;
  /** Recipient emails the provider accepted. */
  accepted: string[];
}

/** A transport that knows how to deliver a message. Add a provider by
 *  implementing this and registering it in providers/index.ts. */
export interface EmailProvider {
  readonly name: string;
  send(message: EmailMessage): Promise<SendResult>;
}

export interface EmailClientConfig {
  /** EMAIL_SEND_TYPE — provider id (e.g. "smtp2go"). Defaults to "console". */
  type?: string;
  /** EMAIL_SEND_URL — provider endpoint override (optional). */
  url?: string;
  /** EMAIL_SEND_KEY — provider API key. */
  key?: string;
  /** Default sender, used when a message omits `from`. */
  from?: Address;
  /** Injectable fetch (for tests). Defaults to the global fetch. */
  fetch?: typeof fetch;
}

export interface EmailClient {
  /** The resolved provider name. */
  readonly provider: string;
  send(message: EmailMessage): Promise<SendResult>;
}
