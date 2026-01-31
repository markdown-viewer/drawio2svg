import type { RenderContext, ShapeAttrs } from '../../../renderer.ts';
import { ActorShapeHandler } from '../../shape-registry.ts';

// tan(30°) related constants for isometric shapes
const tan30 = Math.tan(Math.PI / 6);  // ~0.577
const tan30Dx = (0.5 - tan30) / 2;  // ~-0.039

/**
 * IsoRectangle shape - isometric rectangle (diamond in iso view)
 * Based on IsoRectangleShape from Shapes.js
 */
export class IsoRectangleHandler extends ActorShapeHandler {
  constructor(renderCtx: RenderContext) {
    super(renderCtx);
  }

  render(attrs: ShapeAttrs): void {
    const { builder, currentGroup, x, y, width, height, applyShapeAttrsToBuilder } = this.renderCtx;
    if (!builder || !currentGroup) return;

    const m = Math.min(width, height / tan30);
    const offsetX = (width - m) / 2;
    const offsetY = (height - m) / 2 + m / 4;

    builder.setCanvasRoot(currentGroup);
    builder.save();
    applyShapeAttrsToBuilder(builder, attrs);
    builder.begin();
    builder.moveTo(x + offsetX, y + offsetY + 0.25 * m);
    builder.lineTo(x + offsetX + 0.5 * m, y + offsetY + m * tan30Dx);
    builder.lineTo(x + offsetX + m, y + offsetY + 0.25 * m);
    builder.lineTo(x + offsetX + 0.5 * m, y + offsetY + (0.5 - tan30Dx) * m);
    builder.lineTo(x + offsetX, y + offsetY + 0.25 * m);
    builder.close();
    builder.fillAndStroke();
    builder.restore();
  }
}
