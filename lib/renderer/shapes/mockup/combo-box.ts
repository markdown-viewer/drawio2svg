// @ts-nocheck
import type { RenderContext, ShapeAttrs } from '../../../renderer.ts';
import { BaseShapeHandler } from '../../shape-registry.ts';

export class MockupComboBoxHandler extends BaseShapeHandler {
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

    builder.translate(x, y);
    this.renderBackground(builder, x, y, width, height, style, getStencilShape, renderStencilShape);
    builder.setShadow(!1);
    this.renderForeground(builder, x, y, width, height, style, getStencilShape, renderStencilShape);
    this.render_mainText(builder, x, y, width, height);
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
    renderStencilShape?: RenderContext['renderStencilShape']
  ): void {
    if (!builder) return;
    builder.setFillColor('#ffffff' as string);
    builder.roundrect(0, 0, width, height, 5, 5);
    builder.fillAndStroke();
  }

  private renderForeground(
    builder: RenderContext['builder'],
    x: number,
    y: number,
    width: number,
    height: number,
    style: RenderContext['style'],
    getStencilShape?: RenderContext['getStencilShape'],
    renderStencilShape?: RenderContext['renderStencilShape']
  ): void {
    if (!builder) return;
    x = this.getStyleValue(style, 'fillColor', '').toString();
    y = this.getStyleValue(style, 'fillColor2', '').toString();
    builder.setGradient(x, y, width - 30, 0, 30, height, 'south', 1, 1);
    builder.begin();
    builder.moveTo(width - 30, 0);
    builder.lineTo(width - 5, 0);
    builder.arcTo(5, 5, 0, 0, 1, width, 5);
    builder.lineTo(width, height - 5);
    builder.arcTo(5, 5, 0, 0, 1, width - 5, height);
    builder.lineTo(width - 30, height);
    builder.close();
    builder.fillAndStroke();
    builder.setFillColor('#ffffff' as string);
    builder.begin();
    builder.moveTo(width - 22, 0.5 * height - 5);
    builder.lineTo(width - 15, 0.5 * height + 5);
    builder.lineTo(width - 8, 0.5 * height - 5);
    builder.fill();
  }

  private render_mainText(
    builder: RenderContext['builder'],
    p1: any,
    p2: any,
    p3: any,
    p4: any
  ): void {
    if (!builder) return;
    p1 = this.getStyleValue(this.renderCtx.style, 'mainText', 'Main Text');
    p2 = this.getStyleValue(this.renderCtx.style, 'textColor', '#666666').toString();
    p3 = this.getStyleValue(this.renderCtx.style, 'textSize', '17').toString();
    builder.begin();
    builder.setFontSize(Number.parseFloat(String(p3)) || 0);
    builder.setFontColor(p2 as string);
    builder.text(5, 0.5 * p4, 0, 0, p1, 'left', 'middle', 0, 0, 0);
  }
}
