// @ts-nocheck
import type { RenderContext, ShapeAttrs } from '../../../renderer.ts';
import { ActorShapeHandler } from '../../shape-registry.ts';

export class InfographicCylinderHandler extends ActorShapeHandler {
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
    let d = x;

    builder.translate(d, y);
    d = 0.5 * width;
    builder.begin();
    builder.moveTo(0, 10);
    builder.arcTo(d, 10, 0, 0, 1, width, 10);
    builder.lineTo(width, height - 10);
    builder.arcTo(d, 10, 0, 0, 1, 0, height - 10);
    builder.close();
    builder.fillAndStroke();
    builder.setShadow(!1);
    builder.setGradient('#000000', '#ffffff', 0, 0, width, height, 'east', 0.4, 0.4);
    builder.begin();
    builder.moveTo(0, 10);
    builder.arcTo(d, 10, 0, 0, 0, width, 10);
    builder.lineTo(width, height - 10);
    builder.arcTo(d, 10, 0, 0, 1, 0, height - 10);
    builder.close();
    builder.fill();
    builder.begin();
    builder.moveTo(0, 10);
    builder.arcTo(d, 10, 0, 0, 1, width, 10);
    builder.lineTo(width, height - 10);
    builder.arcTo(d, 10, 0, 0, 1, 0, height - 10);
    builder.close();
    builder.stroke();
    builder.restore();
  }
}
