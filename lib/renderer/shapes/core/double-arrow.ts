import type { RenderContext, ShapeAttrs } from '../../../renderer.ts';
import { ActorShapeHandler } from '../../shape-registry.ts';

/**
 * DoubleArrow shape - arrow pointing both ways
 * Based on DoubleArrowShape from Shapes.js
 */
export class DoubleArrowHandler extends ActorShapeHandler {
  constructor(renderCtx: RenderContext) {
    super(renderCtx);
  }

  render(attrs: ShapeAttrs): void {
    const { builder, currentGroup, style, x, y, width, height, applyShapeAttrsToBuilder } = this.renderCtx;
    if (!builder || !currentGroup) return;

    const defaultArrowWidth = 0.333;
    const defaultArrowSize = 0.333;
    const arrowWidth = Math.max(0, Math.min(1, parseFloat(style.arrowWidth as string) || defaultArrowWidth));
    const arrowSize = Math.max(0, Math.min(1, parseFloat(style.arrowSize as string) || defaultArrowSize));
    
    const aw = height * arrowWidth;
    const as = width * arrowSize;
    const at = (height - aw) / 2;
    const ab = at + aw;

    const arcSize = (parseFloat(style.arcSize as string) || 10) / 2;
    const isRounded = attrs.rounded;

    builder.setCanvasRoot(currentGroup);
    builder.save();
    applyShapeAttrsToBuilder(builder, attrs);
    builder.begin();
    builder.addPoints(
      [
        { x, y: y + height / 2 },
        { x: x + as, y },
        { x: x + as, y: y + at },
        { x: x + width - as, y: y + at },
        { x: x + width - as, y },
        { x: x + width, y: y + height / 2 },
        { x: x + width - as, y: y + height },
        { x: x + width - as, y: y + ab },
        { x: x + as, y: y + ab },
        { x: x + as, y: y + height }
      ],
      isRounded,
      arcSize,
      true
    );
    builder.fillAndStroke();
    builder.restore();
  }
}
