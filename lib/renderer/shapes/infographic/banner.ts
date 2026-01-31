// @ts-nocheck
import type { RenderContext, ShapeAttrs } from '../../../renderer.ts';
import { ActorShapeHandler } from '../../shape-registry.ts';

export class InfographicBannerHandler extends ActorShapeHandler {
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
    d = Math.max(0, Math.min(width / 2, this.getStyleNumber(style, 'dx', 0.5)));
    e = Math.max(0, Math.min(0.5 * height, this.getStyleNumber(style, 'dy', 0.5)));
    f = Math.max(0, Math.min(width, this.getStyleNumber(style, 'notch', 0.5)));
    d = Math.min(width / 2 - 2 * e, d);
    f = Math.min(d, f);
    builder.begin();
    builder.moveTo(0, e);
    builder.lineTo(d, e);
    builder.lineTo(d, 0);
    builder.lineTo(width - d, 0);
    builder.lineTo(width - d, e);
    builder.lineTo(width, e);
    builder.lineTo(width - f, 0.5 * (height - e) + e);
    builder.lineTo(width, height);
    builder.lineTo(width - d - 2 * e, height);
    builder.lineTo(width - d - 2 * e, height - e);
    builder.lineTo(d + 2 * e, height - e);
    builder.lineTo(d + 2 * e, height);
    builder.lineTo(0, height);
    builder.lineTo(f, 0.5 * (height - e) + e);
    builder.close();
    builder.fillAndStroke();
    builder.setShadow(!1);
    builder.setFillAlpha('0.2');
    builder.setFillColor('#000000' as string);
    builder.begin();
    builder.moveTo(0, e);
    builder.lineTo(d, e);
    builder.lineTo(d, height - e);
    builder.lineTo(d + 2 * e, height);
    builder.lineTo(0, height);
    builder.lineTo(f, 0.5 * (height - e) + e);
    builder.close();
    builder.moveTo(width, e);
    builder.lineTo(width - d, e);
    builder.lineTo(width - d, height - e);
    builder.lineTo(width - d - 2 * e, height);
    builder.lineTo(width, height);
    builder.lineTo(width - f, 0.5 * (height - e) + e);
    builder.close();
    builder.fill();
    builder.setFillAlpha('0.4');
    builder.begin();
    builder.moveTo(d, height - e);
    builder.lineTo(d + 2 * e, height - e);
    builder.lineTo(d + 2 * e, height);
    builder.close();
    builder.moveTo(width - d, height - e);
    builder.lineTo(width - d - 2 * e, height - e);
    builder.lineTo(width - d - 2 * e, height);
    builder.close();
    builder.fill();
    builder.restore();
  }
}
