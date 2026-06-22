import { addressEmail, formatAddress, toAddressList } from "../address.js";
import { EmailError } from "../errors.js";
const DEFAULT_URL = "https://api.smtp2go.com/v3/email/send";
/**
 * SMTP2GO transport — https://developers.smtp2go.com/docs/send-an-email
 * POST {url} with header `X-Smtp2go-Api-Key` and a JSON body of
 * { sender, to[], subject, text_body, html_body? }.
 */
export function createSmtp2goProvider(options) {
    const url = options.url || DEFAULT_URL;
    const doFetch = options.fetch ?? globalThis.fetch;
    return {
        name: "smtp2go",
        async send(message) {
            const from = message.from ?? options.from;
            if (!from) {
                throw new EmailError("No sender: pass message.from or configure a default `from`.");
            }
            const to = toAddressList(message.to);
            if (to.length === 0)
                throw new EmailError("No recipients: `to` is empty.");
            const body = {
                sender: formatAddress(from),
                to: to.map(formatAddress),
                subject: message.subject,
                text_body: message.text,
            };
            if (message.html)
                body.html_body = message.html;
            const cc = toAddressList(message.cc);
            if (cc.length)
                body.cc = cc.map(formatAddress);
            const bcc = toAddressList(message.bcc);
            if (bcc.length)
                body.bcc = bcc.map(formatAddress);
            const customHeaders = [];
            if (message.replyTo) {
                customHeaders.push({ header: "Reply-To", value: formatAddress(message.replyTo) });
            }
            for (const [header, value] of Object.entries(message.headers ?? {})) {
                customHeaders.push({ header, value });
            }
            if (customHeaders.length)
                body.custom_headers = customHeaders;
            let res;
            try {
                res = await doFetch(url, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Accept: "application/json",
                        "X-Smtp2go-Api-Key": options.key,
                    },
                    body: JSON.stringify(body),
                });
            }
            catch (cause) {
                throw new EmailError("SMTP2GO request failed (network error).", { cause });
            }
            const payload = (await res.json().catch(() => null));
            if (!res.ok) {
                const detail = payload?.error ?? payload?.data?.error;
                throw new EmailError(`SMTP2GO error (${res.status})${detail ? `: ${detail}` : ""}.`, {
                    status: res.status,
                    cause: payload,
                });
            }
            const data = payload?.data ?? {};
            if (typeof data.failed === "number" && data.failed > 0) {
                throw new EmailError(`SMTP2GO rejected ${data.failed} recipient(s): ${JSON.stringify(data.failures ?? [])}`, { status: res.status, cause: payload });
            }
            return { provider: "smtp2go", id: data.email_id, accepted: to.map(addressEmail) };
        },
    };
}
