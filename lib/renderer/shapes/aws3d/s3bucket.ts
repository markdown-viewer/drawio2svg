// @ts-nocheck
import type { RenderContext, ShapeAttrs } from '../../../renderer.ts';
import { BaseShapeHandler } from '../../shape-registry.ts';

export class Aws3dS3BucketHandler extends BaseShapeHandler {
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
    f = (e * width) / 61.5;
    e = (e * height) / 63.8;
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
    builder.moveTo(0, 0.2774 * height);
    builder.lineTo(0.5 * width, 0);
    builder.lineTo(width, 0.2774 * height);
    builder.lineTo(0.7967 * width, 0.8307 * height);
    builder.lineTo(0.5 * width, height);
    builder.lineTo(0.1951 * width, 0.8307 * height);
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
    builder.moveTo(0, 0.2774 * height);
    builder.lineTo(0.5 * width, 0.5564 * height);
    builder.lineTo(0.5 * width, height);
    builder.lineTo(0.1984 * width, 0.8307 * height);
    builder.close();
    builder.fill();
    if ('0' == g) {
      builder.setAlpha(f[1]);
    } else {
      builder.setAlpha(f[0]);
    }
    builder.begin();
    builder.moveTo(0.5 * width, 0.5533 * height);
    builder.lineTo(width, 0.2774 * height);
    builder.lineTo(0.7967 * width, 0.8307 * height);
    builder.lineTo(0.5 * width, height);
    builder.close();
    builder.fill();
    builder.restore();
    builder.setLineJoin('round');
    builder.begin();
    builder.moveTo(0, 0.2774 * height);
    builder.lineTo(0.5 * width, 0.5564 * height);
    builder.lineTo(width, 0.2774 * height);
    builder.stroke();
    builder.begin();
    builder.moveTo(0.5 * width, 0.5564 * height);
    builder.lineTo(0.5 * width, height);
    builder.stroke();
    builder.setStrokeWidth(2 * e);
    builder.setStrokeColor(d as string);
    builder.setLineJoin('round');
    builder.begin();
    builder.moveTo(0, 0.2774 * height);
    builder.lineTo(0.5008 * width, 0);
    builder.lineTo(width, 0.2774 * height);
    builder.lineTo(0.7967 * width, 0.8307 * height);
    builder.lineTo(0.5008 * width, height);
    builder.lineTo(0.1951 * width, 0.8307 * height);
    builder.close();
    builder.stroke();
    builder.restore();
  }
}
