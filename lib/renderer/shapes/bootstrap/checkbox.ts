// @ts-nocheck
import type { RenderContext, ShapeAttrs } from '../../../renderer.ts';
import { BaseShapeHandler } from '../../shape-registry.ts';

export class BootstrapCheckboxHandler extends BaseShapeHandler {
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
    builder.roundrect(0, 0, width, height, 3, 3);
    builder.fillAndStroke();
    builder.setStrokeWidth('3');
    builder.begin();
    builder.moveTo(0.8 * width, 0.2 * height);
    builder.lineTo(0.4 * width, 0.8 * height);
    builder.lineTo(0.25 * width, 0.6 * height);
    builder.stroke();
    builder.restore();
  }
}
