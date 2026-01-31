// @ts-nocheck
import type { RenderContext, ShapeAttrs } from '../../../renderer.ts';
import { BaseShapeHandler } from '../../shape-registry.ts';

export class Aws3dInstanceHandler extends BaseShapeHandler {
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
    d = (f * width) / 123;
    f = (f * height) / 97;
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
    builder.moveTo(0, 0.634 * height);
    builder.lineTo(0, 0.2732 * height);
    builder.lineTo(0.374 * width, 0);
    builder.lineTo(0.622 * width, 0);
    builder.lineTo(width, 0.2732 * height);
    builder.lineTo(width, 0.634 * height);
    builder.lineTo(0.5 * width, height);
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
    builder.moveTo(0, 0.2732 * height);
    builder.lineTo(0.5 * width, 0.6392 * height);
    builder.lineTo(0.5 * width, height);
    builder.lineTo(0, 0.634 * height);
    builder.close();
    builder.fill();
    if ('0' == y) {
      builder.setAlpha(x[1]);
    } else {
      builder.setAlpha(x[0]);
    }
    builder.begin();
    builder.moveTo(0.5 * width, 0.6392 * height);
    builder.lineTo(width, 0.2732 * height);
    builder.lineTo(width, 0.6392 * height);
    builder.lineTo(0.5 * width, height);
    builder.close();
    builder.fill();
    builder.restore();
    builder.setShadow(!1);
    builder.setLineJoin('round');
    builder.begin();
    builder.moveTo(0, 0.2732 * height);
    builder.lineTo(0.5 * width, 0.6392 * height);
    builder.lineTo(0.5 * width, height);
    builder.lineTo(0, 0.634 * height);
    builder.close();
    builder.stroke();
    builder.begin();
    builder.moveTo(0.5 * width, 0.6392 * height);
    builder.lineTo(width, 0.2732 * height);
    builder.lineTo(width, 0.6392 * height);
    builder.lineTo(0.5 * width, height);
    builder.close();
    builder.stroke();
    x = this.getStyleValue(style, 'strokeColor', '#000000');
    builder.setFillColor(x as string);
    builder.begin();
    builder.moveTo(0.374 * width, 0.4742 * height);
    builder.arcTo(0.0325 * width, 0.0258 * height, 0, 0, 1, 0.374 * width, 0.4381 * height);
    builder.lineTo(0.4797 * width, 0.3608 * height);
    builder.arcTo(0.0325 * width, 0.0206 * height, 0, 0, 1, 0.5203 * width, 0.3608 * height);
    builder.lineTo(0.626 * width, 0.4381 * height);
    builder.arcTo(0.0325 * width, 0.0258 * height, 0, 0, 1, 0.626 * width, 0.4711 * height);
    builder.lineTo(0.5203 * width, 0.5485 * height);
    builder.arcTo(0.0325 * width, 0.0206 * height, 0, 0, 1, 0.4797 * width, 0.5485 * height);
    builder.close();
    builder.fill();
    builder.setStrokeWidth(2 * extra1);
    builder.setStrokeColor(extra2 as string);
    builder.setLineJoin('round');
    builder.begin();
    builder.moveTo(0, 0.634 * height);
    builder.lineTo(0, 0.2732 * height);
    builder.lineTo(0.374 * width, 0);
    builder.lineTo(0.622 * width, 0);
    builder.lineTo(width, 0.2732 * height);
    builder.lineTo(width, 0.634 * height);
    builder.lineTo(0.5 * width, height);
    builder.close();
    builder.stroke();
  }
}
