import type { RenderContext, ShapeAttrs } from '../../../renderer.ts';
import { ActorShapeHandler } from '../../shape-registry.ts';

export class ParallelogramHandler extends ActorShapeHandler {
  constructor(renderCtx: RenderContext) {
    super(renderCtx);
  }

  render(attrs: ShapeAttrs): void {
    const { builder, currentGroup, x, y, width, height, style, applyShapeAttrsToBuilder } = this.renderCtx;
    if (!builder || !currentGroup) return;

    // Matches ParallelogramShape.redrawPath from the platform
    // Default size = 0.2, fixedSize = 20
    const fixed = style.fixedSize === '1' || style.fixedSize === 'true';
    const sizeValue = parseFloat(style.size as string) || (fixed ? 20 : 0.2);
    const dx = fixed
      ? Math.max(0, Math.min(width, sizeValue))
      : width * Math.max(0, Math.min(1, sizeValue));

    builder.setCanvasRoot(currentGroup);
    builder.save();
    applyShapeAttrsToBuilder(builder, attrs);
    builder.begin();
    const arcSize = (parseFloat(style.arcSize as string) || 10) / 2;
    builder.addPoints(
      [
        { x, y: y + height },
        { x: x + dx, y },
        { x: x + width, y },
        { x: x + width - dx, y: y + height }
      ],
      attrs.rounded,
      arcSize,
      true
    );
    builder.fillAndStroke();
    builder.restore();
  }
}
