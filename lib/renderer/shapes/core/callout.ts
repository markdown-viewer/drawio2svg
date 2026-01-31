import type { RenderContext, ShapeAttrs } from '../../../renderer.ts';
import { RectangleShapeHandler, type LabelOverrides } from '../../shape-registry.ts';

/**
 * Callout shape - speech bubble/tooltip
 * Based on CalloutShape from Shapes.js
 */
export class CalloutHandler extends RectangleShapeHandler {
  constructor(renderCtx: RenderContext) {
    super(renderCtx);
  }

  getLabelOverrides(): LabelOverrides | null {
    return {
      // getLabelMargins returns bottom margin = size, so text area is height - size
      getLabelBounds: (style, x, y, width, height) => {
        const size = Math.max(0, Math.min(height, parseFloat(style.size as string) || 30));
        return { x, y, width, height: height - size };
      },
      alwaysUseLabelBounds: true
    };
  }

  render(attrs: ShapeAttrs): void {
    const { builder, currentGroup, style, x, y, width, height, applyShapeAttrsToBuilder } = this.renderCtx;
    if (!builder || !currentGroup) return;

    const arcSize = (parseFloat(style.arcSize as string) || 10) / 2;
    const size = Math.max(0, Math.min(height, parseFloat(style.size as string) || 30));
    const position = Math.max(0, Math.min(1, parseFloat(style.position as string) || 0.5));
    const position2 = Math.max(0, Math.min(1, parseFloat(style.position2 as string) || 0.5));
    const base = Math.max(0, Math.min(width, parseFloat(style.base as string) || 20));
    const isRounded = attrs.rounded;

    const dx = width * position;
    const dx2 = width * position2;

    builder.setCanvasRoot(currentGroup);
    builder.save();
    applyShapeAttrsToBuilder(builder, attrs);
    builder.begin();
    
    // The 4th point (index 4) is the tip of the callout, which shouldn't be rounded
    builder.addPoints(
      [
        { x, y },
        { x: x + width, y },
        { x: x + width, y: y + height - size },
        { x: x + Math.min(width, dx + base), y: y + height - size },
        { x: x + dx2, y: y + height },  // tip point
        { x: x + Math.max(0, dx), y: y + height - size },
        { x, y: y + height - size }
      ],
      isRounded,
      arcSize,
      true,
      [4]  // Don't round the tip
    );
    builder.fillAndStroke();
    builder.restore();
  }
}
