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

    const outerSize = Math.max(0, Math.min(width, height));
    const innerSize = Math.max(0, outerSize - 8);
    const cx = x + width / 2;
    const cy = y + height / 2;

    builder.setCanvasRoot(currentGroup);
    builder.save();
    applyShapeAttrsToBuilder(builder, attrs);
    builder.ellipse(cx - innerSize / 2, cy - innerSize / 2, innerSize, innerSize);
    builder.fillAndStroke();

    builder.setFillColor(null);
    builder.ellipse(cx - outerSize / 2, cy - outerSize / 2, outerSize, outerSize);
    builder.stroke();
    builder.restore();
  }
}
