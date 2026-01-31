// @ts-nocheck
import type { RenderContext, ShapeAttrs } from '../../../renderer.ts';
import { BaseShapeHandler } from '../../shape-registry.ts';

export class SysmlSendSigActHandler extends BaseShapeHandler {
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
    builder.lineTo(x + width - 0.3 * height, y);
    builder.lineTo(x + width, y + 0.5 * height);
    builder.lineTo(x + width - 0.3 * height, y + height);
    builder.lineTo(x, y + height);
    builder.close();
    builder.fillAndStroke();
    builder.restore();
  }
}
