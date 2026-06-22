import type { Address } from "./types.js";
/** Render an address as an RFC-822 string ("Name <a@b.com>" or "a@b.com"). */
export declare function formatAddress(address: Address): string;
/** Extract the bare email from an address (best-effort for "Name <a@b.com>"). */
export declare function addressEmail(address: Address): string;
/** Normalise an optional address / address[] into an array. */
export declare function toAddressList(value?: Address | Address[]): Address[];
