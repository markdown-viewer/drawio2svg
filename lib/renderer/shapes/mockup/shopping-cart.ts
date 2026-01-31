// @ts-nocheck
import type { RenderContext, ShapeAttrs } from '../../../renderer.ts';
import { BaseShapeHandler } from '../../shape-registry.ts';

export class MockupMiscShoppingCartHandler extends BaseShapeHandler {
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
    f = this.getStyleValue(style, 'strokeColor', '#000000');
    builder.translate(x, y);
    builder.setStrokeWidth(3);
    builder.begin();
    builder.moveTo(0.975 * width, 0.025 * height);
    builder.lineTo(0.82 * width, 0.055 * height);
    builder.lineTo(0.59 * width, 0.66 * height);
    builder.lineTo(0.7 * width, 0.765 * height);
    builder.arcTo(0.06 * width, 0.06 * height, 0, 0, 1, 0.665 * width, 0.86 * height);
    builder.lineTo(0.05 * width, 0.86 * height);
    builder.moveTo(0.74 * width, 0.26 * height);
    builder.lineTo(0.03 * width, 0.28 * height);
    builder.lineTo(0.065 * width, 0.61 * height);
    builder.lineTo(0.59 * width, 0.66 * height);
    builder.stroke();
    builder.setStrokeWidth(1);
    builder.begin();
    builder.moveTo(0.15 * width, 0.28 * height);
    builder.lineTo(0.15 * width, 0.62 * height);
    builder.moveTo(0.265 * width, 0.275 * height);
    builder.lineTo(0.265 * width, 0.63 * height);
    builder.moveTo(0.38 * width, 0.27 * height);
    builder.lineTo(0.38 * width, 0.64 * height);
    builder.moveTo(0.495 * width, 0.265 * height);
    builder.lineTo(0.495 * width, 0.65 * height);
    builder.moveTo(0.61 * width, 0.265 * height);
    builder.lineTo(0.61 * width, 0.61 * height);
    builder.stroke();
    builder.begin();
    builder.moveTo(0.69 * width, 0.405 * height);
    builder.lineTo(0.045 * width, 0.405 * height);
    builder.moveTo(0.645 * width, 0.52 * height);
    builder.lineTo(0.055 * width, 0.52 * height);
    builder.stroke();
    builder.setFillColor(f as string);
    builder.ellipse(0.075 * width, 0.89 * height, 0.1 * width, 0.1 * height);
    builder.fillAndStroke();
    builder.ellipse(0.62 * width, 0.89 * height, 0.1 * width, 0.1 * height);
    builder.fillAndStroke();
    builder.restore();
  }
}
