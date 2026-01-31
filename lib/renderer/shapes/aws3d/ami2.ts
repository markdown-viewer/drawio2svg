// @ts-nocheck
import type { RenderContext, ShapeAttrs } from '../../../renderer.ts';
import { BaseShapeHandler } from '../../shape-registry.ts';

export class Aws3dAmi2Handler extends BaseShapeHandler {
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
    g = (e * width) / 92;
    e = (e * height) / 60;
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
    builder.setStrokeWidth(2 * e);
    builder.setLineJoin('round');
    builder.begin();
    builder.moveTo(0.2095 * width, 0.376 * height);
    builder.lineTo(0.527 * width, 0.104 * height);
    builder.lineTo(0.6338 * width, 0.194 * height);
    builder.lineTo(0.3149 * width, 0.468 * height);
    builder.close();
    builder.moveTo(0.3716 * width, 0.518 * height);
    builder.lineTo(0.6892 * width, 0.246 * height);
    builder.lineTo(0.796 * width, 0.336 * height);
    builder.lineTo(0.477 * width, 0.61 * height);
    builder.close();
    builder.moveTo(0.3108 * width, 0.282 * height);
    builder.lineTo(0.4257 * width, 0.38 * height);
    builder.moveTo(0.4189 * width, 0.194 * height);
    builder.lineTo(0.5297 * width, 0.288 * height);
    builder.moveTo(0.5838 * width, 0.338 * height);
    builder.lineTo(0.6892 * width, 0.426 * height);
    builder.moveTo(0.4757 * width, 0.426 * height);
    builder.lineTo(0.5838 * width, 0.518 * height);
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
