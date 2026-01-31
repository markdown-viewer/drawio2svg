// @ts-nocheck
import type { RenderContext, ShapeAttrs } from '../../../renderer.ts';
import { BaseShapeHandler } from '../../shape-registry.ts';

export class MockupMiscEditIconHandler extends BaseShapeHandler {
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

    let f;
    f = this.getStyleValue(style, 'strokeColor', '#999999');
    builder.translate(x, y);
    builder.roundrect(0, 0, width, height, 0.05 * width, 0.05 * height);
    builder.fillAndStroke();
    builder.setShadow(!1);
    builder.setFillColor(f as string);
    builder.begin();
    builder.moveTo(0.11 * width, 0.8 * height);
    builder.lineTo(0.2 * width, 0.89 * height);
    builder.lineTo(0.05 * width, 0.95 * height);
    builder.close();
    builder.moveTo(0.74 * width, 0.16 * height);
    builder.lineTo(0.84 * width, 0.26 * height);
    builder.lineTo(0.22 * width, 0.88 * height);
    builder.lineTo(0.12 * width, 0.78 * height);
    builder.close();
    builder.moveTo(0.755 * width, 0.145 * height);
    builder.lineTo(0.82 * width, 0.08 * height);
    builder.lineTo(0.92 * width, 0.18 * height);
    builder.lineTo(0.855 * width, 0.245 * height);
    builder.close();
    builder.fill();
    builder.restore();
  }
}
