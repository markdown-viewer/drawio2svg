import type { RenderContext, ShapeAttrs } from '../../../renderer.ts';
import { ActorShapeHandler } from '../../shape-registry.ts';

/**
 * ParallelMarker shape - three vertical bars
 * Based on ParallelMarkerShape from Shapes.js
 */
export class ParallelMarkerHandler extends ActorShapeHandler {
  constructor(renderCtx: RenderContext) {
    super(renderCtx);
  }

  render(attrs: ShapeAttrs): void {
    const { builder, currentGroup, x, y, width, height, applyShapeAttrsToBuilder } = this.renderCtx;
    if (!builder || !currentGroup) return;

    const w2 = width / 5;

    builder.setCanvasRoot(currentGroup);
    builder.save();
    applyShapeAttrsToBuilder(builder, attrs);
    
    // Use stroke color as fill for the bars
    const strokeColor = attrs.strokeColor || '#000000';
    builder.setFillColor(strokeColor);
    builder.setStrokeWidth(1);

    // Three vertical bars
    builder.rect(x, y, w2, height);
    builder.fillAndStroke();
    
    builder.rect(x + 2 * w2, y, w2, height);
    builder.fillAndStroke();
    
    builder.rect(x + 4 * w2, y, w2, height);
    builder.fillAndStroke();

    builder.restore();
  }
}
