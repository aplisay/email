/** Error thrown for any send/config failure. `status` is the provider HTTP
 *  status when the failure came from the provider API. */
export class EmailError extends Error {
  readonly cause?: unknown;
  readonly status?: number;

  constructor(message: string, options: { cause?: unknown; status?: number } = {}) {
    super(message);
    this.name = "EmailError";
    this.cause = options.cause;
    this.status = options.status;
  }
}
