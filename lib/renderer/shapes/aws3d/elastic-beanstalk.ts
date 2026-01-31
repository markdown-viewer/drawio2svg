// @ts-nocheck
import type { RenderContext, ShapeAttrs } from '../../../renderer.ts';
import { BaseShapeHandler } from '../../shape-registry.ts';

export class Aws3dElasticBeanstalkHandler extends BaseShapeHandler {
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
    f = (e * width) / 181.5;
    e = (e * height) / 140;
    g = parseFloat(this.getStyleValue(style, 'shadow', '0'));
    d = this.getStyleValue(style, 'strokeColor2', '#292929');
    e = Math.min(f, e);
    builder.setShadow(!1);
    builder.setStrokeWidth(e);
    builder.save();
    builder.save();
    builder.save();
    builder.setStrokeWidth(2 * e);
    builder.setStrokeColor(d as string);
    builder.setLineJoin('round');
    if (1 == g) {
      builder.setShadow(!0);
    }
    builder.begin();
    builder.moveTo(0, 0.6239 * height);
    builder.lineTo(0, 0.3754 * height);
    builder.lineTo(0.5 * width, 0);
    builder.lineTo(width, 0.3754 * height);
    builder.lineTo(width, 0.6239 * height);
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
    builder.moveTo(0, 0.3754 * height);
    builder.lineTo(0.5 * width, 0.7514 * height);
    builder.lineTo(0.5 * width, height);
    builder.lineTo(0, 0.6239 * height);
    builder.close();
    builder.fill();
    if ('0' == g) {
      builder.setAlpha(f[1]);
    } else {
      builder.setAlpha(f[0]);
    }
    builder.begin();
    builder.moveTo(0.5 * width, 0.7514 * height);
    builder.lineTo(width, 0.3754 * height);
    builder.lineTo(width, 0.6239 * height);
    builder.lineTo(0.5 * width, height);
    builder.close();
    builder.fill();
    builder.restore();
    builder.setLineJoin('round');
    builder.begin();
    builder.moveTo(0, 0.3754 * height);
    builder.lineTo(0.5 * width, 0.7514 * height);
    builder.lineTo(0.5 * width, height);
    builder.lineTo(0, 0.6239 * height);
    builder.close();
    builder.moveTo(0.5 * width, 0.7514 * height);
    builder.lineTo(width, 0.3754 * height);
    builder.lineTo(width, 0.6239 * height);
    builder.lineTo(0.5 * width, height);
    builder.close();
    builder.moveTo(0.2485 * width, 0.187 * height);
    builder.lineTo(0.7493 * width, 0.5623 * height);
    builder.lineTo(0.7493 * width, 0.8123 * height);
    builder.stroke();
    builder.setLineJoin('miter');
    f = this.getStyleValue(style, 'strokeColor', '#000000');
    builder.setFillColor(f as string);
    builder.begin();
    builder.moveTo(0.7763 * width, 0.2063 * height);
    builder.lineTo(0.2749 * width, 0.5817 * height);
    builder.lineTo(0.2749 * width, 0.8309 * height);
    builder.lineTo(0.2204 * width, 0.7894 * height);
    builder.lineTo(0.2204 * width, 0.5394 * height);
    builder.lineTo(0.7185 * width, 0.1619 * height);
    builder.close();
    builder.fill();
    builder.restore();
    builder.begin();
    builder.moveTo(0.1713 * width, 0.543 * height);
    builder.arcTo(0.1653 * width, 0.2149 * height, 0, 0, 1, 0.2028 * width, 0.5723 * height);
    builder.arcTo(0.1653 * width, 0.2149 * height, 0, 0, 1, 0.2281 * width, 0.6096 * height);
    builder.arcTo(0.1102 * width, 0.1433 * height, 0, 0, 1, 0.2402 * width, 0.644 * height);
    builder.arcTo(0.1102 * width, 0.1433 * height, 0, 0, 1, 0.2424 * width, 0.6848 * height);
    builder.arcTo(0.1653 * width, 0.2149 * height, 0, 0, 1, 0.216 * width, 0.6612 * height);
    builder.arcTo(0.1653 * width, 0.2149 * height, 0, 0, 1, 0.1895 * width, 0.6239 * height);
    builder.arcTo(0.1102 * width, 0.1433 * height, 0, 0, 1, 0.1719 * width, 0.5824 * height);
    builder.arcTo(0.0826 * width, 0.1074 * height, 0, 0, 1, 0.1713 * width, 0.543 * height);
    builder.close();
    builder.moveTo(0.2507 * width, 0.7794 * height);
    builder.arcTo(0.1653 * width, 0.2149 * height, 0, 0, 1, 0.254 * width, 0.7421 * height);
    builder.arcTo(0.022 * width, 0.0287 * height, 0, 0, 1, 0.27 * width, 0.7264 * height);
    builder.arcTo(0.0551 * width, 0.0716 * height, 0, 0, 1, 0.2986 * width, 0.73 * height);
    builder.arcTo(0.1653 * width, 0.2149 * height, 0, 0, 1, 0.3234 * width, 0.7457 * height);
    builder.arcTo(0.1653 * width, 0.2149 * height, 0, 0, 1, 0.3218 * width, 0.7815 * height);
    builder.arcTo(0.022 * width, 0.0287 * height, 0, 0, 1, 0.3019 * width, 0.7987 * height);
    builder.arcTo(0.0826 * width, 0.1074 * height, 0, 0, 1, 0.27 * width, 0.7923 * height);
    builder.arcTo(0.1653 * width, 0.2149 * height, 0, 0, 1, 0.2507 * width, 0.7794 * height);
    builder.close();
    builder.moveTo(0.2799 * width, 0.5265 * height);
    builder.arcTo(0.1102 * width, 0.1433 * height, 0, 0, 1, 0.3003 * width, 0.515 * height);
    builder.arcTo(0.0826 * width, 0.1074 * height, 0, 0, 1, 0.3317 * width, 0.515 * height);
    builder.arcTo(0.1653 * width, 0.2149 * height, 0, 0, 1, 0.3774 * width, 0.5315 * height);
    builder.arcTo(0.1653 * width, 0.2149 * height, 0, 0, 1, 0.4033 * width, 0.5487 * height);
    builder.arcTo(0.0826 * width, 0.1074 * height, 0, 0, 1, 0.3906 * width, 0.5595 * height);
    builder.arcTo(0.0826 * width, 0.1074 * height, 0, 0, 1, 0.3493 * width, 0.5616 * height);
    builder.arcTo(0.1653 * width, 0.2149 * height, 0, 0, 1, 0.3069 * width, 0.5444 * height);
    builder.arcTo(0.1653 * width, 0.2149 * height, 0, 0, 1, 0.2799 * width, 0.5265 * height);
    builder.close();
    builder.moveTo(0.2887 * width, 0.3933 * height);
    builder.arcTo(0.1653 * width, 0.2149 * height, 0, 0, 1, 0.314 * width, 0.414 * height);
    builder.arcTo(0.1653 * width, 0.2149 * height, 0, 0, 1, 0.3322 * width, 0.4391 * height);
    builder.arcTo(0.0193 * width, 0.0251 * height, 0, 0, 1, 0.3344 * width, 0.4699 * height);
    builder.arcTo(0.0551 * width, 0.0716 * height, 0, 0, 1, 0.3196 * width, 0.485 * height);
    builder.arcTo(0.1653 * width, 0.2149 * height, 0, 0, 1, 0.2887 * width, 0.4592 * height);
    builder.arcTo(0.1102 * width, 0.1433 * height, 0, 0, 1, 0.27 * width, 0.4269 * height);
    builder.arcTo(0.0165 * width, 0.0215 * height, 0, 0, 1, 0.2727 * width, 0.4054 * height);
    builder.arcTo(0.0551 * width, 0.0716 * height, 0, 0, 1, 0.2887 * width, 0.3933 * height);
    builder.close();
    builder.moveTo(0.4613 * width, 0.262 * height);
    builder.arcTo(0.1653 * width, 0.2149 * height, 0, 0, 1, 0.4867 * width, 0.2827 * height);
    builder.arcTo(0.1653 * width, 0.2149 * height, 0, 0, 1, 0.5049 * width, 0.3078 * height);
    builder.arcTo(0.0193 * width, 0.0251 * height, 0, 0, 1, 0.5071 * width, 0.3386 * height);
    builder.arcTo(0.0551 * width, 0.0716 * height, 0, 0, 1, 0.4922 * width, 0.3537 * height);
    builder.arcTo(0.1653 * width, 0.2149 * height, 0, 0, 1, 0.4613 * width, 0.3279 * height);
    builder.arcTo(0.1102 * width, 0.1433 * height, 0, 0, 1, 0.4426 * width, 0.2956 * height);
    builder.arcTo(0.0165 * width, 0.0215 * height, 0, 0, 1, 0.4453 * width, 0.2741 * height);
    builder.arcTo(0.0551 * width, 0.0716 * height, 0, 0, 1, 0.4613 * width, 0.262 * height);
    builder.close();
    builder.moveTo(0.4525 * width, 0.3952 * height);
    builder.arcTo(0.1102 * width, 0.1433 * height, 0, 0, 1, 0.4729 * width, 0.3837 * height);
    builder.arcTo(0.0826 * width, 0.1074 * height, 0, 0, 1, 0.5043 * width, 0.3837 * height);
    builder.arcTo(0.1653 * width, 0.2149 * height, 0, 0, 1, 0.55 * width, 0.4002 * height);
    builder.arcTo(0.1653 * width, 0.2149 * height, 0, 0, 1, 0.5759 * width, 0.4174 * height);
    builder.arcTo(0.0826 * width, 0.1074 * height, 0, 0, 1, 0.5633 * width, 0.4282 * height);
    builder.arcTo(0.0826 * width, 0.1074 * height, 0, 0, 1, 0.5219 * width, 0.4303 * height);
    builder.arcTo(0.1653 * width, 0.1074 * height, 0, 0, 1, 0.4795 * width, 0.4131 * height);
    builder.arcTo(0.1653 * width, 0.2149 * height, 0, 0, 1, 0.4525 * width, 0.3952 * height);
    builder.close();
    builder.moveTo(0.6217 * width, 0.1426 * height);
    builder.arcTo(0.1653 * width, 0.2149 * height, 0, 0, 1, 0.6471 * width, 0.1633 * height);
    builder.arcTo(0.1653 * width, 0.2149 * height, 0, 0, 1, 0.6652 * width, 0.1884 * height);
    builder.arcTo(0.0193 * width, 0.0251 * height, 0, 0, 1, 0.6674 * width, 0.2192 * height);
    builder.arcTo(0.0551 * width, 0.0716 * height, 0, 0, 1, 0.6526 * width, 0.2342 * height);
    builder.arcTo(0.1653 * width, 0.2149 * height, 0, 0, 1, 0.6217 * width, 0.2085 * height);
    builder.arcTo(0.1102 * width, 0.1433 * height, 0, 0, 1, 0.603 * width, 0.1762 * height);
    builder.arcTo(0.0165 * width, 0.0215 * height, 0, 0, 1, 0.6057 * width, 0.1547 * height);
    builder.arcTo(0.0551 * width, 0.0716 * height, 0, 0, 1, 0.6217 * width, 0.1426 * height);
    builder.close();
    builder.moveTo(0.6129 * width, 0.2758 * height);
    builder.arcTo(0.1102 * width, 0.1433 * height, 0, 0, 1, 0.6333 * width, 0.2643 * height);
    builder.arcTo(0.0826 * width, 0.1433 * height, 0, 0, 1, 0.6647 * width, 0.2643 * height);
    builder.arcTo(0.1653 * width, 0.2149 * height, 0, 0, 1, 0.7104 * width, 0.2808 * height);
    builder.arcTo(0.1653 * width, 0.2149 * height, 0, 0, 1, 0.7363 * width, 0.298 * height);
    builder.arcTo(0.0826 * width, 0.2149 * height, 0, 0, 1, 0.7363 * width, 0.298 * height);
    builder.arcTo(0.0826 * width, 0.1074 * height, 0, 0, 1, 0.6823 * width, 0.3109 * height);
    builder.arcTo(0.1653 * width, 0.2149 * height, 0, 0, 1, 0.6399 * width, 0.2937 * height);
    builder.arcTo(0.1653 * width, 0.2149 * height, 0, 0, 1, 0.6129 * width, 0.2758 * height);
    builder.close();
    builder.fillAndStroke();
    builder.setStrokeWidth(2 * e);
    builder.setStrokeColor(d as string);
    builder.setLineJoin('round');
    builder.begin();
    builder.moveTo(0, 0.6239 * height);
    builder.lineTo(0, 0.3754 * height);
    builder.lineTo(0.5 * width, 0);
    builder.lineTo(width, 0.3754 * height);
    builder.lineTo(width, 0.6239 * height);
    builder.lineTo(0.5 * width, height);
    builder.close();
    builder.stroke();
    builder.restore();
  }
}
