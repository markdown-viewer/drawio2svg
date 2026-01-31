// @ts-nocheck
import type { RenderContext, ShapeAttrs } from '../../../renderer.ts';
import { BaseShapeHandler } from '../../shape-registry.ts';

export class ErAttributeHandler extends BaseShapeHandler {
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
    let c = height;
    const f = this.getStyleValue(style, 'buttonText', 'Entity');
    const g = this.getStyleValue(style, 'textColor', '#666666');
    const h = this.getStyleValue(style, 'fontSize', '17');

    builder.translate(x, y);
    b = Math.max(b, 20);
    c = Math.max(c, 20);
    this.renderBackground(builder, x, y, b, c, style, getStencilSvg, renderStencilShape, 10, g);
    builder.setShadow(!1);
    this.render_mainText(builder, x, y, b, c, f, h, g);
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
    extra1?: any,
    extra2?: any
  ): void {
    if (!builder) return;
    x = this.getStyleValue(style, 'buttonStyle', 'simple').toString();
    if ('simple' === x) {
      builder.begin();
      builder.ellipse(0, 0, width, height);
      builder.fillAndStroke();
    } else if ('dblFrame' === x) {
      x = this.getStyleValue(style, 'fillColor', '#666666');
      builder.setFillColor(x as string);
      builder.begin();
      builder.ellipse(0, 0, width, height);
      builder.fillAndStroke();
      extra1 = Math.min(width, height);
      builder.begin();
      builder.ellipse(0.1 * extra1, 0.1 * extra1, width - 0.2 * extra1, height - 0.2 * extra1);
      builder.stroke();
    }
  }

  private render_mainText(
    builder: RenderContext['builder'],
    p1: any,
    p2: any,
    p3: any,
    p4: any,
    p5: any,
    p6: any,
    p7: any
  ): void {
    if (!builder) return;
    builder.begin();
    builder.setFontSize(Number.parseFloat(String(p6)) || 0);
    builder.setFontColor(p7 as string);
    builder.text(0.5 * p3, 0.5 * p4, 0, 0, p5, 'center', 'middle', 0, 0, 0);
  }
}
