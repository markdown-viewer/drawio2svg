// @ts-nocheck
import type { RenderContext, ShapeAttrs } from '../../../renderer.ts';
import { BaseShapeHandler } from '../../shape-registry.ts';

export class MockupMiscPrintIconHandler extends BaseShapeHandler {
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
    builder.moveTo(0.15 * width, 0.58 * height);
    builder.arcTo(0.03 * width, 0.03 * height, 0, 0, 1, 0.18 * width, 0.55 * height);
    builder.lineTo(0.82 * width, 0.55 * height);
    builder.arcTo(0.03 * width, 0.03 * height, 0, 0, 1, 0.85 * width, 0.58 * height);
    builder.lineTo(0.85 * width, 0.82 * height);
    builder.arcTo(0.03 * width, 0.03 * height, 0, 0, 1, 0.82 * width, 0.85 * height);
    builder.lineTo(0.18 * width, 0.85 * height);
    builder.arcTo(0.03 * width, 0.03 * height, 0, 0, 1, 0.15 * width, 0.82 * height);
    builder.close();
    builder.moveTo(0.7 * width, 0.52 * height);
    builder.lineTo(0.3 * width, 0.52 * height);
    builder.lineTo(0.3 * width, 0.15 * height);
    builder.lineTo(0.55 * width, 0.15 * height);
    builder.lineTo(0.55 * width, 0.3 * height);
    builder.lineTo(0.7 * width, 0.3 * height);
    builder.close();
    builder.moveTo(0.57 * width, 0.15 * height);
    builder.lineTo(0.7 * width, 0.28 * height);
    builder.lineTo(0.57 * width, 0.28 * height);
    builder.close();
    builder.fill();
    builder.restore();
  }
}
