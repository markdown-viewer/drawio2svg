// @ts-nocheck
import type { RenderContext, ShapeAttrs } from '../../../renderer.ts';
import { BaseShapeHandler } from '../../shape-registry.ts';

export class IosICallButtonsHandler extends BaseShapeHandler {
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
    builder.setStrokeWidth(0.5);
    builder.setStrokeColor('#008cff' as string);
    builder.setGradient('#0F1B2B', '#4F5B6B', 0, 0, width, height, 'north', 1, 1);
    builder.rect(0, 0, width, height);
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
    builder.begin();
    builder.moveTo(0, 0.1667 * height);
    builder.lineTo(width, 0.1667 * height);
    builder.moveTo(0, 0.3333 * height);
    builder.lineTo(width, 0.3333 * height);
    builder.moveTo(0, 0.5 * height);
    builder.lineTo(width, 0.5 * height);
    builder.moveTo(0, 0.6667 * height);
    builder.lineTo(width, 0.6667 * height);
    builder.moveTo(0, 0.8333 * height);
    builder.lineTo(width, 0.8333 * height);
    builder.moveTo(0.3333 * width, 0.1667 * height);
    builder.lineTo(0.3333 * width, height);
    builder.moveTo(0.6667 * width, 0.1667 * height);
    builder.lineTo(0.6667 * width, height);
    builder.stroke();
    builder.setFontSize(Number.parseFloat(String(15.5)) || 0);
    builder.setFontColor('#ffffff' as string);
    builder.setFontStyle(1);
    builder.text(0.5 * width, 0.0834 * height, 0, 0, '(123) 456-7890', 'center', 'middle', 0, 0, 0);
    builder.text(0.1667 * width, 0.22 * height, 0, 0, '1', 'center', 'middle', 0, 0, 0);
    builder.text(0.5 * width, 0.22 * height, 0, 0, '2', 'center', 'middle', 0, 0, 0);
    builder.text(0.8333 * width, 0.22 * height, 0, 0, '3', 'center', 'middle', 0, 0, 0);
    builder.text(0.1667 * width, 0.3867 * height, 0, 0, '3', 'center', 'middle', 0, 0, 0);
    builder.text(0.5 * width, 0.3867 * height, 0, 0, '4', 'center', 'middle', 0, 0, 0);
    builder.text(0.8333 * width, 0.3867 * height, 0, 0, '5', 'center', 'middle', 0, 0, 0);
    builder.text(0.1667 * width, 0.5534 * height, 0, 0, '6', 'center', 'middle', 0, 0, 0);
    builder.text(0.5 * width, 0.5534 * height, 0, 0, '7', 'center', 'middle', 0, 0, 0);
    builder.text(0.8333 * width, 0.5534 * height, 0, 0, '8', 'center', 'middle', 0, 0, 0);
    builder.setFontSize(Number.parseFloat(String(27.5)) || 0);
    builder.text(0.1667 * width, 0.76 * height, 0, 0, '*', 'center', 'middle', 0, 0, 0);
    builder.setFontSize(Number.parseFloat(String(15.5)) || 0);
    builder.text(0.5 * width, 0.72 * height, 0, 0, '0', 'center', 'middle', 0, 0, 0);
    builder.text(0.8333 * width, 0.75 * height, 0, 0, '#', 'center', 'middle', 0, 0, 0);
    builder.setGradient(
      '#E2FFEB',
      '#008215',
      0.3333 * width,
      0.8333 * height,
      0.3333 * width,
      0.1667 * height,
      'south',
      1,
      1
    );
    builder.rect(0.3333 * width, 0.8333 * height, 0.3333 * width, 0.1667 * height);
    builder.fillAndStroke();
    builder.text(0.5 * width, 0.9168 * height, 0, 0, 'Call', 'center', 'middle', 0, 0, 0);
    builder.setFontStyle(0);
    builder.setFontSize(Number.parseFloat(String(8)) || 0);
    builder.setFontColor('#bbbbbb' as string);
    builder.text(0.5 * width, 0.28 * height, 0, 0, 'ABC', 'center', 'middle', 0, 0, 0);
    builder.text(0.8333 * width, 0.28 * height, 0, 0, 'DEF', 'center', 'middle', 0, 0, 0);
    builder.text(0.1667 * width, 0.4467 * height, 0, 0, 'GHI', 'center', 'middle', 0, 0, 0);
    builder.text(0.5 * width, 0.4467 * height, 0, 0, 'JKL', 'center', 'middle', 0, 0, 0);
    builder.text(0.8333 * width, 0.4467 * height, 0, 0, 'MNO', 'center', 'middle', 0, 0, 0);
    builder.text(0.1667 * width, 0.6134 * height, 0, 0, 'PQRS', 'center', 'middle', 0, 0, 0);
    builder.text(0.5 * width, 0.6134 * height, 0, 0, 'TUV', 'center', 'middle', 0, 0, 0);
    builder.text(0.8333 * width, 0.6134 * height, 0, 0, 'WXYZ', 'center', 'middle', 0, 0, 0);
    builder.text(0.5 * width, 0.78 * height, 0, 0, '+', 'center', 'middle', 0, 0, 0);
    builder.setFillColor('#ffffff' as string);
    builder.begin();
    builder.moveTo(0.1028 * width, 0.9464 * height);
    builder.arcTo(0.0862 * width, 0.0652 * height, 0, 0, 1, 0.1402 * width, 0.9333 * height);
    builder.arcTo(0.0144 * width, 0.0109 * height, 0, 0, 0, 0.1517 * width, 0.9246 * height);
    builder.lineTo(0.1524 * width, 0.9181 * height);
    builder.arcTo(0.023 * width, 0.0326 * height, 0, 0, 1, 0.143 * width, 0.8877 * height);
    builder.arcTo(0.0247 * width, 0.0187 * height, 0, 0, 1, 0.1919 * width, 0.8877 * height);
    builder.arcTo(0.023 * width, 0.0326 * height, 0, 0, 1, 0.1847 * width, 0.9181 * height);
    builder.arcTo(0.0431 * width, 0.0174 * height, 0, 0, 0, 0.1919 * width, 0.9311 * height);
    builder.arcTo(0.1437 * width, 0.1087 * height, 0, 0, 1, 0.2307 * width, 0.9453 * height);
    builder.lineTo(0.2307 * width, 0.9616 * height);
    builder.lineTo(0.1028 * width, 0.9616 * height);
    builder.close();
    builder.fill();
    builder.setStrokeColor('#ffffff' as string);
    builder.setStrokeWidth(2.5);
    builder.setLineJoin('round');
    builder.begin();
    builder.moveTo(0.79 * width, 0.89 * height);
    builder.lineTo(0.9 * width, 0.89 * height);
    builder.lineTo(0.9 * width, 0.95 * height);
    builder.lineTo(0.79 * width, 0.95 * height);
    builder.lineTo(0.76 * width, 0.92 * height);
    builder.close();
    builder.fillAndStroke();
    builder.setStrokeColor('#0F1B2B' as string);
    builder.begin();
    builder.moveTo(0.82 * width, 0.907 * height);
    builder.lineTo(0.85 * width, 0.933 * height);
    builder.moveTo(0.82 * width, 0.933 * height);
    builder.lineTo(0.85 * width, 0.907 * height);
    builder.stroke();
  }
}
