// @ts-nocheck
import type { RenderContext, ShapeAttrs } from '../../../renderer.ts';
import { ActorShapeHandler } from '../../shape-registry.ts';

export class InfographicFlagHandler extends ActorShapeHandler {
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
    d = Math.max(0, Math.min(width, this.getStyleNumber(style, 'dx', 0.5)));
    e = Math.max(0, Math.min(height, this.getStyleNumber(style, 'dy', 0.5)));
    builder.begin();
    builder.moveTo(0, 0);
    builder.lineTo(width, 0);
    builder.lineTo(width, height - e);
    builder.lineTo(d, height - e);
    builder.lineTo(0.5 * d, height);
    builder.lineTo(0, height - e);
    builder.close();
    builder.fillAndStroke();
    builder.setShadow(!1);
    builder.setFillAlpha('0.2');
    builder.setFillColor('#ffffff' as string);
    builder.begin();
    builder.moveTo(0, 0);
    builder.lineTo(d, 0);
    builder.lineTo(d, height - e);
    builder.lineTo(0.5 * d, height);
    builder.lineTo(0, height - e);
    builder.close();
    builder.fill();
    builder.restore();
  }
}
