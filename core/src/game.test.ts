import test from "node:test";
import assert from "assert";
import { ComponentSetFactory } from "./factories/componentsetfactory";
import Game from "./game";

test("Game", async (t) => {
  await t.test("constructor", async (t) => {
    await t.test("with playersCount and componentSet arguments", async () => {
      const playersCount = 4;
      const componentSet = ComponentSetFactory.withNoblesCount(3)
        .withCardsCountEveryLevel(3)
        .withTokensCount(5)
        .apply();
      const game = new Game(playersCount, componentSet);
      // with game created event
      assert.equal(game.events.length, 1);
      // players
      assert.equal(game.players.length, playersCount);
      // decks
      for (let i = 0; i < game.decks.length; i++) {
        assert.equal(game.decks[i].first().level, i + 1);
      }
      // faceUpCards
      for (let i = 0; i < game.faceUpCards.length; i++) {
        assert.equal(game.faceUpCards[i].level, i + 1);
      }
      // tokens
      const expectedTokens = new Map()
        .set("blue", 5)
        .set("red", 5)
        .set("green", 5)
        .set("white", 5)
        .set("black", 5)
        .set("gold", 5);
      assert.deepStrictEqual(game.tokens.value, expectedTokens);
      // nobles
      assert.equal(game.nobles.length, 3);
    });
  });
});
