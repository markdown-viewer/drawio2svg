// @ts-nocheck
import type { RenderContext, ShapeAttrs } from '../../../renderer.ts';
import { BaseShapeHandler } from '../../shape-registry.ts';

export class Aws3dRoute53Handler extends BaseShapeHandler {
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
    d = (f * width) / 117;
    f = (f * height) / 134.4;
    e = this.getStyleValue(style, 'strokeColor2', '#292929');
    f = Math.min(d, f);
    builder.setStrokeWidth(f);
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
    builder.save();
    builder.save();
    builder.setStrokeWidth(2 * extra1);
    builder.setStrokeColor(extra2 as string);
    builder.setLineJoin('round');
    builder.begin();
    builder.moveTo(0, 0.6994 * height);
    builder.lineTo(0, 0.2009 * height);
    builder.lineTo(0.0427 * width, 0.0781 * height);
    builder.lineTo(0.7974 * width, 0);
    builder.lineTo(width, 0.1004 * height);
    builder.lineTo(width, 0.5915 * height);
    builder.lineTo(0.8376 * width, 0.9784 * height);
    builder.lineTo(0.5983 * width, height);
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
    builder.moveTo(0, 0.2009 * height);
    builder.lineTo(0.6009 * width, 0.5007 * height);
    builder.lineTo(0.8376 * width, 0.4799 * height);
    builder.lineTo(0.8376 * width, 0.9784 * height);
    builder.lineTo(0.5966 * width, height);
    builder.lineTo(0, 0.6979 * height);
    builder.close();
    builder.fill();
    if ('0' == y) {
      builder.setAlpha(x[1]);
    } else {
      builder.setAlpha(x[0]);
    }
    builder.begin();
    builder.moveTo(0.8348 * width, 0.4861 * height);
    builder.lineTo(0.9985 * width, 0.0992 * height);
    builder.lineTo(width, 0.5952 * height);
    builder.lineTo(0.8404 * width, 0.9747 * height);
    builder.close();
    builder.fill();
    builder.restore();
    builder.setShadow(!1);
    builder.setLineJoin('round');
    x = this.getStyleValue(style, 'strokeColor', '#000000');
    builder.setFillColor(x as string);
    builder.begin();
    builder.moveTo(0.5855 * width, 0.1079 * height);
    builder.arcTo(0.094 * width, 0.0744 * height, 0, 0, 0, 0.6863 * width, 0.1548 * height);
    builder.arcTo(0.0855 * width, 0.0446 * height, 0, 0, 0, 0.7761 * width, 0.2031 * height);
    builder.lineTo(0.7726 * width, 0.2455 * height);
    builder.arcTo(0.0769 * width, 0.0298 * height, 0, 0, 0, 0.694 * width, 0.2693 * height);
    builder.arcTo(0.0684 * width, 0.0446 * height, 0, 0, 1, 0.5897 * width, 0.3051 * height);
    builder.arcTo(0.4274 * width, 0.372 * height, 0, 0, 0, 0.4573 * width, 0.2753 * height);
    builder.arcTo(0.0855 * width, 0.0744 * height, 0, 0, 0, 0.4188 * width, 0.2344 * height);
    builder.lineTo(0.3846 * width, 0.2083 * height);
    builder.arcTo(0.0769 * width, 0.0372 * height, 0, 0, 1, 0.4103 * width, 0.1525 * height);
    builder.arcTo(0.0855 * width, 0.0409 * height, 0, 0, 0, 0.4906 * width, 0.1079 * height);
    builder.close();
    builder.fill();
    builder.begin();
    builder.moveTo(0, 0.2009 * height);
    builder.lineTo(0.6009 * width, 0.5007 * height);
    builder.lineTo(0.8376 * width, 0.4799 * height);
    builder.lineTo(0.8376 * width, 0.9784 * height);
    builder.lineTo(0.5966 * width, height);
    builder.lineTo(0, 0.6979 * height);
    builder.close();
    builder.moveTo(0.8348 * width, 0.4861 * height);
    builder.lineTo(0.9985 * width, 0.0992 * height);
    builder.lineTo(width, 0.5952 * height);
    builder.lineTo(0.8404 * width, 0.9747 * height);
    builder.close();
    builder.moveTo(0.6009 * width, 0.5007 * height);
    builder.lineTo(0.6009 * width, height);
    builder.stroke();
    builder.setStrokeWidth(2 * extra1);
    builder.setStrokeColor(extra2 as string);
    builder.begin();
    builder.moveTo(0, 0.6994 * height);
    builder.lineTo(0, 0.2009 * height);
    builder.lineTo(0.0427 * width, 0.0781 * height);
    builder.lineTo(0.7974 * width, 0);
    builder.lineTo(width, 0.1004 * height);
    builder.lineTo(width, 0.5915 * height);
    builder.lineTo(0.8376 * width, 0.9784 * height);
    builder.lineTo(0.5983 * width, height);
    builder.close();
    builder.stroke();
  }
}
