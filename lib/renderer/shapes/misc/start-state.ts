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

    const size = Math.max(0, Math.min(width, height) - 8);
    const rx = size / 2;
    const ry = size / 2;
    const cx = x + width / 2;
    const cy = y + height / 2;

    builder.setCanvasRoot(currentGroup);
    builder.save();
    applyShapeAttrsToBuilder(builder, attrs);
    builder.ellipse(cx - rx, cy - ry, rx * 2, ry * 2);
    builder.fillAndStroke();
    builder.restore();
  }
}
