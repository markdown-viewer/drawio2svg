// @ts-nocheck
import type { RenderContext, ShapeAttrs } from '../../../renderer.ts';
import { ActorShapeHandler } from '../../shape-registry.ts';

export class Uml25InputPinHandler extends ActorShapeHandler {
  constructor(renderCtx: RenderContext) {
    super(renderCtx);
  }

  render(attrs: ShapeAttrs): void {
    const { builder, currentGroup, applyShapeAttrsToBuilder, x, y, width, height } = this.renderCtx;
    if (!builder || !currentGroup) return;
    if (width <= 0 || height <= 0) return;

    builder.setCanvasRoot(currentGroup);
    builder.save();
    applyShapeAttrsToBuilder(builder, attrs);

    builder.translate(x, y);
    builder.begin();
    builder.moveTo(0, 0);
    builder.lineTo(width, 0);
    builder.lineTo(width, height);
    builder.lineTo(0, height);
    builder.close();
    builder.fillAndStroke();
    builder.setShadow(!1);
    builder.begin();
    builder.moveTo(0.75 * width, 0.5 * height);
    builder.lineTo(0.25 * width, 0.5 * height);
    builder.moveTo(0.4 * width, 0.4 * height);
    builder.lineTo(0.25 * width, 0.5 * height);
    builder.lineTo(0.4 * width, 0.6 * height);
    builder.stroke();
    builder.restore();
  }
}
