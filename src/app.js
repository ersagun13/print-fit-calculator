import { calculateFit } from "./fit.js";

const form = document.querySelector("#fit-form");
const validationMessage = document.querySelector("#validation-message");
const resultIntro = document.querySelector("#result-intro");
const resultDetails = document.querySelector("#result-details");
const scalePercent = document.querySelector("#scale-percent");
const limitingAxis = document.querySelector("#limiting-axis");
const fittedSize = document.querySelector("#fitted-size");

function readDimensions(prefix) {
  return Object.fromEntries(
    ["x", "y", "z"].map((axis) => [axis, form.elements.namedItem(`${prefix}-${axis}`).valueAsNumber]),
  );
}

function formatMillimeters(value) {
  return `${value.toFixed(2)} mm`;
}

function showError(error) {
  resultDetails.hidden = true;
  resultIntro.textContent = "Check the dimensions and calculate again.";
  if (error instanceof RangeError) {
    validationMessage.textContent = "Every dimension must be greater than zero.";
  } else {
    validationMessage.textContent = "Enter a finite number for each of the six dimensions.";
  }
}

form.addEventListener("submit", (event) => {
  event.preventDefault();
  validationMessage.textContent = "";

  try {
    const result = calculateFit(readDimensions("model"), readDimensions("target"));
    scalePercent.textContent = `${result.scalePercent.toFixed(2)}%`;
    limitingAxis.textContent = result.limitingAxis ? result.limitingAxis.toUpperCase() : "None — already fits";
    fittedSize.textContent = `X ${formatMillimeters(result.display.x)} · Y ${formatMillimeters(result.display.y)} · Z ${formatMillimeters(result.display.z)}`;
    resultIntro.textContent = result.limitingAxis
      ? `Axis ${result.limitingAxis.toUpperCase()} sets the maximum uniform scale.`
      : "The part already fits, so it stays at its current size.";
    resultDetails.hidden = false;
  } catch (error) {
    showError(error);
  }
});
