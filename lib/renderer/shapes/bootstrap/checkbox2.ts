// @ts-nocheck
import type { RenderContext, ShapeAttrs } from '../../../renderer.ts';
import { BaseShapeHandler } from '../../shape-registry.ts';

export class BootstrapCheckbox2Handler extends BaseShapeHandler {
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
      builder.setStrokeColor(h as string);
      builder.roundrect(0, 0, width, height, 2, 2);
      builder.fill();
      builder.setStrokeWidth('2');
      builder.begin();
      builder.moveTo(0.8 * width, 0.2 * height);
      builder.lineTo(0.4 * width, 0.75 * height);
      builder.lineTo(0.25 * width, 0.6 * height);
      builder.stroke();
    } else {
      builder.roundrect(0, 0, width, height, 2, 2);
      builder.fillAndStroke();
    }
    builder.restore();
  }
}
