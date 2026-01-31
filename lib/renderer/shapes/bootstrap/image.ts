// @ts-nocheck
import type { RenderContext, ShapeAttrs } from '../../../renderer.ts';
import { BaseShapeHandler } from '../../shape-registry.ts';

export class BootstrapImageHandler extends BaseShapeHandler {
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
    let b = width;
    let c = height;

    builder.translate(d, e);
    d = Math.max(0, parseInt(this.getStyleNumber(style, 'rSize', 10)));
    this.getStyleValue(style, 'strokeColor', '#000000');
    this.getStyleValue(style, 'fillColor', '#ffffff');
    builder.begin();
    builder.moveTo(0, d);
    builder.arcTo(d, d, 0, 0, 1, d, 0);
    builder.lineTo(b - d, 0);
    builder.arcTo(d, d, 0, 0, 1, b, d);
    builder.lineTo(b, c - d);
    builder.arcTo(d, d, 0, 0, 1, b - d, c);
    builder.lineTo(d, c);
    builder.arcTo(d, d, 0, 0, 1, 0, c - d);
    builder.close();
    builder.stroke();
    e = 0.5 * d;
    builder.translate(e, e);
    b = Math.max(0, b - d);
    c = Math.max(0, c - d);
    builder.begin();
    builder.moveTo(0, e);
    builder.arcTo(e, e, 0, 0, 1, e, 0);
    builder.lineTo(b - e, 0);
    builder.arcTo(e, e, 0, 0, 1, b, e);
    builder.lineTo(b, c - e);
    builder.arcTo(e, e, 0, 0, 1, b - e, c);
    builder.lineTo(e, c);
    builder.arcTo(e, e, 0, 0, 1, 0, c - e);
    builder.close();
    builder.fill();
    builder.restore();
  }
}
