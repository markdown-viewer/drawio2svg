// @ts-nocheck
import type { RenderContext, ShapeAttrs } from '../../../renderer.ts';
import { BaseShapeHandler } from '../../shape-registry.ts';

export class Aws3dFlatEdgeHandler extends BaseShapeHandler {
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
    builder.setFillColor('#F4B934' as string);
    builder.setStrokeColor('none' as string);
    builder.begin();
    builder.moveTo(width - 46, 8.8);
    builder.lineTo(width - 61.2, 0);
    builder.lineTo(width, 0);
    builder.lineTo(width, 35.5);
    builder.lineTo(width - 15.4, 26.5);
    builder.lineTo(30.7, height);
    builder.lineTo(0, height - 17.7);
    builder.fillAndStroke();
    builder.restore();
  }
}
