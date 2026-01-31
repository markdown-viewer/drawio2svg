// @ts-nocheck
import type { RenderContext, ShapeAttrs } from '../../../renderer.ts';
import { BaseShapeHandler } from '../../shape-registry.ts';

export class Aws3dDeciderHandler extends BaseShapeHandler {
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
    f = parseFloat(this.getStyleValue(style, 'shadow', '0'));
    g = (e * width) / 74;
    e = (e * height) / 50;
    d = this.getStyleValue(style, 'strokeColor2', '#292929');
    e = Math.min(g, e);
    builder.setStrokeWidth(e);
    builder.setShadow(!1);
    builder.save();
    builder.save();
    builder.setStrokeWidth(2 * e);
    builder.setStrokeColor(d as string);
    builder.setLineJoin('round');
    if (1 == f) {
      builder.setShadow(!0);
    }
    builder.begin();
    builder.moveTo(0, 0.572 * height);
    builder.lineTo(0.0865 * width, 0.284 * height);
    builder.lineTo(0.4203 * width, 0);
    builder.lineTo(0.5865 * width, 0);
    builder.lineTo(0.919 * width, 0.286 * height);
    builder.lineTo(width, 0.566 * height);
    builder.lineTo(0.5027 * width, height);
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
    builder.moveTo(0, 0.566 * height);
    builder.lineTo(0.0892 * width, 0.282 * height);
    builder.lineTo(0.0878 * width, 0.426 * height);
    builder.lineTo(0.4216 * width, 0.712 * height);
    builder.lineTo(0.5865 * width, 0.712 * height);
    builder.lineTo(0.5027 * width, height);
    builder.close();
    builder.fill();
    if ('0' == g) {
      builder.setAlpha(f[1]);
    } else {
      builder.setAlpha(f[0]);
    }
    builder.begin();
    builder.moveTo(0.5027 * width, height);
    builder.lineTo(0.5865 * width, 0.712 * height);
    builder.lineTo(0.9176 * width, 0.43 * height);
    builder.lineTo(width, 0.566 * height);
    builder.close();
    builder.fill();
    builder.restore();
    builder.setLineJoin('round');
    builder.begin();
    builder.moveTo(0, 0.566 * height);
    builder.lineTo(0.0892 * width, 0.282 * height);
    builder.lineTo(0.0878 * width, 0.426 * height);
    builder.lineTo(0.4216 * width, 0.712 * height);
    builder.lineTo(0.5865 * width, 0.712 * height);
    builder.lineTo(0.5027 * width, height);
    builder.close();
    builder.moveTo(0.5027 * width, height);
    builder.lineTo(0.5865 * width, 0.712 * height);
    builder.lineTo(0.9176 * width, 0.43 * height);
    builder.lineTo(width, 0.566 * height);
    builder.close();
    builder.moveTo(0, 0.572 * height);
    builder.lineTo(0.0892 * width, 0.422 * height);
    builder.moveTo(0.5027 * width, height);
    builder.lineTo(0.4189 * width, 0.708 * height);
    builder.moveTo(0.9176 * width, 0.43 * height);
    builder.lineTo(0.9176 * width, 0.29 * height);
    builder.stroke();
    builder.setStrokeWidth(1.6 * e);
    builder.setLineJoin('square');
    builder.begin();
    builder.moveTo(0.4973 * width, 0.1523 * height);
    builder.lineTo(0.5608 * width, 0.0982 * height);
    builder.lineTo(0.6581 * width, 0.1844 * height);
    builder.lineTo(0.5986 * width, 0.2365 * height);
    builder.close();
    builder.moveTo(0.3784 * width, 0.2164 * height);
    builder.lineTo(0.5054 * width, 0.2305 * height);
    builder.lineTo(0.5203 * width, 0.3407 * height);
    builder.lineTo(0.3892 * width, 0.3246 * height);
    builder.close();
    builder.moveTo(0.2932 * width, 0.3246 * height);
    builder.lineTo(0.3919 * width, 0.4128 * height);
    builder.lineTo(0.3334 * width, 0.4647 * height);
    builder.lineTo(0.2357 * width, 0.38 * height);
    builder.close();
    builder.moveTo(0.4568 * width, 0.4649 * height);
    builder.lineTo(0.5554 * width, 0.5511 * height);
    builder.lineTo(0.4932 * width, 0.6032 * height);
    builder.lineTo(0.3946 * width, 0.517 * height);
    builder.close();
    builder.moveTo(0.5473 * width, 0.1924 * height);
    builder.lineTo(0.5027 * width, 0.2365 * height);
    builder.moveTo(0.4 * width, 0.3186 * height);
    builder.lineTo(0.3446 * width, 0.3667 * height);
    builder.moveTo(0.5189 * width, 0.3387 * height);
    builder.lineTo(0.6081 * width, 0.4148 * height);
    builder.lineTo(0.5068 * width, 0.501 * height);
    builder.stroke();
    builder.setStrokeColor(d as string);
    builder.begin();
    builder.moveTo(0, 0.572 * height);
    builder.lineTo(0.0865 * width, 0.284 * height);
    builder.lineTo(0.4203 * width, 0);
    builder.lineTo(0.5865 * width, 0);
    builder.lineTo(0.919 * width, 0.286 * height);
    builder.lineTo(width, 0.566 * height);
    builder.lineTo(0.5027 * width, height);
    builder.close();
    builder.stroke();
    builder.restore();
  }
}
