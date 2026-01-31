// @ts-nocheck
import type { RenderContext, ShapeAttrs } from '../../../renderer.ts';
import { BaseShapeHandler } from '../../shape-registry.ts';

export class Pid2valvesAutoRecircValveHandler extends BaseShapeHandler {
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
    let e = y;

    builder.setLineJoin('round');
    builder.translate(d, e);
    builder.rect(0, 0, width, height);
    builder.fillAndStroke();
    builder.setShadow(!1);
    builder.begin();
    builder.moveTo(0.08 * width, 0.08 * height);
    builder.lineTo(0.08 * width, 0.92 * height);
    builder.moveTo(0.92 * width, 0.08 * height);
    builder.lineTo(0.92 * width, 0.92 * height);
    builder.moveTo(0.12 * width, 0.122 * height);
    builder.lineTo(0.8738 * width, 0.8837 * height);
    builder.moveTo(0.5 * width, 0);
    builder.lineTo(0.55 * width, 0.05 * height);
    builder.lineTo(0.45 * width, 0.15 * height);
    builder.lineTo(0.55 * width, 0.25 * height);
    builder.lineTo(0.45 * width, 0.35 * height);
    builder.lineTo(0.55 * width, 0.45 * height);
    builder.lineTo(0.49 * width, 0.5 * height);
    builder.stroke();
    d = this.getStyleValue(style, 'fillColor', '#ffffff');
    e = this.getStyleValue(style, 'strokeColor', '#000000');
    builder.begin();
    builder.moveTo(0.8257 * width, 0.7695 * height);
    builder.lineTo(0.8797 * width, 0.888 * height);
    builder.lineTo(0.79 * width, 0.8651 * height);
    builder.close();
    builder.setFillColor(e as string);
    builder.fillAndStroke();
    builder.setFillColor(d as string);
    builder.restore();
  }
}
