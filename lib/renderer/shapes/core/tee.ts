import type { RenderContext, ShapeAttrs } from '../../../renderer.ts';
import { ActorShapeHandler } from '../../shape-registry.ts';

/**
 * Tee shape - T-shaped connector
 * Based on TeeShape from Shapes.js
 */
export class TeeHandler extends ActorShapeHandler {
  constructor(renderCtx: RenderContext) {
    super(renderCtx);
  }

  render(attrs: ShapeAttrs): void {
    const { builder, currentGroup, style, x, y, width, height, applyShapeAttrsToBuilder } = this.renderCtx;
    if (!builder || !currentGroup) return;

    const dx = Math.max(0, Math.min(width, parseFloat(style.dx as string) || 20));
    const dy = Math.max(0, Math.min(height, parseFloat(style.dy as string) || 20));
    const arcSize = (parseFloat(style.arcSize as string) || 10) / 2;
    const isRounded = attrs.rounded;

    builder.setCanvasRoot(currentGroup);
    builder.save();
    applyShapeAttrsToBuilder(builder, attrs);
    builder.begin();
    builder.addPoints(
      [
        { x, y },
        { x: x + width, y },
        { x: x + width, y: y + dy },
        { x: x + (width + dx) / 2, y: y + dy },
        { x: x + (width + dx) / 2, y: y + height },
        { x: x + (width - dx) / 2, y: y + height },
        { x: x + (width - dx) / 2, y: y + dy },
        { x, y: y + dy }
      ],
      isRounded,
      arcSize,
      true
    );
    builder.fillAndStroke();
    builder.restore();
  }
}
