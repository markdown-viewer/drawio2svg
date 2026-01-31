// @ts-nocheck
import type { RenderContext, ShapeAttrs } from '../../../renderer.ts';
import { BaseShapeHandler } from '../../shape-registry.ts';

export class MockupMiscVolumeIconHandler extends BaseShapeHandler {
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
    builder.moveTo(0.1 * width, 0.3 * height);
    builder.lineTo(0.3 * width, 0.3 * height);
    builder.lineTo(0.5 * width, 0.15 * height);
    builder.lineTo(0.5 * width, 0.85 * height);
    builder.lineTo(0.3 * width, 0.7 * height);
    builder.lineTo(0.1 * width, 0.7 * height);
    builder.close();
    builder.fill();
    builder.begin();
    builder.moveTo(0.6 * width, 0.4 * height);
    builder.arcTo(0.2 * width, 0.2 * height, 0, 0, 1, 0.6 * width, 0.6 * height);
    builder.moveTo(0.7 * width, 0.3 * height);
    builder.arcTo(0.3 * width, 0.3 * height, 0, 0, 1, 0.7 * width, 0.7 * height);
    builder.moveTo(0.8 * width, 0.2 * height);
    builder.arcTo(0.4 * width, 0.4 * height, 0, 0, 1, 0.8 * width, 0.8 * height);
    builder.stroke();
    builder.restore();
  }
}
