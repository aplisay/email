import { test } from "node:test";
import assert from "node:assert/strict";
import { createEmailClient, EmailError } from "../dist/index.js";

function stubFetch(captured, response, ok = true, status = 200) {
  return async (url, init) => {
    captured.url = url;
    captured.init = init;
    return { ok, status, json: async () => response };
  };
}

test("smtp2go: maps a message to the SMTP2GO payload + headers", async () => {
  const cap = {};
  const email = createEmailClient({
    type: "smtp2go",
    key: "api-test",
    from: { email: "hello@polite.ai", name: "polite.ai" },
    fetch: stubFetch(cap, { data: { succeeded: 1, failed: 0, email_id: "abc-123" } }),
  });

  const result = await email.send({ to: "user@example.com", subject: "Confirm", text: "Hello" });

  assert.equal(cap.url, "https://api.smtp2go.com/v3/email/send");
  assert.equal(cap.init.headers["X-Smtp2go-Api-Key"], "api-test");
  const body = JSON.parse(cap.init.body);
  assert.equal(body.sender, "polite.ai <hello@polite.ai>");
  assert.deepEqual(body.to, ["user@example.com"]);
  assert.equal(body.text_body, "Hello");
  assert.ok(!("html_body" in body), "no html_body for text-only message");
  assert.equal(result.id, "abc-123");
  assert.deepEqual(result.accepted, ["user@example.com"]);
});

test("smtp2go: html, cc, reply-to, and EMAIL_SEND_URL override", async () => {
  const cap = {};
  const email = createEmailClient({
    type: "smtp2go",
    key: "k",
    url: "https://proxy.internal/send",
    fetch: stubFetch(cap, { data: { failed: 0, email_id: "x" } }),
  });
  await email.send({
    from: "a@b.com",
    to: ["one@x.com", { email: "two@x.com", name: "Two" }],
    cc: "cc@x.com",
    replyTo: { email: "reply@x.com", name: "Reply" },
    subject: "S",
    text: "T",
    html: "<p>T</p>",
  });
  assert.equal(cap.url, "https://proxy.internal/send");
  const body = JSON.parse(cap.init.body);
  assert.deepEqual(body.to, ["one@x.com", "Two <two@x.com>"]);
  assert.deepEqual(body.cc, ["cc@x.com"]);
  assert.equal(body.html_body, "<p>T</p>");
  assert.deepEqual(body.custom_headers, [{ header: "Reply-To", value: "Reply <reply@x.com>" }]);
});

test("smtp2go: non-2xx → EmailError with status", async () => {
  const cap = {};
  const email = createEmailClient({
    type: "smtp2go",
    key: "k",
    from: "a@b.com",
    fetch: stubFetch(cap, { error: "bad key" }, false, 401),
  });
  await assert.rejects(
    () => email.send({ to: "u@x.com", subject: "S", text: "T" }),
    (err) => err instanceof EmailError && err.status === 401,
  );
});

test("smtp2go: partial recipient failure → EmailError", async () => {
  const cap = {};
  const email = createEmailClient({
    type: "smtp2go",
    key: "k",
    from: "a@b.com",
    fetch: stubFetch(cap, { data: { succeeded: 0, failed: 1, failures: ["u@x.com"] } }),
  });
  await assert.rejects(() => email.send({ to: "u@x.com", subject: "S", text: "T" }), EmailError);
});

test("config: smtp2go without a key is a clear error", () => {
  assert.throws(() => createEmailClient({ type: "smtp2go" }), /EMAIL_SEND_KEY is required/);
});

test("console: default provider accepts", async () => {
  const email = createEmailClient({ type: "console" });
  assert.equal(email.provider, "console");
  const res = await email.send({ from: "a@b.com", to: "u@x.com", subject: "S", text: "T" });
  assert.deepEqual(res.accepted, ["u@x.com"]);
});

test("unknown provider type is rejected", () => {
  assert.throws(() => createEmailClient({ type: "carrier-pigeon" }), /Unknown EMAIL_SEND_TYPE/);
});
