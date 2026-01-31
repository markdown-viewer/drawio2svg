import type { RenderContext, ShapeAttrs } from '../../../renderer.ts';
import { ActorShapeHandler } from '../../shape-registry.ts';

/**
 * IsoCube2 shape - flexible isometric cube with adjustable angle
 * Based on IsoCubeShape2 from Shapes.js
 */
export class IsoCube2Handler extends ActorShapeHandler {
  constructor(renderCtx: RenderContext) {
    super(renderCtx);
  }

  render(attrs: ShapeAttrs): void {
    const { builder, currentGroup, x, y, width, height, applyShapeAttrsToBuilder, style } = this.renderCtx;
    if (!builder || !currentGroup) return;

    builder.setCanvasRoot(currentGroup);
    builder.save();
    applyShapeAttrsToBuilder(builder, attrs);

    const isoAngleStyle = Number(style.isoAngle) || 15;
    const isoAngle = Math.max(0.01, Math.min(94, isoAngleStyle)) * Math.PI / 200;
    const isoH = Math.min(width * Math.tan(isoAngle), height * 0.5);

    // Draw main cube outline
    builder.begin();
    builder.moveTo(x + width * 0.5, y);
    builder.lineTo(x + width, y + isoH);
    builder.lineTo(x + width, y + height - isoH);
    builder.lineTo(x + width * 0.5, y + height);
    builder.lineTo(x, y + height - isoH);
    builder.lineTo(x, y + isoH);
    builder.close();
    builder.fillAndStroke();

    // Draw internal edges
    builder.setShadow(false);
    builder.begin();
    builder.moveTo(x, y + isoH);
    builder.lineTo(x + width * 0.5, y + 2 * isoH);
    builder.lineTo(x + width, y + isoH);
    builder.moveTo(x + width * 0.5, y + 2 * isoH);
    builder.lineTo(x + width * 0.5, y + height);
    builder.stroke();

    builder.restore();
  }
}
