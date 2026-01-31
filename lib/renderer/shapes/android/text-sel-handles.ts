// @ts-nocheck
import type { RenderContext, ShapeAttrs } from '../../../renderer.ts';
import { BaseShapeHandler } from '../../shape-registry.ts';

export class AndroidTextSelHandlesHandler extends BaseShapeHandler {
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

    let f;
    f = this.getStyleValue(style, 'strokeColor', 'none');
    builder.translate(d, y);
    d = Math.max(0, height - 22.5);
    builder.setAlpha(0.5);
    builder.rect(15, 0, width - 30, d);
    builder.fill();
    builder.begin();
    builder.moveTo(0, height - 15);
    builder.lineTo(7.5, height - 22.5);
    builder.lineTo(15, height - 15);
    builder.close();
    builder.moveTo(width - 15, height - 15);
    builder.lineTo(width - 7.5, height - 22.5);
    builder.lineTo(width, height - 15);
    builder.close();
    builder.fill();
    builder.setFillColor(f as string);
    builder.rect(0, height - 15, 15, 15);
    builder.fill();
    builder.rect(width - 15, height - 15, 15, 15);
    builder.fill();
    builder.restore();
  }
}
