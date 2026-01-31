// @ts-nocheck
import type { RenderContext, ShapeAttrs } from '../../../renderer.ts';
import { BaseShapeHandler } from '../../shape-registry.ts';

export class Aws3dEbs2Handler extends BaseShapeHandler {
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
    f = (e * width) / 92;
    e = (e * height) / 60;
    g = parseFloat(this.getStyleValue(style, 'shadow', '0'));
    d = this.getStyleValue(style, 'strokeColor2', '#292929');
    e = Math.min(f, e);
    builder.setStrokeWidth(e);
    builder.setShadow(!1);
    builder.save();
    builder.save();
    builder.setStrokeWidth(2 * e);
    builder.setStrokeColor(d as string);
    builder.setLineJoin('round');
    if (1 == g) {
      builder.setShadow(!0);
    }
    builder.begin();
    builder.moveTo(0, 0.5276 * height);
    builder.lineTo(0, 0.4188 * height);
    builder.lineTo(0.071 * width, 0.2898 * height);
    builder.lineTo(0.4033 * width, 0);
    builder.lineTo(0.9301 * width, 0.464 * height);
    builder.lineTo(width, 0.5863 * height);
    builder.lineTo(width, 0.7035 * height);
    builder.lineTo(0.6667 * width, height);
    builder.lineTo(0.5355 * width, height);
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
    builder.moveTo(0.071 * width, 0.2948 * height);
    builder.lineTo(0.6011 * width, 0.7621 * height);
    builder.lineTo(0.6667 * width, height);
    builder.lineTo(0.5355 * width, height);
    builder.lineTo(0, 0.5276 * height);
    builder.lineTo(0, 0.4137 * height);
    builder.close();
    builder.fill();
    if ('0' == g) {
      builder.setAlpha(f[1]);
    } else {
      builder.setAlpha(f[0]);
    }
    builder.begin();
    builder.moveTo(0.6011 * width, 0.7655 * height);
    builder.lineTo(0.9344 * width, 0.4724 * height);
    builder.lineTo(width, 0.7035 * height);
    builder.lineTo(0.6667 * width, height);
    builder.close();
    builder.fill();
    builder.restore();
    builder.setLineJoin('round');
    builder.begin();
    builder.moveTo(0.071 * width, 0.2948 * height);
    builder.lineTo(0.6011 * width, 0.7621 * height);
    builder.lineTo(0.6667 * width, height);
    builder.lineTo(0.5355 * width, height);
    builder.lineTo(0, 0.5276 * height);
    builder.lineTo(0, 0.4137 * height);
    builder.close();
    builder.moveTo(0.6011 * width, 0.7655 * height);
    builder.lineTo(0.9344 * width, 0.4724 * height);
    builder.lineTo(width, 0.7035 * height);
    builder.lineTo(0.6667 * width, height);
    builder.close();
    builder.moveTo(0.0033 * width, 0.5276 * height);
    builder.lineTo(0.071 * width, 0.2898 * height);
    builder.moveTo(0.5325 * width, 0.9976 * height);
    builder.lineTo(0.603 * width, 0.7593 * height);
    builder.stroke();
    builder.setStrokeWidth(2 * e);
    builder.setLineCap('round');
    builder.begin();
    builder.moveTo(0.3388 * width, 0.3802 * height);
    builder.lineTo(0.5027 * width, 0.2345 * height);
    builder.lineTo(0.6667 * width, 0.3802 * height);
    builder.lineTo(0.5027 * width, 0.526 * height);
    builder.close();
    builder.moveTo(0.4426 * width, 0.3802 * height);
    builder.lineTo(0.5027 * width, 0.3266 * height);
    builder.lineTo(0.5628 * width, 0.3802 * height);
    builder.lineTo(0.5027 * width, 0.4338 * height);
    builder.close();
    builder.moveTo(0.3867 * width, 0.3284 * height);
    builder.lineTo(0.3541 * width, 0.2998 * height);
    builder.moveTo(0.4436 * width, 0.2748 * height);
    builder.lineTo(0.4077 * width, 0.2412 * height);
    builder.moveTo(0.5704 * width, 0.2803 * height);
    builder.lineTo(0.5992 * width, 0.2513 * height);
    builder.moveTo(0.6231 * width, 0.3284 * height);
    builder.lineTo(0.6503 * width, 0.3032 * height);
    builder.moveTo(0.622 * width, 0.4338 * height);
    builder.lineTo(0.6557 * width, 0.4606 * height);
    builder.moveTo(0.5667 * width, 0.4845 * height);
    builder.lineTo(0.5992 * width, 0.5156 * height);
    builder.moveTo(0.4414 * width, 0.4874 * height);
    builder.lineTo(0.412 * width, 0.5159 * height);
    builder.moveTo(0.3889 * width, 0.4405 * height);
    builder.lineTo(0.3607 * width, 0.4657 * height);
    builder.stroke();
    builder.setStrokeColor(d as string);
    builder.setLineJoin('round');
    builder.begin();
    builder.moveTo(0, 0.5276 * height);
    builder.lineTo(0, 0.4188 * height);
    builder.lineTo(0.071 * width, 0.2898 * height);
    builder.lineTo(0.4033 * width, 0);
    builder.lineTo(0.9301 * width, 0.464 * height);
    builder.lineTo(width, 0.5863 * height);
    builder.lineTo(width, 0.7035 * height);
    builder.lineTo(0.6667 * width, height);
    builder.lineTo(0.5355 * width, height);
    builder.close();
    builder.stroke();
    builder.restore();
  }
}
