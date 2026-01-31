import type { RenderContext, ShapeAttrs } from '../../../renderer.ts';
import { RectangleShapeHandler } from '../../shape-registry.ts';

/**
 * AssociativeEntity shape - rectangle with diamond inside
 * Based on AssociativeEntity from Shapes.js
 */
export class AssociativeEntityHandler extends RectangleShapeHandler {
  constructor(renderCtx: RenderContext) {
    super(renderCtx);
  }

  render(attrs: ShapeAttrs): void {
    const { builder, currentGroup, style, x, y, width, height, applyShapeAttrsToBuilder } = this.renderCtx;
    if (!builder || !currentGroup) return;

    const hw = width / 2;
    const hh = height / 2;
    const arcSize = (parseFloat(style.arcSize as string) || 10) / 2;
    const isRounded = attrs.rounded;

    builder.setCanvasRoot(currentGroup);
    builder.save();
    applyShapeAttrsToBuilder(builder, attrs);

    // Draw rectangle (background)
    builder.rect(x, y, width, height);
    builder.fillAndStroke();

    // Draw diamond (foreground - stroke only)
    builder.begin();
    builder.addPoints(
      [
        { x: x + hw, y },
        { x: x + width, y: y + hh },
        { x: x + hw, y: y + height },
        { x, y: y + hh }
      ],
      isRounded,
      arcSize,
      true
    );
    builder.stroke();

    builder.restore();
  }
}
