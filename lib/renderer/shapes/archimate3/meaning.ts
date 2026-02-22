import type { RenderContext, ShapeAttrs } from '../../../renderer.ts';
import { BaseShapeHandler } from '../../shape-registry.ts';

/**
 * ArchiMate3 Meaning icon — thought-bubble cloud shape.
 * Path faithfully reproduced from the official PlantUML reference SVG.
 * Bounding box: x≈119.0, y≈20.47, w≈17.68, h≈15.91
 * All coordinates are proportional (0..1) to width/height.
 */
export class Archimate3MeaningHandler extends BaseShapeHandler {
  constructor(renderCtx: RenderContext) {
    super(renderCtx);
  }

  render(attrs: ShapeAttrs): void {
    const { builder, currentGroup, applyShapeAttrsToBuilder, x, y, width, height } = this.renderCtx;
    if (!builder || !currentGroup) return;
    if (width <= 0 || height <= 0) return;

    builder.setCanvasRoot(currentGroup);
    builder.save();
    applyShapeAttrsToBuilder(builder, attrs);
    builder.translate(x, y);

    const w = width, h = height;

    // ── Sub-path 1: main cloud body ───────────────────────────────────────
    builder.begin();
    builder.moveTo(0.3440 * w, 0.0000 * h);
    builder.curveTo(0.2911 * w, -0.0013 * h, 0.2255 * w, 0.0129 * h, 0.1808 * w, 0.0692 * h);
    builder.curveTo(0.1538 * w, 0.1032 * h, 0.1548 * w, 0.1476 * h, 0.1670 * w, 0.1784 * h);
    builder.curveTo(0.1726 * w, 0.1926 * h, 0.1798 * w, 0.1995 * h, 0.1871 * w, 0.2105 * h);
    builder.curveTo(0.1660 * w, 0.2155 * h, 0.1424 * w, 0.2166 * h, 0.1260 * w, 0.2296 * h);
    builder.curveTo(0.0879 * w, 0.2602 * h, 0.0699 * w, 0.3113 * h, 0.0680 * w, 0.3635 * h);
    builder.curveTo(0.0661 * w, 0.4156 * h, 0.0799 * w, 0.4708 * h, 0.1106 * w, 0.5155 * h);
    builder.curveTo(0.1419 * w, 0.5611 * h, 0.1826 * w, 0.5802 * h, 0.2195 * w, 0.5782 * h);
    builder.curveTo(0.2463 * w, 0.5767 * h, 0.2668 * w, 0.5625 * h, 0.2875 * w, 0.5501 * h);
    builder.curveTo(0.2965 * w, 0.5708 * h, 0.3023 * w, 0.5947 * h, 0.3178 * w, 0.6070 * h);
    builder.curveTo(0.3425 * w, 0.6266 * h, 0.3718 * w, 0.6360 * h, 0.3999 * w, 0.6347 * h);
    builder.curveTo(0.4269 * w, 0.6334 * h, 0.4651 * w, 0.6340 * h, 0.5032 * w, 0.6227 * h);
    builder.curveTo(0.5285 * w, 0.6153 * h, 0.5522 * w, 0.5973 * h, 0.5726 * w, 0.5734 * h);
    builder.curveTo(0.5828 * w, 0.5934 * h, 0.5900 * w, 0.6175 * h, 0.6067 * w, 0.6300 * h);
    builder.curveTo(0.6354 * w, 0.6515 * h, 0.6715 * w, 0.6566 * h, 0.7210 * w, 0.6554 * h);
    builder.curveTo(0.7743 * w, 0.6541 * h, 0.8145 * w, 0.6478 * h, 0.8409 * w, 0.6160 * h);
    builder.curveTo(0.8541 * w, 0.6001 * h, 0.8606 * w, 0.5783 * h, 0.8612 * w, 0.5566 * h);
    builder.curveTo(0.8615 * w, 0.5445 * h, 0.8574 * w, 0.5306 * h, 0.8550 * w, 0.5175 * h);
    builder.curveTo(0.8836 * w, 0.5130 * h, 0.9131 * w, 0.5096 * h, 0.9372 * w, 0.4917 * h);
    builder.curveTo(0.9706 * w, 0.4670 * h, 0.9961 * w, 0.4257 * h, 0.9974 * w, 0.3742 * h);
    builder.curveTo(1.0000 * w, 0.2702 * h, 0.9755 * w, 0.1838 * h, 0.9268 * w, 0.1221 * h);
    builder.curveTo(0.8879 * w, 0.0727 * h, 0.8400 * w, 0.0452 * h, 0.7909 * w, 0.0473 * h);
    builder.curveTo(0.7523 * w, 0.0490 * h, 0.7167 * w, 0.0734 * h, 0.6849 * w, 0.1080 * h);
    builder.curveTo(0.6728 * w, 0.0865 * h, 0.6623 * w, 0.0612 * h, 0.6462 * w, 0.0499 * h);
    builder.curveTo(0.6207 * w, 0.0320 * h, 0.5910 * w, 0.0294 * h, 0.5653 * w, 0.0369 * h);
    builder.curveTo(0.5294 * w, 0.0473 * h, 0.5013 * w, 0.0747 * h, 0.4775 * w, 0.1053 * h);
    builder.curveTo(0.4708 * w, 0.0896 * h, 0.4656 * w, 0.0740 * h, 0.4558 * w, 0.0591 * h);
    builder.curveTo(0.4367 * w, 0.0303 * h, 0.4065 * w, 0.0057 * h, 0.3658 * w, 0.0014 * h);
    builder.curveTo(0.3588 * w, 0.0007 * h, 0.3515 * w, 0.0002 * h, 0.3440 * w, 0.0000 * h);
    builder.fillAndStroke();

    // ── Sub-path 2: medium oval (thought-bubble step 1) ──────────────────
    builder.begin();
    builder.moveTo(0.2114 * w, 0.6032 * h);
    builder.curveTo(0.1692 * w, 0.6036 * h, 0.1309 * w, 0.6135 * h, 0.1009 * w, 0.6317 * h);
    builder.curveTo(0.0709 * w, 0.6499 * h, 0.0468 * w, 0.6796 * h, 0.0468 * w, 0.7181 * h);
    builder.curveTo(0.0476 * w, 0.7567 * h, 0.0731 * w, 0.7852 * h, 0.1036 * w, 0.8029 * h);
    builder.curveTo(0.1341 * w, 0.8205 * h, 0.1728 * w, 0.8300 * h, 0.2151 * w, 0.8297 * h);
    builder.curveTo(0.2573 * w, 0.8295 * h, 0.2957 * w, 0.8196 * h, 0.3258 * w, 0.8015 * h);
    builder.curveTo(0.3559 * w, 0.7834 * h, 0.3808 * w, 0.7538 * h, 0.3802 * w, 0.7153 * h);
    builder.curveTo(0.3797 * w, 0.6768 * h, 0.3542 * w, 0.6481 * h, 0.3238 * w, 0.6303 * h);
    builder.curveTo(0.2933 * w, 0.6126 * h, 0.2547 * w, 0.6030 * h, 0.2124 * w, 0.6032 * h);
    builder.close();
    builder.fillAndStroke();

    // ── Sub-path 3: small circle (thought-bubble step 2) ─────────────────
    builder.begin();
    builder.moveTo(0.0805 * w, 0.8297 * h);
    builder.curveTo(0.0374 * w, 0.8303 * h, -0.0006 * w, 0.8674 * h, 0.0000 * w, 0.9157 * h);
    builder.curveTo(0.0006 * w, 0.9640 * h, 0.0392 * w, 1.0000 * h, 0.0824 * w, 0.9996 * h);
    builder.curveTo(0.1256 * w, 0.9991 * h, 0.1636 * w, 0.9621 * h, 0.1631 * w, 0.9138 * h);
    builder.curveTo(0.1628 * w, 0.8656 * h, 0.1243 * w, 0.8294 * h, 0.0811 * w, 0.8297 * h);
    builder.close();
    builder.fillAndStroke();

    builder.setShadow(false);
    builder.restore();
  }
}
