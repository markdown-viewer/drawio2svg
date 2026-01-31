import type { RenderContext, ShapeAttrs } from '../../../renderer.ts';
import { ActorShapeHandler } from '../../shape-registry.ts';

/**
 * UmlDestroy shape - X mark
 * Based on UmlDestroyShape from Shapes.js
 */
export class UmlDestroyHandler extends ActorShapeHandler {
  constructor(renderCtx: RenderContext) {
    super(renderCtx);
  }

  render(attrs: ShapeAttrs): void {
    const { builder, currentGroup, x, y, width, height, applyShapeAttrsToBuilder } = this.renderCtx;
    if (!builder || !currentGroup) return;

    builder.setCanvasRoot(currentGroup);
    builder.save();
    applyShapeAttrsToBuilder(builder, attrs);

    // X mark
    builder.begin();
    builder.moveTo(x + width, y);
    builder.lineTo(x, y + height);
    builder.moveTo(x, y);
    builder.lineTo(x + width, y + height);
    builder.stroke();

    builder.restore();
  }
}
