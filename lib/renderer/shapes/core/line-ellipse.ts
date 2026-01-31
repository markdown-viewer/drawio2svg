import type { RenderContext, ShapeAttrs } from '../../../renderer.ts';
import { EllipseShapeHandler } from '../../shape-registry.ts';

/**
 * LineEllipse shape - ellipse with a line through it
 * Based on LineEllipseShape from Shapes.js
 */
export class LineEllipseHandler extends EllipseShapeHandler {
  constructor(renderCtx: RenderContext) {
    super(renderCtx);
  }

  render(attrs: ShapeAttrs): void {
    const { builder, currentGroup, style, x, y, width, height, applyShapeAttrsToBuilder } = this.renderCtx;
    if (!builder || !currentGroup) return;

    const lineDirection = style.line as string;

    builder.setCanvasRoot(currentGroup);
    builder.save();
    applyShapeAttrsToBuilder(builder, attrs);

    // Draw ellipse
    builder.ellipse(x, y, width, height);
    builder.fillAndStroke();

    // Draw line through center
    // Note: drawio only checks if line == 'vertical', otherwise horizontal
    builder.setShadow(false);
    builder.begin();
    if (lineDirection === 'vertical') {
      builder.moveTo(x + width / 2, y);
      builder.lineTo(x + width / 2, y + height);
    } else {
      // Default: horizontal (including 'both' and any other value)
      builder.moveTo(x, y + height / 2);
      builder.lineTo(x + width, y + height / 2);
    }
    builder.stroke();

    builder.restore();
  }
}
