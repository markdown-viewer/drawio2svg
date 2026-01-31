// @ts-nocheck
import type { RenderContext, ShapeAttrs } from '../../../renderer.ts';
import { BaseShapeHandler } from '../../shape-registry.ts';

export class SysmlIsStreamHandler extends BaseShapeHandler {
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

    builder.translate(d, e);
    d = this.getStyleValue(style, 'strokeColor', '#000000');
    e = this.getStyleValue(style, 'fillColor', '#ffffff');
    builder.setFillColor(d as string);
    builder.rect(0, 0.5 * height - 10, 10, 20);
    builder.fillAndStroke();
    builder.setFillColor(e as string);
    builder.roundrect(10, 0, width - 20, height, 10, 10);
    builder.fillAndStroke();
    builder.setFillColor(d as string);
    builder.rect(width - 10, 0.5 * height - 10, 10, 20);
    builder.fillAndStroke();
    builder.restore();
  }
}
