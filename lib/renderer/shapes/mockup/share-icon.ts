// @ts-nocheck
import type { RenderContext, ShapeAttrs } from '../../../renderer.ts';
import { BaseShapeHandler } from '../../shape-registry.ts';

export class MockupMiscShareIconHandler extends BaseShapeHandler {
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

    let f;
    f = this.getStyleValue(style, 'strokeColor', '#999999');
    builder.translate(d, y);
    builder.roundrect(0, 0, width, height, 0.05 * width, 0.05 * height);
    builder.fillAndStroke();
    builder.setShadow(!1);
    builder.setFillColor(f as string);
    builder.begin();
    builder.moveTo(0.15 * width, 0.18 * height);
    builder.arcTo(0.03 * width, 0.03 * height, 0, 0, 1, 0.18 * width, 0.15 * height);
    builder.lineTo(0.82 * width, 0.15 * height);
    builder.arcTo(0.03 * width, 0.03 * height, 0, 0, 1, 0.85 * width, 0.18 * height);
    builder.lineTo(0.85 * width, 0.82 * height);
    builder.arcTo(0.03 * width, 0.03 * height, 0, 0, 1, 0.82 * width, 0.85 * height);
    builder.lineTo(0.18 * width, 0.85 * height);
    builder.arcTo(0.03 * width, 0.03 * height, 0, 0, 1, 0.15 * width, 0.82 * height);
    builder.close();
    builder.fill();
    d = this.getStyleValue(style, 'fillColor', '#ffffff');
    builder.setFillColor(d as string);
    builder.begin();
    builder.moveTo(0.563 * width, 0.34 * height);
    builder.arcTo(0.095 * width, 0.095 * height, 0, 1, 1, 0.603 * width, 0.42 * height);
    builder.lineTo(0.44 * width, 0.5 * height);
    builder.lineTo(0.602 * width, 0.582 * height);
    builder.arcTo(0.095 * width, 0.095 * height, 0, 1, 1, 0.563 * width, 0.653 * height);
    builder.lineTo(0.403 * width, 0.575 * height);
    builder.arcTo(0.095 * width, 0.095 * height, 0, 1, 1, 0.4 * width, 0.42 * height);
    builder.close();
    builder.fill();
    builder.restore();
  }
}
