// @ts-nocheck
import type { RenderContext, ShapeAttrs } from '../../../renderer.ts';
import { BaseShapeHandler } from '../../shape-registry.ts';

export class FloorplanWindowGardenHandler extends BaseShapeHandler {
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
    f = Math.min(this.getStyleNumber(style, 'windowPanes', 3), 20);
    g = (width - 14 - 2 * (f - 1)) / f;
    builder.translate(d, y);
    builder.rect(0, height - 10, 5, 10);
    builder.fillAndStroke();
    builder.rect(width - 5, height - 10, 5, 10);
    builder.fillAndStroke();
    builder.begin();
    builder.moveTo(5, height);
    builder.lineTo(5, 0);
    builder.lineTo(width - 5, 0);
    builder.lineTo(width - 5, height);
    builder.lineTo(width - 5 - 2, height);
    builder.lineTo(width - 5 - 2, 2);
    for (d = 1; d < f; d++) {
      (builder.lineTo(width - 5 - 2 - d * g - 2 * (d - 1), 2),
        builder.lineTo(width - 5 - 2 - d * g - 2 * (d - 1), height),
        builder.lineTo(width - 5 - 4 - 2 * (d - 1) - d * g, height),
        builder.lineTo(width - 5 - 4 - 2 * (d - 1) - d * g, 2));
    }
    builder.lineTo(7, 2);
    builder.lineTo(7, height);
    builder.close();
    builder.fillAndStroke();
    builder.restore();
  }
}
