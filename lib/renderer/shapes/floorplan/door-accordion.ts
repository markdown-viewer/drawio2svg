// @ts-nocheck
import type { RenderContext, ShapeAttrs } from '../../../renderer.ts';
import { BaseShapeHandler } from '../../shape-registry.ts';

export class FloorplanDoorAccordionHandler extends BaseShapeHandler {
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
    let g;
    f = width * Math.max(0, Math.min(width, this.getStyleNumber(style, 'dx', 0.5)));
    f = Math.max(5, f);
    f = Math.min(width - 5, f);
    g = parseFloat(this.getStyleValue(style, 'strokeWidth', 0.5));
    builder.translate(d, y);
    builder.rect(0, 0.5 * height - 5, 5, 10);
    builder.fillAndStroke();
    builder.rect(width - 5, 0.5 * height - 5, 5, 10);
    builder.fillAndStroke();
    builder.setStrokeWidth(3 * g);
    d = f - 5;
    builder.begin();
    builder.moveTo(5, 0.5 * height);
    builder.lineTo(5 + 0.1 * d, 0);
    builder.lineTo(5 + 0.3 * d, height);
    builder.lineTo(5 + 0.5 * d, 0);
    builder.lineTo(5 + 0.7 * d, height);
    builder.lineTo(5 + 0.9 * d, 0);
    builder.lineTo(5 + d, 0.5 * height);
    builder.stroke();
    builder.restore();
  }
}
