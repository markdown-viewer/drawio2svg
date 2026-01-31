// @ts-nocheck
import type { RenderContext, ShapeAttrs } from '../../../renderer.ts';
import { BaseShapeHandler } from '../../shape-registry.ts';

export class BootstrapRadioButton2Handler extends BaseShapeHandler {
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

    let f;
    let g;
    let h;
    f = this.getStyleValue(style, 'checked', !1);
    g = this.getStyleValue(style, 'checkedFill', '#ffffff');
    h = this.getStyleValue(style, 'checkedStroke', '#000000');
    builder.translate(x, y);
    if (f) {
      builder.setFillColor(g as string);
      builder.setStrokeColor(g as string);
      builder.ellipse(0, 0, width, height);
      builder.fillAndStroke();
      builder.setFillColor(h as string);
      builder.ellipse(0.2 * width, 0.2 * height, 0.6 * width, 0.6 * height);
      builder.fill();
    } else {
      builder.ellipse(0, 0, width, height);
      builder.fillAndStroke();
    }
    builder.restore();
  }
}
