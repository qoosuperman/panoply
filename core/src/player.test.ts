import test from "node:test";
import assert from "assert";
import { Player } from "./player";
import { MonetaryValue } from "./monetaryvalue";
import { Card } from "./card";

test("Player", async (t) => {
  await t.test("cardPurchasingPower", async (t) => {
    await t.test("equals the combined purchasing power of all owned cards", async () => {
      const player = new Player();
      const cardValues = [new MonetaryValue().add("green", 1), new MonetaryValue().add("blue", 1)];

      player.cards = cardValues.map((value) => new Card(1, 1, new MonetaryValue(), value));

      const expectedPurchasingPower = cardValues.reduce((total, value) => total.add(value), new MonetaryValue());

      assert.deepEqual(player.cardPurchasingPower, expectedPurchasingPower);
    });
  });
});
