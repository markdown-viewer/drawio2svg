// @ts-nocheck
import type { RenderContext, ShapeAttrs } from '../../../renderer.ts';
import { BaseShapeHandler } from '../../shape-registry.ts';

export class Aws3dDataServerHandler extends BaseShapeHandler {
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
    let g;
    builder.translate(d, e);
    e = parseFloat(this.getStyleValue(style, 'strokeWidth', '1'));
    f = (e * width) / 123;
    e = (e * height) / 106;
    g = parseFloat(this.getStyleValue(style, 'shadow', '0'));
    d = this.getStyleValue(style, 'strokeColor2', '#292929');
    e = Math.min(f, e);
    builder.setShadow(!1);
    builder.setStrokeWidth(e);
    builder.save();
    builder.save();
    builder.setStrokeWidth(2 * e);
    builder.setStrokeColor(d as string);
    builder.setLineJoin('round');
    if (1 == g) {
      builder.setShadow(!0);
    }
    builder.begin();
    builder.moveTo(0, 0.6651 * height);
    builder.lineTo(0, 0.3349 * height);
    builder.lineTo(0.5 * width, 0);
    builder.lineTo(width, 0.3349 * height);
    builder.lineTo(width, 0.6651 * height);
    builder.lineTo(0.5 * width, height);
    builder.close();
    builder.fillAndStroke();
    builder.restore();
    builder.setFillColor('#000000' as string);
    f = this.getStyleValue(style, 'shadingCols', '0.1,0.3').toString().split(',');
    g = this.getStyleValue(style, 'flipH', '0');
    if ('0' == g) {
      builder.setAlpha(f[0]);
    } else {
      builder.setAlpha(f[1]);
    }
    builder.begin();
    builder.moveTo(0, 0.6651 * height);
    builder.lineTo(0, 0.3349 * height);
    builder.lineTo(0.5 * width, 0.6698 * height);
    builder.lineTo(0.5 * width, height);
    builder.close();
    builder.fill();
    if ('0' == g) {
      builder.setAlpha(f[1]);
    } else {
      builder.setAlpha(f[0]);
    }
    builder.begin();
    builder.moveTo(width, 0.6651 * height);
    builder.lineTo(width, 0.3349 * height);
    builder.lineTo(0.5 * width, 0.6698 * height);
    builder.lineTo(0.5 * width, height);
    builder.close();
    builder.fill();
    builder.restore();
    builder.setLineJoin('round');
    builder.begin();
    builder.moveTo(0, 0.6651 * height);
    builder.lineTo(0, 0.3349 * height);
    builder.lineTo(0.5 * width, 0.6698 * height);
    builder.lineTo(0.5 * width, height);
    builder.close();
    builder.stroke();
    builder.begin();
    builder.moveTo(width, 0.6651 * height);
    builder.lineTo(width, 0.3349 * height);
    builder.lineTo(0.5 * width, 0.6698 * height);
    builder.lineTo(0.5 * width, height);
    builder.close();
    builder.stroke();
    builder.setLineCap('round');
    builder.setStrokeWidth(3 * e);
    builder.begin();
    builder.moveTo(0.0878 * width, 0.4858 * height);
    builder.lineTo(0.4187 * width, 0.7094 * height);
    builder.moveTo(0.587 * width, 0.7094 * height);
    builder.lineTo(0.9187 * width, 0.4858 * height);
    builder.stroke();
    builder.setStrokeWidth(2 * e);
    builder.setStrokeColor(d as string);
    builder.setLineJoin('round');
    builder.begin();
    builder.moveTo(0, 0.6651 * height);
    builder.lineTo(0, 0.3349 * height);
    builder.lineTo(0.5 * width, 0);
    builder.lineTo(width, 0.3349 * height);
    builder.lineTo(width, 0.6651 * height);
    builder.lineTo(0.5 * width, height);
    builder.close();
    builder.stroke();
    builder.restore();
  }
}
