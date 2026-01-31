// @ts-nocheck
import type { RenderContext, ShapeAttrs } from '../../../renderer.ts';
import { BaseShapeHandler } from '../../shape-registry.ts';

export class SysmlAccEventHandler extends BaseShapeHandler {
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

    builder.begin();
    builder.moveTo(x, y);
    builder.lineTo(x + width, y);
    builder.lineTo(x + width, y + height);
    builder.lineTo(x, y + height);
    builder.lineTo(x + 0.3 * height, y + 0.5 * height);
    builder.close();
    builder.fillAndStroke();
    builder.restore();
  }
}
