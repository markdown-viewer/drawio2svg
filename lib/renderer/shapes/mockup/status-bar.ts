// @ts-nocheck
import type { RenderContext, ShapeAttrs } from '../../../renderer.ts';
import { BaseShapeHandler } from '../../shape-registry.ts';

export class MockupMiscStatusBarHandler extends BaseShapeHandler {
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
    let b = width;

    builder.translate(x, y);
    b = Math.max(b, 105);
    this.renderBackground(builder, 0, 0, b, height, style, getStencilSvg, renderStencilShape);
    builder.setShadow(!1);
    this.renderForeground(builder, 0, 0, b, height, style, getStencilSvg, renderStencilShape);
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
    builder.rect(0, 0.5 * height - 15, width, 30);
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
    let b;
    let c;
    let f;
    let g;
    let h;
    b = this.getStyleValue(style, 'fillColor2', '#ddeeff');
    c = this.getStyleValue(style, 'strokeColor2', '#008cff');
    f = this.getStyleValue(style, 'mainText', '').toString().split(',');
    g = this.getStyleValue(style, 'textColor', '#999999');
    h = this.getStyleValue(style, 'textSize', '17');
    builder.setFillColor(b as string);
    builder.roundrect(5, 0.5 * height - 10, 0.46 * (width - 75), 20, 5, 5);
    builder.fill();
    builder.roundrect(10 + 0.46 * (width - 75), 0.5 * height - 10, 0.23 * (width - 75), 20, 5, 5);
    builder.fill();
    builder.roundrect(15 + 0.69 * (width - 75), 0.5 * height - 10, 0.276 * (width - 75), 20, 5, 5);
    builder.fill();
    builder.setFontSize(Number.parseFloat(String(h)) || 0);
    builder.setFontColor(g as string);
    builder.text(10, 0.5 * height, 0, 0, f[0], 'left', 'middle', 0, 0, 0);
    builder.text(10 + 0.575 * (width - 75), 0.5 * height, 0, 0, f[1], 'center', 'middle', 0, 0, 0);
    builder.text(15 + 0.828 * (width - 75), 0.5 * height, 0, 0, f[2], 'center', 'middle', 0, 0, 0);
    builder.setStrokeColor(c as string);
    builder.ellipse(width - 25, 0.5 * height - 10, 20, 20);
    builder.stroke();
    builder.begin();
    builder.moveTo(width - 55, 0.5 * height + 10);
    builder.lineTo(width - 35, 0.5 * height + 10);
    builder.stroke();
  }
}
