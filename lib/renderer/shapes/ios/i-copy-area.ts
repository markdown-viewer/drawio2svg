// @ts-nocheck
import type { RenderContext, ShapeAttrs } from '../../../renderer.ts';
import { BaseShapeHandler } from '../../shape-registry.ts';

export class IosICopyAreaHandler extends BaseShapeHandler {
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
    this.renderBackground(
      builder,
      0,
      0,
      width,
      height,
      style,
      getStencilSvg,
      renderStencilShape,
      5
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
      5
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
    extra1?: any
  ): void {
    if (!builder) return;
    builder.begin();
    builder.moveTo(0.5 * width - 20, 0 + extra1);
    builder.arcTo(extra1, extra1, 0, 0, 1, 0.5 * width - 20 + extra1, 0);
    builder.lineTo(0.5 * width + 20 - extra1, 0);
    builder.arcTo(extra1, extra1, 0, 0, 1, 0.5 * width + 20, extra1);
    builder.lineTo(0.5 * width + 20, 20 - extra1);
    builder.arcTo(extra1, extra1, 0, 0, 1, 0.5 * width + 20 - extra1, 20);
    builder.lineTo(0.5 * width + 7.5, 20);
    builder.lineTo(0.5 * width, 27.5);
    builder.lineTo(0.5 * width - 7.5, 20);
    builder.lineTo(0.5 * width - 20 + extra1, 20);
    builder.arcTo(extra1, extra1, 0, 0, 1, 0.5 * width - 20, 20 - extra1);
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
    extra1?: any
  ): void {
    if (!builder) return;
    let c;
    builder.setAlpha(0.3);
    builder.setFillColor('#2266ff' as string);
    builder.rect(2.5, 27.5, width - 5, height - 30);
    builder.fill();
    builder.setAlpha(1);
    if (27.5 < height) {
      builder.setStrokeColor('#ffffff' as string);
      builder.setGradient('#88ddff', '#2266ff', 0.5 * width - 2.5, 25, 5, 5, 'south', 1, 1);
      builder.ellipse(0.5 * width - 2.5, 25, 5, 5);
      builder.fillAndStroke();
      builder.setGradient('#88ddff', '#2266ff', 0.5 * width - 2.5, height - 5, 5, 5, 'south', 1, 1);
      builder.ellipse(0.5 * width - 2.5, height - 5, 5, 5);
      builder.fillAndStroke();
      builder.setGradient('#88ddff', '#2266ff', 0, 0.5 * height + 10, 5, 5, 'south', 1, 1);
      builder.ellipse(0, 0.5 * height + 10, 5, 5);
      builder.fillAndStroke();
      builder.setGradient('#88ddff', '#2266ff', width - 5, 0.5 * height + 10, 5, 5, 'south', 1, 1);
      builder.ellipse(width - 5, 0.5 * height + 10, 5, 5);
      builder.fillAndStroke();
    }
    height = this.getStyleValue(style, 'fillColor2', '#00ff00');
    c = this.getStyleValue(style, 'strokeColor', '#00ff00');
    builder.setFillColor(height as string);
    builder.setStrokeColor(c as string);
    builder.begin();
    builder.moveTo(0.5 * width - 20, 0 + extra1);
    builder.arcTo(extra1, extra1, 0, 0, 1, 0.5 * width - 20 + extra1, 0);
    builder.lineTo(0.5 * width + 20 - extra1, 0);
    builder.arcTo(extra1, extra1, 0, 0, 1, 0.5 * width + 20, extra1);
    builder.lineTo(0.5 * width + 20, 20 - extra1);
    builder.arcTo(extra1, extra1, 0, 0, 1, 0.5 * width + 20 - extra1, 20);
    builder.lineTo(0.5 * width + 7.5, 20);
    builder.lineTo(0.5 * width, 27.5);
    builder.lineTo(0.5 * width - 7.5, 20);
    builder.lineTo(0.5 * width - 20 + extra1, 20);
    builder.arcTo(extra1, extra1, 0, 0, 1, 0.5 * width - 20, 20 - extra1);
    builder.close();
    builder.fillAndStroke();
    height = this.getStyleValue(style, 'fillColor3', '#00ff00');
    builder.setGradient(height, height, 0.5 * width - 20, 0, 40, 10, 'south', 0.8, 0.1);
    builder.begin();
    builder.moveTo(0.5 * width - 20, extra1);
    builder.arcTo(extra1, extra1, 0, 0, 1, 0.5 * width - 20 + extra1, 0);
    builder.lineTo(0.5 * width + 20 - extra1, 0);
    builder.arcTo(extra1, extra1, 0, 0, 1, 0.5 * width + 20, extra1);
    builder.lineTo(0.5 * width + 20, 10);
    builder.lineTo(0.5 * width - 20, 10);
    builder.close();
    builder.fill();
    extra1 = decodeURIComponent(this.getStyleValue(style, 'buttonText', ''));
    height = this.getStyleValue(style, 'textColor', '#00ff00');
    builder.setFontColor(height as string);
    builder.setFontSize(Number.parseFloat(String(8.5)) || 0);
    builder.text(0.5 * width, 8.75, 0, 0, extra1, 'center', 'middle', 0, 0, 0);
  }
}
