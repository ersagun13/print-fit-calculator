const AXES = ["x", "y", "z"];

function validateDimensions(dimensions, label) {
  if (!dimensions || typeof dimensions !== "object") {
    throw new TypeError(`${label} dimensions must be an object with x, y, and z values`);
  }

  for (const axis of AXES) {
    const value = dimensions[axis];
    if (typeof value !== "number" || !Number.isFinite(value)) {
      throw new TypeError(`${label}.${axis} must be a finite number`);
    }
    if (value <= 0) {
      throw new RangeError(`${label}.${axis} must be greater than zero`);
    }
  }
}

function roundForDisplay(value) {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}

export function calculateFit(model, target) {
  validateDimensions(model, "model");
  validateDimensions(target, "target");

  const ratios = Object.fromEntries(AXES.map((axis) => [axis, target[axis] / model[axis]]));
  const limitingAxis = AXES.reduce((smallest, axis) =>
    ratios[axis] < ratios[smallest] ? axis : smallest,
  );
  const smallestRatio = ratios[limitingAxis];
  const scale = Math.min(1, smallestRatio);
  const axisWithinTarget = smallestRatio <= 1 ? limitingAxis : null;
  const raw = Object.fromEntries(AXES.map((axis) => [axis, model[axis] * scale]));

  return {
    scale,
    scalePercent: roundForDisplay(scale * 100),
    limitingAxis: axisWithinTarget,
    x: raw.x,
    y: raw.y,
    z: raw.z,
    raw,
    display: Object.fromEntries(AXES.map((axis) => [axis, roundForDisplay(raw[axis])])),
  };
}
