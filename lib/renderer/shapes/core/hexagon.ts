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
    // Read size from style (default 0.25 proportional, or fixedSize=20 in fixed mode)
    const isFixedSize = style.fixedSize !== '0' && style.fixedSize !== undefined && style.fixedSize !== 0;
    const sizeRaw = parseFloat(style.size as string);
    const s = isFixedSize
      ? Math.max(0, Math.min(width * 0.5, Number.isFinite(sizeRaw) ? sizeRaw : 20))
      : width * Math.max(0, Math.min(1, Number.isFinite(sizeRaw) ? sizeRaw : 0.25));
    builder.addPoints(
      [
        { x: s, y: 0 },
        { x: width - s, y: 0 },
        { x: width, y: 0.5 * height },
        { x: width - s, y: height },
        { x: s, y: height },
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
