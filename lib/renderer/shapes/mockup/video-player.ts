// @ts-nocheck
import type { RenderContext, ShapeAttrs } from '../../../renderer.ts';
import { BaseShapeHandler } from '../../shape-registry.ts';

export class MockupVideoPlayerHandler extends BaseShapeHandler {
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
    const f = this.getStyleValue(style, 'fillColor', '#ffffff');
    const g = this.getStyleValue(style, 'fillColor2', '#c4c4c4');
    const h = this.getStyleValue(style, 'strokeColor', '#666666');
    const k = this.getStyleValue(style, 'strokeColor2', '#008cff');
    const l = this.getStyleValue(style, 'strokeColor3', '#c4c4c4');
    const m = this.getStyleNumber(style, 'barHeight', 30);

    b = Math.max(b, 5 * m);
    c = Math.max(c, m + 10);
    builder.translate(x, y);
    this.renderBackground(builder, x, y, b, c, style, getStencilShape, renderStencilShape, f, h);
    builder.setShadow(!1);
    this.render_otherShapes(builder, x, y, b, c, g, h, k, l, m);
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
    builder.setFillColor(extra1 as string);
    builder.setStrokeColor(extra2 as string);
    builder.begin();
    builder.moveTo(0, 0);
    builder.lineTo(width, 0);
    builder.lineTo(width, height);
    builder.lineTo(0, height);
    builder.close();
    builder.fillAndStroke();
  }

  private render_otherShapes(
    builder: RenderContext['builder'],
    p1: any,
    p2: any,
    p3: any,
    p4: any,
    p5: any,
    p6: any,
    p7: any,
    p8: any,
    p9: any
  ): void {
    if (!builder) return;
    let m;
    m = this.getStyleNumber(this.renderCtx.style, 'barPos', 20);
    m = Math.max(0, m);
    m = Math.min(100, m);
    p1 = this.getStyleValue(this.renderCtx.style, 'strokeWidth', '1');
    p2 = p4 - p9;
    m = 8 + ((p3 - 8 - 8) * m) / 100;
    builder.setStrokeColor(p7 as string);
    builder.begin();
    builder.moveTo(0, p2);
    builder.lineTo(m, p2);
    builder.stroke();
    builder.setStrokeColor(p8 as string);
    builder.begin();
    builder.moveTo(m, p2);
    builder.lineTo(p3, p2);
    builder.stroke();
    builder.setStrokeColor(p6 as string);
    builder.begin();
    builder.ellipse(m - 8, p2 - 8, 16, 16);
    builder.fillAndStroke();
    builder.begin();
    builder.setStrokeWidth(p1 / 2);
    builder.ellipse(m - 4, p2 - 4, 8, 8);
    builder.fillAndStroke();
    builder.setStrokeWidth(p1);
    p6 = 0.3 * p9;
    p7 = p4 - 0.5 * (p9 + p6);
    p8 = 0.3 * p9;
    builder.setFillColor(p5 as string);
    builder.setStrokeColor(p5 as string);
    builder.begin();
    builder.moveTo(p8, p7);
    builder.lineTo(p8 + p6, p7 + 0.5 * p6);
    builder.lineTo(p8, p7 + p6);
    builder.close();
    builder.fillAndStroke();
    p5 = p4 - p9;
    builder.moveTo(p9 + 0.05 * p9, p5 + 0.4 * p9);
    builder.lineTo(p9 + 0.15 * p9, p5 + 0.4 * p9);
    builder.lineTo(p9 + 0.3 * p9, p5 + 0.25 * p9);
    builder.lineTo(p9 + 0.3 * p9, p5 + 0.75 * p9);
    builder.lineTo(p9 + 0.15 * p9, p5 + 0.6 * p9);
    builder.lineTo(p9 + 0.05 * p9, p5 + 0.6 * p9);
    builder.close();
    builder.fillAndStroke();
    builder.begin();
    builder.moveTo(p9 + 0.4 * p9, p5 + 0.35 * p9);
    builder.arcTo(0.2 * p9, 0.3 * p9, 0, 0, 1, p9 + 0.4 * p9, p5 + 0.65 * p9);
    builder.moveTo(p9 + 0.425 * p9, p5 + 0.25 * p9);
    builder.arcTo(0.225 * p9, 0.35 * p9, 0, 0, 1, p9 + 0.425 * p9, p5 + 0.75 * p9);
    builder.stroke();
    p3 -= 1.3 * p9;
    builder.begin();
    builder.moveTo(p3 + 0.1 * p9, p5 + 0.4 * p9);
    builder.lineTo(p3 + 0.1 * p9, p5 + 0.3 * p9);
    builder.lineTo(p3 + 0.25 * p9, p5 + 0.3 * p9);
    builder.moveTo(p3 + 0.1 * p9, p5 + 0.6 * p9);
    builder.lineTo(p3 + 0.1 * p9, p5 + 0.7 * p9);
    builder.lineTo(p3 + 0.25 * p9, p5 + 0.7 * p9);
    builder.moveTo(p3 + 0.9 * p9, p5 + 0.4 * p9);
    builder.lineTo(p3 + 0.9 * p9, p5 + 0.3 * p9);
    builder.lineTo(p3 + 0.75 * p9, p5 + 0.3 * p9);
    builder.moveTo(p3 + 0.9 * p9, p5 + 0.6 * p9);
    builder.lineTo(p3 + 0.9 * p9, p5 + 0.7 * p9);
    builder.lineTo(p3 + 0.75 * p9, p5 + 0.7 * p9);
    builder.stroke();
    p3 = this.getStyleValue(this.renderCtx.style, 'textColor', '#666666');
    builder.begin();
    builder.setFontSize(Number.parseFloat(String(0.5 * p9)) || 0);
    builder.setFontColor(p3 as string);
    builder.text(1.9 * p9, p4 - 0.45 * p9, 0, 0, '0:00/3:53', 'left', 'middle', 0, 0, 0);
  }
}
