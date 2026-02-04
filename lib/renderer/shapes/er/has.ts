// @ts-nocheck
import type { RenderContext, ShapeAttrs } from '../../../renderer.ts';
import { BaseShapeHandler } from '../../shape-registry.ts';

export class ErHasHandler extends BaseShapeHandler {
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
    const f = this.getStyleValue(style, 'buttonText', 'Entity');
    const g = this.getStyleValue(style, 'textColor', '#666666');
    const h = this.getStyleValue(style, 'fontSize', '17');

    builder.translate(x, y);
    b = Math.max(b, 20);
    c = Math.max(c, 20);
    this.renderBackground(builder, x, y, b, c, style, getStencilShape, renderStencilShape, 10, g);
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
    getStencilShape?: RenderContext['getStencilShape'],
    renderStencilShape?: RenderContext['renderStencilShape'],
    extra1?: any,
    extra2?: any
  ): void {
    if (!builder) return;
    x = this.getStyleValue(style, 'buttonStyle', 'rhombus').toString();
    if ('rhombus' === x) {
      builder.begin();
      builder.moveTo(0, 0.5 * height);
      builder.lineTo(0.5 * width, 0);
      builder.lineTo(width, 0.5 * height);
      builder.lineTo(0.5 * width, height);
      builder.close();
      builder.fillAndStroke();
    } else if ('dblFrame' === x) {
      x = this.getStyleValue(style, 'fillColor', '#666666');
      builder.setFillColor(x as string);
      builder.begin();
      builder.moveTo(0, 0.5 * height);
      builder.lineTo(0.5 * width, 0);
      builder.lineTo(width, 0.5 * height);
      builder.lineTo(0.5 * width, height);
      builder.close();
      builder.fillAndStroke();
      builder.begin();
      builder.moveTo(0.1 * width, 0.5 * height);
      builder.lineTo(0.5 * width, 0.1 * height);
      builder.lineTo(0.9 * width, 0.5 * height);
      builder.lineTo(0.5 * width, 0.9 * height);
      builder.close();
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
