// @ts-nocheck
import type { RenderContext, ShapeAttrs } from '../../../renderer.ts';
import { ActorShapeHandler } from '../../shape-registry.ts';

export class InfographicRibbonSimpleHandler extends ActorShapeHandler {
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
    d = Math.max(0, Math.min(width, parseFloat(this.getStyleValue(style, 'notch1', 0.5))));
    e = Math.max(0, Math.min(width, parseFloat(this.getStyleValue(style, 'notch2', 0.5))));
    builder.begin();
    builder.moveTo(0, height);
    builder.lineTo(d, 0.5 * height);
    builder.lineTo(0, 0);
    builder.lineTo(width - e, 0);
    builder.lineTo(width, 0.5 * height);
    builder.lineTo(width - e, height);
    builder.close();
    builder.fillAndStroke();
    builder.restore();
  }
}
