// @ts-nocheck
import type { RenderContext, ShapeAttrs } from '../../../renderer.ts';
import { BaseShapeHandler } from '../../shape-registry.ts';

export class IosIDialogBoxHandler extends BaseShapeHandler {
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
    let b = width;
    let c = height;
    let rSize;

    b = Math.max(b, 15);
    c = Math.max(c, 15);
    builder.translate(x, y);
    rSize = 7.5;
    this.renderBackground(builder, x, y, b, c, style, getStencilShape, renderStencilShape, rSize);
    builder.setShadow(!1);
    this.renderForeground(builder, x, y, b, c, style, getStencilShape, renderStencilShape, rSize);
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
    extra1?: any
  ): void {
    if (!builder) return;
    builder.setGradient('#497198', '#193168', 0, 0, width, height, 'south', 1, 1);
    builder.setAlpha(0.8);
    builder.setStrokeWidth(1);
    builder.roundrect(0, 0, width, height, extra1, extra1);
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
    extra1?: any
  ): void {
    if (!builder) return;
    x = decodeURIComponent(this.getStyleValue(style, 'buttonText', 'Main Text').toString()).split(
      ','
    );
    builder.setStrokeColor('#497198' as string);
    builder.setGradient('#497198', '#c5cee1', 0, 0, width, 22.5, 'south', 1, 1);
    builder.setAlpha(0.5);
    builder.begin();
    builder.moveTo(width - extra1, 0);
    builder.arcTo(extra1, extra1, 0, 0, 1, width, extra1);
    builder.lineTo(width, 17.5);
    builder.arcTo(1.67 * width, 2.5 * height, 0, 0, 1, 0, 17.5);
    builder.lineTo(0, extra1);
    builder.arcTo(extra1, extra1, 0, 0, 1, extra1, 0);
    builder.close();
    builder.fillAndStroke();
    builder.setAlpha(0.8);
    builder.setStrokeColor('#ffffff' as string);
    builder.setStrokeWidth(1);
    builder.roundrect(0, 0, width, height, extra1, extra1);
    builder.stroke();
    builder.setGradient('#497198', '#c5cee1', 5, height - 25, 0.5 * width - 10, 20, 'south', 1, 1);
    builder.roundrect(5, height - 25, 0.5 * width - 10, 20, 2.5, 2.5);
    builder.fillAndStroke();
    builder.roundrect(0.5 * width + 2.5, height - 25, 0.5 * width - 10, 20, 2.5, 2.5);
    builder.fillAndStroke();
    builder.setAlpha(0.9);
    builder.setFontSize(Number.parseFloat(String(9.5)) || 0);
    builder.setFontColor('#ffffff' as string);
    builder.text(0.5 * width, 0.15 * height, 0, 0, x[0], 'center', 'middle', 0, 0, 0);
    builder.setFontSize(Number.parseFloat(String(8)) || 0);
    builder.text(0.5 * width, 0.4 * height, 0, 0, x[3], 'center', 'middle', 0, 0, 0);
    builder.text(0.5 * width, 0.55 * height, 0, 0, x[4], 'center', 'middle', 0, 0, 0);
    builder.setFontSize(Number.parseFloat(String(8.5)) || 0);
    builder.text(0.25 * width, height - 15, 0, 0, x[1], 'center', 'middle', 0, 0, 0);
    builder.text(0.75 * width, height - 15, 0, 0, x[2], 'center', 'middle', 0, 0, 0);
  }
}
