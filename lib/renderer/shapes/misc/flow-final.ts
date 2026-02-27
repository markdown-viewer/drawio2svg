import type { RenderContext, ShapeAttrs } from '../../../renderer.ts';
import { EllipseShapeHandler, type PerimeterFn } from '../../shape-registry.ts';
import { getEllipsePerimeterPoint } from '../../../edge-router/perimeter/ellipse.ts';

/**
 * Flow final node — circle with an X (diagonal cross) inside.
 * Used for UML activity diagram "end" (flow final) pseudo-state.
 */
export class FlowFinalHandler extends EllipseShapeHandler {
  constructor(renderCtx: RenderContext) {
    super(renderCtx);
  }

  getPerimeter(): PerimeterFn {
    return getEllipsePerimeterPoint;
  }

  render(attrs: ShapeAttrs): void {
    const { builder, currentGroup, applyShapeAttrsToBuilder, x, y, width, height } = this.renderCtx;
    if (!builder || !currentGroup) return;

    const size = Math.min(width, height);
    const cx = x + width / 2;
    const cy = y + height / 2;
    const r = size / 2;

    builder.setCanvasRoot(currentGroup);
    builder.save();
    applyShapeAttrsToBuilder(builder, attrs);

    // Outer circle
    builder.ellipse(cx - r, cy - r, size, size);
    builder.stroke();

    // Diagonal cross (X) inside
    const inset = r * 0.7;
    builder.begin();
    builder.moveTo(cx - inset, cy - inset);
    builder.lineTo(cx + inset, cy + inset);
    builder.stroke();

    builder.begin();
    builder.moveTo(cx + inset, cy - inset);
    builder.lineTo(cx - inset, cy + inset);
    builder.stroke();

    builder.restore();
  }
}
