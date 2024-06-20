import test, { beforeEach } from "node:test";
import assert from "assert";
import Game from "./game";
import { GameCreated } from "./events/gamecreated";
import { ComponentSetBuilder } from "./builders/componentsetbuilder";
import { TokensTaken } from "./events/tokenstaken";
import { MonetaryValue } from "./monetaryvalue";
import { ComponentSet } from "./componentset";
import { TurnState } from "./turnstate";
import {
  InvalidDrawTokenAmount,
  InvalidMultiDrawToken,
  InvalidOverdrawToken,
  InvalidPlayOrder,
  InvalidTokenReturn,
  InvalidTurnCommand,
} from "./error";
import { TokensReturned } from "./events/tokensreturned";
import { Noble } from "./noble";
import { Card } from "./card";

test("Game", async (t) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const assertInstance = (instance: any, clazz: any) => {
    assert.ok(instance instanceof clazz, `Expected instance of ${clazz.name}, but got ${instance?.constructor?.name}`);
  };

  await t.test("constructor", async (t) => {
    await t.test("with playersCount and componentSet arguments", async () => {
      const playersCount = 4;
      const componentSet = new ComponentSetBuilder()
        .withNoblesCount(3)
        .withCardsCountEveryLevel(5)
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
      assert.equal(game.faceUpCards.length, 3);
      for (let i = 0; i < game.faceUpCards.length; i++) {
        assert.equal(game.faceUpCards[i].length, 4);
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
        .withCardsCountEveryLevel(6)
        .withTokensCount(4)
        .build();
      const event = new GameCreated(3, componentSet.tokens, componentSet.nobles, componentSet.cards);
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
      assert.equal(game.faceUpCards.length, 3);
      for (let i = 0; i < game.faceUpCards.length; i++) {
        assert.equal(game.faceUpCards[i].length, 4);
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

  await t.test("handleTokensTaken", async (t) => {
    await t.test("removes tokens from the game stash and adds them to player's collection", () => {
      const gameTokens = new MonetaryValue().add("green", 2).add("red", 2).add("blue", 2);
      const takenTokens = new MonetaryValue().add("green", 1).add("red", 1).add("blue", 1);

      const game = new Game(1, new ComponentSet([], [], gameTokens));
      const player = game.players[0];
      const event = new TokensTaken(0, takenTokens);

      const expectedGameTokens = gameTokens.subtract(takenTokens);
      const expectedPlayerTokens = player.tokens.add(takenTokens);

      game.handleTokensTaken(event);

      assert.deepStrictEqual(expectedGameTokens.value, game.tokens.value);
      assert.deepStrictEqual(expectedPlayerTokens.value, player.tokens.value);
    });

    await t.test("adjusts turn state if player has more than ten tokens after draw", () => {
      const gameTokens = new MonetaryValue().add("green", 2).add("red", 2).add("blue", 2);
      const takenTokens = new MonetaryValue().add("green", 1).add("red", 1).add("blue", 1);

      const game = new Game(1, new ComponentSet([], [], gameTokens));
      const player = game.players[0];
      player.tokens = new MonetaryValue().add("green", 3).add("red", 5).add("blue", 2);
      const event = new TokensTaken(0, takenTokens);

      assert.equal(game.turnState, TurnState.Action);

      game.handleTokensTaken(event);

      assert.equal(game.turnState, TurnState.ReturnTokens);
    });

    await t.test("progresses to next player if the current player does not need to do anything else", () => {
      const game = new Game(2, new ComponentSet([], [], new MonetaryValue("green", 1)));
      const event = new TokensTaken(0, new MonetaryValue("green", 1));

      assert.equal(game.currentPlayerIndex, 0);

      game.handleTokensTaken(event);

      assert.equal(game.currentPlayerIndex, 1);
      assert.equal(game.turnState, TurnState.Action);
    });

    await t.test("adjusts turn state if multiple nobles are available and tokens are within limit", () => {
      const nobles = [
        new Noble(3, new MonetaryValue().add("green", 1)),
        new Noble(2, new MonetaryValue().add("blue", 1)),
      ];
      const game = new Game(2, new ComponentSet([], nobles, new MonetaryValue().add("green", 1)));
      const player = game.players[0];
      player.tokens = new MonetaryValue().add("green", 1);
      player.cards = [
        new Card(1, 1, new MonetaryValue(), new MonetaryValue("green", 1)),
        new Card(1, 1, new MonetaryValue(), new MonetaryValue("blue", 1)),
      ];

      const event = new TokensTaken(0, new MonetaryValue("green", 1));

      game.handleTokensTaken(event);

      assert.deepStrictEqual(game.currentPlayerIndex, 0);
      assert.deepStrictEqual(game.turnState, TurnState.SelectNoble);
    });

    await t.test("assigns noble and progresses to next player if only one noble is available", () => {
      const nobles = [new Noble(3, new MonetaryValue().add("green", 1))];
      const game = new Game(2, new ComponentSet([], nobles, new MonetaryValue().add("green", 1)));
      const player = game.players[0];
      player.tokens = new MonetaryValue().add("green", 1);
      player.cards = [new Card(1, 1, new MonetaryValue(), new MonetaryValue("green", 1))];

      const event = new TokensReturned(0, new MonetaryValue("green", 1));

      game.handleTokensTaken(event);

      assert.deepStrictEqual(game.currentPlayerIndex, 1);
      assert.deepStrictEqual(game.turnState, TurnState.Action);
      assert.deepStrictEqual(game.players[0].nobles, [nobles[0]]);
    });
  });

  await t.test("takeTokens", async (t) => {
    await t.test("successfully performs a legal draw from different piles", () => {
      const game = new Game(
        2,
        new ComponentSet([], [], new MonetaryValue().add("green", 3).add("blue", 3).add("red", 3)),
      );
      const result = game.takeTokens(0, new MonetaryValue().add("green", 1).add("blue", 1).add("red", 1));

      assert.equal(result, undefined);
    });

    await t.test("successfully performs a legal draw from a single pile", () => {
      const game = new Game(2, new ComponentSet([], [], new MonetaryValue().add("green", 5)));
      const result = game.takeTokens(0, new MonetaryValue().add("green", 2));

      assert.equal(result, undefined);
    });

    await t.test("generates a TakeTokenEvent", () => {
      const game = new Game(2, new ComponentSet([], [], new MonetaryValue().add("green", 5)));
      game.takeTokens(0, new MonetaryValue().add("green", 2));

      assertInstance(game.events[game.events.length - 1], TokensTaken);
    });

    await t.test("applies TakeTokenEvent", (t) => {
      const game = new Game(2, new ComponentSet([], [], new MonetaryValue().add("green", 5)));
      const handleTakeTokenEvent = t.mock.fn();
      game.handleTokensTaken = handleTakeTokenEvent;
      game.takeTokens(0, new MonetaryValue().add("green", 2));

      assert.equal(handleTakeTokenEvent.mock.callCount(), 1);
    });

    await t.test("throws error when playing out of turn", () => {
      const game = new Game(2, new ComponentSet([], [], new MonetaryValue("green", 1)));
      const result = game.takeTokens(1, new MonetaryValue("green", 1));

      assertInstance(result, InvalidPlayOrder);
    });

    await t.test("throws error when taking invalid action", () => {
      const game = new Game(2, new ComponentSet([], [], new MonetaryValue("green", 1)));
      game.turnState = TurnState.ReturnTokens;
      const result = game.takeTokens(0, new MonetaryValue("green", 1));

      assertInstance(result, InvalidTurnCommand);
    });

    await t.test("throws error when drawing more tokens than exist in the bank", () => {
      const game = new Game(2, new ComponentSet([], [], new MonetaryValue("green", 1)));
      const result = game.takeTokens(0, new MonetaryValue("green", 2));

      assertInstance(result, InvalidOverdrawToken);
    });

    await t.test("throws error when drawing more than three tokens", () => {
      const game = new Game(2, new ComponentSet([], [], new MonetaryValue("green", 4)));
      const result = game.takeTokens(0, new MonetaryValue("green", 4));

      assertInstance(result, InvalidDrawTokenAmount);
    });

    await t.test("throws error when drawing zero tokens", () => {
      const game = new Game(2, new ComponentSet([], [], new MonetaryValue("green", 1)));
      const result = game.takeTokens(0, new MonetaryValue());

      assertInstance(result, InvalidDrawTokenAmount);
    });

    await t.test("throws error when drawing mixed duplicate tokens", () => {
      const game = new Game(2, new ComponentSet([], [], new MonetaryValue().add("green", 2).add("red", 2)));
      const result = game.takeTokens(0, new MonetaryValue().add("green", 2).add("red", 1));

      assertInstance(result, InvalidDrawTokenAmount);
    });

    await t.test("throws error when drawing mixed duplicate tokens", () => {
      const game = new Game(2, new ComponentSet([], [], new MonetaryValue().add("green", 2).add("red", 2)));
      const result = game.takeTokens(0, new MonetaryValue().add("green", 2));

      assertInstance(result, InvalidMultiDrawToken);
    });
  });

  await t.test("handleTokensReturned", async (t) => {
    await t.test("removes tokens from the player's possession and returns them to player's collection", () => {
      const gameTokens = new MonetaryValue().add("green", 10).add("red", 10).add("blue", 10);
      const game = new Game(1, new ComponentSet([], [], gameTokens));
      const player = game.players[0];

      for (let i = 0; i < 4; i++) {
        const takenTokens = new MonetaryValue().add("green", 1).add("red", 1).add("blue", 1);
        game.takeTokens(0, takenTokens);
      }

      const returnedTokens = new MonetaryValue().add("green", 1).add("red", 1);

      const event = new TokensReturned(0, returnedTokens);

      const expectedGameTokens = game.tokens.add(returnedTokens);
      const expectedPlayerTokens = player.tokens.subtract(returnedTokens);

      game.handleTokensReturned(event);

      assert.deepStrictEqual(expectedGameTokens.value, game.tokens.value);
      assert.deepStrictEqual(expectedPlayerTokens.value, player.tokens.value);
    });

    await t.test("progresses to next player if no nobles are available", () => {
      const game = new Game(2, new ComponentSet([], [], new MonetaryValue().add("green", 1)));
      const player = game.players[0];
      player.tokens = new MonetaryValue().add("green", 13);

      const event = new TokensReturned(0, new MonetaryValue().add("green", 3));

      game.handleTokensReturned(event);

      assert.deepStrictEqual(game.currentPlayerIndex, 1);
      assert.deepStrictEqual(game.turnState, TurnState.Action);
    });

    await t.test("adjusts turn state if multiple nobles are available", () => {
      const nobles = [
        new Noble(3, new MonetaryValue().add("green", 1)),
        new Noble(2, new MonetaryValue().add("blue", 1)),
      ];
      const game = new Game(2, new ComponentSet([], nobles, new MonetaryValue().add("green", 1)));
      const player = game.players[0];
      player.tokens = new MonetaryValue().add("green", 13);
      player.cards = [
        new Card(1, 1, new MonetaryValue(), new MonetaryValue("green", 1)),
        new Card(1, 1, new MonetaryValue(), new MonetaryValue("blue", 1)),
      ];

      const event = new TokensReturned(0, new MonetaryValue().add("green", 3));

      game.handleTokensReturned(event);

      assert.deepStrictEqual(game.currentPlayerIndex, 0);
      assert.deepStrictEqual(game.turnState, TurnState.SelectNoble);
    });

    await t.test("assigns noble and progresses to next player if only one noble is available", () => {
      const nobles = [new Noble(3, new MonetaryValue().add("green", 1))];
      const game = new Game(2, new ComponentSet([], nobles, new MonetaryValue().add("green", 1)));
      const player = game.players[0];
      player.tokens = new MonetaryValue().add("green", 13);
      player.cards = [new Card(1, 1, new MonetaryValue(), new MonetaryValue("green", 1))];

      const event = new TokensReturned(0, new MonetaryValue().add("green", 3));

      game.handleTokensReturned(event);

      assert.deepStrictEqual(game.currentPlayerIndex, 1);
      assert.deepStrictEqual(game.turnState, TurnState.Action);
      assert.deepStrictEqual(game.players[0].nobles, [nobles[0]]);
    });
  });

  await t.test("returnTokens", async (t) => {
    let game: Game;

    beforeEach(() => {
      const gameTokens = new MonetaryValue().add("green", 10).add("red", 10).add("blue", 10);
      game = new Game(1, new ComponentSet([], [], gameTokens));

      for (let i = 0; i < 4; i++) {
        const takenTokens = new MonetaryValue().add("green", 1).add("red", 1).add("blue", 1);
        game.takeTokens(0, takenTokens);
      }
    });

    await t.test("successfully performs a legal return", () => {
      const returnedTokens = new MonetaryValue().add("green", 1).add("red", 1);
      const result = game.returnTokens(0, returnedTokens);
      assert.equal(result, undefined);
    });

    await t.test("generates a TokensReturned event", () => {
      const returnedTokens = new MonetaryValue().add("green", 1).add("red", 1);
      game.returnTokens(0, returnedTokens);

      assertInstance(game.events[game.events.length - 1], TokensReturned);
    });

    await t.test("applies TokensReturned", (t) => {
      const handleTokensReturnedEvent = t.mock.fn();
      game.handleTokensReturned = handleTokensReturnedEvent;
      game.returnTokens(0, new MonetaryValue().add("green", 1).add("red", 1));

      assert.equal(handleTokensReturnedEvent.mock.callCount(), 1);
    });

    await t.test("throws error when playing out of turn", () => {
      game.returnTokens(1, new MonetaryValue().add("green", 1).add("red", 1));
      const result = game.takeTokens(1, new MonetaryValue("green", 1));

      assertInstance(result, InvalidPlayOrder);
    });

    await t.test("throws error when taking invalid action", () => {
      const returnedTokens = new MonetaryValue().add("green", 1).add("red", 1);
      game.returnTokens(0, returnedTokens);
      const result = game.returnTokens(0, returnedTokens);

      assertInstance(result, InvalidTurnCommand);
    });

    await t.test("throws error when returning an invalid number of tokens", () => {
      const fewReturnedTokens = new MonetaryValue().add("green", 1);
      const manyReturnedTokens = new MonetaryValue().add("green", 1).add("red", 1).add("blue", 1);

      const fewResult = game.returnTokens(0, fewReturnedTokens);
      const manyResult = game.returnTokens(0, manyReturnedTokens);

      assertInstance(fewResult, InvalidTokenReturn);
      assertInstance(manyResult, InvalidTokenReturn);
    });
  });
});
