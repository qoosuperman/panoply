import { MonetaryColors, MonetaryDenominations, MonetaryValue } from "../monetaryvalue";

export class MonetaryValueBuilder {
  private denominations: string[] = Object.values(MonetaryColors);
  private md: MonetaryDenominations = new Map();

  build(): MonetaryValue {
    return new MonetaryValue(this.md);
  }

  with3RandomColorDenominations(): MonetaryValueBuilder {
    const shuffled = this.denominations.sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, 3);

    selected.forEach((color) => {
      const randomValue = Math.floor(Math.random() * 10);
      this.md.set(color, randomValue);
    });

    return this;
  }

  with1RandomColorDenomination(): MonetaryValueBuilder {
    const randomIndex = Math.floor(Math.random() * this.denominations.length);
    const randomValue = Math.floor(Math.random() * 10);
    this.md.set(this.denominations[randomIndex], randomValue);
    return this;
  }
}
