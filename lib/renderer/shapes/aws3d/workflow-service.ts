// @ts-nocheck
import type { RenderContext, ShapeAttrs } from '../../../renderer.ts';
import { BaseShapeHandler } from '../../shape-registry.ts';

export class Aws3dWorkflowServiceHandler extends BaseShapeHandler {
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
    d = (f * width) / 181.5;
    f = (f * height) / 210;
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
    builder.save();
    builder.setStrokeWidth(2 * extra1);
    builder.setStrokeColor(extra2 as string);
    builder.setLineJoin('round');
    builder.begin();
    builder.moveTo(0, 0.6456 * height);
    builder.lineTo(0.2481 * width, 0);
    builder.lineTo(0.7497 * width, 0);
    builder.lineTo(width, 0.6456 * height);
    builder.lineTo(0.4984 * width, height);
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
    builder.moveTo(0, 0.6456 * height);
    builder.lineTo(0.2486 * width, 0);
    builder.lineTo(0.2486 * width, 0.3531 * height);
    builder.lineTo(0.4984 * width, height);
    builder.close();
    builder.moveTo(0.7497 * width, 0.3531 * height);
    builder.lineTo(0.7497 * width, 0);
    builder.lineTo(width, 0.6456 * height);
    builder.close();
    builder.fill();
    if ('0' == y) {
      builder.setAlpha(x[1]);
    } else {
      builder.setAlpha(x[0]);
    }
    builder.begin();
    builder.moveTo(0.4984 * width, height);
    builder.lineTo(0.7486 * width, 0.3531 * height);
    builder.lineTo(width, 0.6456 * height);
    builder.lineTo(0.4967 * width, height);
    builder.close();
    builder.fill();
    builder.restore();
    builder.setShadow(!1);
    builder.setLineJoin('round');
    builder.begin();
    builder.moveTo(0.7497 * width, 0.3531 * height);
    builder.lineTo(0.7497 * width, 0);
    builder.lineTo(width, 0.6456 * height);
    builder.close();
    builder.moveTo(0, 0.6456 * height);
    builder.lineTo(0.2486 * width, 0);
    builder.lineTo(0.2486 * width, 0.3531 * height);
    builder.lineTo(0.4984 * width, height);
    builder.lineTo(0.7486 * width, 0.3531 * height);
    builder.lineTo(width, 0.6456 * height);
    builder.lineTo(0.4967 * width, height);
    builder.close();
    builder.moveTo(0.2486 * width, 0.3531 * height);
    builder.lineTo(0.7508 * width, 0.3531 * height);
    builder.moveTo(0.2488 * width, 0.353 * height);
    builder.lineTo(0, 0.6486 * height);
    builder.stroke();
    builder.restore();
    builder.setShadow(!1);
    x = this.getStyleValue(style, 'strokeColor', '#000000');
    builder.setFillColor(x as string);
    builder.setStrokeWidth(2 * extra1);
    builder.begin();
    builder.ellipse(0.2925 * width, 0.031 * height, 0.4116 * width, 0.2925 * height);
    builder.fill();
    x = this.getStyleValue(style, 'fillColor', '#ffffff');
    builder.setStrokeColor(x as string);
    builder.begin();
    builder.moveTo(0.5252 * width, 0.0465 * height);
    builder.lineTo(0.5873 * width, 0.0903 * height);
    builder.lineTo(0.5483 * width, 0.1173 * height);
    builder.lineTo(0.4874 * width, 0.0728 * height);
    builder.close();
    builder.moveTo(0.4896 * width, 0.1132 * height);
    builder.lineTo(0.5005 * width, 0.1705 * height);
    builder.lineTo(0.4182 * width, 0.1631 * height);
    builder.lineTo(0.4122 * width, 0.1058 * height);
    builder.close();
    builder.moveTo(0.3584 * width, 0.1631 * height);
    builder.lineTo(0.4204 * width, 0.2062 * height);
    builder.lineTo(0.3825 * width, 0.2332 * height);
    builder.lineTo(0.32 * width, 0.19 * height);
    builder.close();
    builder.moveTo(0.4594 * width, 0.2338 * height);
    builder.lineTo(0.5214 * width, 0.2783 * height);
    builder.lineTo(0.4835 * width, 0.3053 * height);
    builder.lineTo(0.4215 * width, 0.2608 * height);
    builder.close();
    builder.moveTo(0.5187 * width, 0.0943 * height);
    builder.lineTo(0.4879 * width, 0.1152 * height);
    builder.moveTo(0.421 * width, 0.1624 * height);
    builder.lineTo(0.3895 * width, 0.1846 * height);
    builder.moveTo(0.5 * width, 0.1698 * height);
    builder.lineTo(0.5554 * width, 0.2089 * height);
    builder.lineTo(0.4885 * width, 0.2567 * height);
    builder.stroke();
    builder.setStrokeWidth(2 * extra1);
    builder.setStrokeColor(extra2 as string);
    builder.setLineJoin('round');
    builder.begin();
    builder.moveTo(0, 0.6456 * height);
    builder.lineTo(0.2481 * width, 0);
    builder.lineTo(0.7497 * width, 0);
    builder.lineTo(width, 0.6456 * height);
    builder.lineTo(0.4984 * width, height);
    builder.close();
    builder.close();
    builder.stroke();
  }
}
