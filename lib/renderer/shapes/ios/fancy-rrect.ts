// @ts-nocheck
import type { RenderContext, ShapeAttrs } from '../../../renderer.ts';
import { BaseShapeHandler } from '../../shape-registry.ts';

export class IosFancyRRectHandler extends BaseShapeHandler {
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

    let f;
    builder.translate(d, e);
    d = parseInt(this.getStyleNumber(style, 'rSize', 10));
    e = this.getStyleValue(style, 'fillColor', '#ffffff');
    f = this.getStyleValue(style, 'strokeColor', '#000000');
    builder.roundrect(0, 0, width, height, d);
    builder.fillAndStroke();
    builder.setShadow(!1);
    builder.setStrokeColor(e as string);
    builder.setGradient(e, '#ffffff', 0, 0, width, 22.5, 'south', 1, 1);
    builder.setAlpha(0.3);
    builder.begin();
    builder.moveTo(width - d, 0);
    builder.arcTo(d, d, 0, 0, 1, width, d);
    builder.lineTo(width, 17.5);
    builder.arcTo(1.67 * width, 2.5 * height, 0, 0, 1, 0, 17.5);
    builder.lineTo(0, d);
    builder.arcTo(d, d, 0, 0, 1, d, 0);
    builder.close();
    builder.fillAndStroke();
    builder.setAlpha(0.8);
    builder.setStrokeColor(f as string);
    builder.setStrokeWidth(1);
    builder.roundrect(0, 0, width, height, d, d);
    builder.stroke();
    builder.restore();
  }
}
