// @ts-nocheck
import type { RenderContext, ShapeAttrs } from '../../../renderer.ts';
import { BaseShapeHandler } from '../../shape-registry.ts';

export class Aws3dSnapshotHandler extends BaseShapeHandler {
  constructor(renderCtx: RenderContext) {
    super(renderCtx);
  }

  render(attrs: ShapeAttrs): void {
    const { builder, currentGroup, applyShapeAttrsToBuilder, x, y, width, height, style } =
      this.renderCtx;
    if (!builder || !currentGroup) return;
    if (width <= 0 || height <= 0) return;

    builder.setCanvasRoot(currentGroup);
    builder.save();
    applyShapeAttrsToBuilder(builder, attrs);
    let d = x;
    let e = y;

    let f;
    let g;
    builder.translate(d, e);
    e = parseFloat(this.getStyleValue(style, 'strokeWidth', '1'));
    f = (e * width) / 92;
    e = (e * height) / 60;
    g = parseFloat(this.getStyleValue(style, 'shadow', '0'));
    d = this.getStyleValue(style, 'strokeColor2', '#292929');
    e = Math.min(f, e);
    builder.setStrokeWidth(e);
    builder.setShadow(!1);
    builder.save();
    builder.save();
    builder.setStrokeWidth(2 * e);
    builder.setStrokeColor(d as string);
    builder.setLineJoin('round');
    if (1 == g) {
      builder.setShadow(!0);
    }
    builder.begin();
    builder.moveTo(width, 0.6483 * height);
    builder.lineTo(0.9316 * width, 0.4133 * height);
    builder.lineTo(0.4674 * width, 0);
    builder.lineTo(0.3315 * width, 0);
    builder.lineTo(0.0641 * width, 0.2367 * height);
    builder.lineTo(0, 0.465 * height);
    builder.lineTo(0.6 * width, height);
    builder.close();
    builder.fillAndStroke();
    builder.restore();
    builder.setFillColor('#000000' as string);
    f = this.getStyleValue(style, 'shadingCols', '0.1,0.3').toString().split(',');
    g = this.getStyleValue(style, 'flipH', '0');
    if ('0' == g) {
      builder.setAlpha(f[1]);
    } else {
      builder.setAlpha(f[0]);
    }
    builder.begin();
    builder.moveTo(width, 0.65 * height);
    builder.lineTo(0.9348 * width, 0.52 * height);
    builder.lineTo(0.6674 * width, 0.7667 * height);
    builder.lineTo(0.5337 * width, 0.7667 * height);
    builder.lineTo(0.6 * width, height);
    builder.close();
    builder.fill();
    if ('0' == g) {
      builder.setAlpha(f[0]);
    } else {
      builder.setAlpha(f[1]);
    }
    builder.begin();
    builder.moveTo(0.6 * width, height);
    builder.lineTo(0.5359 * width, 0.77 * height);
    builder.lineTo(0.0674 * width, 0.355 * height);
    builder.lineTo(0.0653 * width, 0.24 * height);
    builder.lineTo(0, 0.4667 * height);
    builder.close();
    builder.fill();
    builder.restore();
    builder.setLineJoin('round');
    builder.begin();
    builder.moveTo(width, 0.65 * height);
    builder.lineTo(0.9348 * width, 0.52 * height);
    builder.lineTo(0.6674 * width, 0.7667 * height);
    builder.lineTo(0.5337 * width, 0.7667 * height);
    builder.lineTo(0.6 * width, height);
    builder.close();
    builder.stroke();
    builder.begin();
    builder.moveTo(0.6 * width, height);
    builder.lineTo(0.5359 * width, 0.77 * height);
    builder.lineTo(0.0674 * width, 0.355 * height);
    builder.lineTo(0.0653 * width, 0.24 * height);
    builder.lineTo(0, 0.4667 * height);
    builder.close();
    builder.stroke();
    builder.begin();
    builder.moveTo(0.9348 * width, 0.42 * height);
    builder.lineTo(0.9348 * width, 0.52 * height);
    builder.moveTo(0.6663 * width, 0.7667 * height);
    builder.lineTo(0.6 * width, height);
    builder.moveTo(0.0652 * width, 0.355 * height);
    builder.lineTo(0, 0.4733 * height);
    builder.stroke();
    builder.setStrokeWidth(2 * e);
    builder.setStrokeColor(d as string);
    builder.setLineJoin('round');
    builder.begin();
    builder.moveTo(width, 0.6483 * height);
    builder.lineTo(0.9316 * width, 0.4133 * height);
    builder.lineTo(0.4674 * width, 0);
    builder.lineTo(0.3315 * width, 0);
    builder.lineTo(0.0641 * width, 0.2367 * height);
    builder.lineTo(0, 0.465 * height);
    builder.lineTo(0.6 * width, height);
    builder.close();
    builder.stroke();
    builder.restore();
  }
}
