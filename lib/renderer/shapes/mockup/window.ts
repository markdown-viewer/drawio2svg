// @ts-nocheck
import type { RenderContext, ShapeAttrs } from '../../../renderer.ts';
import { BaseShapeHandler } from '../../shape-registry.ts';

export class MockupWindowHandler extends BaseShapeHandler {
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
    const f = this.getStyleValue(style, 'fillColor', '#ffffff');
    const g = this.getStyleValue(style, 'strokeColor', '#666666');
    const h = this.getStyleValue(style, 'strokeColor2', '#008cff');
    const k = this.getStyleValue(style, 'strokeColor3', '#c4c4c4');

    builder.translate(x, y);
    c = Math.max(c, 30);
    b = Math.max(b, 90);
    this.renderBackground(builder, x, y, b, c, style, getStencilSvg, renderStencilShape, f, g);
    builder.setShadow(!1);
    this.render_otherShapes(builder, x, y, b, c, g, k, h);
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
    builder.setFillColor(extra1 as string);
    builder.setStrokeColor(extra2 as string);
    builder.rect(0, 0, width, height);
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
    p7: any
  ): void {
    if (!builder) return;
    this.getStyleValue(this.renderCtx.style, 'strokeWidth', '1');
    builder.setStrokeColor(p5 as string);
    builder.ellipse(p3 - 75, 5, 20, 20);
    builder.stroke();
    builder.ellipse(p3 - 50, 5, 20, 20);
    builder.stroke();
    builder.setStrokeColor(p7 as string);
    builder.ellipse(p3 - 25, 5, 20, 20);
    builder.stroke();
    builder.setStrokeColor(p6 as string);
    builder.begin();
    builder.moveTo(0, 30);
    builder.lineTo(p3, 30);
    builder.stroke();
    p1 = this.getStyleValue(this.renderCtx.style, 'mainText', 'Window Title');
    p2 = this.getStyleValue(this.renderCtx.style, 'textColor', '#666666');
    p3 = this.getStyleValue(this.renderCtx.style, 'textSize', '17').toString();
    builder.setFontColor(p2 as string);
    builder.setFontSize(Number.parseFloat(String(p3)) || 0);
    builder.text(10, 15, 0, 0, p1, 'left', 'middle', 0, 0, 0);
    builder.stroke();
  }
}
