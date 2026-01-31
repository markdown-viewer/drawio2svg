// @ts-nocheck
import type { RenderContext, ShapeAttrs } from '../../../renderer.ts';
import { BaseShapeHandler } from '../../shape-registry.ts';

export class MockupMiscRegisteredIconHandler extends BaseShapeHandler {
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
    builder.moveTo(0.29 * width, 0.9 * height);
    builder.lineTo(0.29 * width, 0.09 * height);
    builder.lineTo(0.5 * width, 0.09 * height);
    builder.arcTo(0.2195 * width, 0.2195 * height, 0, 0, 1, 0.545 * width, 0.525 * height);
    builder.lineTo(0.738 * width, 0.91 * height);
    builder.lineTo(0.674 * width, 0.91 * height);
    builder.lineTo(0.4825 * width, 0.53 * height);
    builder.lineTo(0.35 * width, 0.53 * height);
    builder.lineTo(0.35 * width, 0.9 * height);
    builder.close();
    builder.moveTo(0.35 * width, 0.47 * height);
    builder.lineTo(0.5 * width, 0.47 * height);
    builder.arcTo(0.15 * width, 0.15 * height, 0, 0, 0, 0.5 * width, 0.15 * height);
    builder.lineTo(0.35 * width, 0.15 * height);
    builder.close();
    builder.fill();
    builder.restore();
  }
}
