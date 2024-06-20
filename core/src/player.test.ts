import test from "node:test";
import assert from "assert";
import { Player } from "./player";
import { MonetaryValue } from "./monetaryvalue";
import { Card } from "./card";
import { CardBuilder } from "./builders/cardbuilder";

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

  await t.test("addReservedCard", async (t) => {
    await t.test("adds the card to the reserved cards", async () => {
      const player = new Player();
      const card = new CardBuilder().build();

      player.addReservedCard(card);

      assert.deepEqual(player.reservedCards, [card]);
    });
  });

  await t.test("ableToReserveCard", async (t) => {
    await t.test("returns true when user has 2 card", async () => {
      const player = new Player();

      for (let i = 0; i < 2; i++) {
        const card = new CardBuilder().build();
        player.addReservedCard(card);
      }

      assert.deepEqual(player.ableToReserveCard, true);
    });

    await t.test("returns false when user has 3 card", async () => {
      const player = new Player();

      for (let i = 0; i < 3; i++) {
        const card = new CardBuilder().build();
        player.addReservedCard(card);
      }

      assert.deepEqual(player.ableToReserveCard, false);
    });
  });
});
