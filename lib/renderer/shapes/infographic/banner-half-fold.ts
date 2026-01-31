// @ts-nocheck
import type { RenderContext, ShapeAttrs } from '../../../renderer.ts';
import { ActorShapeHandler } from '../../shape-registry.ts';

export class InfographicBannerHalfFoldHandler extends ActorShapeHandler {
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
    d = Math.max(0, Math.min(width, this.getStyleNumber(style, 'dx', 0.5)));
    e = Math.max(0, Math.min(width - d, this.getStyleNumber(style, 'dx2', 0.5)));
    f = Math.max(0, Math.min(height - d, this.getStyleNumber(style, 'notch', 0.5)));
    builder.begin();
    builder.moveTo(e, 0);
    builder.lineTo(width - d, 0);
    builder.lineTo(width, d);
    builder.lineTo(width, height);
    builder.lineTo(width - 0.5 * d, height - f);
    builder.lineTo(width - d, height);
    builder.lineTo(width - d, d);
    builder.lineTo(e, d);
    builder.lineTo(0, 0.5 * d);
    builder.close();
    builder.fillAndStroke();
    builder.setShadow(!1);
    builder.setFillAlpha('0.2');
    builder.setFillColor('#000000' as string);
    builder.begin();
    builder.moveTo(width - d, d);
    builder.lineTo(width, d);
    builder.lineTo(width, height);
    builder.lineTo(width - 0.5 * d, height - f);
    builder.lineTo(width - d, height);
    builder.lineTo(width - d, d);
    builder.lineTo(0, d);
    builder.close();
    builder.fill();
    builder.begin();
    builder.moveTo(e, 0);
    builder.lineTo(width - d, 0);
    builder.lineTo(width, d);
    builder.lineTo(width, height);
    builder.lineTo(width - 0.5 * d, height - f);
    builder.lineTo(width - d, height);
    builder.lineTo(width - d, d);
    builder.lineTo(e, d);
    builder.lineTo(0, 0.5 * d);
    builder.close();
    builder.stroke();
    builder.restore();
  }
}
