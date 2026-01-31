import type { RenderContext, ShapeAttrs } from '../../../renderer.ts';
import { ActorShapeHandler } from '../../shape-registry.ts';

export class TapeHandler extends ActorShapeHandler {
  constructor(renderCtx: RenderContext) {
    super(renderCtx);
  }

  render(attrs: ShapeAttrs): void {
    const { builder, currentGroup, style, x, y, width, height, applyShapeAttrsToBuilder } = this.renderCtx;
    if (!builder || !currentGroup) return;

    const size = Math.max(0, Math.min(1, parseFloat(style.size as string) || 0.4));
    const dy = height * size;
    const fy = 1.4;

    builder.setCanvasRoot(currentGroup);
    builder.save();
    applyShapeAttrsToBuilder(builder, attrs);
    builder.begin();
    builder.moveTo(x, y + dy / 2);
    builder.quadTo(x + width / 4, y + dy * fy, x + width / 2, y + dy / 2);
    builder.quadTo(x + (width * 3) / 4, y + dy * (1 - fy), x + width, y + dy / 2);
    builder.lineTo(x + width, y + height - dy / 2);
    builder.quadTo(x + (width * 3) / 4, y + height - dy * fy, x + width / 2, y + height - dy / 2);
    builder.quadTo(x + width / 4, y + height - dy * (1 - fy), x, y + height - dy / 2);
    builder.lineTo(x, y + dy / 2);
    builder.close();
    builder.fillAndStroke();
    builder.restore();
  }
}
