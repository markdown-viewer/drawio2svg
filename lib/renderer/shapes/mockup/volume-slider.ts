// @ts-nocheck
import type { RenderContext, ShapeAttrs } from '../../../renderer.ts';
import { BaseShapeHandler } from '../../shape-registry.ts';

export class MockupMiscVolumeSliderHandler extends BaseShapeHandler {
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

    let f;
    let g;
    builder.translate(d, e);
    e = this.getStyleNumber(style, 'barPos', 80);
    d = this.getStyleValue(style, 'fillColor2', '#ddeeff');
    this.getStyleValue(style, 'strokeColor', '#999999');
    e = Math.min(e, 100);
    e = Math.max(e, 0);
    c = Math.max(c, 25);
    b = Math.max(b, 87.5);
    f = b - 25;
    g = 0.5 * (c - 25);
    builder.begin();
    builder.moveTo(f + 1.25, g + 8.75);
    builder.lineTo(f + 3.75, g + 8.75);
    builder.lineTo(f + 7.5, g + 5);
    builder.lineTo(f + 7.5, g + 20);
    builder.lineTo(f + 3.75, g + 16.25);
    builder.lineTo(f + 1.25, g + 16.25);
    builder.close();
    builder.fill();
    e = ((b - 32.5) * e) / 100;
    f = b - 25;
    g = 0.5 * (c - 25);
    builder.begin();
    builder.moveTo(f + 10, g + 8.75);
    builder.arcTo(5, 7.5, 0, 0, 1, f + 10, g + 16.25);
    builder.moveTo(f + 10.625, g + 6.25);
    builder.arcTo(5.625, 8.75, 0, 0, 1, f + 10.625, g + 18.75);
    builder.moveTo(f + 12.5, g + 5);
    builder.arcTo(6.25, 10, 0, 0, 1, f + 12.5, g + 20);
    builder.fillAndStroke();
    c = 0.5 * (c - 25);
    builder.roundrect(0, c + 8.75, b - 32.5, 7.5, 5, 5);
    builder.fill();
    builder.setShadow(!1);
    builder.setFillColor(d as string);
    builder.roundrect(0, c + 8.75, e, 7.5, 5, 5);
    builder.fill();
    builder.ellipse(e - 6.25, c + 6.25, 12.5, 12.5);
    builder.fillAndStroke();
    builder.restore();
  }
}
