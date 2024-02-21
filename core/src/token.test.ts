import test from "node:test";
import assert from "assert";
import { Token } from "./token";
import { MonetaryValue } from "./monetaryvalue";

test("Noble", async (t) => {
  await t.test("constructor", async () => {
    const value = new MonetaryValue().add("blue", 1);

    const token = new Token(value);

    assert.deepStrictEqual(value, token.value);
  });
});
