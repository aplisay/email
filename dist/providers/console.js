import { addressEmail, toAddressList } from "../address.js";
/** Dev/fallback transport: logs the message instead of sending it. Used when
 *  EMAIL_SEND_TYPE is unset, so the flow works locally with no credentials. */
export function createConsoleProvider() {
    return {
        name: "console",
        async send(message) {
            const to = toAddressList(message.to).map(addressEmail);
            console.info(`\n──────── [@aplisay/email:console] ────────\n` +
                `To:      ${to.join(", ")}\n` +
                `Subject: ${message.subject}\n\n` +
                `${message.text}\n` +
                `──────────────────────────────────────────\n`);
            return { provider: "console", accepted: to };
        },
    };
}
