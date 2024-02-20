import test from "node:test";
import assert from "assert";
import { Card } from "./card";
import { MonetaryValue } from "./monetaryvalue";

test("Card", async (t) => {
  await t.test("constructor", async () => {
    const cost = new MonetaryValue().add("blue", 1).add("white", 1).add("red", 4);
    const purchasingPower = new MonetaryValue("red", 1);

    const card = new Card(1, 0, cost, purchasingPower);

    assert.deepStrictEqual(cost, card.cost);
    assert.deepStrictEqual(purchasingPower, card.purchasingPower);
    assert.deepStrictEqual(1, card.level);
    assert.deepStrictEqual(0, card.points);
  });
});
