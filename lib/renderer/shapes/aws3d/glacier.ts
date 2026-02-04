// @ts-nocheck
import type { RenderContext, ShapeAttrs } from '../../../renderer.ts';
import { BaseShapeHandler } from '../../shape-registry.ts';

export class Aws3dGlacierHandler extends BaseShapeHandler {
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
    d = (f * width) / 180;
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
    builder.setStrokeWidth(2 * extra1);
    builder.setStrokeColor(extra2 as string);
    builder.setLineJoin('round');
    builder.begin();
    builder.moveTo(0, 0.8177 * height);
    builder.lineTo(0, 0.5448 * height);
    builder.lineTo(0.168 * width, 0.1792 * height);
    builder.lineTo(0.5008 * width, 0);
    builder.lineTo(0.8309 * width, 0.1812 * height);
    builder.lineTo(width, 0.5469 * height);
    builder.lineTo(width, 0.8188 * height);
    builder.lineTo(0.6661 * width, height);
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
    builder.moveTo(0.1658 * width, 0.1802 * height);
    builder.lineTo(0.5008 * width, 0.3651 * height);
    builder.lineTo(0.6661 * width, 0.9089 * height);
    builder.lineTo(0.6661 * width, height);
    builder.lineTo(0.3339 * width, height);
    builder.lineTo(0, 0.8177 * height);
    builder.lineTo(0, 0.5427 * height);
    builder.close();
    builder.fill();
    if ('0' == y) {
      builder.setAlpha(x[1]);
    } else {
      builder.setAlpha(x[0]);
    }
    builder.begin();
    builder.moveTo(0.5008 * width, 0.362 * height);
    builder.lineTo(0.8314 * width, 0.1823 * height);
    builder.lineTo(width, 0.5469 * height);
    builder.lineTo(width, 0.8177 * height);
    builder.lineTo(0.6661 * width, height);
    builder.lineTo(0.6661 * width, 0.9089 * height);
    builder.close();
    builder.fill();
    builder.restore();
    builder.setShadow(!1);
    builder.setLineJoin('round');
    builder.begin();
    builder.moveTo(0.1658 * width, 0.1802 * height);
    builder.lineTo(0.5008 * width, 0.3651 * height);
    builder.lineTo(0.6661 * width, 0.9089 * height);
    builder.lineTo(0.6661 * width, height);
    builder.lineTo(0.3339 * width, height);
    builder.lineTo(0, 0.8177 * height);
    builder.lineTo(0, 0.5427 * height);
    builder.close();
    builder.moveTo(0.5008 * width, 0.362 * height);
    builder.lineTo(0.8314 * width, 0.1823 * height);
    builder.lineTo(width, 0.5469 * height);
    builder.lineTo(width, 0.8177 * height);
    builder.lineTo(0.6661 * width, height);
    builder.lineTo(0.6661 * width, 0.9089 * height);
    builder.close();
    builder.moveTo(0.1675 * width, 0.1797 * height);
    builder.lineTo(0, 0.7281 * height);
    builder.lineTo(0.3284 * width, 0.9089 * height);
    builder.lineTo(0.6661 * width, 0.9089 * height);
    builder.lineTo(width, 0.7266 * height);
    builder.lineTo(0.8309 * width, 0.1823 * height);
    builder.moveTo(0.5003 * width, 0.362 * height);
    builder.lineTo(0.3311 * width, 0.9089 * height);
    builder.lineTo(0.3311 * width, height);
    builder.stroke();
    builder.setStrokeWidth(2 * extra1);
    builder.setStrokeColor(extra2 as string);
    builder.begin();
    builder.moveTo(0, 0.8177 * height);
    builder.lineTo(0, 0.5448 * height);
    builder.lineTo(0.168 * width, 0.1792 * height);
    builder.lineTo(0.5008 * width, 0);
    builder.lineTo(0.8309 * width, 0.1812 * height);
    builder.lineTo(width, 0.5469 * height);
    builder.lineTo(width, 0.8188 * height);
    builder.lineTo(0.6661 * width, height);
    builder.lineTo(0.3333 * width, height);
    builder.close();
    builder.stroke();
  }
}
