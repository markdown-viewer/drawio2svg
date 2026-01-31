// @ts-nocheck
import type { RenderContext, ShapeAttrs } from '../../../renderer.ts';
import { BaseShapeHandler } from '../../shape-registry.ts';

export class DfdDataStoreIDHandler extends BaseShapeHandler {
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
    builder.begin();
    builder.moveTo(width, height);
    builder.lineTo(0, height);
    builder.lineTo(0, 0);
    builder.lineTo(width, 0);
    builder.fillAndStroke();
    builder.setShadow(!1);
    d = Math.min(30, width);
    builder.begin();
    builder.moveTo(d, 0);
    builder.lineTo(d, height);
    builder.stroke();
    builder.restore();
  }
}
