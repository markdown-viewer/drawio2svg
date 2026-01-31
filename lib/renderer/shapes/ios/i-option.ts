// @ts-nocheck
import type { RenderContext, ShapeAttrs } from '../../../renderer.ts';
import { BaseShapeHandler } from '../../shape-registry.ts';

export class IosIOptionHandler extends BaseShapeHandler {
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

    builder.translate(x, y);
    this.renderBackground(builder, x, y, width, height, style, getStencilSvg, renderStencilShape);
    builder.setShadow(!1);
    this.renderForeground(builder, x, y, width, height, style, getStencilSvg, renderStencilShape);
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
    renderStencilShape?: RenderContext['renderStencilShape']
  ): void {
    if (!builder) return;
    y = this.getStyleNumber(style, 'barPos', 80);
    y = Math.min(y, 100);
    y = Math.max(y, 0);
    x = this.getStyleValue(style, 'pointerPos', 'bottom');
    y = 10 + ((width - 20) * y) / 100;
    builder.setStrokeWidth(0.5);
    builder.setStrokeColor('#000000' as string);
    builder.setAlpha(0.9);
    builder.begin();
    if (x === 'bottom') {
      builder.setGradient('#000000', '#888888', 0, 0, width, height, 'north', 1, 1);
      builder.moveTo(0, 2.5);
      builder.arcTo(2.5, 2.5, 0, 0, 1, 2.5, 0);
      builder.lineTo(width - 2.5, 0);
      builder.arcTo(2.5, 2.5, 0, 0, 1, width, 2.5);
      builder.lineTo(width, height - 2.5 - 7.5);
      builder.arcTo(2.5, 2.5, 0, 0, 1, width - 2.5, height - 7.5);
      builder.lineTo(y + 7.5, height - 7.5);
      builder.lineTo(y, height);
      builder.lineTo(y - 7.5, height - 7.5);
      builder.lineTo(2.5, height - 7.5);
      builder.arcTo(2.5, 2.5, 0, 0, 1, 0, height - 2.5 - 7.5);
    } else if (x === 'top') {
      builder.setGradient('#000000', '#888888', 0, 0, width, height, 'north', 1, 1);
      builder.moveTo(0, 10);
      builder.arcTo(2.5, 2.5, 0, 0, 1, 2.5, 7.5);
      builder.lineTo(y - 7.5, 7.5);
      builder.lineTo(y, 0);
      builder.lineTo(y + 7.5, 7.5);
      builder.lineTo(width - 2.5, 7.5);
      builder.arcTo(2.5, 2.5, 0, 0, 1, width, 10);
      builder.lineTo(width, height - 2.5);
      builder.arcTo(2.5, 2.5, 0, 0, 1, width - 2.5, height);
      builder.lineTo(2.5, height);
      builder.arcTo(2.5, 2.5, 0, 0, 1, 0, height - 2.5);
    }
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
    renderStencilShape?: RenderContext['renderStencilShape']
  ): void {
    if (!builder) return;
    x = decodeURIComponent(this.getStyleValue(style, 'buttonText', 'Some Location'));
    y = this.getStyleValue(style, 'pointerPos', 'bottom');
    builder.setAlpha(1);
    builder.setFontColor('#ffffff' as string);
    builder.setFontSize(Number.parseFloat(String(9.5)) || 0);
    if (y === 'bottom') {
      builder.text(0.5 * width, 0.5 * (height - 7.5), 0, 0, x, 'center', 'middle', 0, 0, 0);
    } else {
      builder.text(0.5 * width, 0.5 * (height + 7.5), 0, 0, x, 'center', 'middle', 0, 0, 0);
    }
  }
}
