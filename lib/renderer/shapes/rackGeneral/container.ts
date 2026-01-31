// @ts-nocheck
import type { RenderContext, ShapeAttrs } from '../../../renderer.ts';
import { BaseShapeHandler } from '../../shape-registry.ts';

export class RackGeneralContainerHandler extends BaseShapeHandler {
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

    let f;
    let g;
    let h;
    f = this.getStyleValue(style, 'numDisp', 'ascend');
    g = this.getStyleValue(style, 'fillColor', '#ffffff');
    h = this.getStyleValue(style, 'fillColor2', '#f4f4f4');
    if (f !== 'off') {
      builder.translate(x + 24, y);
      b = Math.max(b - 24, 0);
    } else {
      builder.translate(x, y);
    }
    builder.setFillColor(g as string);
    this.renderBackground(builder, 0, 0, b, height, style, getStencilSvg, renderStencilShape, 12);
    builder.setShadow(!1);
    builder.setFillColor(h as string);
    this.renderForeground(builder, 0, 0, b, height, style, getStencilSvg, renderStencilShape, 12);
    if (f !== 'off' && 42 < b) {
      this.render_sideText(builder, b, height, 12);
    }
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
    renderStencilShape?: RenderContext['renderStencilShape'],
    extra1?: any
  ): void {
    if (!builder) return;
    if (width > 18 + 2 * extra1 && 42 < height) {
      builder.rect(0, 0, width, 21);
      builder.fillAndStroke();
      builder.rect(0, height - 21, width, 21);
      builder.fillAndStroke();
      builder.rect(0, 21, 9, height - 42);
      builder.fillAndStroke();
      builder.rect(width - 9, 21, 9, height - 42);
      builder.fillAndStroke();
      builder.ellipse(2.5, 7.5, 6, 6);
      builder.stroke();
      builder.ellipse(width - 8.5, 7.5, 6, 6);
      builder.stroke();
      builder.ellipse(2.5, height - 13.5, 6, 6);
      builder.stroke();
      builder.ellipse(width - 8.5, height - 13.5, 6, 6);
      builder.stroke();
    }
  }

  private render_sideText(builder: RenderContext['builder'], p1: any, p2: any, p3: any): void {
    if (!builder) return;
    let c;
    let f;
    c = this.getStyleValue(this.renderCtx.style, 'textColor', '#666666');
    p1 = this.getStyleValue(this.renderCtx.style, 'numDisp', 'ascend');
    f = this.getStyleNumber(this.renderCtx.style, 'rackUnitSize', 20);
    builder.setFontSize(Number.parseFloat(String(p3)) || 0);
    builder.setFontColor(c as string);
    p2 = Math.floor((Math.abs(p2) - 42) / f);
    for (c = 0; c < p2; c++) {
      builder.text(
        -p3,
        21 + 0.5 * f + c * f,
        0,
        0,
        p1 === 'descend' ? (c + 1).toString() : (p2 - c).toString(),
        'center',
        'middle',
        0,
        0,
        0
      );
    }
    builder.begin();
    for (c = 0; c < p2 + 1; c++) {
      (builder.moveTo(-2 * p3, 21 + c * f), builder.lineTo(0, 21 + c * f));
    }
    builder.stroke();
  }
}
