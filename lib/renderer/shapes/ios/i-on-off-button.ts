// @ts-nocheck
import type { RenderContext, ShapeAttrs } from '../../../renderer.ts';
import { BaseShapeHandler } from '../../shape-registry.ts';

export class IosIOnOffButtonHandler extends BaseShapeHandler {
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
    this.render_mainText(builder, x, y, b, height, f);
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
      builder.setGradient('#E2FFEB', '#008215', 0, 0, width, height, 'south', 1, 1);
      builder.roundrect(0, 0, width, height, 0.5 * height, 0.5 * height);
      builder.fillAndStroke();
    } else if (extra1 === 'off') {
      builder.setGradient('#cc9999', '#881100', 0, 0, width, height, 'south', 1, 1);
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
    if (extra1 === 'on') {
      builder.setGradient('#ffffff', '#888888', width - height, 0, height, height, 'south', 1, 1);
      builder.ellipse(width - height, 0, height, height);
    } else {
      builder.setGradient('#ffffff', '#888888', 0, 0, height, height, 'south', 1, 1);
      builder.ellipse(0, 0, height, height);
    }
    builder.fillAndStroke();
  }

  private render_mainText(
    builder: RenderContext['builder'],
    p1: any,
    p2: any,
    p3: any,
    p4: any,
    p5: any
  ): void {
    if (!builder) return;
    p1 = this.getStyleValue(this.renderCtx.style, 'mainText', null);
    builder.setFontColor('#ffffff' as string);
    builder.setFontSize(Number.parseFloat(String(8.5)) || 0);
    if ('' != p1) {
      if (p5 === 'on') {
        builder.text(0.5 * p3 - 0.4 * p4, 0.5 * p4, 0, 0, p1 || 'ON', 'center', 'middle', 0, 0, 0);
      } else if (p5 === 'off') {
        builder.text(0.5 * p3 + 0.4 * p4, 0.5 * p4, 0, 0, p1 || 'OFF', 'center', 'middle', 0, 0, 0);
      }
    }
  }
}
