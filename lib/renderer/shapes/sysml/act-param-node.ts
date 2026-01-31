// @ts-nocheck
import type { RenderContext, ShapeAttrs } from '../../../renderer.ts';
import { BaseShapeHandler } from '../../shape-registry.ts';

export class SysmlActParamNodeHandler extends BaseShapeHandler {
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
    let e = y;

    builder.translate(d, e);
    builder.begin();
    d = Math.max(0.35 * width, 70);
    e = Math.min(0.65 * width, width - 10);
    builder.begin();
    builder.moveTo(d, height);
    builder.lineTo(10, height);
    builder.lineTo(10, 0);
    builder.lineTo(d, 0);
    builder.moveTo(e, height);
    builder.lineTo(width - 10, height);
    builder.lineTo(width - 10, 0);
    builder.lineTo(e, 0);
    builder.stroke();
    d = Math.min(50, width);
    if (20 < d) {
      builder.begin();
      builder.moveTo(10, 20);
      builder.lineTo(d - 10, 20);
      builder.lineTo(d, 10);
      builder.lineTo(d, 0);
      builder.lineTo(10, 0);
      builder.close();
      builder.fillAndStroke();
    }
    builder.rect(0, 0.35 * height - 10, 20, 20);
    builder.fillAndStroke();
    builder.rect(0, 0.65 * height - 10, 20, 20);
    builder.fillAndStroke();
    builder.rect(width - 20, 0.5 * height - 10, 20, 20);
    builder.fillAndStroke();
    builder.restore();
  }
}
