// @ts-nocheck
import type { RenderContext, ShapeAttrs } from '../../../renderer.ts';
import { BaseShapeHandler } from '../../shape-registry.ts';

export class SysmlCallBehActHandler extends BaseShapeHandler {
  constructor(renderCtx: RenderContext) {
    super(renderCtx);
  }

  render(attrs: ShapeAttrs): void {
    const { builder, currentGroup, applyShapeAttrsToBuilder, x, y, width, height } = this.renderCtx;
    if (!builder || !currentGroup) return;
    if (width <= 0 || height <= 0) return;

    builder.setCanvasRoot(currentGroup);
    builder.save();
    applyShapeAttrsToBuilder(builder, attrs);

    builder.roundrect(x, y, width, height, 10, 10);
    builder.fillAndStroke();
    if (30 < height && 40 < width) {
      builder.setShadow(!1);
      this.render_drawSymb(builder, x + width - 30, y + height - 30, 20, 20);
    }
    builder.restore();
  }

  private render_drawSymb(
    builder: RenderContext['builder'],
    p1: any,
    p2: any,
    p3: any,
    p4: any
  ): void {
    if (!builder) return;
    builder.begin();
    builder.moveTo(p1 + 0.5 * p3, p2);
    builder.lineTo(p1 + 0.5 * p3, p2 + p4);
    builder.moveTo(p1, p2 + p4);
    builder.lineTo(p1, p2 + 0.5 * p4);
    builder.lineTo(p1 + p3, p2 + 0.5 * p4);
    builder.lineTo(p1 + p3, p2 + p4);
    builder.stroke();
  }
}
