// @ts-nocheck
import type { RenderContext, ShapeAttrs } from '../../../renderer.ts';
import { ActorShapeHandler } from '../../shape-registry.ts';

export class Uml25ActionParamsHandler extends ActorShapeHandler {
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

    builder.translate(d, e);
    d = this.getStyleValue(style, 'absoluteArcSize', !1);
    e = this.getStyleValue(style, 'arcSize', this.getStyleNumber(style, 'arcSize', 0.15));
    if (!d) {
      e *= Math.min(width, height);
    }
    e = Math.min(e, 0.5 * width, 0.5 * height);
    builder.begin();
    builder.moveTo(20, e);
    builder.arcTo(e, e, 0, 0, 1, 20 + e, 0);
    builder.lineTo(width - e, 0);
    builder.arcTo(e, e, 0, 0, 1, width, e);
    builder.lineTo(width, height - e);
    builder.arcTo(e, e, 0, 0, 1, width - e, height);
    builder.lineTo(20 + e, height);
    builder.arcTo(e, e, 0, 0, 1, 20, height - e);
    builder.close();
    builder.fillAndStroke();
    builder.rect(5, 0.5 * height - 17, 20, 34);
    builder.fillAndStroke();
    builder.rect(0, 0.5 * height - 13, 10, 10);
    builder.fillAndStroke();
    builder.rect(0, 0.5 * height + 3, 10, 10);
    builder.fillAndStroke();
    builder.restore();
  }
}
