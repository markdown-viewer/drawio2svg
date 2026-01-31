// @ts-nocheck
import type { RenderContext, ShapeAttrs } from '../../../renderer.ts';
import { BaseShapeHandler } from '../../shape-registry.ts';

export class BootstrapBottomButtonHandler extends BaseShapeHandler {
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
    builder.moveTo(0, 0);
    builder.lineTo(width, 0);
    builder.lineTo(width, height - d);
    builder.arcTo(d, d, 0, 0, 1, width - d, height);
    builder.lineTo(d, height);
    builder.arcTo(d, d, 0, 0, 1, 0, height - d);
    builder.close();
    builder.fillAndStroke();
    builder.restore();
  }
}
