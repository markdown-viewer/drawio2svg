// @ts-nocheck
import type { RenderContext, ShapeAttrs } from '../../../renderer.ts';
import { BaseShapeHandler } from '../../shape-registry.ts';

export class LeanMappingSignalKanbanHandler extends BaseShapeHandler {
  constructor(renderCtx: RenderContext) {
    super(renderCtx);
  }

  render(attrs: ShapeAttrs): void {
    const { builder, currentGroup, applyShapeAttrsToBuilder, x, y, width, height, style } =
      this.renderCtx;
    if (!builder || !currentGroup) return;
    if (width <= 0 || height <= 0) return;

    builder.setCanvasRoot(currentGroup);
    builder.save();
    applyShapeAttrsToBuilder(builder, attrs);
    let d = x;

    builder.translate(d, y);
    builder.setDashed(!0);
    builder.begin();
    builder.moveTo(4, height - 10);
    builder.lineTo(4, 15);
    builder.lineTo(width, 15);
    builder.stroke();
    builder.setDashed(!1);
    builder.begin();
    builder.moveTo(width - 65, 0);
    builder.lineTo(width - 25, 0);
    builder.lineTo(width - 45, 45);
    builder.close();
    builder.fillAndStroke();
    d = this.getStyleValue(style, 'strokeColor', '#000000');
    builder.setFillColor(d as string);
    builder.begin();
    builder.moveTo(0, height - 10);
    builder.lineTo(4, height);
    builder.lineTo(8, height - 10);
    builder.close();
    builder.fillAndStroke();
    builder.restore();
  }
}
