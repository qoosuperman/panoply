/**
 * MonetaryDenominations represents a collection of color-amount pairs.
 *
 * TODO: Consider changing all mentions of "denomination" to the more intuitive "color".
 */
export type MonetaryDenominations = InstanceType<typeof Map<string, number>>;

/**
 * MonetaryValue represents a composite value that can be used to describe
 * and compare financial figures such as cost and purchasing power.
 *
 * The basic structure of this underlying composite value is a collection of
 * color-amount pairs, where the color is a string and the amount is a numerical value.
 *
 * TODO: Consider renaming this to something simpler, like "Money".
 */
export class MonetaryValue {
  protected denominations: Readonly<MonetaryDenominations>;

  constructor();

  constructor(denominations: Readonly<MonetaryDenominations>);

  constructor(color: string, amount: number);

  constructor(
    colorOrDenominations?: string | MonetaryDenominations,
    amount: number = 0,
  ) {
    if (typeof colorOrDenominations === "string") {
      this.denominations = new Map([[colorOrDenominations, amount]]);
    } else if (colorOrDenominations instanceof Map) {
      this.denominations = new Map(colorOrDenominations);
    } else {
      this.denominations = new Map();
    }
  }

  /**
   * Return a new MonetaryValue that is the sum of the current value and the given value.
   *
   * If a denomination exists in both the current and the passed value, their amounts will
   * be summed together and used as the result.
   */
  add(value: MonetaryValue): MonetaryValue;

  /**
   * Return a new MonetaryValue that is the result of adding the given color and amount
   * to the current MonetaryValue.
   *
   * If the color already exists in the current value, the two amounts will be summed together
   * and used as the result.
   */
  add(color: string, amount: number): MonetaryValue;

  add(
    colorOrMonetaryValue: string | MonetaryValue,
    amount: number = 0,
  ): MonetaryValue {
    const addend = this.toDenominations(colorOrMonetaryValue, amount);
    const sum = this.mergeReduce(addend, (a, b) => a + b);

    return new MonetaryValue(sum);
  }

  /**
   * Return a new MonetaryValue that is the difference of the current value and the given value.
   *
   * If a denomination exists in both the current and the passed value, the passed amount will
   * be subtracted from the current amount and used as the result.
   */
  subtract(value: MonetaryValue): MonetaryValue;

  /**
   * Return a new MonetaryValue that is the result of subtracting the given color and amount
   * from the current MonetaryValue.
   *
   * If the color already exists in the current value, the passed amount will be subtracted
   * from the current amount and used as the result.
   */
  subtract(color: string, amount: number): MonetaryValue;

  subtract(
    colorOrMonetaryValue: string | MonetaryValue,
    amount: number = 0,
  ): MonetaryValue {
    const subtrahend = this.toDenominations(colorOrMonetaryValue, amount);
    const difference = this.mergeReduce(subtrahend, (a, b) => a - b);

    return new MonetaryValue(difference);
  }

  /**
   * Return whether or not the current value contains the passed value.
   *
   * A MonetaryValue `X` contains another MonetaryValue `Y` if all the constituent colors of `Y`
   * are also present in `X`, and for each such color, the amount in `X` is greater than the
   * amount in `Y`.
   */
  contains(value: MonetaryValue): boolean {
    const difference = this.subtract(value);
    return difference.sign >= 0;
  }

  /**
   * Return the sign of the current value.
   *
   * The sign is -1 if the current value contains any colors whose amount is negative.
   * The sign is 0 if the current value contains are no colors whatsoever.
   * The sign is 1 if the current value contains only colors whose amount is positive.
   */
  get sign(): 1 | 0 | -1 {
    if (!this.denominations.size) {
      return 0;
    }

    for (const amount of this.denominations.values()) {
      if (amount < 0) {
        return -1;
      }
    }

    return 1;
  }

  /**
   * Return the colors and corresponding amounts of the current MonetaryValue as a Map.
   */
  get value(): MonetaryDenominations {
    return new Map(this.denominations);
  }

  /**
   * Coalesce the given arguments into a Map.
   *
   * This is a convenience function for the handling of polymorphic methods.
   */
  private toDenominations(
    colorOrMonetaryValue: string | MonetaryValue,
    amount: number = 0,
  ): MonetaryDenominations {
    if (typeof colorOrMonetaryValue === "string") {
      return new Map([[colorOrMonetaryValue, amount]]);
    }

    return new Map(colorOrMonetaryValue.denominations);
  }

  /**
   * Combine the current value with the given value, using the provided merge
   * function to produce a resultant amount for each color.
   */
  private mergeReduce(
    target: Readonly<MonetaryDenominations>,
    merge: (source: number, target: number) => number,
  ): MonetaryDenominations {
    const result = new Map(this.denominations);

    for (const [color, targetAmount] of target) {
      if (!result.has(color)) {
        result.set(color, 0);
      }

      result.set(color, merge(result.get(color) ?? 0, targetAmount));

      if (result.get(color) === 0) {
        result.delete(color);
      }
    }

    return result;
  }
}
