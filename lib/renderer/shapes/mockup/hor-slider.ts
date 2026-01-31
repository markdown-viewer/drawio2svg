// @ts-nocheck
import type { RenderContext, ShapeAttrs } from '../../../renderer.ts';
import { BaseShapeHandler } from '../../shape-registry.ts';

export class MockupFormsHorSliderHandler extends BaseShapeHandler {
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

    const f = this.getStyleValue(style, 'sliderStyle', 'basic');

    builder.translate(x, y);
    this.renderBackground(builder, width, height, 5, f, style, getStencilSvg, renderStencilShape);
    builder.setShadow(!1);
    this.renderForeground(builder, width, height, 5, f, style, getStencilSvg, renderStencilShape);
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
    if (height === 'basic') {
      builder.begin();
      builder.moveTo(0, 0.5 * y);
      builder.lineTo(x, 0.5 * y);
      builder.stroke();
    } else if (height === 'fancy') {
      builder.roundrect(0, 0.5 * y - width, x, 2 * width, width, width);
      builder.fillAndStroke();
    }
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
    let f;
    let g;
    let h;
    let k;
    let l;
    f = this.getStyleNumber(style, 'sliderPos', 20);
    g = this.getStyleValue(style, 'handleStyle', 'circle');
    h = this.getStyleValue(style, 'fillColor', '#ffffff');
    k = this.getStyleValue(style, 'fillColor2', '#ddeeff');
    l = this.getStyleValue(style, 'strokeColor', '#999999');
    f = Math.min(100, f);
    f = Math.max(0, f);
    if (height === 'basic') {
      builder.setStrokeColor(k as string);
      height = (x * f) / 100;
      builder.begin();
      builder.moveTo(0, 0.5 * y);
      builder.lineTo(height, 0.5 * y);
      builder.stroke();
      builder.setStrokeColor(l as string);
    } else if (height === 'fancy') {
      height = 10 + ((x - 10) * f) / 100;
      builder.setFillColor(k as string);
      builder.roundrect(0, 0.5 * y - width, height, 2 * width, width, width);
      builder.fillAndStroke();
      builder.setFillColor(h as string);
    }
    x = 5 + ((x - 10) * f) / 100;
    if (g === 'circle') {
      builder.ellipse(x - 10, 0.5 * y - 10, 20, 20);
      builder.fillAndStroke();
    } else if (g === 'triangle') {
      builder.begin();
      builder.moveTo(x - 10, 0.5 * y + 10);
      builder.lineTo(x, 0.5 * y - 10);
      builder.lineTo(x + 10, 0.5 * y + 10);
      builder.close();
      builder.fillAndStroke();
    } else if (g === 'handle') {
      builder.begin();
      builder.moveTo(x - 7, 0.5 * y + 10);
      builder.lineTo(x - 7, 0.5 * y);
      builder.lineTo(x, 0.5 * y - 10);
      builder.lineTo(x + 7, 0.5 * y);
      builder.lineTo(x + 7, 0.5 * y + 10);
      builder.close();
      builder.fillAndStroke();
    }
  }
}
