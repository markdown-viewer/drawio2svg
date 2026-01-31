// @ts-nocheck
import type { RenderContext, ShapeAttrs } from '../../../renderer.ts';
import { BaseShapeHandler } from '../../shape-registry.ts';

export class AndroidQuickscroll3Handler extends BaseShapeHandler {
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
    f = Math.min(
      height - 10,
      Math.max(10, height * Math.max(0, Math.min(height, this.getStyleNumber(style, 'dy', 0.5))))
    );
    this.getStyleValue(style, 'fillColor', '#ffffff');
    g = this.getStyleValue(style, 'fillColor2', '#cccccc');
    builder.translate(x, y);
    builder.save();
    builder.setStrokeColor(g as string);
    builder.begin();
    builder.moveTo(0.5 * width, 0);
    builder.lineTo(0.5 * width, height);
    builder.stroke();
    builder.restore();
    builder.begin();
    builder.roundrect(0.5 * width - 3, f - 10, 6, 20, 1, 1);
    builder.fillAndStroke();
    builder.restore();
  }
}
