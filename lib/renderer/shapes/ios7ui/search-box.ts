// @ts-nocheck
import type { RenderContext, ShapeAttrs } from '../../../renderer.ts';
import { BaseShapeHandler } from '../../shape-registry.ts';

export class Ios7uiSearchBoxHandler extends BaseShapeHandler {
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
    this.renderBackground(builder, 0, 0, width, height, style, getStencilSvg, renderStencilShape);
    builder.setShadow(!1);
    this.renderForeground(builder, 0, 0, width, height, style, getStencilSvg, renderStencilShape);
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
    builder.rect(0, 0, width, height);
    builder.fill();
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
    let b;
    let c;
    let f;
    let g;
    b = this.getStyleValue(style, 'buttonText', 'Search');
    c = this.getStyleValue(style, 'textColor', '#666666');
    f = this.getStyleValue(style, 'strokeColor2', '#008cff');
    this.getStyleValue(style, 'textSize', '17');
    g = 0.1 * Math.min(width, height);
    builder.setFillColor('#ffffff' as string);
    builder.roundrect(0.05 * width, 0.15 * height, 0.5 * width, 0.7 * height, g, g);
    builder.fillAndStroke();
    builder.setFontColor(c as string);
    builder.setFontSize(Number.parseFloat(String(Math.min(0.7 * height, 0.1 * width))) || 0);
    builder.text(5, 0.5 * height, 0, 0, b, 'left', 'middle', 0, 0, 0);
    builder.setStrokeColor(f as string);
    builder.ellipse(0.05 * width + 3, 0.5 * height - 3, 4, 4);
    builder.stroke();
    builder.begin();
    builder.moveTo(0.05 * width + 8, 0.5 * height + 3.5);
    builder.lineTo(0.05 * width + 6, 0.5 * height + 0.5);
    builder.stroke();
  }
}
