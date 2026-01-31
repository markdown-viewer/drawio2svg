// @ts-nocheck
import type { RenderContext, ShapeAttrs } from '../../../renderer.ts';
import { BaseShapeHandler } from '../../shape-registry.ts';

export class BootstrapRoundedButtonHandler extends BaseShapeHandler {
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
    if (width > height) {
      d = 0.5 * height;
      builder.begin();
      builder.moveTo(width - d, 0);
      builder.arcTo(d, d, 0, 0, 1, width - d, height);
      builder.lineTo(d, height);
      builder.arcTo(d, d, 0, 0, 1, d, 0);
    } else {
      d = 0.5 * width;
      builder.begin();
      builder.moveTo(0, height - d);
      builder.arcTo(d, d, 0, 0, 0, width, height - d);
      builder.lineTo(width, d);
      builder.arcTo(d, d, 0, 0, 0, 0, d);
    }
    builder.close();
    builder.fillAndStroke();
    builder.restore();
  }
}
