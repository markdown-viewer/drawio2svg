// @ts-nocheck
import type { RenderContext, ShapeAttrs } from '../../../renderer.ts';
import { BaseShapeHandler } from '../../shape-registry.ts';

export class SysmlActFinalHandler extends BaseShapeHandler {
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
    builder.ellipse(x, y, width, height);
    builder.fillAndStroke();
    f = this.getStyleValue(style, 'strokeColor', '#000000');
    builder.setFillColor(f as string);
    builder.ellipse(x + 5, y + 5, width - 10, height - 10);
    builder.fillAndStroke();
    builder.restore();
  }
}
