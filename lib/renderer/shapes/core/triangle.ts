import type { RenderContext, ShapeAttrs } from '../../../renderer.ts';
import { TriangleShapeHandler, type PerimeterFn } from '../../shape-registry.ts';
import { getTrianglePerimeterPoint } from '../../../edge-router/perimeter/triangle.ts';

export class TriangleHandler extends TriangleShapeHandler {
  constructor(renderCtx: RenderContext) {
    super(renderCtx);
  }

  getPerimeter(): PerimeterFn {
    return getTrianglePerimeterPoint;
  }

  render(attrs: ShapeAttrs): void {
    const { builder, currentGroup, x, y, width, height, style, applyShapeAttrsToBuilder } = this.renderCtx;
    if (!builder || !currentGroup) return;

    builder.setCanvasRoot(currentGroup);
    builder.save();
    applyShapeAttrsToBuilder(builder, attrs);
    builder.begin();
    builder.translate(x, y);
    const arcSize = (parseFloat(style.arcSize as string) || 20) / 2;
    builder.addPoints(
      [
        { x: 0, y: 0 },
        { x: width, y: height * 0.5 },
        { x: 0, y: height }
      ],
      attrs.rounded,
      arcSize,
      true
    );
    builder.fillAndStroke();
    builder.restore();
  }
}
