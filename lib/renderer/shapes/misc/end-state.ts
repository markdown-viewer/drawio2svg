import type { RenderContext, ShapeAttrs } from '../../../renderer.ts';
import { EllipseShapeHandler, type PerimeterFn } from '../../shape-registry.ts';
import { getEllipsePerimeterPoint } from '../../../edge-router/perimeter/ellipse.ts';

export class EndStateHandler extends EllipseShapeHandler {
  constructor(renderCtx: RenderContext) {
    super(renderCtx);
  }

  getPerimeter(): PerimeterFn {
    return getEllipsePerimeterPoint;
  }

  render(attrs: ShapeAttrs): void {
    const { builder, currentGroup, applyShapeAttrsToBuilder, x, y, width, height } = this.renderCtx;
    if (!builder || !currentGroup) return;

    // Matches draw.io StateShape with outerStroke=true (endState)
    const inset = Math.min(4, Math.min(width / 5, height / 5));

    builder.setCanvasRoot(currentGroup);
    builder.save();
    applyShapeAttrsToBuilder(builder, attrs);

    if (width > 0 && height > 0) {
      builder.ellipse(x + inset, y + inset, width - 2 * inset, height - 2 * inset);
      builder.fillAndStroke();
    }

    // Outer stroke without shadow
    builder.setFillColor(null);
    builder.ellipse(x, y, width, height);
    builder.stroke();
    builder.restore();
  }
}
