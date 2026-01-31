import type { RenderContext, ShapeAttrs } from '../../../renderer.ts';
import { ActorShapeHandler } from '../../shape-registry.ts';

/**
 * Crossbar shape - two vertical lines with a horizontal connector
 * Based on CrossbarShape from Shapes.js
 */
export class CrossbarHandler extends ActorShapeHandler {
  constructor(renderCtx: RenderContext) {
    super(renderCtx);
  }

  render(attrs: ShapeAttrs): void {
    const { builder, currentGroup, x, y, width, height, applyShapeAttrsToBuilder } = this.renderCtx;
    if (!builder || !currentGroup) return;

    builder.setCanvasRoot(currentGroup);
    builder.save();
    applyShapeAttrsToBuilder(builder, attrs);

    // All lines in one path (drawio combines them)
    builder.begin();
    // Left vertical line
    builder.moveTo(x, y);
    builder.lineTo(x, y + height);
    // Right vertical line  
    builder.moveTo(x + width, y);
    builder.lineTo(x + width, y + height);
    // Horizontal line in middle
    builder.moveTo(x, y + height / 2);
    builder.lineTo(x + width, y + height / 2);
    builder.fillAndStroke();

    builder.restore();
  }
}
