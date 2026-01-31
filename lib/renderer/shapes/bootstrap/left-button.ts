// @ts-nocheck
import type { RenderContext, ShapeAttrs } from '../../../renderer.ts';
import { BaseShapeHandler } from '../../shape-registry.ts';

export class BootstrapLeftButtonHandler extends BaseShapeHandler {
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
    d = parseInt(this.getStyleNumber(style, 'rSize', 10));
    builder.begin();
    builder.moveTo(width, 0);
    builder.lineTo(width, height);
    builder.lineTo(d, height);
    builder.arcTo(d, d, 0, 0, 1, 0, height - d);
    builder.lineTo(0, d);
    builder.arcTo(d, d, 0, 0, 1, d, 0);
    builder.close();
    builder.fillAndStroke();
    builder.restore();
  }
}
