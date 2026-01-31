import type { RenderContext, ShapeAttrs } from '../../../renderer.ts';
import { EllipseShapeHandler } from '../../shape-registry.ts';

/**
 * RequiredInterface shape - half circle (socket interface)
 * Based on RequiredInterfaceShape from Shapes.js
 */
export class RequiredInterfaceHandler extends EllipseShapeHandler {
  constructor(renderCtx: RenderContext) {
    super(renderCtx);
  }

  render(attrs: ShapeAttrs): void {
    const { builder, currentGroup, x, y, width, height, applyShapeAttrsToBuilder } = this.renderCtx;
    if (!builder || !currentGroup) return;

    builder.setCanvasRoot(currentGroup);
    builder.save();
    applyShapeAttrsToBuilder(builder, attrs);

    // Draw half circle (socket)
    builder.begin();
    builder.moveTo(x, y);
    builder.quadTo(x + width, y, x + width, y + height / 2);
    builder.quadTo(x + width, y + height, x, y + height);
    builder.stroke();

    builder.restore();
  }
}
