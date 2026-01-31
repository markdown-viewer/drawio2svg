// @ts-nocheck
import type { RenderContext, ShapeAttrs } from '../../../renderer.ts';
import { BaseShapeHandler } from '../../shape-registry.ts';

export class Gcp2DoubleRectHandler extends BaseShapeHandler {
  constructor(renderCtx: RenderContext) {
    super(renderCtx);
  }

  render(attrs: ShapeAttrs): void {
    const { builder, currentGroup, applyShapeAttrsToBuilder, x, y, width, height } = this.renderCtx;
    if (!builder || !currentGroup) return;
    if (width <= 0 || height <= 0) return;

    builder.setCanvasRoot(currentGroup);
    builder.save();
    applyShapeAttrsToBuilder(builder, attrs);
    let b = width;
    let c = height;

    b -= 8;
    c -= 8;
    builder.translate(x, y);
    builder.begin();
    builder.roundrect(8, 8, b, c, 1, 1);
    builder.fillAndStroke();
    builder.roundrect(0, 0, b, c, 1, 1);
    builder.fillAndStroke();
    builder.restore();
  }
}
