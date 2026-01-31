// @ts-nocheck
import type { RenderContext, ShapeAttrs } from '../../../renderer.ts';
import { HexagonShapeHandler } from '../../shape-registry.ts';

export class BpmnConversation2Handler extends HexagonShapeHandler {
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

    let f;
    let g;
    f = this.getStyleValue(style, 'bpmnConversationType', 'conv');
    g = this.getStyleValue(style, 'strokeWidth', 1);
    if ('call' == f) {
      builder.setStrokeWidth(4 * g);
    }
    builder.translate(x, y);
    builder.begin();
    builder.moveTo(0, 0.5 * height);
    builder.lineTo(0.25 * width, 0);
    builder.lineTo(0.75 * width, 0);
    builder.lineTo(width, 0.5 * height);
    builder.lineTo(0.75 * width, height);
    builder.lineTo(0.25 * width, height);
    builder.close();
    builder.fillAndStroke();
    builder.setStrokeWidth(1);
    if (this.getStyleValue(style, 'isLoopSub', !1)) {
      if ('call' == f) {
        builder.translate(0.5 * width - 7, height - 14 - 2 * g);
      } else {
        builder.translate(0.5 * width - 7, height - 14 - 0.5 * g);
      }
      builder.rect(0, 0, 14, 14);
      builder.stroke();
      builder.begin();
      builder.moveTo(4, 7);
      builder.lineTo(10, 7);
      builder.moveTo(7, 4);
      builder.lineTo(7, 10);
      builder.stroke();
    }
    builder.restore();
  }
}
