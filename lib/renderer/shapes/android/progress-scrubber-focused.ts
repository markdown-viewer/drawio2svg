// @ts-nocheck
import type { RenderContext, ShapeAttrs } from '../../../renderer.ts';
import { BaseShapeHandler } from '../../shape-registry.ts';

export class AndroidProgressScrubberFocusedHandler extends BaseShapeHandler {
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

    let f;
    let g;
    let h;
    f = width * Math.max(0, Math.min(width, this.getStyleNumber(style, 'dx', 0.3)));
    g = this.getStyleValue(style, 'fillColor', '#ffffff');
    h = this.getStyleValue(style, 'strokeColor2', '#444444');
    builder.translate(d, y);
    builder.save();
    builder.save();
    builder.setStrokeColor(h as string);
    builder.begin();
    builder.moveTo(0, 0.5 * height);
    builder.lineTo(width, 0.5 * height);
    builder.stroke();
    builder.restore();
    builder.setShadow(!1);
    builder.setAlpha('0.75');
    builder.begin();
    d = Math.min(height, 0.1 * width) / 2;
    builder.ellipse(f - d, 0.5 * height - d, 2 * d, 2 * d);
    builder.fill();
    builder.restore();
    builder.setShadow(!1);
    builder.setStrokeColor(g as string);
    builder.begin();
    builder.moveTo(0, 0.5 * height);
    builder.lineTo(f, 0.5 * height);
    builder.stroke();
    builder.begin();
    d = Math.min(height, 0.1 * width) / 8;
    builder.ellipse(f - d, 0.5 * height - d, 2 * d, 2 * d);
    builder.fill();
    builder.restore();
  }
}
