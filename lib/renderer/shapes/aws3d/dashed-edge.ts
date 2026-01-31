// @ts-nocheck
import type { RenderContext, ShapeAttrs } from '../../../renderer.ts';
import { BaseShapeHandler } from '../../shape-registry.ts';

export class Aws3dDashedEdgeHandler extends BaseShapeHandler {
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
    builder.setFillColor('#2D6195' as string);
    builder.save();
    builder.setStrokeColor('none' as string);
    builder.begin();
    builder.moveTo(width - 21, 5.5);
    builder.lineTo(width, 0);
    builder.lineTo(width - 9.7, 12.2);
    builder.fillAndStroke();
    builder.restore();
    builder.setStrokeColor('#2D6195' as string);
    builder.setStrokeWidth('4');
    builder.setDashed('true');
    builder.setLineCap('round');
    builder.begin();
    builder.moveTo(width - 7.675, 4.425);
    builder.lineTo(0, height);
    builder.stroke();
    builder.restore();
  }
}
