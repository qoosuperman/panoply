import { MonetaryColors, MonetaryDenominations, MonetaryValue } from "../monetaryvalue";

export class MonetaryValueFactory {
  private static denominations: string[] = MonetaryColors;
  private static md: MonetaryDenominations = new Map();

  static with3RandomColorDenominations(): typeof MonetaryValueFactory {
    const shuffled = this.denominations.sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, 3);

    selected.forEach((color) => {
      const randomValue = Math.floor(Math.random() * 10);
      this.md.set(color, randomValue);
    });

    return this;
  }

  static with1RandomColorDenomination(): typeof MonetaryValueFactory {
    const randomIndex = Math.floor(Math.random() * this.denominations.length);
    const randomValue = Math.floor(Math.random() * 10);
    this.md.set(this.denominations[randomIndex], randomValue);
    return this;
  }

  static apply(): MonetaryValue {
    return new MonetaryValue(this.md);
  }
}
