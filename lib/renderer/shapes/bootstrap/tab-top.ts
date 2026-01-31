// @ts-nocheck
import type { RenderContext, ShapeAttrs } from '../../../renderer.ts';
import { BaseShapeHandler } from '../../shape-registry.ts';

export class BootstrapTabTopHandler extends BaseShapeHandler {
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
    let e = y;

    let f;
    builder.translate(d, e);
    d = parseInt(this.getStyleNumber(style, 'rSize', 10));
    e = this.getStyleValue(style, 'strokeColor', '#000000');
    f = this.getStyleValue(style, 'fillColor', '#ffffff');
    builder.setStrokeColor(f as string);
    builder.begin();
    builder.moveTo(0, d);
    builder.arcTo(d, d, 0, 0, 1, d, 0);
    builder.lineTo(width - d, 0);
    builder.arcTo(d, d, 0, 0, 1, width, d);
    builder.lineTo(width, height);
    builder.lineTo(0, height);
    builder.close();
    builder.fillAndStroke();
    builder.setStrokeColor(e as string);
    builder.begin();
    builder.moveTo(0, height);
    builder.lineTo(0, d);
    builder.arcTo(d, d, 0, 0, 1, d, 0);
    builder.lineTo(width - d, 0);
    builder.arcTo(d, d, 0, 0, 1, width, d);
    builder.lineTo(width, height);
    builder.stroke();
    builder.restore();
  }
}
