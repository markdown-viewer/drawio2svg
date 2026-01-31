// @ts-nocheck
import type { RenderContext, ShapeAttrs } from '../../../renderer.ts';
import { BaseShapeHandler } from '../../shape-registry.ts';

export class Aws3dFlatDoubleEdgeHandler extends BaseShapeHandler {
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
    builder.moveTo(15.3, 61.9);
    builder.lineTo(30.8, 53.2);
    builder.lineTo(15.4, 44.2);
    builder.lineTo(0, 53.2);
    builder.lineTo(15.4, 8.8);
    builder.lineTo(92.1, 0);
    builder.lineTo(76.5, 8.8);
    builder.lineTo(92.1, 17.7);
    builder.lineTo(107.4, 8.8);
    builder.lineTo(width - 15.3, height - 61.9);
    builder.lineTo(width - 30.8, height - 53.2);
    builder.lineTo(width - 15.4, height - 44.2);
    builder.lineTo(width, height - 53.2);
    builder.lineTo(width - 15.4, height - 8.8);
    builder.lineTo(width - 92.1, height);
    builder.lineTo(width - 76.5, height - 8.8);
    builder.lineTo(width - 92.1, height - 17.7);
    builder.lineTo(width - 107.4, height - 8.8);
    builder.fillAndStroke();
    builder.restore();
  }
}
