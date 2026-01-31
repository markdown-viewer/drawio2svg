import type { RenderContext, ShapeAttrs } from '../../../renderer.ts';
import { ActorShapeHandler } from '../../shape-registry.ts';

export class CurlyBracketHandler extends ActorShapeHandler {
  constructor(renderCtx: RenderContext) {
    super(renderCtx);
  }

  render(attrs: ShapeAttrs): void {
    const { builder, currentGroup, x, y, width, height, style, applyShapeAttrsToBuilder } = this.renderCtx;
    if (!builder || !currentGroup) return;

    const size = Math.max(0, Math.min(1, parseFloat(style.size as string) || 0.5));
    const s = width * size;
    const arcSize = (parseFloat(style.arcSize as string) || 20) / 2;

    builder.setCanvasRoot(currentGroup);
    builder.save();
    applyShapeAttrsToBuilder(builder, attrs);
    builder.setFillColor(null);
    builder.begin();
    builder.translate(x, y);
    builder.addPoints(
      [
        { x: width, y: 0 },
        { x: s, y: 0 },
        { x: s, y: height / 2 },
        { x: 0, y: height / 2 },
        { x: s, y: height / 2 },
        { x: s, y: height },
        { x: width, y: height }
      ],
      attrs.rounded,
      arcSize,
      false
    );
    builder.stroke();
    builder.restore();

    const path = currentGroup.lastChild as Element | null;
    if (path) {
      path.setAttribute('pointer-events', 'all');
    }
  }
}