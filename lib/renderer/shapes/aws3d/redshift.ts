// @ts-nocheck
import type { RenderContext, ShapeAttrs } from '../../../renderer.ts';
import { BaseShapeHandler } from '../../shape-registry.ts';

export class Aws3dRedshiftHandler extends BaseShapeHandler {
  constructor(renderCtx: RenderContext) {
    super(renderCtx);
  }

  render(attrs: ShapeAttrs): void {
    const {
      builder,
      currentGroup,
      applyShapeAttrsToBuilder,
      x,
      y,
      width,
      height,
      style,
      getStencilShape,
      renderStencilShape,
    } = this.renderCtx;
    if (!builder || !currentGroup) return;
    if (width <= 0 || height <= 0) return;

    builder.setCanvasRoot(currentGroup);
    builder.save();
    applyShapeAttrsToBuilder(builder, attrs);
    let d = x;
    let e = y;
    let f = parseFloat(this.getStyleValue(style, 'strokeWidth', '1'));

    builder.translate(d, e);
    d = (f * width) / 149.5;
    f = (f * height) / 187.5;
    e = this.getStyleValue(style, 'strokeColor2', '#292929');
    f = Math.min(d, f);
    this.renderBackground(
      builder,
      0,
      0,
      width,
      height,
      style,
      getStencilShape,
      renderStencilShape,
      f,
      e
    );
    builder.setShadow(!1);
    this.renderForeground(
      builder,
      0,
      0,
      width,
      height,
      style,
      getStencilShape,
      renderStencilShape,
      f,
      e
    );
    builder.restore();
  }

  private renderBackground(
    builder: RenderContext['builder'],
    x: number,
    y: number,
    width: number,
    height: number,
    style: RenderContext['style'],
    getStencilShape?: RenderContext['getStencilShape'],
    renderStencilShape?: RenderContext['renderStencilShape'],
    extra1?: any,
    extra2?: any
  ): void {
    if (!builder) return;
    builder.setStrokeWidth(extra1);
    builder.save();
    builder.save();
    builder.save();
    builder.setStrokeWidth(2 * extra1);
    builder.setStrokeColor(extra2 as string);
    builder.setLineJoin('round');
    builder.begin();
    builder.moveTo(0, 0.6517 * height);
    builder.lineTo(0, 0.0912 * height);
    builder.lineTo(0.0368 * width, 0.0155 * height);
    builder.lineTo(0.2047 * width, 0);
    builder.lineTo(0.3378 * width, 0.0619 * height);
    builder.lineTo(0.3378 * width, 0.0912 * height);
    builder.lineTo(0.3819 * width, 0.0693 * height);
    builder.lineTo(0.6154 * width, 0.0693 * height);
    builder.lineTo(0.8502 * width, 0.1776 * height);
    builder.lineTo(0.8502 * width, 0.3083 * height);
    builder.lineTo(0.8682 * width, 0.3061 * height);
    builder.lineTo(width, 0.3664 * height);
    builder.lineTo(width, 0.9099 * height);
    builder.lineTo(0.9672 * width, 0.9861 * height);
    builder.lineTo(0.7926 * width, height);
    builder.lineTo(0.6629 * width, 0.9392 * height);
    builder.lineTo(0.6629 * width, 0.9099 * height);
    builder.lineTo(0.6167 * width, 0.9317 * height);
    builder.lineTo(0.3813 * width, 0.9317 * height);
    builder.lineTo(0.1478 * width, 0.8219 * height);
    builder.lineTo(0.1478 * width, 0.7093 * height);
    builder.lineTo(0.1365 * width, 0.7163 * height);
    builder.close();
    builder.fillAndStroke();
  }

