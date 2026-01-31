import type { RenderContext, ShapeAttrs } from '../../../renderer.ts';
import { ActorShapeHandler } from '../../shape-registry.ts';

/**
 * DataStorage shape - cylinder-like
 * Based on DataStorageShape from Shapes.js
 */
export class DataStorageHandler extends ActorShapeHandler {
  constructor(renderCtx: RenderContext) {
    super(renderCtx);
  }

  render(attrs: ShapeAttrs): void {
    const { builder, currentGroup, style, x, y, width, height, applyShapeAttrsToBuilder } = this.renderCtx;
    if (!builder || !currentGroup) return;

    const defaultSize = 0.1;
    const fixedSize = 10;
    const fixed = style.fixedSize === '1' || style.fixedSize === 1;
    const s = fixed
      ? Math.max(0, Math.min(width, parseFloat(style.size as string) || fixedSize))
      : width * Math.max(0, Math.min(1, parseFloat(style.size as string) || defaultSize));

    builder.setCanvasRoot(currentGroup);
    builder.save();
    applyShapeAttrsToBuilder(builder, attrs);
    builder.begin();
    builder.moveTo(x + s, y);
    builder.lineTo(x + width, y);
    builder.quadTo(x + width - s * 2, y + height / 2, x + width, y + height);
    builder.lineTo(x + s, y + height);
    builder.quadTo(x + s - s * 2, y + height / 2, x + s, y);
    builder.close();
    builder.fillAndStroke();
    builder.restore();
  }
}
