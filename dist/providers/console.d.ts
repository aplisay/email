import type { EmailProvider } from "../types.js";
/** Dev/fallback transport: logs the message instead of sending it. Used when
 *  EMAIL_SEND_TYPE is unset, so the flow works locally with no credentials. */
export declare function createConsoleProvider(): EmailProvider;
