// @ts-nocheck
import type { RenderContext, ShapeAttrs } from '../../../renderer.ts';
import { BaseShapeHandler } from '../../shape-registry.ts';

export class Aws3dArrowSEHandler extends BaseShapeHandler {
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
    builder.moveTo(width - 17, height - 8);
    builder.lineTo(width - 21, height - 5.5);
    builder.lineTo(width, height);
    builder.lineTo(width - 9.7, height - 12.2);
    builder.lineTo(width - 13.9, height - 9.8);
    builder.lineTo(9.7, 3.5);
    builder.arcTo(6, 3, 0, 0, 0, 9, 0.4);
    builder.arcTo(5.2, 3, 0, 0, 0, 1, 1.4);
    builder.arcTo(6, 2.8, 0, 0, 0, 3, 5.4);
    builder.arcTo(5, 3, 0, 0, 0, 6.7, 5.2);
    builder.close();
    builder.fillAndStroke();
    builder.restore();
  }
}
