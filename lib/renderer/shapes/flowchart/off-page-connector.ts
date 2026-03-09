import type { RenderContext, ShapeAttrs } from '../../../renderer.ts';
import { ActorShapeHandler } from '../../shape-registry.ts';

/**
 * Off-page connector — a pentagon with flat left side and arrow tip right.
 *
 * 5 vertices:
 *   P0 ────── P1
 *   │           \
 *   │            P2 (arrow tip)
 *   │           /
 *   P4 ────── P3
 *
 * Supports fixedSize=1 for pixel-based arrow depth (default 20)
 * or proportional sizing (default 0.2).
 * Use flipH=1 to mirror horizontally (arrow tip on left).
 */
export class OffPageConnectorHandler extends ActorShapeHandler {
  constructor(renderCtx: RenderContext) {
    super(renderCtx);
  }

  isRoundable(): boolean {
    return true;
  }

  render(attrs: ShapeAttrs): void {
    const { builder, currentGroup, style, x, y, width, height, applyShapeAttrsToBuilder } = this.renderCtx;
    if (!builder || !currentGroup) return;

    const fixed = (style.fixedSize as string) === '1';
    const sizeParam = parseFloat(style.size as string);
    const defaultSize = fixed ? 20 : 0.2;
    const s = fixed
      ? Math.max(0, Math.min(width, sizeParam || defaultSize))
      : width * Math.max(0, Math.min(1, sizeParam || defaultSize));

    const arcSize = (parseFloat(style.arcSize as string) || 10) / 2;
    const isRounded = attrs.rounded;

    builder.setCanvasRoot(currentGroup);
    builder.save();
    applyShapeAttrsToBuilder(builder, attrs);
    builder.begin();
    builder.addPoints(
      [
        { x, y },
        { x: x + width - s, y },
        { x: x + width, y: y + height / 2 },
        { x: x + width - s, y: y + height },
        { x, y: y + height },
      ],
      isRounded,
      arcSize,
      true
    );
    builder.fillAndStroke();
    builder.restore();
  }
}
