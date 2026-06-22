import type { EmailClientConfig, EmailProvider } from "../types.js";
/** Provider ids this build supports. */
export declare const SUPPORTED_PROVIDERS: readonly ["smtp2go", "console"];
/** Resolve a provider from config (driven by EMAIL_SEND_TYPE). */
export declare function createProvider(config: EmailClientConfig): EmailProvider;
export { createSmtp2goProvider } from "./smtp2go.js";
export { createConsoleProvider } from "./console.js";
