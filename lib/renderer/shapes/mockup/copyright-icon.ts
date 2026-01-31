// @ts-nocheck
import type { RenderContext, ShapeAttrs } from '../../../renderer.ts';
import { BaseShapeHandler } from '../../shape-registry.ts';

export class MockupMiscCopyrightIconHandler extends BaseShapeHandler {
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
    builder.ellipse(0, 0, width, height);
    builder.fillAndStroke();
    builder.setShadow(!1);
    builder.setFillColor(f as string);
    builder.begin();
    builder.moveTo(0.713 * width, 0.288 * height);
    builder.arcTo(0.3 * width, 0.3 * height, 0, 1, 0, 0.713 * width, 0.712 * height);
    builder.lineTo(0.784 * width, 0.783 * height);
    builder.arcTo(0.4 * width, 0.4 * height, 0, 1, 1, 0.784 * width, 0.217 * height);
    builder.close();
    builder.fill();
    builder.restore();
  }
}
