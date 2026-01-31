import type { RenderContext, ShapeAttrs } from '../../../renderer.ts';
import { ActorShapeHandler, type PerimeterFn } from '../../shape-registry.ts';
import { getEllipsePerimeterPoint } from '../../../edge-router/perimeter/ellipse.ts';

export class CloudHandler extends ActorShapeHandler {
  constructor(renderCtx: RenderContext) {
    super(renderCtx);
  }

  getPerimeter(): PerimeterFn {
    return getEllipsePerimeterPoint;
  }

  render(attrs: ShapeAttrs): void {
    const { builder, currentGroup, x, y, width, height, applyShapeAttrsToBuilder } = this.renderCtx;
    if (!builder || !currentGroup) return;

    builder.setCanvasRoot(currentGroup);
    builder.save();
    applyShapeAttrsToBuilder(builder, attrs);
    builder.begin();
    builder.moveTo(x + 0.25 * width, y + 0.25 * height);
    builder.curveTo(x + 0.05 * width, y + 0.25 * height, x, y + 0.5 * height, x + 0.16 * width, y + 0.55 * height);
    builder.curveTo(x, y + 0.66 * height, x + 0.18 * width, y + 0.9 * height, x + 0.31 * width, y + 0.8 * height);
    builder.curveTo(x + 0.4 * width, y + height, x + 0.7 * width, y + height, x + 0.8 * width, y + 0.8 * height);
    builder.curveTo(x + width, y + 0.8 * height, x + width, y + 0.6 * height, x + 0.875 * width, y + 0.5 * height);
    builder.curveTo(x + width, y + 0.3 * height, x + 0.8 * width, y + 0.1 * height, x + 0.625 * width, y + 0.2 * height);
    builder.curveTo(x + 0.5 * width, y + 0.05 * height, x + 0.3 * width, y + 0.05 * height, x + 0.25 * width, y + 0.25 * height);
    builder.close();
    builder.fillAndStroke();
    builder.restore();
  }
}
