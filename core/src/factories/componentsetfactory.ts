import { Card } from "../card";
import { ComponentSet } from "../componentset";
import { MonetaryColors, MonetaryDenominations, MonetaryValue } from "../monetaryvalue";
import { Noble } from "../noble";
import { MonetaryValueFactory } from "./monetaryvaluefactory";

export class ComponentSetFactory {
  private static nobles: Noble[] = [];
  private static cards: Card[] = [];
  private static tokens: MonetaryValue = new MonetaryValue();

  static withNoblesCount(noblesCount: number): typeof ComponentSetFactory {
    for (let i = 0; i < noblesCount; i++) {
      const randomValue = Math.floor(Math.random() * 10);
      const monetaryValue = MonetaryValueFactory.with3RandomColorDenominations().apply();
      this.nobles.push(new Noble(randomValue, monetaryValue));
    }
    return this;
  }

  static withCardsCountEveryLevel(cardsCount: number): typeof ComponentSetFactory {
    for (let level = 1; level < 4; level++) {
      for (let i = 0; i < cardsCount; i++) {
        const points = Math.floor(Math.random() * level);
        const cost = MonetaryValueFactory.with3RandomColorDenominations().apply();
        const purchasingPower = MonetaryValueFactory.with1RandomColorDenomination().apply();
        this.cards.push(new Card(level, points, cost, purchasingPower));
      }
    }
    return this;
  }

  static withTokensCount(tokensCount: number): typeof ComponentSetFactory {
    const colorsMap: MonetaryDenominations = MonetaryColors.reduce((map, color) => {
      map.set(color, tokensCount);
      return map;
    }, new Map<string, number>());
    this.tokens = new MonetaryValue(colorsMap);
    return this;
  }

  static apply(): ComponentSet {
    return new ComponentSet(this.cards, this.nobles, this.tokens);
  }
}
