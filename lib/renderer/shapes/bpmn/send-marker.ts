// @ts-nocheck
import type { RenderContext, ShapeAttrs } from '../../../renderer.ts';
import { ActorShapeHandler } from '../../shape-registry.ts';

export class BpmnSendMarkerHandler extends ActorShapeHandler {
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
    builder.rect(0, 0, width, height);
    builder.fillAndStroke();
    builder.setShadow(!1);
    builder.begin();
    builder.moveTo(0, 0);
    builder.lineTo(0.5 * width, 0.5 * height);
    builder.lineTo(width, 0);
    builder.stroke();
    builder.restore();
  }
}
