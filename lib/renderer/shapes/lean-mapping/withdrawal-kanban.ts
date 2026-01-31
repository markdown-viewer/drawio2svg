// @ts-nocheck
import type { RenderContext, ShapeAttrs } from '../../../renderer.ts';
import { BaseShapeHandler } from '../../shape-registry.ts';

export class LeanMappingWithdrawalKanbanHandler extends BaseShapeHandler {
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
    builder.lineTo(4, 25);
    builder.lineTo(width, 25);
    builder.stroke();
    builder.setDashed(!1);
    builder.begin();
    builder.moveTo(width - 75, 0);
    builder.lineTo(width - 30, 0);
    builder.lineTo(width - 15, 15);
    builder.lineTo(width - 15, 50);
    builder.lineTo(width - 75, 50);
    builder.close();
    builder.fillAndStroke();
    builder.begin();
    builder.moveTo(width - 75, 45);
    builder.lineTo(width - 70, 50);
    builder.moveTo(width - 75, 35);
    builder.lineTo(width - 60, 50);
    builder.moveTo(width - 75, 25);
    builder.lineTo(width - 50, 50);
    builder.moveTo(width - 75, 15);
    builder.lineTo(width - 40, 50);
    builder.moveTo(width - 75, 5);
    builder.lineTo(width - 30, 50);
    builder.moveTo(width - 70, 0);
    builder.lineTo(width - 20, 50);
    builder.moveTo(width - 60, 0);
    builder.lineTo(width - 15, 45);
    builder.moveTo(width - 50, 0);
    builder.lineTo(width - 15, 35);
    builder.moveTo(width - 40, 0);
    builder.lineTo(width - 15, 25);
    builder.stroke();
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
