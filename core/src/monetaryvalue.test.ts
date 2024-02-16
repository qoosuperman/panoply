import test from "node:test";
import assert from "assert";
import { MonetaryDenominations, MonetaryValue } from "./monetaryvalue";

test("MonetaryValue", async (t) => {
  await t.test("constructor", async (t) => {
    await t.test("instantiate with no arguments", () => {
      const mv = new MonetaryValue();

      const denominations = mv.value;
      const expected = new Map();

      assert.deepStrictEqual(denominations, expected);
    });

    await t.test("instantiate with a MonetaryDenominations object", () => {
      const md: MonetaryDenominations = new Map() //
        .set("red", 4)
        .set("blue", 1);

      const mv = new MonetaryValue(md);

      const denominations = mv.value;
      const expected = md;

      assert.deepStrictEqual(denominations, expected);
    });

    await t.test("instantiate with a string and number", () => {
      const mv = new MonetaryValue("red", 1);

      const denominations = mv.value;
      const expected = new Map().set("red", 1);

      assert.deepStrictEqual(denominations, expected);
    });
  });

  await t.test("add", async (t) => {
    await t.test("with MonetaryValue", () => {
      const mv = new MonetaryValue()
        .add(new MonetaryValue("blue", 2))
        .add(new MonetaryValue("red", 2));

      const denominations = mv.value;
      const expected = new Map() //
        .set("blue", 2)
        .set("red", 2);

      assert.deepStrictEqual(denominations, expected);
    });

    await t.test("with string and number", () => {
      const mv = new MonetaryValue()
        .add("blue", 2)
        .add("red", 2)
        .add("green", 2);

      const denominations = mv.value;
      const expected = new Map() //
        .set("blue", 2)
        .set("red", 2)
        .set("green", 2);

      assert.deepStrictEqual(denominations, expected);
    });

    await t.test("existing color", () => {
      const mv = new MonetaryValue()
        .add("red", 2)
        .add("green", 4)
        .add("red", 1);

      const denominations = mv.value;
      const expected = new Map() //
        .set("red", 3)
        .set("green", 4);

      assert.deepStrictEqual(denominations, expected);
    });

    await t.test("clear zero-value", () => {
      const mv = new MonetaryValue()
        .add("red", 2)
        .add("blue", 1)
        .add("red", -2);

      const denominations = mv.value;
      const expected = new Map().set("blue", 1);

      assert.deepStrictEqual(denominations, expected);
    });
  });

  await t.test("subtract", async (t) => {
    await t.test("with MonetaryValue", () => {
      const mv = new MonetaryValue()
        .add(new MonetaryValue("blue", 2))
        .add(new MonetaryValue("red", 2))
        .subtract(new MonetaryValue("blue", 1));

      const denominations = mv.value;
      const expected = new Map() //
        .set("blue", 1)
        .set("red", 2);

      assert.deepStrictEqual(denominations, expected);
    });

    await t.test("with string and number", () => {
      const mv = new MonetaryValue()
        .add("blue", 2)
        .add("red", 2)
        .add("green", 2)
        .subtract("blue", 1)
        .subtract("red", 1);

      const denominations = mv.value;
      const expected = new Map() //
        .set("blue", 1)
        .set("red", 1)
        .set("green", 2);

      assert.deepStrictEqual(denominations, expected);
    });

    await t.test("non-existent color", () => {
      const mv = new MonetaryValue()
        .add("red", 2)
        .add("blue", 1)
        .subtract("green", 4);

      const denominations = mv.value;
      const expected = new Map() //
        .set("red", 2)
        .set("blue", 1)
        .set("green", -4);

      assert.deepStrictEqual(denominations, expected);
    });

    await t.test("clear zero-value", () => {
      const mv = new MonetaryValue()
        .add("red", 2)
        .add("blue", 1)
        .subtract("red", 2);

      const denominations = mv.value;
      const expected = new Map().set("blue", 1);

      assert.deepStrictEqual(denominations, expected);
    });
  });

  await t.test("contains", async (t) => {
    await t.test("true", () => {
      const pool = new MonetaryValue()
        .add("red", 2)
        .add("blue", 2)
        .add("green", 2);

      const cost = new MonetaryValue()
        .add("red", 1)
        .add("blue", 1)
        .add("green", 2);

      assert.ok(pool.contains(cost));
    });

    await t.test("false", () => {
      const pool = new MonetaryValue()
        .add("red", 2)
        .add("blue", 2)
        .add("green", 2);

      const cost = new MonetaryValue()
        .add("red", 1)
        .add("blue", 1)
        .add("yellow", 2);

      assert.ok(!pool.contains(cost));
    });
  });

  await t.test("sign", async (t) => {
    await t.test("positive", () => {
      const mv = new MonetaryValue("red", 1);
      assert.equal(mv.sign, 1);
    });

    await t.test("zero", () => {
      const mv = new MonetaryValue();
      assert.equal(mv.sign, 0);
    });

    await t.test("negative", () => {
      const mv = new MonetaryValue() //
        .add("red", 1)
        .subtract("green", 1);

      assert.equal(mv.sign, -1);
    });
  });
});
