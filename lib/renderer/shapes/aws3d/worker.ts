// @ts-nocheck
import type { RenderContext, ShapeAttrs } from '../../../renderer.ts';
import { BaseShapeHandler } from '../../shape-registry.ts';

export class Aws3dWorkerHandler extends BaseShapeHandler {
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
    f = this.getStyleValue(style, 'strokeColor', '#000000');
    builder.setFillColor(f as string);
    builder.setLineJoin('round');
    builder.begin();
    builder.moveTo(0.2892 * width, 0.2104 * height);
    builder.lineTo(0.3595 * width, 0.1503 * height);
    builder.lineTo(0.3973 * width, 0.1844 * height);
    builder.arcTo(0.2703 * width, 0.4008 * height, 0, 0, 1, 0.4486 * width, 0.1703 * height);
    builder.lineTo(0.4486 * width, 0.1242 * height);
    builder.lineTo(0.5527 * width, 0.1242 * height);
    builder.lineTo(0.5527 * width, 0.1703 * height);
    builder.arcTo(0.2703 * width, 0.4008 * height, 0, 0, 1, 0.6149 * width, 0.1924 * height);
    builder.lineTo(0.6527 * width, 0.1603 * height);
    builder.lineTo(0.7257 * width, 0.2224 * height);
    builder.lineTo(0.6892 * width, 0.2545 * height);
    builder.arcTo(0.2027 * width, 0.3006 * height, 0, 0, 1, 0.7162 * width, 0.3106 * height);
    builder.lineTo(0.7676 * width, 0.3106 * height);
    builder.lineTo(0.7676 * width, 0.3988 * height);
    builder.lineTo(0.7162 * width, 0.3988 * height);
    builder.arcTo(0.2027 * width, 0.3006 * height, 0, 0, 1, 0.6973 * width, 0.4409 * height);
    builder.lineTo(0.7378 * width, 0.475 * height);
    builder.lineTo(0.6635 * width, 0.5371 * height);
    builder.lineTo(0.6297 * width, 0.505 * height);
    builder.arcTo(0.2703 * width, 0.4008 * height, 0, 0, 1, 0.5527 * width, 0.5351 * height);
    builder.lineTo(0.5527 * width, 0.5812 * height);
    builder.lineTo(0.45 * width, 0.5812 * height);
    builder.lineTo(0.45 * width, 0.5351 * height);
    builder.arcTo(0.2703 * width, 0.4008 * height, 0, 0, 1, 0.3878 * width, 0.513 * height);
    builder.lineTo(0.3514 * width, 0.5431 * height);
    builder.lineTo(0.2784 * width, 0.481 * height);
    builder.lineTo(0.3149 * width, 0.4509 * height);
    builder.arcTo(0.2027 * width, 0.3006 * height, 0, 0, 1, 0.2865 * width, 0.3968 * height);
    builder.lineTo(0.2351 * width, 0.3968 * height);
    builder.lineTo(0.2351 * width, 0.3086 * height);
    builder.lineTo(0.2865 * width, 0.3086 * height);
    builder.arcTo(0.2027 * width, 0.3006 * height, 0, 0, 1, 0.3203 * width, 0.2425 * height);
    builder.close();
    builder.moveTo(0.4054 * width, 0.2445 * height);
    builder.arcTo(0.1351 * width, 0.2004 * height, 0, 0, 0, 0.3554 * width, 0.2986 * height);
    builder.arcTo(0.0676 * width, 0.1002 * height, 0, 0, 0, 0.3432 * width, 0.3567 * height);
    builder.arcTo(0.0811 * width, 0.1202 * height, 0, 0, 0, 0.3635 * width, 0.4208 * height);
    builder.arcTo(0.1351 * width, 0.2004 * height, 0, 0, 0, 0.4122 * width, 0.4649 * height);
    builder.arcTo(0.2027 * width, 0.3006 * height, 0, 0, 0, 0.4122 * width, 0.4649 * height);
    builder.arcTo(0.2027 * width, 0.3006 * height, 0, 0, 0, 0.5676 * width, 0.4749 * height);
    builder.arcTo(0.1351 * width, 0.2004 * height, 0, 0, 0, 0.6351 * width, 0.4228 * height);
    builder.arcTo(0.0676 * width, 0.1002 * height, 0, 0, 0, 0.6595 * width, 0.3467 * height);
    builder.arcTo(0.0811 * width, 0.1202 * height, 0, 0, 0, 0.6149 * width, 0.2605 * height);
    builder.arcTo(0.2027 * width, 0.3006 * height, 0, 0, 0, 0.5419 * width, 0.2204 * height);
    builder.arcTo(0.3378 * width, 0.501 * height, 0, 0, 0, 0.4649 * width, 0.2184 * height);
    builder.arcTo(0.2027 * width, 0.3006 * height, 0, 0, 0, 0.4054 * width, 0.2445 * height);
    builder.close();
    builder.moveTo(0.473 * width, 0.2806 * height);
    builder.arcTo(0.2027 * width, 0.3006 * height, 0, 0, 1, 0.55 * width, 0.2866 * height);
    builder.arcTo(0.0676 * width, 0.1002 * height, 0, 0, 1, 0.5892 * width, 0.3307 * height);
    builder.arcTo(0.0338 * width, 0.0501 * height, 0, 0, 1, 0.5824 * width, 0.3888 * height);
    builder.arcTo(0.0946 * width, 0.1403 * height, 0, 0, 1, 0.5216 * width, 0.4269 * height);
    builder.arcTo(0.1622 * width, 0.2405 * height, 0, 0, 1, 0.4432 * width, 0.4128 * height);
    builder.arcTo(0.0541 * width, 0.0802 * height, 0, 0, 1, 0.4108 * width, 0.3527 * height);
    builder.arcTo(0.0541 * width, 0.0802 * height, 0, 0, 1, 0.4351 * width, 0.2986 * height);
    builder.arcTo(0.0811 * width, 0.1202 * height, 0, 0, 1, 0.473 * width, 0.2806 * height);
    builder.close();
    builder.fill();
    builder.setStrokeWidth(2 * e);
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
