// @ts-nocheck
import type { RenderContext, ShapeAttrs } from '../../../renderer.ts';
import { BaseShapeHandler } from '../../shape-registry.ts';

export class FloorplanDoorBifoldHandler extends BaseShapeHandler {
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
    let g;
    f = width * Math.max(0, Math.min(width, this.getStyleNumber(style, 'dx', 0.5)));
    g = parseFloat(this.getStyleValue(style, 'strokeWidth', 0.5));
    builder.translate(x, y);
    builder.rect(0, height - 10, 5, 10);
    builder.fillAndStroke();
    builder.rect(width - 5, height - 10, 5, 10);
    builder.fillAndStroke();
    builder.setStrokeWidth(3 * g);
    builder.begin();
    builder.moveTo(5, height - 10);
    builder.lineTo(Math.max(0.5 * (f - 10) + 5, 5), 0);
    builder.lineTo(Math.max(f, 5), height - 10);
    builder.moveTo(width - 5, height - 10);
    builder.lineTo(width - Math.max(0.5 * (f - 10) + 5, 5), 0);
    builder.lineTo(width - Math.max(f, 5), height - 10);
    builder.stroke();
    builder.restore();
  }
}
