import test from "node:test";
import assert from "assert";
import { Noble } from "./noble";
import { MonetaryValue } from "./monetaryvalue";

test("Noble", async (t) => {
  await t.test("constructor", async () => {
    const cost = new MonetaryValue().add("blue", 3).add("white", 3).add("red", 4);

    const noble = new Noble(3, cost);

    assert.deepStrictEqual(cost, noble.cost);
    assert.deepStrictEqual(3, noble.points);
  });
});
