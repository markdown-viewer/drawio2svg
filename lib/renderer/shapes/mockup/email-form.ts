// @ts-nocheck
import type { RenderContext, ShapeAttrs } from '../../../renderer.ts';
import { BaseShapeHandler } from '../../shape-registry.ts';

export class MockupFormsEmailFormHandler extends BaseShapeHandler {
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
    const f = this.getStyleValue(style, 'textSize', '12');
    const g = this.getStyleValue(style, 'showCC', 'true');
    const h = this.getStyleValue(style, 'showBCC', 'true');
    const k = 4 * f;
    let l = 0;

    if ('true' === g) {
      l++;
    }
    if ('true' === h) {
      l++;
    }
    b = Math.max(b, 5 * f);
    c = Math.max(c, 10.5 * f + l * f * 3);
    builder.translate(x, y);
    this.renderBackground(builder, b, c, f, k, style, getStencilSvg, renderStencilShape, g, h);
    builder.setShadow(!1);
    this.renderForeground(builder, b, c, f, k, style, getStencilSvg, renderStencilShape, g, h);
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
    let h;
    h = 9 * width;
    if ('true' === extra1) {
      h += 3 * width;
      builder.rect(height, 9 * width, x - height, 1.5 * width);
      builder.fillAndStroke();
    }
    if ('true' === extra2) {
      builder.rect(height, h, x - height, 1.5 * width);
      h += 3 * width;
      builder.fillAndStroke();
    }
    builder.rect(height, 0, x - height, 1.5 * width);
    builder.fillAndStroke();
    builder.rect(height, 3 * width, x - height, 1.5 * width);
    builder.fillAndStroke();
    builder.rect(height, 6 * width, x - height, 1.5 * width);
    builder.fillAndStroke();
    builder.rect(0, h, x, y - h);
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
    extra1?: any,
    extra2?: any
  ): void {
    if (!builder) return;
    x = this.getStyleValue(
      style,
      'mainText',
      'john@jgraph.com,Greeting,fred@jgraph.com,,,Lorem ipsum'
    )
      .toString()
      .split(',');
    y = this.getStyleValue(style, 'textColor', '#666666');
    builder.setFontColor(y as string);
    builder.setFontSize(Number.parseFloat(String(width)) || 0);
    builder.text(height - 0.5 * width, 0.75 * width, 0, 0, 'From', 'right', 'middle', 0, 0, 0);
    builder.text(height - 0.5 * width, 3.75 * width, 0, 0, 'Subject', 'right', 'middle', 0, 0, 0);
    builder.text(height - 0.5 * width, 6.75 * width, 0, 0, 'To', 'right', 'middle', 0, 0, 0);
    builder.text(height + 0.5 * width, 0.75 * width, 0, 0, x[0], 'left', 'middle', 0, 0, 0);
    builder.text(height + 0.5 * width, 3.75 * width, 0, 0, x[1], 'left', 'middle', 0, 0, 0);
    builder.text(height + 0.5 * width, 6.75 * width, 0, 0, x[2], 'left', 'middle', 0, 0, 0);
    y = 9 * width;
    if ('true' === extra1) {
      y += 3 * width;
      builder.text(height - 0.5 * width, 9.75 * width, 0, 0, 'CC', 'right', 'middle', 0, 0, 0);
      builder.text(height + 0.5 * width, 9.75 * width, 0, 0, x[3], 'left', 'middle', 0, 0, 0);
    }
    if ('true' === extra2) {
      builder.text(height - 0.5 * width, y + 0.75 * width, 0, 0, 'BCC', 'right', 'middle', 0, 0, 0);
      builder.text(height + 0.5 * width, y + 0.75 * width, 0, 0, x[4], 'left', 'middle', 0, 0, 0);
      y += 3 * width;
    }
    builder.text(0.5 * width, y + 0.75 * width, 0, 0, x[5], 'left', 'middle', 0, 0, 0);
  }
}
