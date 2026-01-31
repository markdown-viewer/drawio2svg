// @ts-nocheck
import type { RenderContext, ShapeAttrs } from '../../../renderer.ts';
import { ActorShapeHandler } from '../../shape-registry.ts';

export class Uml25BehaviorActionHandler extends ActorShapeHandler {
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
    d = this.getStyleValue(style, 'rounded', !1);
    e = this.getStyleValue(style, 'absoluteArcSize', !1);
    f = this.getStyleValue(style, 'arcSize', this.getStyleNumber(style, 'arcSize', 0.15));
    if (!e) {
      f *= Math.min(width, height);
    }
    f = Math.min(f, 0.5 * width, 0.5 * height);
    if (!d) {
      f = 0;
    }
    builder.begin();
    if (d) {
      builder.moveTo(0, f);
      builder.arcTo(f, f, 0, 0, 1, f, 0);
      builder.lineTo(width - f, 0);
      builder.arcTo(f, f, 0, 0, 1, width, f);
      builder.lineTo(width, height - f);
      builder.arcTo(f, f, 0, 0, 1, width - f, height);
      builder.lineTo(f, height);
      builder.arcTo(f, f, 0, 0, 1, 0, height - f);
    } else {
      builder.moveTo(0, 0);
      builder.lineTo(width, 0);
      builder.lineTo(width, height);
      builder.lineTo(0, height);
    }
    builder.close();
    builder.fillAndStroke();
    builder.setShadow(!1);
    if (60 <= width && 40 <= height) {
      builder.begin();
      builder.moveTo(width - 60, 0.5 * height + 20);
      builder.lineTo(width - 60, 0.5 * height);
      builder.lineTo(width - 20, 0.5 * height);
      builder.lineTo(width - 20, 0.5 * height + 20);
      builder.moveTo(width - 40, 0.5 * height - 20);
      builder.lineTo(width - 40, 0.5 * height + 20);
      builder.stroke();
    }
    builder.restore();
  }
}