  private renderForeground(
    builder: RenderContext['builder'],
    x: number,
    y: number,
    width: number,
    height: number,
    style: RenderContext['style'],
    getStencilShape?: RenderContext['getStencilShape'],
    renderStencilShape?: RenderContext['renderStencilShape'],
    extra1?: any,
    extra2?: any
  ): void {
    if (!builder) return;
    builder.restore();
    builder.setShadow(!1);
    builder.setFillColor('#000000' as string);
    x = this.getStyleValue(style, 'shadingCols', '0.1,0.3').toString().split(',');
    y = this.getStyleValue(style, 'flipH', '0');
    if ('0' == y) {
      builder.setAlpha(x[0]);
    } else {
      builder.setAlpha(x[1]);
    }
    builder.begin();
    builder.moveTo(0, 0.6541 * height);
    builder.lineTo(0, 0.0933 * height);
    builder.lineTo(0.1371 * width, 0.1573 * height);
    builder.lineTo(0.1371 * width, 0.7157 * height);
    builder.close();
    builder.moveTo(0.1485 * width, 0.8219 * height);
    builder.lineTo(0.1485 * width, 0.2864 * height);
    builder.lineTo(0.3846 * width, 0.3941 * height);
    builder.lineTo(0.3846 * width, 0.9317 * height);
    builder.close();
    builder.moveTo(0.6642 * width, 0.9392 * height);
    builder.lineTo(0.6642 * width, 0.4011 * height);
    builder.lineTo(0.796 * width, 0.4597 * height);
    builder.lineTo(0.796 * width, height);
    builder.close();
    builder.fill();
    if ('0' == y) {
      builder.setAlpha(x[1]);
    } else {
      builder.setAlpha(x[0]);
    }
    builder.begin();
    builder.moveTo(0.1371 * width, 0.7157 * height);
    builder.lineTo(0.1371 * width, 0.1568 * height);
    builder.lineTo(0.2027 * width, 0.1525 * height);
    builder.lineTo(0.1498 * width, 0.1771 * height);
    builder.lineTo(0.1498 * width, 0.7061 * height);
    builder.close();
    builder.moveTo(0.3846 * width, 0.3941 * height);
    builder.lineTo(0.614 * width, 0.3941 * height);
    builder.lineTo(0.6809 * width, 0.3632 * height);
    builder.lineTo(0.6642 * width, 0.4 * height);
    builder.lineTo(0.6642 * width, 0.9067 * height);
    builder.lineTo(0.6191 * width, 0.9317 * height);
    builder.lineTo(0.3833 * width, 0.9317 * height);
    builder.close();
    builder.moveTo(0.796 * width, 0.4608 * height);
    builder.lineTo(0.9639 * width, 0.4469 * height);
    builder.lineTo(width, 0.3691 * height);
    builder.lineTo(width, 0.9077 * height);
    builder.lineTo(0.9686 * width, 0.9856 * height);
    builder.lineTo(0.796 * width, height);
    builder.close();
    builder.moveTo(0.3378 * width, 0.0608 * height);
    builder.lineTo(0.3378 * width, 0.0907 * height);
    builder.lineTo(0.3197 * width, 0.1008 * height);
    builder.close();
    builder.moveTo(0.8502 * width, 0.2843 * height);
    builder.lineTo(0.8502 * width, 0.3083 * height);
    builder.lineTo(0.794 * width, 0.3136 * height);
    builder.close();
    builder.fill();
    builder.restore();
    builder.setShadow(!1);
    builder.setLineJoin('round');
    builder.begin();
    builder.moveTo(0, 0.6541 * height);
    builder.lineTo(0, 0.0933 * height);
    builder.lineTo(0.1371 * width, 0.1573 * height);
    builder.lineTo(0.1371 * width, 0.7157 * height);
    builder.close();
    builder.moveTo(0.1485 * width, 0.8219 * height);
    builder.lineTo(0.1485 * width, 0.2864 * height);
    builder.lineTo(0.3846 * width, 0.3941 * height);
    builder.lineTo(0.3846 * width, 0.9317 * height);
    builder.close();
    builder.moveTo(0.6642 * width, 0.9392 * height);
    builder.lineTo(0.6642 * width, 0.4011 * height);
    builder.lineTo(0.796 * width, 0.4597 * height);
    builder.lineTo(0.796 * width, height);
    builder.close();
    builder.moveTo(0.1371 * width, 0.7157 * height);
    builder.lineTo(0.1371 * width, 0.1568 * height);
    builder.lineTo(0.2027 * width, 0.1525 * height);
    builder.lineTo(0.1498 * width, 0.1771 * height);
    builder.lineTo(0.1498 * width, 0.7061 * height);
    builder.close();
    builder.moveTo(0.3846 * width, 0.3941 * height);
    builder.lineTo(0.614 * width, 0.3941 * height);
    builder.lineTo(0.6809 * width, 0.3632 * height);
    builder.lineTo(0.6642 * width, 0.4 * height);
    builder.lineTo(0.6642 * width, 0.9067 * height);
    builder.lineTo(0.6191 * width, 0.9317 * height);
    builder.lineTo(0.3833 * width, 0.9317 * height);
    builder.close();
    builder.moveTo(0.796 * width, 0.4608 * height);
    builder.lineTo(0.9639 * width, 0.4469 * height);
    builder.lineTo(width, 0.3691 * height);
    builder.lineTo(width, 0.9077 * height);
    builder.lineTo(0.9686 * width, 0.9856 * height);
    builder.lineTo(0.796 * width, height);
    builder.close();
    builder.moveTo(0.3378 * width, 0.0608 * height);
    builder.lineTo(0.3378 * width, 0.0907 * height);
    builder.lineTo(0.3197 * width, 0.1008 * height);
    builder.close();
    builder.moveTo(0.8502 * width, 0.2843 * height);
    builder.lineTo(0.8502 * width, 0.3083 * height);
    builder.lineTo(0.794 * width, 0.3136 * height);
    builder.close();
    builder.moveTo(0.6167 * width, 0.3941 * height);
    builder.lineTo(0.6167 * width, 0.9317 * height);
    builder.moveTo(0.9652 * width, 0.4448 * height);
    builder.lineTo(0.9652 * width, 0.9851 * height);
    builder.stroke();
    builder.restore();
    builder.setShadow(!1);
    x = this.getStyleValue(style, 'strokeColor', '#000000');
    builder.setFillColor(x as string);
    builder.begin();
    builder.moveTo(0.4903 * width, 0.1259 * height);
    builder.arcTo(0.01 * width, 0.008 * height, 0, 0, 1, 0.5023 * width, 0.1189 * height);
    builder.arcTo(0.2007 * width, 0.16 * height, 0, 0, 1, 0.5639 * width, 0.1333 * height);
    builder.arcTo(0.602 * width, 0.48 * height, 0, 0, 1, 0.7157 * width, 0.2005 * height);
    builder.arcTo(0.2006 * width, 0.16 * height, 0, 0, 1, 0.7565 * width, 0.2315 * height);
    builder.arcTo(0.01 * width, 0.008 * height, 0, 0, 1, 0.7445 * width, 0.2421 * height);
    builder.arcTo(0.2676 * width, 0.2133 * height, 0, 0, 1, 0.6742 * width, 0.2251 * height);
    builder.arcTo(0.602 * width, 0.48 * height, 0, 0, 1, 0.5204 * width, 0.1541 * height);
    builder.arcTo(0.1338 * width, 0.1067 * height, 0, 0, 1, 0.4903 * width, 0.1259 * height);
    builder.close();
    builder.moveTo(0.4789 * width, 0.1275 * height);
    builder.arcTo(0.0334 * width, 0.0267 * height, 0, 0, 0, 0.487 * width, 0.1461 * height);
    builder.arcTo(0.1672 * width, 0.1333 * height, 0, 0, 0, 0.5237 * width, 0.1728 * height);
    builder.arcTo(0.6689 * width, 0.5333 * height, 0, 0, 0, 0.6609 * width, 0.2352 * height);
    builder.arcTo(0.2676 * width, 0.2133 * height, 0, 0, 0, 0.7244 * width, 0.2501 * height);
    builder.arcTo(0.0201 * width, 0.016 * height, 0, 0, 0, 0.7411 * width, 0.2475 * height);
    builder.lineTo(0.5385 * width, 0.3408 * height);
    builder.arcTo(0.0669 * width, 0.05333 * height, 0, 0, 1, 0.512 * width, 0.3397 * height);
    builder.arcTo(0.2676 * width, 0.2133 * height, 0, 0, 1, 0.4548 * width, 0.3248 * height);
    builder.arcTo(0.6689 * width, 0.5333 * height, 0, 0, 1, 0.3084 * width, 0.2565 * height);
    builder.arcTo(0.1672 * width, 0.1333 * height, 0, 0, 1, 0.2776 * width, 0.2304 * height);
    builder.arcTo(0.01 * width, 0.008 * height, 0, 0, 1, 0.2776 * width, 0.2197 * height);
    builder.close();
    builder.fill();
    x = this.getStyleValue(style, 'fillColor', '#ffffff');
    builder.setFillColor(x as string);
    builder.setLineJoin('round');
    builder.setLineCap('round');
    builder.begin();
    builder.moveTo(0.3398 * width, 0.2421 * height);
    builder.lineTo(0.4769 * width, 0.1797 * height);
    builder.lineTo(0.6341 * width, 0.2512 * height);
    builder.lineTo(0.4936 * width, 0.3147 * height);
    builder.fill();
    builder.begin();
    builder.moveTo(0.4334 * width, 0.1941 * height);
    builder.lineTo(0.6207 * width, 0.2811 * height);
    builder.moveTo(0.5338 * width, 0.1995 * height);
    builder.lineTo(0.3866 * width, 0.2688 * height);
    builder.moveTo(0.5873 * width, 0.2235 * height);
    builder.lineTo(0.4334 * width, 0.2955 * height);
    builder.stroke();
    builder.setStrokeWidth(2 * extra1);
    builder.setStrokeColor(extra2 as string);
    builder.begin();
    builder.moveTo(0, 0.6517 * height);
    builder.lineTo(0, 0.0912 * height);
    builder.lineTo(0.0368 * width, 0.0155 * height);
    builder.lineTo(0.2047 * width, 0);
    builder.lineTo(0.3378 * width, 0.0619 * height);
    builder.lineTo(0.3378 * width, 0.0912 * height);
    builder.lineTo(0.3819 * width, 0.0693 * height);
    builder.lineTo(0.6154 * width, 0.0693 * height);
    builder.lineTo(0.8502 * width, 0.1776 * height);
    builder.lineTo(0.8502 * width, 0.3083 * height);
    builder.lineTo(0.8682 * width, 0.3061 * height);
    builder.lineTo(width, 0.3664 * height);
    builder.lineTo(width, 0.9099 * height);
    builder.lineTo(0.9672 * width, 0.9861 * height);
    builder.lineTo(0.7926 * width, height);
    builder.lineTo(0.6629 * width, 0.9392 * height);
    builder.lineTo(0.6629 * width, 0.9099 * height);
    builder.lineTo(0.6167 * width, 0.9317 * height);
    builder.lineTo(0.3813 * width, 0.9317 * height);
    builder.lineTo(0.1478 * width, 0.8219 * height);
    builder.lineTo(0.1478 * width, 0.7093 * height);
    builder.lineTo(0.1365 * width, 0.7163 * height);
    builder.close();
    builder.stroke();
  }
}
