import type { Address } from "./types.js";

/** Render an address as an RFC-822 string ("Name <a@b.com>" or "a@b.com"). */
export function formatAddress(address: Address): string {
  if (typeof address === "string") return address;
  return address.name ? `${address.name} <${address.email}>` : address.email;
}

/** Extract the bare email from an address (best-effort for "Name <a@b.com>"). */
export function addressEmail(address: Address): string {
  if (typeof address !== "string") return address.email;
  const match = address.match(/<([^>]+)>/);
  return (match ? match[1] : address).trim();
}

/** Normalise an optional address / address[] into an array. */
export function toAddressList(value?: Address | Address[]): Address[] {
  if (value == null) return [];
  return Array.isArray(value) ? value : [value];
}
