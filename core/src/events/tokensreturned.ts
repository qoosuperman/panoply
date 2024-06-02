import { MonetaryValue } from "../monetaryvalue";
import { GameEvent } from "./gameevent";

export class TokensReturned extends GameEvent {
  playerId: number;
  tokens: MonetaryValue;

  constructor(playerId: number, tokens: MonetaryValue) {
    super();
    this.playerId = playerId;
    this.tokens = tokens;
  }
}
