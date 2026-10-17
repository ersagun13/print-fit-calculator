import assert from "node:assert/strict";
import test from "node:test";

import { calculateFit } from "../src/fit.js";

test("fits to the X limit and keeps raw and display dimensions separate", () => {
  const result = calculateFit(
    { x: 120, y: 60, z: 30 },
    { x: 90, y: 100, z: 100 },
  );

  assert.equal(result.limitingAxis, "x");
  assert.equal(result.scale, 0.75);
  assert.equal(result.x, 90);
  assert.equal(result.y, 45);
  assert.equal(result.display.y, 45);
});

test("uses the Y limit when Y has the smallest ratio", () => {
  const result = calculateFit(
    { x: 100, y: 100, z: 50 },
    { x: 130, y: 70, z: 100 },
  );

  assert.equal(result.limitingAxis, "y");
  assert.equal(result.scale, 0.7);
  assert.equal(result.y, 70);
});

test("uses the Z limit when Z has the smallest ratio", () => {
  const result = calculateFit(
    { x: 80, y: 80, z: 120 },
    { x: 100, y: 100, z: 90 },
  );

  assert.equal(result.limitingAxis, "z");
  assert.equal(result.scale, 0.75);
  assert.equal(result.z, 90);
});

test("does not upscale a model that already fits", () => {
  const result = calculateFit(
    { x: 10, y: 20, z: 30 },
    { x: 100, y: 100, z: 100 },
  );

  assert.equal(result.scale, 1);
  assert.equal(result.limitingAxis, null);
  assert.deepEqual({ x: result.x, y: result.y, z: result.z }, { x: 10, y: 20, z: 30 });
});

test("rounds display values without changing the raw calculation", () => {
  const result = calculateFit(
    { x: 3, y: 4, z: 5 },
    { x: 1, y: 10, z: 10 },
  );

  assert.equal(result.scale, 1 / 3);
  assert.equal(result.y, 4 / 3);
  assert.equal(result.display.y, 1.33);
});

test("raw fitted dimensions stay within the target", () => {
  const model = { x: 37, y: 12.5, z: 88 };
  const target = { x: 20, y: 20, z: 43 };
  const result = calculateFit(model, target);

  for (const axis of ["x", "y", "z"]) {
    assert.ok(result[axis] <= target[axis]);
  }
});

test("rejects zero dimensions", () => {
  assert.throws(() => calculateFit({ x: 0, y: 2, z: 3 }, { x: 4, y: 5, z: 6 }), RangeError);
  assert.throws(() => calculateFit({ x: 2, y: 3, z: 4 }, { x: 4, y: 0, z: 6 }), RangeError);
});

test("rejects negative dimensions", () => {
  assert.throws(() => calculateFit({ x: -1, y: 2, z: 3 }, { x: 4, y: 5, z: 6 }), RangeError);
  assert.throws(() => calculateFit({ x: 2, y: 3, z: 4 }, { x: 4, y: 5, z: -6 }), RangeError);
});

test("rejects non-finite and non-numeric dimensions", () => {
  assert.throws(() => calculateFit({ x: Number.NaN, y: 2, z: 3 }, { x: 4, y: 5, z: 6 }), TypeError);
  assert.throws(() => calculateFit({ x: 2, y: 3, z: 4 }, { x: 4, y: "wide", z: 6 }), TypeError);
});
