import { GameEvent } from "./gameevent";

export class FaceUpCardReserved extends GameEvent {
  player: number;
  level: number;
  index: number;

  constructor(player: number, level: number, index: number) {
    super();
    this.player = player;
    this.level = level;
    this.index = index;
  }
}
