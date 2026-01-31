// @ts-nocheck
import type { RenderContext, ShapeAttrs } from '../../../renderer.ts';
import { BaseShapeHandler } from '../../shape-registry.ts';

export class FloorplanWindowBowHandler extends BaseShapeHandler {
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
    let d = x;

    builder.translate(d, y);
    d = Math.min(0.5 * width, height);
    builder.begin();
    builder.moveTo(0, 0.5 * (height - d));
    builder.lineTo(d, 0.5 * (height + d));
    builder.lineTo(width - d, 0.5 * (height + d));
    builder.lineTo(width, 0.5 * (height - d));
    builder.stroke();
    builder.restore();
  }
}
