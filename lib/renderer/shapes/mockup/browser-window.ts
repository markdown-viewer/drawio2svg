// @ts-nocheck
import type { RenderContext, ShapeAttrs } from '../../../renderer.ts';
import { BaseShapeHandler } from '../../shape-registry.ts';

export class MockupBrowserWindowHandler extends BaseShapeHandler {
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
    const g = this.getStyleValue(style, 'strokeColor', '#666666');
    const h = this.getStyleValue(style, 'strokeColor2', '#008cff');
    const k = this.getStyleValue(style, 'strokeColor3', '#c4c4c4');

    b = Math.max(b, 260);
    c = Math.max(c, 110);
    builder.translate(x, y);
    this.renderBackground(builder, x, y, b, c, style, getStencilShape, renderStencilShape, f, g);
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
    p7: any
  ): void {
    if (!builder) return;
    p1 = this.getStyleValue(this.renderCtx.style, 'strokeWidth', '1');
    p2 = this.getStyleValue(this.renderCtx.style, 'mainText', 'http://www.draw.io,Page 1')
      .toString()
      .split(',');
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
    builder.moveTo(0, 40);
    builder.lineTo(30, 40);
    builder.lineTo(30, 15);
    builder.arcTo(5, 5, 0, 0, 1, 35, 10);
    builder.lineTo(170, 10);
    builder.arcTo(5, 5, 0, 0, 1, 175, 15);
    builder.lineTo(175, 40);
    builder.lineTo(p3, 40);
    builder.stroke();
    builder.begin();
    builder.moveTo(0, 110);
    builder.lineTo(p3, 110);
    builder.stroke();
    builder.begin();
    builder.moveTo(100, 60);
    builder.arcTo(5, 5, 0, 0, 1, 105, 55);
    builder.lineTo(p3 - 15, 55);
    builder.arcTo(5, 5, 0, 0, 1, p3 - 10, 60);
    builder.lineTo(p3 - 10, 85);
    builder.arcTo(5, 5, 0, 0, 1, p3 - 15, 90);
    builder.lineTo(105, 90);
    builder.arcTo(5, 5, 0, 0, 1, 100, 85);
    builder.close();
    builder.stroke();
    p3 = this.getStyleValue(this.renderCtx.style, 'textColor', '#666666');
    builder.setFontColor(p3 as string);
    builder.setFontSize(Number.parseFloat(String(17)) || 0);
    builder.text(65, 25, 0, 0, p2[1], 'left', 'middle', 0, 0, 0);
    builder.text(130, 73, 0, 0, p2[0], 'left', 'middle', 0, 0, 0);
    builder.stroke();
    builder.translate(37, 17);
    builder.begin();
    builder.moveTo(0, 0);
    builder.lineTo(11, 0);
    builder.lineTo(15, 4);
    builder.lineTo(15, 18);
    builder.lineTo(0, 18);
    builder.close();
    builder.stroke();
    builder.setStrokeWidth(0.5 * p1);
    builder.begin();
    builder.moveTo(11, 0);
    builder.lineTo(11, 4);
    builder.lineTo(15, 5);
    builder.stroke();
    builder.setStrokeWidth(2 * p1);
    builder.translate(70, 47);
    builder.begin();
    builder.moveTo(0, 0);
    builder.lineTo(11, 0);
    builder.lineTo(15, 4);
    builder.lineTo(15, 18);
    builder.lineTo(0, 18);
    builder.close();
    builder.stroke();
    builder.setStrokeWidth(0.5 * p1);
    builder.begin();
    builder.moveTo(11, 0);
    builder.lineTo(11, 4);
    builder.lineTo(15, 5);
    builder.stroke();
    builder.setFillColor(p6 as string);
    builder.begin();
    builder.setStrokeWidth(2 * p1);
    builder.translate(-95, 0);
    builder.moveTo(0, 10);
    builder.lineTo(10, 0);
    builder.lineTo(10, 6);
    builder.lineTo(20, 6);
    builder.lineTo(20, 14);
    builder.lineTo(10, 14);
    builder.lineTo(10, 20);
    builder.close();
    builder.fillAndStroke();
    builder.begin();
    builder.translate(30, 0);
    builder.moveTo(20, 10);
    builder.lineTo(10, 0);
    builder.lineTo(10, 6);
    builder.lineTo(0, 6);
    builder.lineTo(0, 14);
    builder.lineTo(10, 14);
    builder.lineTo(10, 20);
    builder.close();
    builder.fillAndStroke();
    builder.begin();
    builder.translate(30, 0);
    builder.moveTo(20 * 0.78, 13.3);
    builder.arcTo(6, 6, 0, 1, 1, 13.5, 5.04);
    builder.lineTo(20 * 0.595, 6.5);
    builder.lineTo(19.8, 20 * 0.415);
    builder.lineTo(18, 0.8);
    builder.lineTo(20 * 0.815, 2.4);
    builder.arcTo(9.8, 9.8, 0, 1, 0, 20 * 0.92, 16);
    builder.close();
    builder.fillAndStroke();
  }
}
