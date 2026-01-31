// @ts-nocheck
import type { RenderContext, ShapeAttrs } from '../../../renderer.ts';
import { ActorShapeHandler } from '../../shape-registry.ts';

export class InfographicCircularDialHandler extends ActorShapeHandler {
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
    d = Math.max(
      0,
      Math.min(0.5 * height - 10, 0.5 * width, this.getStyleNumber(style, 'dy', 0.5))
    );
    e = Math.max(0, Math.min(0.5 * width, 0.5 * height - 10));
    f = e - d;
    builder.begin();
    builder.moveTo(0.5 * width - e, height);
    builder.lineTo(0.5 * width - e, e);
    builder.arcTo(e, e, 0, 0, 1, 0.5 * width, 0);
    builder.arcTo(e, e, 0, 0, 1, 0.5 * width + e, e);
    builder.lineTo(0.5 * width + e, height);
    builder.close();
    builder.moveTo(0.5 * width, d);
    builder.arcTo(f, f, 0, 0, 0, 0.5 * width - f, e);
    builder.arcTo(f, f, 0, 0, 0, 0.5 * width, e + f);
    builder.arcTo(f, f, 0, 0, 0, 0.5 * width + f, e);
    builder.arcTo(f, f, 0, 0, 0, 0.5 * width, d);
    builder.close();
    builder.fillAndStroke();
    builder.setShadow(!1);
    builder.setFillAlpha('0.2');
    builder.setFillColor('#000000' as string);
    builder.begin();
    builder.moveTo(0.5 * width - e, 2 * e);
    builder.lineTo(0.5 * width + e, 2 * e);
    builder.lineTo(0.5 * width + e, height);
    builder.lineTo(0.5 * width - e, height);
    builder.close();
    builder.fill();
    builder.restore();
  }
}
