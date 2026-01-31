// @ts-nocheck
import type { RenderContext, ShapeAttrs } from '../../../renderer.ts';
import { BaseShapeHandler } from '../../shape-registry.ts';

export class AndroidProgressBarHandler extends BaseShapeHandler {
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
    let h;
    f = width * Math.max(0, Math.min(width, parseFloat(this.getStyleValue(style, 'dx1', 0.8))));
    g = width * Math.max(0, Math.min(width, this.getStyleNumber(style, 'dx2', 0.6)));
    h = this.getStyleValue(style, 'strokeColor2', '#444444');
    builder.translate(x, y);
    builder.save();
    builder.save();
    builder.setStrokeColor(h as string);
    builder.begin();
    builder.moveTo(0, 0.5 * height);
    builder.lineTo(width, 0.5 * height);
    builder.stroke();
    builder.restore();
    builder.setShadow(!1);
    builder.begin();
    builder.moveTo(0, 0.5 * height);
    builder.lineTo(f, 0.5 * height);
    builder.stroke();
    builder.setStrokeColor('#000000' as string);
    builder.setAlpha('0.2');
    builder.begin();
    builder.moveTo(0, 0.5 * height);
    builder.lineTo(f, 0.5 * height);
    builder.stroke();
    builder.restore();
    builder.setShadow(!1);
    builder.begin();
    builder.moveTo(0, 0.5 * height);
    builder.lineTo(g, 0.5 * height);
    builder.stroke();
    builder.restore();
  }
}
