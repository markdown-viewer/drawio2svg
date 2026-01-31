// @ts-nocheck
import type { RenderContext, ShapeAttrs } from '../../../renderer.ts';
import { BaseShapeHandler } from '../../shape-registry.ts';

export class Aws3dEmailServiceHandler extends BaseShapeHandler {
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
    d = (f * width) / 151;
    f = (f * height) / 192;
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
    builder.moveTo(0, 0.8182 * height);
    builder.lineTo(0, 0.1818 * height);
    builder.lineTo(0.4007 * width, 0);
    builder.lineTo(0.606 * width, 0);
    builder.lineTo(width, 0.1792 * height);
    builder.lineTo(width, 0.8182 * height);
    builder.lineTo(0.5993 * width, height);
    builder.lineTo(0.4007 * width, height);
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
    builder.moveTo(0, 0.2727 * height);
    builder.lineTo(0.4007 * width, 0.4546 * height);
    builder.lineTo(0.5993 * width, 0.4546 * height);
    builder.lineTo(0.5993 * width, height);
    builder.lineTo(0.4007 * width, height);
    builder.lineTo(0, 0.8182 * height);
    builder.close();
    builder.fill();
    if ('0' == y) {
      builder.setAlpha(x[1]);
    } else {
      builder.setAlpha(x[0]);
    }
    builder.begin();
    builder.moveTo(0.5993 * width, 0.4546 * height);
    builder.lineTo(width, 0.2727 * height);
    builder.lineTo(0.8013 * width, 0.1792 * height);
    builder.lineTo(0.8013 * width, 0.0883 * height);
    builder.lineTo(width, 0.1792 * height);
    builder.lineTo(width, 0.8182 * height);
    builder.lineTo(0.5993 * width, height);
    builder.close();
    builder.fill();
    builder.restore();
    builder.setShadow(!1);
    builder.setLineJoin('round');
    builder.begin();
    builder.moveTo(0, 0.2727 * height);
    builder.lineTo(0.4007 * width, 0.4546 * height);
    builder.lineTo(0.5993 * width, 0.4546 * height);
    builder.lineTo(0.5993 * width, height);
    builder.lineTo(0.4007 * width, height);
    builder.lineTo(0, 0.8182 * height);
    builder.close();
    builder.stroke();
    builder.begin();
    builder.moveTo(0.5993 * width, 0.4546 * height);
    builder.lineTo(width, 0.2727 * height);
    builder.lineTo(0.8013 * width, 0.1792 * height);
    builder.lineTo(0.8013 * width, 0.0883 * height);
    builder.lineTo(width, 0.1792 * height);
    builder.lineTo(width, 0.8182 * height);
    builder.lineTo(0.5993 * width, height);
    builder.close();
    builder.stroke();
    builder.begin();
    builder.moveTo(0.202 * width, 0.0883 * height);
    builder.lineTo(0.202 * width, 0.1818 * height);
    builder.lineTo(0.4007 * width, 0.2727 * height);
    builder.lineTo(0.5993 * width, 0.2727 * height);
    builder.lineTo(0.798 * width, 0.1818 * height);
    builder.moveTo(0.2053 * width, 0.1818 * height);
    builder.lineTo(0.0033 * width, 0.2714 * height);
    builder.moveTo(0.4007 * width, 0.2727 * height);
    builder.lineTo(0.4007 * width, 0.9961 * height);
    builder.moveTo(0.5993 * width, 0.2727 * height);
    builder.lineTo(0.5993 * width, 0.4546 * height);
    builder.stroke();
    builder.setLineJoin('miter');
    x = this.getStyleValue(style, 'strokeColor', '#000000');
    builder.setFillColor(x as string);
    builder.begin();
    builder.moveTo(0.4437 * width, 0.0779 * height);
    builder.arcTo(0.0662 * width, 0.0519 * height, 0, 0, 1, 0.404 * width, 0.0706 * height);
    builder.arcTo(0.0464 * width, 0.0364 * height, 0, 0, 1, 0.3815 * width, 0.0421 * height);
    builder.arcTo(0.053 * width, 0.026 * height, 0, 0, 1, 0.4205 * width, 0.0187 * height);
    builder.arcTo(0.1987 * width, 0.1558 * height, 0, 0, 1, 0.4768 * width, 0.0203 * height);
    builder.arcTo(0.0795 * width, 0.0364 * height, 0, 0, 1, 0.5199 * width, 0.0494 * height);
    builder.arcTo(0.0265 * width, 0.0208 * height, 0, 0, 1, 0.5099 * width, 0.0649 * height);
    builder.arcTo(0.0795 * width, 0.0623 * height, 0, 0, 1, 0.4536 * width, 0.0727 * height);
    builder.arcTo(0.0199 * width, 0.0156 * height, 0, 0, 1, 0.4404 * width, 0.0597 * height);
    builder.arcTo(0.0265 * width, 0.0208 * height, 0, 0, 1, 0.4219 * width, 0.0566 * height);
    builder.arcTo(0.0199 * width, 0.0114 * height, 0, 0, 1, 0.4172 * width, 0.0431 * height);
    builder.arcTo(0.0265 * width, 0.0208 * height, 0, 0, 1, 0.4483 * width, 0.0416 * height);
    builder.arcTo(0.0132 * width, 0.0104 * height, 0, 0, 1, 0.457 * width, 0.053 * height);
    builder.arcTo(0.0132 * width, 0.0104 * height, 0, 0, 0, 0.4669 * width, 0.0431 * height);
    builder.arcTo(0.0166 * width, 0.0166 * height, 0, 0, 0, 0.4464 * width, 0.0358 * height);
    builder.lineTo(0.4437 * width, 0.0338 * height);
    builder.arcTo(0.0199 * width, 0.0156 * height, 0, 0, 1, 0.4603 * width, 0.0322 * height);
    builder.arcTo(0.0397 * width, 0.0156 * height, 0, 0, 1, 0.4755 * width, 0.0462 * height);
    builder.arcTo(0.0199 * width, 0.0156 * height, 0, 0, 1, 0.4669 * width, 0.0545 * height);
    builder.arcTo(0.053 * width, 0.0416 * height, 0, 0, 1, 0.453 * width, 0.0608 * height);
    builder.arcTo(0.0099 * width, 0.0078 * height, 0, 0, 0, 0.4636 * width, 0.0675 * height);
    builder.arcTo(0.0662 * width, 0.0519 * height, 0, 0, 0, 0.498 * width, 0.0623 * height);
    builder.arcTo(0.0185 * width, 0.0145 * height, 0, 0, 0, 0.5079 * width, 0.0457 * height);
    builder.arcTo(0.053 * width, 0.0416 * height, 0, 0, 0, 0.4848 * width, 0.0296 * height);
    builder.arcTo(0.0993 * width, 0.0779 * height, 0, 0, 0, 0.455 * width, 0.0234 * height);
    builder.arcTo(0.1325 * width, 0.1039 * height, 0, 0, 0, 0.4172 * width, 0.026 * height);
    builder.arcTo(0.0397 * width, 0.0312 * height, 0, 0, 0, 0.3927 * width, 0.039 * height);
    builder.arcTo(0.0265 * width, 0.0208 * height, 0, 0, 0, 0.3974 * width, 0.0571 * height);
    builder.arcTo(0.053 * width, 0.0416 * height, 0, 0, 0, 0.4205 * width, 0.0701 * height);
    builder.arcTo(0.0331 * width, 0.026 * height, 0, 0, 0, 0.4404 * width, 0.0722 * height);
    builder.moveTo(0.42 * width, 0.049 * height);
    builder.arcTo(0.02 * width, 0.02 * height, 0, 0, 0, 0.435 * width, 0.055 * height);
    builder.arcTo(0.02 * width, 0.02 * height, 0, 0, 0, 0.45 * width, 0.049 * height);
    builder.arcTo(0.02 * width, 0.02 * height, 0, 0, 0, 0.435 * width, 0.043 * height);
    builder.arcTo(0.02 * width, 0.02 * height, 0, 0, 0, 0.42 * width, 0.049 * height);
    builder.close();
    builder.moveTo(0.4669 * width, 0.0894 * height);
    builder.arcTo(0.1325 * width, 0.1039 * height, 0, 0, 0, 0.5099 * width, 0.0831 * height);
    builder.lineTo(0.6689 * width, 0.1543 * height);
    builder.lineTo(0.4887 * width, 0.1371 * height);
    builder.close();
    builder.moveTo(0.3887 * width, 0.0769 * height);
    builder.arcTo(0.0662 * width, 0.0519 * height, 0, 0, 0, 0.4205 * width, 0.0888 * height);
    builder.arcTo(0.0662 * width, 0.026 * height, 0, 0, 0, 0.447 * width, 0.0894 * height);
    builder.lineTo(0.4735 * width, 0.1512 * height);
    builder.lineTo(0.6689 * width, 0.1688 * height);
    builder.lineTo(0.5199 * width, 0.2364 * height);
    builder.lineTo(0.2815 * width, 0.1273 * height);
    builder.close();
    builder.fill();
    builder.setStrokeWidth(2 * extra1);
    builder.setStrokeColor(extra2 as string);
    builder.setLineJoin('round');
    builder.begin();
    builder.moveTo(0, 0.8182 * height);
    builder.lineTo(0, 0.1818 * height);
    builder.lineTo(0.4007 * width, 0);
    builder.lineTo(0.606 * width, 0);
    builder.lineTo(width, 0.1792 * height);
    builder.lineTo(width, 0.8182 * height);
    builder.lineTo(0.5993 * width, height);
    builder.lineTo(0.4007 * width, height);
    builder.close();
    builder.stroke();
  }
}
