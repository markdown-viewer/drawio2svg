import type { RenderContext, ShapeAttrs } from '../../../renderer.ts';
import { EllipseShapeHandler } from '../../shape-registry.ts';

/**
 * ProvidedRequiredInterface shape - lollipop with socket (ball and socket)
 * Based on ProvidedRequiredInterfaceShape from Shapes.js
 */
export class ProvidedRequiredInterfaceHandler extends EllipseShapeHandler {
  constructor(renderCtx: RenderContext) {
    super(renderCtx);
  }

  render(attrs: ShapeAttrs): void {
    const { builder, currentGroup, x, y, width, height, applyShapeAttrsToBuilder, style } = this.renderCtx;
    if (!builder || !currentGroup) return;

    builder.setCanvasRoot(currentGroup);
    builder.save();
    applyShapeAttrsToBuilder(builder, attrs);

    const strokeWidth = attrs.strokeWidth ?? 1;
    const insetValue = parseFloat(style.inset as string) || 2;
    const inset = insetValue + strokeWidth;

    // Draw ellipse (provided interface - ball)
    builder.ellipse(x, y + inset, width - 2 * inset, height - 2 * inset);
    builder.fillAndStroke();

    // Draw half circle (required interface - socket)
    builder.begin();
    builder.moveTo(x + width / 2, y);
    builder.quadTo(x + width, y, x + width, y + height / 2);
    builder.quadTo(x + width, y + height, x + width / 2, y + height);
    builder.stroke();

    builder.restore();
  }
}
