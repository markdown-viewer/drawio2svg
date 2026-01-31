// @ts-nocheck
import type { RenderContext, ShapeAttrs } from '../../../renderer.ts';
import { BaseShapeHandler } from '../../shape-registry.ts';

export class AndroidQuickscroll2Handler extends BaseShapeHandler {
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
    f = Math.min(
      height - 20,
      Math.max(20, height * Math.max(0, Math.min(height, this.getStyleNumber(style, 'dy', 0.5))))
    );
    this.getStyleValue(style, 'fillColor', '#ffffff');
    g = this.getStyleValue(style, 'fillColor2', '#cccccc');
    h = this.getStyleValue(style, 'fillColor3', '#666666');
    builder.translate(x, y);
    builder.save();
    builder.save();
    builder.setStrokeColor(g as string);
    builder.begin();
    builder.moveTo(width - 3, 0);
    builder.lineTo(width - 3, height);
    builder.stroke();
    builder.restore();
    builder.begin();
    builder.roundrect(width - 6, f - 10, 6, 20, 1, 1);
    builder.fillAndStroke();
    builder.setFillColor(g as string);
    builder.begin();
    builder.rect(0, f - 20, width - 18, 40);
    builder.fill();
    builder.setFillColor(h as string);
    builder.begin();
    builder.moveTo(width - 18, f - 20);
    builder.lineTo(width - 6, f);
    builder.lineTo(width - 18, f + 20);
    builder.close();
    builder.fill();
    builder.setFontSize(Number.parseFloat(String('12')) || 0);
    builder.text(0.5 * (width - 18), f, 0, 0, 'Aa', 'center', 'middle', 0, 0, 0);
    builder.restore();
  }
}
