// @ts-nocheck
import type { RenderContext, ShapeAttrs } from '../../../renderer.ts';
import { BaseShapeHandler } from '../../shape-registry.ts';

export class FloorplanWindowBayHandler extends BaseShapeHandler {
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

    builder.translate(x, y);
    builder.begin();
    builder.moveTo(0, 0);
    builder.lineTo(0.15 * width, 0.6 * height);
    builder.lineTo(0.35 * width, height);
    builder.lineTo(0.65 * width, height);
    builder.lineTo(0.85 * width, 0.6 * height);
    builder.lineTo(width, 0);
    builder.stroke();
    builder.restore();
  }
}
