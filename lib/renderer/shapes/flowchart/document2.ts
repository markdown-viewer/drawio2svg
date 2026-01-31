// @ts-nocheck
import type { RenderContext, ShapeAttrs } from '../../../renderer.ts';
import { ActorShapeHandler } from '../../shape-registry.ts';

export class FlowchartDocument2Handler extends ActorShapeHandler {
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
    d = height * Math.max(0, Math.min(1, this.getStyleNumber(style, 'size', 0.5)));
    builder.begin();
    builder.moveTo(width - 5, 0);
    builder.arcTo(5, 5, 0, 0, 1, width, 5);
    builder.lineTo(width, height - d / 2);
    builder.quadTo((3 * width) / 4, height - 1.4 * d, width / 2, height - d / 2);
    builder.quadTo(width / 4, height - d * (1 - 1.4), 0, height - d / 2);
    builder.lineTo(0, d / 2);
    builder.lineTo(0, 5);
    builder.arcTo(5, 5, 0, 0, 1, 5, 0);
    builder.close();
    builder.fillAndStroke();
    builder.restore();
  }
}
