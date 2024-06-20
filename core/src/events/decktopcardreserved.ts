import { GameEvent } from "./gameevent";

export class DeckTopCardReserved extends GameEvent {
  player: number;
  level: number;

  constructor(player: number, level: number) {
    super();
    this.player = player;
    this.level = level;
  }
}
