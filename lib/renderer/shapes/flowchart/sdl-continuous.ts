import type { RenderContext, ShapeAttrs } from '../../../renderer.ts';
import { ActorShapeHandler } from '../../shape-registry.ts';

/**
 * SDL Continuous signal — two open V-shaped brackets `< >` on left and right.
 *
 * PlantUML reference renders this as two separate open paths:
 *   Left `<`:   (x+s, y) → (x, y+h/2) → (x+s, y+h)
 *   Right `>`:  (x+w-s, y) → (x+w, y+h/2) → (x+w-s, y+h)
 *
 * Each bracket is filled (small triangle) and stroked. No rectangle body.
 */
export class SdlContinuousHandler extends ActorShapeHandler {
  constructor(renderCtx: RenderContext) {
    super(renderCtx);
  }

  render(attrs: ShapeAttrs): void {
    const { builder, currentGroup, style, x, y, width, height, applyShapeAttrsToBuilder } = this.renderCtx;
    if (!builder || !currentGroup) return;

    const fixed = (style.fixedSize as string) === '1';
    const sizeParam = parseFloat(style.size as string);
    const defaultSize = fixed ? 20 : 0.2;
    const s = fixed
      ? Math.max(0, Math.min(width / 2, sizeParam || defaultSize))
      : width * Math.max(0, Math.min(0.5, sizeParam || defaultSize));

    builder.setCanvasRoot(currentGroup);
    builder.save();
    applyShapeAttrsToBuilder(builder, attrs);

    // Left `<` bracket
    builder.begin();
    builder.moveTo(x + s, y);
    builder.lineTo(x, y + height / 2);
    builder.lineTo(x + s, y + height);
    builder.fillAndStroke();

    // Right `>` bracket
    builder.begin();
    builder.moveTo(x + width - s, y);
    builder.lineTo(x + width, y + height / 2);
    builder.lineTo(x + width - s, y + height);
    builder.fillAndStroke();

    builder.restore();
  }
}
