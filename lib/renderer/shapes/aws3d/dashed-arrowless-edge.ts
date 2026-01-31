// @ts-nocheck
import type { RenderContext, ShapeAttrs } from '../../../renderer.ts';
import { BaseShapeHandler } from '../../shape-registry.ts';

export class Aws3dDashedArrowlessEdgeHandler extends BaseShapeHandler {
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
    builder.setStrokeColor('#2D6195' as string);
    builder.setStrokeWidth('4');
    builder.setDashed('true');
    builder.setLineCap('round');
    builder.begin();
    builder.moveTo(0, 0);
    builder.lineTo(width, height);
    builder.stroke();
    builder.restore();
  }
}
