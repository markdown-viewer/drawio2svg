import type { RenderContext, ShapeAttrs } from '../../../renderer.ts';
import { ActorShapeHandler } from '../../shape-registry.ts';

export class ManualInputHandler extends ActorShapeHandler {
  constructor(renderCtx: RenderContext) {
    super(renderCtx);
  }

  render(attrs: ShapeAttrs): void {
    const { builder, currentGroup, x, y, width, height, style, applyShapeAttrsToBuilder } = this.renderCtx;
    if (!builder || !currentGroup) return;

    // Matches ManualInputShape.redrawPath from the platform
    // Default size = 30 (absolute value)
    const s = Math.min(height, parseFloat(style.size as string) || 30);
    const arcSize = (parseFloat(style.arcSize as string) || 10) / 2;

    builder.setCanvasRoot(currentGroup);
    builder.save();
    applyShapeAttrsToBuilder(builder, attrs);
    builder.begin();
    builder.addPoints(
      [
        { x, y: y + height },
        { x, y: y + s },
        { x: x + width, y },
        { x: x + width, y: y + height }
      ],
      attrs.rounded,
      arcSize,
      true
    );
    builder.fillAndStroke();
    builder.restore();
  }
}
