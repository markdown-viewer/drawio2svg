// @ts-nocheck
import type { RenderContext, ShapeAttrs } from '../../../renderer.ts';
import { BaseShapeHandler } from '../../shape-registry.ts';

export class Aws3dSimpleDb2Handler extends BaseShapeHandler {
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
    builder.moveTo(0, 0.8183 * height);
    builder.lineTo(0, 0.1848 * height);
    builder.lineTo(0.3366 * width, 0);
    builder.lineTo(0.6293 * width, 0.0021 * height);
    builder.lineTo(width, 0.1833 * height);
    builder.lineTo(width, 0.8183 * height);
    builder.lineTo(0.6694 * width, height);
    builder.lineTo(0.4986 * width, 0.9091 * height);
    builder.lineTo(0.3333 * width, height);
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
    builder.moveTo(0, 0.1848 * height);
    builder.lineTo(0.168 * width, 0.1833 * height);
    builder.lineTo(0, 0.365 * height);
    builder.lineTo(0.3333 * width, 0.5467 * height);
    builder.lineTo(0.3333 * width, height);
    builder.lineTo(0, 0.8183 * height);
    builder.close();
    builder.moveTo(0.4986 * width, 0.9078 * height);
    builder.lineTo(0.4986 * width, 0.3655 * height);
    builder.lineTo(0.6667 * width, 0.5457 * height);
    builder.lineTo(0.6667 * width, height);
    builder.close();
    builder.fill();
    if ('0' == y) {
      builder.setAlpha(x[1]);
    } else {
      builder.setAlpha(x[0]);
    }
    builder.begin();
    builder.moveTo(0.3333 * width, 0.5467 * height);
    builder.lineTo(0.4986 * width, 0.3655 * height);
    builder.lineTo(0.4986 * width, 0.9076 * height);
    builder.lineTo(0.3333 * width, height);
    builder.close();
    builder.moveTo(0.8292 * width, 0.1822 * height);
    builder.lineTo(width, 0.1848 * height);
    builder.lineTo(width, 0.8183 * height);
    builder.lineTo(0.6667 * width, height);
    builder.lineTo(0.6667 * width, 0.5441 * height);
    builder.lineTo(width, 0.3666 * height);
    builder.close();
    builder.fill();
    builder.restore();
    builder.setShadow(!1);
    builder.setLineJoin('round');
    builder.begin();
    builder.moveTo(0, 0.1848 * height);
    builder.lineTo(0.168 * width, 0.1833 * height);
    builder.lineTo(0, 0.365 * height);
    builder.lineTo(0.3333 * width, 0.5467 * height);
    builder.lineTo(0.3333 * width, height);
    builder.lineTo(0, 0.8183 * height);
    builder.close();
    builder.moveTo(0.4986 * width, 0.9078 * height);
    builder.lineTo(0.4986 * width, 0.3655 * height);
    builder.lineTo(0.6667 * width, 0.5457 * height);
    builder.lineTo(0.6667 * width, height);
    builder.close();
    builder.moveTo(0.3333 * width, 0.5467 * height);
    builder.lineTo(0.4986 * width, 0.3655 * height);
    builder.lineTo(0.4986 * width, 0.9076 * height);
    builder.lineTo(0.3333 * width, height);
    builder.close();
    builder.moveTo(0.8292 * width, 0.1822 * height);
    builder.lineTo(width, 0.1848 * height);
    builder.lineTo(width, 0.8183 * height);
    builder.lineTo(0.6667 * width, height);
    builder.lineTo(0.6667 * width, 0.5441 * height);
    builder.lineTo(width, 0.3666 * height);
    builder.close();
    builder.moveTo(0.1669 * width, 0.1828 * height);
    builder.lineTo(0.4986 * width, 0.3655 * height);
    builder.lineTo(0.8314 * width, 0.1833 * height);
    builder.lineTo(0.4986 * width, 0.0031 * height);
    builder.close();
    builder.stroke();
    x = this.getStyleValue(style, 'strokeColor', '#000000');
    builder.setFillColor(x as string);
    builder.begin();
    builder.moveTo(0.2634 * width, 0.1833 * height);
    builder.lineTo(0.5003 * width, 0.0535 * height);
    builder.lineTo(0.7394 * width, 0.1833 * height);
    builder.lineTo(0.5003 * width, 0.3136 * height);
    builder.close();
    builder.fill();
    x = this.getStyleValue(style, 'fillColor', '#000000');
    builder.restore();
    builder.setShadow(!1);
    builder.setStrokeWidth(3 * extra1);
    builder.setStrokeColor(x as string);
    builder.begin();
    builder.moveTo(0.3003 * width, 0.2108 * height);
    builder.lineTo(0.5642 * width, 0.068 * height);
    builder.moveTo(0.4429 * width, 0.0693 * height);
    builder.lineTo(0.7059 * width, 0.2121 * height);
    builder.moveTo(0.6667 * width, 0.2458 * height);
    builder.lineTo(0.3974 * width, 0.0992 * height);
    builder.moveTo(0.3499 * width, 0.1277 * height);
    builder.lineTo(0.6088 * width, 0.2698 * height);
    builder.moveTo(0.3009 * width, 0.1556 * height);
    builder.lineTo(0.5496 * width, 0.2913 * height);
    builder.stroke();
    builder.setStrokeWidth(2 * extra1);
    builder.setStrokeColor(extra2 as string);
    builder.setLineJoin('round');
    builder.begin();
    builder.moveTo(0, 0.8183 * height);
    builder.lineTo(0, 0.1848 * height);
    builder.lineTo(0.3366 * width, 0);
    builder.lineTo(0.6293 * width, 0.0021 * height);
    builder.lineTo(width, 0.1833 * height);
    builder.lineTo(width, 0.8183 * height);
    builder.lineTo(0.6694 * width, height);
    builder.lineTo(0.4986 * width, 0.9091 * height);
    builder.lineTo(0.3333 * width, height);
    builder.close();
    builder.stroke();
  }
}
