// @ts-nocheck
import type { RenderContext, ShapeAttrs } from '../../../renderer.ts';
import { BaseShapeHandler } from '../../shape-registry.ts';

export class Aws3dDashedEdge2Handler extends BaseShapeHandler {
  constructor(renderCtx: RenderContext) {
    super(renderCtx);
  }

  render(attrs: ShapeAttrs): void {
    const { builder, currentGroup, applyShapeAttrsToBuilder, x, y, width, height, style } =
      this.renderCtx;
    if (!builder || !currentGroup) return;
    if (width <= 0 || height <= 0) return;

    builder.setCanvasRoot(currentGroup);
    builder.save();
    applyShapeAttrsToBuilder(builder, attrs);
    let d = x;

    builder.translate(d, y);
    d = this.getStyleValue(style, 'strokeColor', '#000000');
    builder.save();
    builder.setStrokeColor('none' as string);
    builder.setFillColor(d as string);
    builder.begin();
    builder.moveTo(width - 21, 5.5);
    builder.lineTo(width, 0);
    builder.lineTo(width - 9.7, 12.2);
    builder.fillAndStroke();
    builder.restore();
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
