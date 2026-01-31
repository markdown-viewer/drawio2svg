import type { RenderContext, ShapeAttrs } from '../../../renderer.ts';
import { RhombusShapeHandler } from '../../shape-registry.ts';

export class SwitchHandler extends RhombusShapeHandler {
  constructor(renderCtx: RenderContext) {
    super(renderCtx);
  }

  render(attrs: ShapeAttrs): void {
    const { builder, currentGroup, x, y, width, height, applyShapeAttrsToBuilder } = this.renderCtx;
    if (!builder || !currentGroup) return;

    const cx = x + width / 2;
    const cy = y + height / 2;

    builder.setCanvasRoot(currentGroup);
    builder.save();
    applyShapeAttrsToBuilder(builder, attrs);
    builder.begin();
    builder.moveTo(x, y);
    builder.quadTo(cx, cy, x + width, y);
    builder.quadTo(cx, cy, x + width, y + height);
    builder.quadTo(cx, cy, x, y + height);
    builder.quadTo(cx, cy, x, y);
    builder.fillAndStroke();
    builder.restore();
  }
}
