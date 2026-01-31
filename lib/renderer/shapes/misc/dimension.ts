import type { RenderContext, ShapeAttrs } from '../../../renderer.ts';
import { ActorShapeHandler } from '../../shape-registry.ts';

/**
 * DimensionShape - renders a dimension/measurement annotation with arrows
 * Based on the platform's DimensionShape in Shapes.js
 */
export class DimensionHandler extends ActorShapeHandler {
  constructor(renderCtx: RenderContext) {
    super(renderCtx);
  }

  render(attrs: ShapeAttrs): void {
    const { builder, currentGroup, x, y, width, height, applyShapeAttrsToBuilder } = this.renderCtx;
    if (!builder || !currentGroup) return;

    builder.setCanvasRoot(currentGroup);
    builder.save();
    applyShapeAttrsToBuilder(builder, attrs);

    // Get stroke width, default to 1
    const strokeWidth = attrs.strokeWidth ?? 1;
    const sw = strokeWidth / 2;

    // Arrow size: 10 + 2 * sw
    const al = 10 + 2 * sw;

    // Center y for the horizontal line (at bottom minus half arrow size)
    const cy = y + height - al / 2;

    builder.begin();

    // Left vertical line
    builder.moveTo(x, y);
    builder.lineTo(x, y + height);

    // Left arrow pointing right
    builder.moveTo(x + sw, cy);
    builder.lineTo(x + sw + al, cy - al / 2);
    builder.moveTo(x + sw, cy);
    builder.lineTo(x + sw + al, cy + al / 2);

    // Horizontal line
    builder.moveTo(x + sw, cy);
    builder.lineTo(x + width - sw, cy);

    // Right vertical line
    builder.moveTo(x + width, y);
    builder.lineTo(x + width, y + height);

    // Right arrow pointing left
    builder.moveTo(x + width - sw, cy);
    builder.lineTo(x + width - al - sw, cy - al / 2);
    builder.moveTo(x + width - sw, cy);
    builder.lineTo(x + width - al - sw, cy + al / 2);

    builder.end();
    builder.stroke();

    builder.restore();
  }
}
