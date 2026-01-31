import type { RenderContext, ShapeAttrs } from '../../../renderer.ts';
import { ActorShapeHandler } from '../../shape-registry.ts';

/**
 * LoopLimit shape - hexagon-like shape with angled top
 * Based on LoopLimitShape from Shapes.js
 */
export class LoopLimitHandler extends ActorShapeHandler {
  constructor(renderCtx: RenderContext) {
    super(renderCtx);
  }

  render(attrs: ShapeAttrs): void {
    const { builder, currentGroup, style, x, y, width, height, applyShapeAttrsToBuilder } = this.renderCtx;
    if (!builder || !currentGroup) return;

    const size = parseFloat(style.size as string) || 20;
    const s = Math.min(width / 2, Math.min(height, size));
    const arcSize = (parseFloat(style.arcSize as string) || 10) / 2;
    const isRounded = attrs.rounded;

    builder.setCanvasRoot(currentGroup);
    builder.save();
    applyShapeAttrsToBuilder(builder, attrs);
    builder.begin();
    builder.addPoints(
      [
        { x: x + s, y },
        { x: x + width - s, y },
        { x: x + width, y: y + s * 0.8 },
        { x: x + width, y: y + height },
        { x, y: y + height },
        { x, y: y + s * 0.8 }
      ],
      isRounded,
      arcSize,
      true
    );
    builder.fillAndStroke();
    builder.restore();
  }
}
