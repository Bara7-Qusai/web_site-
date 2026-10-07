import assert from "node:assert/strict";
import { test } from "node:test";
import { inquirySchema } from "../src/lib/inquiry.ts";
import { matches, normalize } from "../src/lib/search.ts";

test("normalize folds Arabic letter variants and subscripts", () => {
  assert.equal(normalize("أمينوفيرت"), normalize("امينوفيرت"));
  assert.equal(normalize("الكنوز الذائبة"), "الكنوز الذايبه");
  assert.equal(normalize("P₂O₅"), "p2o5");
  assert.equal(normalize("كنوز ⁦18-46-5⁩"), "كنوز 18-46-5");
});

test("matches requires every term", () => {
  const hay = normalize("Al-Kunooz Soluble NPK 20-20-20 | الكنوز الذائب");
  assert.ok(matches(hay, "npk 20-20"));
  assert.ok(matches(hay, "الكنوز"));
  assert.ok(!matches(hay, "npk calcium"));
  assert.ok(matches(hay, "   "));
});

const valid = { type: "product", name: "Ahmed", phone: "+249 912 345 678", email: "", message: "I need the price list please." };

test("inquiry schema accepts a valid inquiry", () => {
  assert.ok(inquirySchema.safeParse(valid).success);
});

test("inquiry schema requires a phone or an email", () => {
  const r = inquirySchema.safeParse({ ...valid, phone: "" });
  assert.ok(!r.success);
  assert.equal(r.error.issues[0].message, "contact");
});

test("inquiry schema rejects bad email, short message and filled honeypot", () => {
  assert.ok(!inquirySchema.safeParse({ ...valid, email: "nope" }).success);
  assert.ok(!inquirySchema.safeParse({ ...valid, message: "hi" }).success);
  assert.ok(!inquirySchema.safeParse({ ...valid, website: "spam" }).success);
});
