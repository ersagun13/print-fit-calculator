# Print Fit Calculator

Print Fit Calculator estimates a uniform scale for fitting a part inside a target box. It works with outside dimensions in millimeters and keeps the raw calculation separate from the two-decimal values shown on screen.

## Run it

You need Python 3 and a modern browser. From this directory, start a loopback-only web server:

```sh
python3 -m http.server --bind 127.0.0.1 8000
```

Open [http://127.0.0.1:8000](http://127.0.0.1:8000). The example starts with a part measuring **125 × 80 × 45 mm** and a space of **100 × 100 × 50 mm**. The X dimension limits the scale to **80%**, giving **100 × 64 × 36 mm**.

Enter all three dimensions for the part and the available space, then choose **Calculate fit**. The calculator never enlarges a part that already fits. If it is smaller than the available space on every axis, the scale stays at 100% and no axis is marked as limiting.

## Assumptions and limits

Scaling is uniform, so the part's proportions stay the same. This page estimates the outside bounding box only; it does not open an STL file, inspect mesh geometry, add clearance, or predict printer behavior. Check the model in your slicer before printing. All calculations run locally in the browser.

## Checks

Node.js 18 or newer is needed for the tests:

```sh
node --test
node --check src/app.js
```

The test suite covers each limiting axis, no-upscale behavior, raw and displayed dimensions, target bounds, and invalid measurements.
