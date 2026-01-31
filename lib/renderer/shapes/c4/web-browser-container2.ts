// @ts-nocheck
import type { RenderContext, ShapeAttrs } from '../../../renderer.ts';
import { BaseShapeHandler } from '../../shape-registry.ts';

export class C4WebBrowserContainer2Handler extends BaseShapeHandler {
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
    d = this.getStyleValue(style, 'fillColor', '#ffffff');
    e = this.getStyleValue(style, 'strokeColor', '#000000');
    f = this.getStyleValue(style, 'strokeColor2', '#0E7DAD');
    builder.setStrokeColor(f as string);
    builder.setFillColor(e as string);
    builder.begin();
    builder.moveTo(0, 8);
    builder.arcTo(8, 8, 0, 0, 1, 8, 0);
    builder.lineTo(width - 8, 0);
    builder.arcTo(8, 8, 0, 0, 1, width, 8);
    builder.lineTo(width, height - 8);
    builder.arcTo(8, 8, 0, 0, 1, width - 8, height);
    builder.lineTo(8, height);
    builder.arcTo(8, 8, 0, 0, 1, 0, height - 8);
    builder.close();
    builder.fillAndStroke();
    builder.setShadow(!1);
    if (61 < width && 39 < height) {
      builder.setFillColor(d as string);
      builder.begin();
      builder.moveTo(5, 8);
      builder.arcTo(3, 3, 0, 0, 1, 8, 5);
      builder.lineTo(width - 36 - 20 - 3, 5);
      builder.arcTo(3, 3, 0, 0, 1, width - 36 - 20, 8);
      builder.lineTo(width - 36 - 20, 14);
      builder.arcTo(3, 3, 0, 0, 1, width - 36 - 20 - 3, 17);
      builder.lineTo(8, 17);
      builder.arcTo(3, 3, 0, 0, 1, 5, 14);
      builder.close();
      builder.moveTo(width - 36 - 15, 8);
      builder.arcTo(3, 3, 0, 0, 1, width - 36 - 15 + 3, 5);
      builder.lineTo(width - 24 - 15 - 3, 5);
      builder.arcTo(3, 3, 0, 0, 1, width - 24 - 15, 8);
      builder.lineTo(width - 24 - 15, 14);
      builder.arcTo(3, 3, 0, 0, 1, width - 24 - 15 - 3, 17);
      builder.lineTo(width - 36 - 15 + 3, 17);
      builder.arcTo(3, 3, 0, 0, 1, width - 36 - 15, 14);
      builder.close();
      builder.moveTo(width - 24 - 10, 8);
      builder.arcTo(3, 3, 0, 0, 1, width - 24 - 10 + 3, 5);
      builder.lineTo(width - 12 - 10 - 3, 5);
      builder.arcTo(3, 3, 0, 0, 1, width - 12 - 10, 8);
      builder.lineTo(width - 12 - 10, 14);
      builder.arcTo(3, 3, 0, 0, 1, width - 12 - 10 - 3, 17);
      builder.lineTo(width - 24 - 10 + 3, 17);
      builder.arcTo(3, 3, 0, 0, 1, width - 24 - 10, 14);
      builder.close();
      builder.moveTo(width - 12 - 5, 8);
      builder.arcTo(3, 3, 0, 0, 1, width - 12 - 5 + 3, 5);
      builder.lineTo(width - 5 - 3, 5);
      builder.arcTo(3, 3, 0, 0, 1, width - 5, 8);
      builder.lineTo(width - 5, 14);
      builder.arcTo(3, 3, 0, 0, 1, width - 5 - 3, 17);
      builder.lineTo(width - 12 - 5 + 3, 17);
      builder.arcTo(3, 3, 0, 0, 1, width - 12 - 5, 14);
      builder.close();
      builder.moveTo(5, 30);
      builder.arcTo(8, 8, 0, 0, 1, 13, 22);
      builder.lineTo(width - 8 - 5, 22);
      builder.arcTo(8, 8, 0, 0, 1, width - 5, 30);
      builder.lineTo(width - 5, height - 8 - 5);
      builder.arcTo(8, 8, 0, 0, 1, width - 8 - 5, height - 5);
      builder.lineTo(13, height - 5);
      builder.arcTo(8, 8, 0, 0, 1, 5, height - 8 - 5);
      builder.close();
      builder.fill();
      builder.fill();
    }
    builder.restore();
  }
}
