/** Error thrown for any send/config failure. `status` is the provider HTTP
 *  status when the failure came from the provider API. */
export declare class EmailError extends Error {
    readonly cause?: unknown;
    readonly status?: number;
    constructor(message: string, options?: {
        cause?: unknown;
        status?: number;
    });
}
