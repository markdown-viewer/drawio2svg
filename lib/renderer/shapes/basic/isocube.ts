// @ts-nocheck
import type { RenderContext, ShapeAttrs } from '../../../renderer.ts';
import { ActorShapeHandler } from '../../shape-registry.ts';

export class BasicIsocubeHandler extends ActorShapeHandler {
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

    builder.translate(d, y);
    d = (Math.max(0.01, Math.min(94, this.getStyleNumber(style, 'isoAngle', 15))) * Math.PI) / 200;
    d = Math.min(width * Math.tan(d), 0.5 * height);
    builder.begin();
    builder.moveTo(0.5 * width, 0);
    builder.lineTo(width, d);
    builder.lineTo(width, height - d);
    builder.lineTo(0.5 * width, height);
    builder.lineTo(0, height - d);
    builder.lineTo(0, d);
    builder.close();
    builder.fillAndStroke();
    builder.setShadow(!1);
    builder.begin();
    builder.moveTo(0, d);
    builder.lineTo(0.5 * width, 2 * d);
    builder.lineTo(width, d);
    builder.moveTo(0.5 * width, 2 * d);
    builder.lineTo(0.5 * width, height);
    builder.stroke();
    builder.restore();
  }
}
