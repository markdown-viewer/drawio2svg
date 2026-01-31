import type { RenderContext, ShapeAttrs } from '../../../renderer.ts';
import { ActorShapeHandler } from '../../shape-registry.ts';

export class CardHandler extends ActorShapeHandler {
  constructor(renderCtx: RenderContext) {
    super(renderCtx);
  }

  render(attrs: ShapeAttrs): void {
    const { builder, currentGroup, style, x, y, width, height, applyShapeAttrsToBuilder } = this.renderCtx;
    if (!builder || !currentGroup) return;

    const size = parseFloat(style.size as string) || 30;
    const s = Math.max(0, Math.min(width, Math.min(height, size)));
    const arcSize = (parseFloat(style.arcSize as string) || 10) / 2;
    const isRounded = attrs.rounded;

    builder.setCanvasRoot(currentGroup);
    builder.save();
    applyShapeAttrsToBuilder(builder, attrs);
    builder.begin();
    builder.addPoints(
      [
        { x: x + s, y },
        { x: x + width, y },
        { x: x + width, y: y + height },
        { x, y: y + height },
        { x, y: y + s }
      ],
      isRounded,
      arcSize,
      true
    );
    builder.fillAndStroke();
    builder.restore();
  }
}
