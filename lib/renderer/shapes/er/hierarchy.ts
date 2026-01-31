// @ts-nocheck
import type { RenderContext, ShapeAttrs } from '../../../renderer.ts';
import { BaseShapeHandler } from '../../shape-registry.ts';

export class ErHierarchyHandler extends BaseShapeHandler {
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
    const f = this.getStyleValue(style, 'buttonText', 'main').toString().split(',');
    const g = this.getStyleValue(style, 'subText', 'sub').toString().split(',');
    const h = this.getStyleValue(style, 'textColor', '#666666');
    const k = this.getStyleValue(style, 'fontSize', '17');

    builder.translate(x, y);
    b = Math.max(b, 20);
    c = Math.max(c, 20);
    this.renderBackground(builder, x, y, b, c, style, getStencilSvg, renderStencilShape, 10, h);
    builder.setShadow(!1);
    this.render_shapeText(builder, x, y, b, c, f, g, k, h);
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
    x = this.getStyleValue(style, 'buttonStyle', 'round').toString();
    if ('round' === x) {
      builder.begin();
      builder.moveTo(0, extra1);
      builder.arcTo(extra1, extra1, 0, 0, 1, extra1, 0);
      builder.lineTo(width - extra1, 0);
      builder.arcTo(extra1, extra1, 0, 0, 1, width, extra1);
      builder.lineTo(width, height - extra1);
      builder.arcTo(extra1, extra1, 0, 0, 1, width - extra1, height);
      builder.lineTo(extra1, height);
      builder.arcTo(extra1, extra1, 0, 0, 1, 0, height - extra1);
      builder.close();
      builder.fillAndStroke();
    } else if ('rect' === x) {
      builder.begin();
      builder.moveTo(0, 0);
      builder.lineTo(width, 0);
      builder.lineTo(width, height);
      builder.lineTo(0, height);
      builder.close();
      builder.fillAndStroke();
    } else if ('dblFrame' === x) {
      extra1 = this.getStyleValue(style, 'fillColor', '#666666');
      builder.setFillColor(extra1 as string);
      builder.begin();
      builder.moveTo(0, 0);
      builder.lineTo(width, 0);
      builder.lineTo(width, height);
      builder.lineTo(0, height);
      builder.close();
      builder.fillAndStroke();
      extra1 = Math.min(width, height);
      builder.begin();
      builder.moveTo(0.1 * extra1, 0.1 * extra1);
      builder.lineTo(width - 0.1 * extra1, 0.1 * extra1);
      builder.lineTo(width - 0.1 * extra1, height - 0.1 * extra1);
      builder.lineTo(0.1 * extra1, height - 0.1 * extra1);
      builder.close();
      builder.stroke();
    }
    extra2 = y = 0;
    if ('round' === x) {
      y = 0.5 * width;
      extra2 = extra1;
      builder.translate(y, extra2);
      width = 0.5 * width - extra1;
      height -= 2 * extra1;
      builder.begin();
      builder.moveTo(0, extra1);
      builder.arcTo(extra1, extra1, 0, 0, 1, extra1, 0);
      builder.lineTo(width - extra1, 0);
      builder.arcTo(extra1, extra1, 0, 0, 1, width, extra1);
      builder.lineTo(width, height - extra1);
      builder.arcTo(extra1, extra1, 0, 0, 1, width - extra1, height);
      builder.lineTo(extra1, height);
      builder.arcTo(extra1, extra1, 0, 0, 1, 0, height - extra1);
      builder.close();
      builder.fillAndStroke();
    } else if ('rect' === x) {
      y = 0.5 * width;
      extra2 = extra1;
      builder.translate(y, extra2);
      width = 0.5 * width - extra1;
      height -= 2 * extra1;
      builder.begin();
      builder.moveTo(0, 0);
      builder.lineTo(width, 0);
      builder.lineTo(width, height);
      builder.lineTo(0, height);
      builder.close();
      builder.fillAndStroke();
    } else if ('dblFrame' === x) {
      y = 0.5 * width;
      extra2 = 0.15 * extra1;
      builder.translate(y, extra2);
      width = 0.5 * width - 0.15 * extra1;
      height -= 0.3 * extra1;
      extra1 = this.getStyleValue(style, 'fillColor', '#666666');
      builder.setFillColor(extra1 as string);
      builder.begin();
      builder.moveTo(0, 0);
      builder.lineTo(width, 0);
      builder.lineTo(width, height);
      builder.lineTo(0, height);
      builder.close();
      builder.fillAndStroke();
      extra1 = Math.min(width, height);
      builder.begin();
      builder.moveTo(0.1 * extra1, 0.1 * extra1);
      builder.lineTo(width - 0.1 * extra1, 0.1 * extra1);
      builder.lineTo(width - 0.1 * extra1, height - 0.1 * extra1);
      builder.lineTo(0.1 * extra1, height - 0.1 * extra1);
      builder.close();
      builder.stroke();
    }
    builder.translate(-y, -extra2);
  }

  private render_shapeText(
    builder: RenderContext['builder'],
    p1: any,
    p2: any,
    p3: any,
    p4: any,
    p5: any,
    p6: any,
    p7: any,
    p8: any
  ): void {
    if (!builder) return;
    builder.begin();
    builder.setFontSize(Number.parseFloat(String(p7)) || 0);
    builder.setFontColor(p8 as string);
    builder.text(0.25 * p3, 0.5 * (p4 - p7), 0, 0, p5[0], 'center', 'middle', 0, 0, 0);
    builder.text(0.25 * p3, 0.5 * (p4 + p7), 0, 0, p5[1], 'center', 'middle', 0, 0, 0);
    builder.text(0.7 * p3, 0.5 * (p4 - p7), 0, 0, p6[0], 'center', 'middle', 0, 0, 0);
    builder.text(0.7 * p3, 0.5 * (p4 + p7), 0, 0, p6[1], 'center', 'middle', 0, 0, 0);
  }
}
