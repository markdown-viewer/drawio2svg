import type { RenderContext, ShapeAttrs } from '../../../renderer.ts';
import { ActorShapeHandler } from '../../shape-registry.ts';

// Isometric constants
const tan30 = Math.tan(Math.PI / 6); // tan(30°)
const tan30Dx = (0.5 - tan30) / 2;

/**
 * IsoCube shape - isometric 3D cube
 * Based on IsoCubeShape from Shapes.js
 */
export class IsoCubeHandler extends ActorShapeHandler {
  constructor(renderCtx: RenderContext) {
    super(renderCtx);
  }

  render(attrs: ShapeAttrs): void {
    const { builder, currentGroup, x, y, width, height, applyShapeAttrsToBuilder } = this.renderCtx;
    if (!builder || !currentGroup) return;

    builder.setCanvasRoot(currentGroup);
    builder.save();
    applyShapeAttrsToBuilder(builder, attrs);

    const m = Math.min(width, height / (0.5 + tan30));
    const offsetX = (width - m) / 2;
    const offsetY = (height - m) / 2;

    // Draw main cube outline (background)
    builder.begin();
    builder.moveTo(x + offsetX, y + offsetY + 0.25 * m);
    builder.lineTo(x + offsetX + 0.5 * m, y + offsetY + m * tan30Dx);
    builder.lineTo(x + offsetX + m, y + offsetY + 0.25 * m);
    builder.lineTo(x + offsetX + m, y + offsetY + 0.75 * m);
    builder.lineTo(x + offsetX + 0.5 * m, y + offsetY + (1 - tan30Dx) * m);
    builder.lineTo(x + offsetX, y + offsetY + 0.75 * m);
    builder.close();
    builder.fillAndStroke();

    // Draw internal edges (foreground)
    builder.setShadow(false);
    builder.begin();
    builder.moveTo(x + offsetX, y + offsetY + 0.25 * m);
    builder.lineTo(x + offsetX + 0.5 * m, y + offsetY + (0.5 - tan30Dx) * m);
    builder.lineTo(x + offsetX + m, y + offsetY + 0.25 * m);
    builder.moveTo(x + offsetX + 0.5 * m, y + offsetY + (0.5 - tan30Dx) * m);
    builder.lineTo(x + offsetX + 0.5 * m, y + offsetY + (1 - tan30Dx) * m);
    builder.stroke();

    builder.restore();
  }
}
