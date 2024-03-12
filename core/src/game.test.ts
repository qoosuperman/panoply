import test from "node:test";
import assert from "assert";
import Game from "./game";
import { GameCreatedEvent } from "./events/gamecreatedevent";
import { ComponentSetBuilder } from "./builders/componentsetbuilder";

test("Game", async (t) => {
  await t.test("constructor", async (t) => {
    await t.test("with playersCount and componentSet arguments", async () => {
      const playersCount = 4;
      const componentSet = new ComponentSetBuilder().withNoblesCount(3)
        .withCardsCountEveryLevel(3)
        .withTokensCount(5)
        .build();

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

    await t.test("with events argument", async () => {
      const componentSet = new ComponentSetBuilder().withNoblesCount(2)
        .withCardsCountEveryLevel(2)
        .withTokensCount(4)
        .build();
      const event = new GameCreatedEvent(3, componentSet.tokens, componentSet.nobles, componentSet.cards);
      const game = new Game([event]);
      // with game created event
      assert.equal(game.events.length, 1);
      // players
      assert.equal(game.players.length, 3);
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
        .set("blue", 4)
        .set("red", 4)
        .set("green", 4)
        .set("white", 4)
        .set("black", 4)
        .set("gold", 4);
      assert.deepStrictEqual(game.tokens.value, expectedTokens);
      // nobles
      assert.equal(game.nobles.length, 2);
    });
  });
});
