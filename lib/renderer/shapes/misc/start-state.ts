import type { RenderContext, ShapeAttrs } from '../../../renderer.ts';
import { EllipseShapeHandler, type PerimeterFn } from '../../shape-registry.ts';
import { getEllipsePerimeterPoint } from '../../../edge-router/perimeter/ellipse.ts';

export class StartStateHandler extends EllipseShapeHandler {
  constructor(renderCtx: RenderContext) {
    super(renderCtx);
  }

  getPerimeter(): PerimeterFn {
    return getEllipsePerimeterPoint;
  }

  render(attrs: ShapeAttrs): void {
    const { builder, currentGroup, applyShapeAttrsToBuilder, x, y, width, height } = this.renderCtx;
    if (!builder || !currentGroup) return;

    // Matches draw.io StateShape with outerStroke=false (startState)
    const inset = Math.min(4, Math.min(width / 5, height / 5));

    builder.setCanvasRoot(currentGroup);
    builder.save();
    applyShapeAttrsToBuilder(builder, attrs);
    builder.ellipse(x + inset, y + inset, width - 2 * inset, height - 2 * inset);
    builder.fillAndStroke();
    builder.restore();
  }
}
