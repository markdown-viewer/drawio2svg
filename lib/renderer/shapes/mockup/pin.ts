// @ts-nocheck
import type { RenderContext, ShapeAttrs } from '../../../renderer.ts';
import { BaseShapeHandler } from '../../shape-registry.ts';

export class MockupMiscPinHandler extends BaseShapeHandler {
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
    f = this.getStyleValue(style, 'fillColor2', '#000000');
    g = this.getStyleValue(style, 'fillColor3', '#000000');
    h = this.getStyleValue(style, 'strokeColor', '#000000');
    builder.setShadow(!1);
    builder.translate(x, y);
    builder.setStrokeWidth(3);
    builder.setStrokeColor('#666666' as string);
    builder.begin();
    builder.moveTo(0.5 * width, 0.4 * height);
    builder.lineTo(0.5 * width, height);
    builder.stroke();
    builder.setStrokeWidth(2);
    builder.setStrokeColor(h as string);
    builder.setGradient(f, g, 0, 0, width, 0.4 * height, 'south', 1, 1);
    builder.setAlpha(0.9);
    builder.ellipse(0, 0, width, 0.4 * height);
    builder.fillAndStroke();
    builder.setFillColor('#ffffff' as string);
    builder.setAlpha(0.5);
    builder.ellipse(0.2 * width, 0.08 * height, 0.3 * width, 0.12 * height);
    builder.fill();
    builder.restore();
  }
}
