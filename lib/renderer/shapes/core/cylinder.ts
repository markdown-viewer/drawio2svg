import type { RenderContext, ShapeAttrs } from '../../../renderer.ts';
import { CylinderShapeHandler } from '../../shape-registry.ts';

export class CylinderHandler extends CylinderShapeHandler {
  constructor(renderCtx: RenderContext) {
    super(renderCtx);
  }

  render(attrs: ShapeAttrs): void {
    const { builder, currentGroup, x, y, width, height, applyShapeAttrsToBuilder, style } = this.renderCtx;
    if (!builder || !currentGroup) return;

    const maxHeight = 40;
    const sizeValue = parseFloat(style.size as string);
    const size = Number.isFinite(sizeValue)
      ? height * Math.max(0, Math.min(1, sizeValue))
      : Math.min(maxHeight, Math.round(height / 5));

    builder.setCanvasRoot(currentGroup);
    builder.save();
    applyShapeAttrsToBuilder(builder, attrs);

    builder.begin();
    builder.moveTo(x, y + size);
    builder.curveTo(x, y - size / 3, x + width, y - size / 3, x + width, y + size);
    builder.lineTo(x + width, y + height - size);
    builder.curveTo(x + width, y + height + size / 3, x, y + height + size / 3, x, y + height - size);
    builder.close();
    builder.fillAndStroke();

    builder.setShadow(false);
    builder.begin();
    builder.moveTo(x, y + size);
    builder.curveTo(x, y + 2 * size, x + width, y + 2 * size, x + width, y + size);
    builder.stroke();

    builder.restore();
  }
}
