import test from "node:test";
import assert from "assert";
import Game from "./game";
import { GameCreatedEvent } from "./events/gamecreatedevent";
import { ComponentSetBuilder } from "./builders/componentsetbuilder";
import { TakeTokenEvent } from "./events/taketoken";
import { MonetaryValue } from "./monetaryvalue";
import { ComponentSet } from "./componentset";
import { TurnState } from "./turnstate";

test("Game", async (t) => {
  await t.test("constructor", async (t) => {
    await t.test("with playersCount and componentSet arguments", async () => {
      const playersCount = 4;
      const componentSet = new ComponentSetBuilder()
        .withNoblesCount(3)
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
        assert.equal(game.decks[i].first.level, i + 1);
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
      const componentSet = new ComponentSetBuilder()
        .withNoblesCount(2)
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
        assert.equal(game.decks[i].first.level, i + 1);
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

  await t.test("handleTakeTokenEvent", async (t) => {
    await t.test("removes tokens from the game stash and adds them to player's collection", () => {
      const gameTokens = new MonetaryValue().add("green", 2).add("red", 2).add("blue", 2);
      const takenTokens = new MonetaryValue().add("green", 1).add("red", 1).add("blue", 1);

      const game = new Game(1, new ComponentSet([], [], gameTokens));
      const player = game.players[0];
      const event = new TakeTokenEvent(0, takenTokens);

      const expectedGameTokens = gameTokens.subtract(takenTokens);
      const expectedPlayerTokens = player.tokens.add(takenTokens);

      game.handleTakeTokenEvent(event);

      assert.deepStrictEqual(expectedGameTokens.value, game.tokens.value);
      assert.deepStrictEqual(expectedPlayerTokens.value, player.tokens.value);
    });

    await t.test("adjusts turn state if player has more than ten tokens after draw", () => {
      const gameTokens = new MonetaryValue().add("green", 2).add("red", 2).add("blue", 2);
      const takenTokens = new MonetaryValue().add("green", 1).add("red", 1).add("blue", 1);

      const game = new Game(1, new ComponentSet([], [], gameTokens));
      const player = game.players[0];
      player.tokens = new MonetaryValue().add("green", 3).add("red", 5).add("blue", 2);
      const event = new TakeTokenEvent(0, takenTokens);

      assert.equal(game.turnState, TurnState.Action);

      game.handleTakeTokenEvent(event);

      assert.equal(game.turnState, TurnState.ReturnTokens);
    });

    await t.test("progresses to next player if the current player does not need to do anything else", () => {
      const game = new Game(2, new ComponentSet([], [], new MonetaryValue("green", 1)));
      const event = new TakeTokenEvent(0, new MonetaryValue("green", 1));

      assert.equal(game.currentPlayerIndex, 0);

      game.handleTakeTokenEvent(event);

      assert.equal(game.currentPlayerIndex, 1);
      assert.equal(game.turnState, TurnState.Action);
    });
  });
});
