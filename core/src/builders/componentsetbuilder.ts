import { Card } from "../card";
import { ComponentSet } from "../componentset";
import { MonetaryColors, MonetaryDenominations, MonetaryValue } from "../monetaryvalue";
import { Noble } from "../noble";
import { MonetaryValueBuilder } from "./monetaryvaluebuilder";

export class ComponentSetBuilder {
  private nobles: Noble[] = [];
  private cards: Card[] = [];
  private tokens: MonetaryValue = new MonetaryValue();

  withNoblesCount(noblesCount: number): ComponentSetBuilder {
    for (let i = 0; i < noblesCount; i++) {
      const randomValue = Math.floor(Math.random() * 10);
      const monetaryValue = new MonetaryValueBuilder().with3RandomColorDenominations().build();
      this.nobles.push(new Noble(randomValue, monetaryValue));
    }
    return this;
  }

  withCardsCountEveryLevel(cardsCount: number): ComponentSetBuilder {
    for (let level = 1; level < 4; level++) {
      for (let i = 0; i < cardsCount; i++) {
        const points = Math.floor(Math.random() * level);
        const cost = new MonetaryValueBuilder().with3RandomColorDenominations().build();
        const purchasingPower = new MonetaryValueBuilder().with1RandomColorDenomination().build();
        this.cards.push(new Card(level, points, cost, purchasingPower));
      }
    }
    return this;
  }

  withTokensCount(tokensCount: number): ComponentSetBuilder {
    const colorsMap: MonetaryDenominations = MonetaryColors.reduce((map, color) => {
      map.set(color, tokensCount);
      return map;
    }, new Map<string, number>());
    this.tokens = new MonetaryValue(colorsMap);
    return this;
  }

  build(): ComponentSet {
    return new ComponentSet(this.cards, this.nobles, this.tokens);
  }
}
