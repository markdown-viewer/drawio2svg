import type { RenderContext, ShapeAttrs } from '../../../renderer.ts';
import { HexagonShapeHandler, type PerimeterFn } from '../../shape-registry.ts';
import { getHexagonPerimeterPoint } from '../../../edge-router/perimeter/hexagon.ts';

export class HexagonHandler extends HexagonShapeHandler {
  constructor(renderCtx: RenderContext) {
    super(renderCtx);
  }

  getPerimeter(): PerimeterFn {
    return getHexagonPerimeterPoint;
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
        { x: 0.25 * width, y: 0 },
        { x: 0.75 * width, y: 0 },
        { x: width, y: 0.5 * height },
        { x: 0.75 * width, y: height },
        { x: 0.25 * width, y: height },
        { x: 0, y: 0.5 * height }
      ],
      attrs.rounded,
      arcSize,
      true
    );
    builder.fillAndStroke();
    builder.restore();
  }
}
