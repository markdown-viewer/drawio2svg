// @ts-nocheck
import type { RenderContext, ShapeAttrs } from '../../../renderer.ts';
import { BaseShapeHandler } from '../../shape-registry.ts';

export class Aws3dS3Handler extends BaseShapeHandler {
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
      getStencilSvg,
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
    d = (f * width) / 231.5;
    f = (f * height) / 239;
    e = this.getStyleValue(style, 'strokeColor2', '#292929');
    f = Math.min(d, f);
    this.renderBackground(
      builder,
      0,
      0,
      width,
      height,
      style,
      getStencilSvg,
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
      getStencilSvg,
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
    getStencilSvg?: RenderContext['getStencilSvg'],
    renderStencilShape?: RenderContext['renderStencilShape'],
    extra1?: any,
    extra2?: any
  ): void {
    if (!builder) return;
    builder.setStrokeWidth(extra1);
    builder.save();
    builder.save();
    builder.setStrokeWidth(2 * extra1);
    builder.setStrokeColor(extra2 as string);
    builder.setLineJoin('round');
    builder.begin();
    builder.moveTo(0, 0.7782 * height);
    builder.lineTo(0, 0.3406 * height);
    builder.lineTo(0.5974 * width, 0);
    builder.lineTo(width, 0.2218 * height);
    builder.lineTo(width, 0.6674 * height);
    builder.lineTo(0.3991 * width, height);
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
    getStencilSvg?: RenderContext['getStencilSvg'],
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
    builder.moveTo(0, 0.3406 * height);
    builder.lineTo(0.3991 * width, 0.5548 * height);
    builder.lineTo(0.3991 * width, height);
    builder.lineTo(0, 0.7782 * height);
    builder.close();
    builder.fill();
    if ('0' == y) {
      builder.setAlpha(x[1]);
    } else {
      builder.setAlpha(x[0]);
    }
    builder.begin();
    builder.moveTo(0.3991 * width, 0.5548 * height);
    builder.lineTo(width, 0.2218 * height);
    builder.lineTo(width, 0.6661 * height);
    builder.lineTo(0.3991 * width, height);
    builder.close();
    builder.fill();
    builder.restore();
    builder.setShadow(!1);
    builder.setLineJoin('round');
    builder.begin();
    builder.moveTo(0, 0.3406 * height);
    builder.lineTo(0.3991 * width, 0.5548 * height);
    builder.lineTo(width, 0.2218 * height);
    builder.moveTo(0.3991 * width, 0.5548 * height);
    builder.lineTo(0.3991 * width, height);
    builder.moveTo(0.3991 * width, 0.3335 * height);
    builder.lineTo(0.2009 * width, 0.448 * height);
    builder.lineTo(0.2009 * width, 0.8891 * height);
    builder.moveTo(0.5983 * width, 0.2209 * height);
    builder.lineTo(0.7948 * width, 0.1109 * height);
    builder.moveTo(0.2022 * width, 0.2218 * height);
    builder.lineTo(0.5991 * width, 0.4448 * height);
    builder.lineTo(0.5991 * width, 0.8891 * height);
    builder.moveTo(0.4004 * width, 0.1117 * height);
    builder.lineTo(0.7978 * width, 0.3335 * height);
    builder.lineTo(0.7978 * width, 0.7791 * height);
    builder.stroke();
    x = this.getStyleValue(style, 'strokeColor', '#000000');
    builder.setFillColor(x as string);
    builder.begin();
    builder.moveTo(0.4773 * width, 0.2155 * height);
    builder.arcTo(0.0086 * width, 0.0046 * height, 0, 0, 1, 0.4903 * width, 0.2096 * height);
    builder.arcTo(0.2808 * width, 0.272 * height, 0, 0, 1, 0.6004 * width, 0.2619 * height);
    builder.arcTo(0.108 * width, 0.105 * height, 0, 0, 1, 0.6177 * width, 0.277 * height);
    builder.arcTo(0.0065 * width, 0.0063 * height, 0, 0, 1, 0.6099 * width, 0.2879 * height);
    builder.arcTo(0.1944 * width, 0.1883 * height, 0, 0, 1, 0.5378 * width, 0.2607 * height);
    builder.arcTo(0.216 * width, 0.2092 * height, 0, 0, 1, 0.4773 * width, 0.2155 * height);
    builder.close();
    builder.fill();
    builder.begin();
    builder.moveTo(0.4687 * width, 0.2138 * height);
    builder.arcTo(0.1512 * width, 0.1464 * height, 0, 0, 0, 0.4838 * width, 0.2343 * height);
    builder.arcTo(0.2376 * width, 0.2301 * height, 0, 0, 0, 0.5529 * width, 0.2774 * height);
    builder.arcTo(0.1728 * width, 0.1674 * height, 0, 0, 0, 0.6091 * width, 0.2954 * height);
    builder.lineTo(0.4946 * width, 0.3339 * height);
    builder.arcTo(0.1944 * width, 0.1883 * height, 0, 0, 1, 0.4549 * width, 0.3205 * height);
    builder.arcTo(0.1944 * width, 0.1883 * height, 0, 0, 1, 0.419 * width, 0.3004 * height);
    builder.arcTo(0.1944 * width, 0.1883 * height, 0, 0, 1, 0.3965 * width, 0.2795 * height);
    builder.close();
    builder.fill();
    builder.setStrokeWidth(2 * extra1);
    builder.setStrokeColor(extra2 as string);
    builder.setLineJoin('round');
    builder.begin();
    builder.moveTo(0, 0.7782 * height);
    builder.lineTo(0, 0.3406 * height);
    builder.lineTo(0.5974 * width, 0);
    builder.lineTo(width, 0.2218 * height);
    builder.lineTo(width, 0.6674 * height);
    builder.lineTo(0.3991 * width, height);
    builder.close();
    builder.stroke();
  }
}
