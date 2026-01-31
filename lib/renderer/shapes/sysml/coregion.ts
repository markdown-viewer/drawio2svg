// @ts-nocheck
import type { RenderContext, ShapeAttrs } from '../../../renderer.ts';
import { BaseShapeHandler } from '../../shape-registry.ts';

export class SysmlCoregionHandler extends BaseShapeHandler {
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
    d = Math.min(10, height);
    builder.begin();
    builder.moveTo(0, d);
    builder.lineTo(0, 0);
    builder.lineTo(width, 0);
    builder.lineTo(width, d);
    builder.moveTo(0, height - d);
    builder.lineTo(0, height);
    builder.lineTo(width, height);
    builder.lineTo(width, height - d);
    builder.stroke();
    builder.restore();
  }
}
