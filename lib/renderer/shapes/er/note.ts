// @ts-nocheck
import type { RenderContext, ShapeAttrs } from '../../../renderer.ts';
import { BaseShapeHandler } from '../../shape-registry.ts';

export class ErNoteHandler extends BaseShapeHandler {
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

    let f;
    let g;
    let h;
    let k;
    f = this.getStyleValue(style, 'buttonText', 'Entity');
    g = this.getStyleValue(style, 'textColor', '#666666');
    h = this.getStyleValue(style, 'fontSize', '17');
    k = this.getStyleValue(style, 'fillColor2', '#ffffff');
    builder.translate(x, y);
    b = Math.max(b, 40);
    c = Math.max(c, 40);
    this.renderBackground(builder, x, y, b, c, style, getStencilSvg, renderStencilShape, 20);
    builder.setShadow(!1);
    this.render_flipShape(builder, x, y, b, c, 20, k);
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
    extra1?: any
  ): void {
    if (!builder) return;
    builder.begin();
    builder.moveTo(0, 0);
    builder.lineTo(width - extra1, 0);
    builder.lineTo(width, extra1);
    builder.lineTo(width, height);
    builder.lineTo(0, height);
    builder.close();
    builder.fillAndStroke();
  }

  private render_flipShape(
    builder: RenderContext['builder'],
    p1: any,
    p2: any,
    p3: any,
    p4: any,
    p5: any,
    p6: any
  ): void {
    if (!builder) return;
    builder.setLineJoin('round');
    builder.setFillColor(p6 as string);
    builder.begin();
    builder.moveTo(p3 - p5, 0);
    builder.lineTo(p3, p5);
    builder.lineTo(p3 - p5, p5);
    builder.close();
    builder.fillAndStroke();
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
