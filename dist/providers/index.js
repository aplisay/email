import { EmailError } from "../errors.js";
import { createSmtp2goProvider } from "./smtp2go.js";
import { createConsoleProvider } from "./console.js";
/** Provider ids this build supports. */
export const SUPPORTED_PROVIDERS = ["smtp2go", "console"];
/** Resolve a provider from config (driven by EMAIL_SEND_TYPE). */
export function createProvider(config) {
    const type = (config.type || "console").toLowerCase();
    switch (type) {
        case "smtp2go": {
            if (!config.key) {
                throw new EmailError('EMAIL_SEND_KEY is required when EMAIL_SEND_TYPE="smtp2go".');
            }
            return createSmtp2goProvider({
                key: config.key,
                url: config.url,
                from: config.from,
                fetch: config.fetch,
            });
        }
        case "console":
            return createConsoleProvider();
        default:
            throw new EmailError(`Unknown EMAIL_SEND_TYPE "${type}". Supported: ${SUPPORTED_PROVIDERS.join(", ")}.`);
    }
}
export { createSmtp2goProvider } from "./smtp2go.js";
export { createConsoleProvider } from "./console.js";
