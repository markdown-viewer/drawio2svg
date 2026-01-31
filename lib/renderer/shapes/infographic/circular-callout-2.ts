// @ts-nocheck
import type { RenderContext, ShapeAttrs } from '../../../renderer.ts';
import { ActorShapeHandler } from '../../shape-registry.ts';

export class InfographicCircularCallout2Handler extends ActorShapeHandler {
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
    e = this.getStyleValue(style, 'strokeColor', 'none');
    builder.setFillColor(e as string);
    e = Math.max(0, Math.min(0.5 * width, 0.4 * height, 0.5 * height - 7));
    builder.begin();
    builder.moveTo(0.5 * width - 2, 2.15 * e);
    builder.arcTo(0.23 * e, 0.23 * e, 0, 0, 0, 0.5 * width - 0.2 * e, 1.97 * e);
    builder.arcTo(e, e, 0, 0, 1, 0.5 * width - e, e);
    builder.arcTo(e, e, 0, 0, 1, 0.5 * width, 0);
    builder.arcTo(e, e, 0, 0, 1, 0.5 * width + e, e);
    builder.arcTo(e, e, 0, 0, 1, 0.5 * width + 0.2 * e, 1.97 * e);
    builder.arcTo(0.23 * e, 0.23 * e, 0, 0, 0, 0.5 * width + 2, 2.15 * e);
    f = Math.max(0.1 * e, 6);
    if (4 < 0.04 * e) {
      builder.lineTo(0.5 * width + 2, height - 0.22 * e);
      builder.arcTo(0.05 * e, 0.05 * e, 0, 0, 0, 0.5 * width + 0.04 * e, height - 0.19 * e);
    } else {
      builder.lineTo(0.5 * width + 2, height - 2 * f);
    }
    builder.arcTo(f, f, 0, 0, 1, 0.5 * width + f, height - f);
    builder.arcTo(f, f, 0, 0, 1, 0.5 * width, height);
    builder.arcTo(f, f, 0, 0, 1, 0.5 * width - f, height - f);
    if (4 < 0.04 * e) {
      builder.arcTo(f, f, 0, 0, 1, 0.5 * width - 0.04 * e, height - 0.19 * e);
      builder.arcTo(0.5 * f, 0.5 * f, 0, 0, 0, 0.5 * width - 2, height - 0.22 * e);
    } else {
      builder.arcTo(f, f, 0, 0, 1, 0.5 * width - 2, height - 2 * f);
    }
    builder.close();
    builder.moveTo(0.5 * width, 0.2 * e);
    builder.arcTo(0.8 * e, 0.8 * e, 0, 0, 0, 0.5 * width - 0.8 * e, 0.8 * e);
    builder.arcTo(0.8 * e, 0.8 * e, 0, 0, 0, 0.5 * width, 1.8 * e);
    builder.arcTo(0.8 * e, 0.8 * e, 0, 0, 0, 0.5 * width + 0.8 * e, 0.8 * e);
    builder.arcTo(0.8 * e, 0.8 * e, 0, 0, 0, 0.5 * width, 0.2 * e);
    builder.close();
    builder.moveTo(0.5 * width, height - 1.75 * f);
    builder.arcTo(0.75 * f, 0.75 * f, 0, 0, 0, 0.5 * width - 0.75 * f, height - f);
    builder.arcTo(0.75 * f, 0.75 * f, 0, 0, 0, 0.5 * width, height - 0.25 * f);
    builder.arcTo(0.75 * f, 0.75 * f, 0, 0, 0, 0.5 * width + 0.75 * f, height - f);
    builder.arcTo(0.75 * f, 0.75 * f, 0, 0, 0, 0.5 * width, height - 1.75 * f);
    builder.close();
    builder.fill();
    builder.setFillColor(d as string);
    builder.setShadow(!1);
    builder.begin();
    builder.moveTo(0.5 * width, 0.2 * e);
    builder.arcTo(0.8 * e, 0.8 * e, 0, 0, 0, 0.5 * width - 0.8 * e, 0.8 * e);
    builder.arcTo(0.8 * e, 0.8 * e, 0, 0, 0, 0.5 * width, 1.8 * e);
    builder.arcTo(0.8 * e, 0.8 * e, 0, 0, 0, 0.5 * width + 0.8 * e, 0.8 * e);
    builder.arcTo(0.8 * e, 0.8 * e, 0, 0, 0, 0.5 * width, 0.2 * e);
    builder.close();
    builder.moveTo(0.5 * width, height - 1.75 * f);
    builder.arcTo(0.75 * f, 0.75 * f, 0, 0, 0, 0.5 * width - 0.75 * f, height - f);
    builder.arcTo(0.75 * f, 0.75 * f, 0, 0, 0, 0.5 * width, height - 0.25 * f);
    builder.arcTo(0.75 * f, 0.75 * f, 0, 0, 0, 0.5 * width + 0.75 * f, height - f);
    builder.arcTo(0.75 * f, 0.75 * f, 0, 0, 0, 0.5 * width, height - 1.75 * f);
    builder.close();
    builder.fill();
    builder.restore();
  }
}
