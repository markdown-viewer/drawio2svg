// @ts-nocheck
import type { RenderContext, ShapeAttrs } from '../../../renderer.ts';
import { BaseShapeHandler } from '../../shape-registry.ts';

export class AndroidSpinner2Handler extends BaseShapeHandler {
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
    builder.moveTo(0, height);
    builder.lineTo(width, height);
    builder.stroke();
    d = Math.min(width / 10, height);
    builder.begin();
    builder.moveTo(width - d, height);
    builder.lineTo(width, height - d);
    builder.lineTo(width, height);
    builder.close();
    builder.fillAndStroke();
    builder.restore();
  }
}
