import { MonetaryValue } from "../monetaryvalue";
import { GameEvent } from "./gameevent";

export class ReturnTokenEvent extends GameEvent {
    player: number;
    tokens: MonetaryValue;

    constructor(player: number, tokens: MonetaryValue) {
        super();
        this.player = player;
        this.tokens = tokens;
    }
}
