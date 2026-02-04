// @ts-nocheck
import type { RenderContext, ShapeAttrs } from '../../../renderer.ts';
import { BaseShapeHandler } from '../../shape-registry.ts';

export class Ios7uiOnOffButtonHandler extends BaseShapeHandler {
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
    const f = this.getStyleValue(style, 'buttonState', 'on');

    builder.translate(x, y);
    b = Math.max(b, 2 * height);
    this.renderBackground(builder, x, y, b, height, style, getStencilShape, renderStencilShape, f);
    builder.setShadow(!1);
    this.renderForeground(builder, x, y, b, height, style, getStencilShape, renderStencilShape, f);
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
    extra1?: any
  ): void {
    if (!builder) return;
    if (extra1 === 'on') {
      builder.roundrect(0, 0, width, height, 0.5 * height, 0.5 * height);
      builder.fillAndStroke();
    } else if (extra1 === 'off') {
      builder.setStrokeColor(this.getStyleValue(style, 'strokeColor2', '#aaaaaa') as string);
      builder.setFillColor(this.getStyleValue(style, 'fillColor2', '#ffffff') as string);
      builder.roundrect(0, 0, width, height, 0.5 * height, 0.5 * height);
      builder.fillAndStroke();
    }
  }

  private renderForeground(
    builder: RenderContext['builder'],
    x: number,
    y: number,
    width: number,
    height: number,
    style: RenderContext['style'],
    getStencilShape?: RenderContext['getStencilShape'],
    renderStencilShape?: RenderContext['renderStencilShape'],
    extra1?: any
  ): void {
    if (!builder) return;
    builder.setFillColor('#ffffff' as string);
    if (extra1 === 'on') {
      builder.ellipse(width - height + 1, 1, height - 2, height - 2);
      builder.fill();
    } else {
      builder.ellipse(0, 0, height, height);
      builder.stroke();
    }
  }
}
