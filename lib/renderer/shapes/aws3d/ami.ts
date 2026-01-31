// @ts-nocheck
import type { RenderContext, ShapeAttrs } from '../../../renderer.ts';
import { BaseShapeHandler } from '../../shape-registry.ts';

export class Aws3dAmiHandler extends BaseShapeHandler {
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
    builder.moveTo(0, 0.6483 * height);
    builder.lineTo(0.0684 * width, 0.4133 * height);
    builder.lineTo(0.5326 * width, 0);
    builder.lineTo(0.6685 * width, 0);
    builder.lineTo(0.9359 * width, 0.2367 * height);
    builder.lineTo(width, 0.465 * height);
    builder.lineTo(0.4 * width, height);
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
    builder.moveTo(0, 0.65 * height);
    builder.lineTo(0.0652 * width, 0.5 * height);
    builder.lineTo(0.3326 * width, 0.7667 * height);
    builder.lineTo(0.4663 * width, 0.7667 * height);
    builder.lineTo(0.4 * width, height);
    builder.close();
    builder.fill();
    if ('0' == g) {
      builder.setAlpha(f[1]);
    } else {
      builder.setAlpha(f[0]);
    }
    builder.begin();
    builder.moveTo(0.4 * width, height);
    builder.lineTo(0.4641 * width, 0.77 * height);
    builder.lineTo(0.9326 * width, 0.355 * height);
    builder.lineTo(0.9347 * width, 0.24 * height);
    builder.lineTo(width, 0.4667 * height);
    builder.close();
    builder.fill();
    builder.restore();
    builder.setLineJoin('round');
    builder.begin();
    builder.moveTo(0, 0.65 * height);
    builder.lineTo(0.0652 * width, 0.5 * height);
    builder.lineTo(0.3326 * width, 0.7667 * height);
    builder.lineTo(0.4663 * width, 0.7667 * height);
    builder.lineTo(0.4 * width, height);
    builder.close();
    builder.stroke();
    builder.begin();
    builder.moveTo(0.4 * width, height);
    builder.lineTo(0.4641 * width, 0.77 * height);
    builder.lineTo(0.9326 * width, 0.355 * height);
    builder.lineTo(0.9347 * width, 0.24 * height);
    builder.lineTo(width, 0.4667 * height);
    builder.close();
    builder.stroke();
    builder.begin();
    builder.moveTo(0.0652 * width, 0.42 * height);
    builder.lineTo(0.0652 * width, 0.5 * height);
    builder.moveTo(0.3337 * width, 0.7667 * height);
    builder.lineTo(0.4 * width, height);
    builder.moveTo(0.9348 * width, 0.355 * height);
    builder.lineTo(width, 0.4733 * height);
    builder.stroke();
    builder.setLineJoin('miter');
    f = this.getStyleValue(style, 'strokeColor', '#000000');
    builder.setFillColor(f as string);
    builder.begin();
    builder.moveTo(0.1935 * width, 0.42 * height);
    builder.lineTo(0.5543 * width, 0.0967 * height);
    builder.lineTo(0.6652 * width, 0.1967 * height);
    builder.lineTo(0.3 * width, 0.5133 * height);
    builder.close();
    builder.moveTo(0.2967 * width, 0.4633 * height);
    builder.lineTo(0.3837 * width, 0.3883 * height);
    builder.lineTo(0.3326 * width, 0.3417 * height);
    builder.lineTo(0.2467 * width, 0.42 * height);
    builder.close();
    builder.moveTo(0.362 * width, 0.32 * height);
    builder.lineTo(0.412 * width, 0.3633 * height);
    builder.lineTo(0.5054 * width, 0.2867 * height);
    builder.lineTo(0.4522 * width, 0.24 * height);
    builder.close();
    builder.moveTo(0.5293 * width, 0.26 * height);
    builder.lineTo(0.6109 * width, 0.1933 * height);
    builder.lineTo(0.5511 * width, 0.145 * height);
    builder.lineTo(0.4739 * width, 0.2133 * height);
    builder.close();
    builder.moveTo(0.3528 * width, 0.557 * height);
    builder.lineTo(0.7137 * width, 0.2337 * height);
    builder.lineTo(0.8246 * width, 0.3337 * height);
    builder.lineTo(0.4593 * width, 0.6503 * height);
    builder.close();
    builder.moveTo(0.4561 * width, 0.6003 * height);
    builder.lineTo(0.543 * width, 0.5253 * height);
    builder.lineTo(0.492 * width, 0.4787 * height);
    builder.lineTo(0.4061 * width, 0.557 * height);
    builder.close();
    builder.moveTo(0.5213 * width, 0.457 * height);
    builder.lineTo(0.5713 * width, 0.5003 * height);
    builder.lineTo(0.6648 * width, 0.4237 * height);
    builder.lineTo(0.6115 * width, 0.377 * height);
    builder.close();
    builder.moveTo(0.6887 * width, 0.397 * height);
    builder.lineTo(0.7702 * width, 0.3303 * height);
    builder.lineTo(0.7104 * width, 0.282 * height);
    builder.lineTo(0.6333 * width, 0.3503 * height);
    builder.close();
    builder.fill();
    builder.setStrokeWidth(2 * e);
    builder.setStrokeColor(d as string);
    builder.setLineJoin('round');
    builder.begin();
    builder.moveTo(0, 0.6483 * height);
    builder.lineTo(0.0684 * width, 0.4133 * height);
    builder.lineTo(0.5326 * width, 0);
    builder.lineTo(0.6685 * width, 0);
    builder.lineTo(0.9359 * width, 0.2367 * height);
    builder.lineTo(width, 0.465 * height);
    builder.lineTo(0.4 * width, height);
    builder.close();
    builder.stroke();
    builder.restore();
  }
}
