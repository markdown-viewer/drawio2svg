// @ts-nocheck
import type { RenderContext, ShapeAttrs } from '../../../renderer.ts';
import { ActorShapeHandler } from '../../shape-registry.ts';

export class BasicDropHandler extends ActorShapeHandler {
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

    let f;
    builder.translate(d, e);
    d = 0.5 * Math.min(height, width);
    e = height - d;
    f = Math.atan(Math.sqrt(e * e - d * d) / d);
    e = d * Math.sin(f);
    f = d * Math.cos(f);
    builder.begin();
    builder.moveTo(0.5 * width, 0);
    builder.lineTo(0.5 * width + e, height - d - f);
    builder.arcTo(d, d, 0, 0, 1, 0.5 * width + d, height - d);
    builder.arcTo(d, d, 0, 0, 1, 0.5 * width, height);
    builder.arcTo(d, d, 0, 0, 1, 0.5 * width - d, height - d);
    builder.arcTo(d, d, 0, 0, 1, 0.5 * width - e, height - d - f);
    builder.close();
    builder.fillAndStroke();
    builder.restore();
  }
}
