import type { Address, EmailProvider } from "../types.js";
export interface Smtp2goOptions {
    key: string;
    /** Endpoint override (EMAIL_SEND_URL). Defaults to the public API. */
    url?: string;
    /** Default sender, used when a message omits `from`. */
    from?: Address;
    /** Injectable fetch (tests). Defaults to global fetch. */
    fetch?: typeof fetch;
}
/**
 * SMTP2GO transport — https://developers.smtp2go.com/docs/send-an-email
 * POST {url} with header `X-Smtp2go-Api-Key` and a JSON body of
 * { sender, to[], subject, text_body, html_body? }.
 */
export declare function createSmtp2goProvider(options: Smtp2goOptions): EmailProvider;
