// @ts-nocheck
import type { RenderContext, ShapeAttrs } from '../../../renderer.ts';
import { BaseShapeHandler } from '../../shape-registry.ts';

export class MockupButtonsOnOffButtonHandler extends BaseShapeHandler {
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

    builder.translate(x, y);
    b = Math.max(b, 10);
    c = Math.max(c, 10);
    this.renderBackground(builder, x, y, b, c, style, getStencilShape, renderStencilShape);
    builder.setShadow(!1);
    this.renderForeground(builder, x, y, b, c, style, getStencilShape, renderStencilShape);
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
    builder.roundrect(0, 0, width, height, 10, 10);
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
    let f;
    let g;
    let h;
    x = this.getStyleValue(style, 'buttonState', 'on');
    y = this.getStyleValue(style, 'fillColor2', '#008cff');
    f = this.getStyleValue(style, 'textColor', '#ffffff,#999999').toString().split(',');
    g = this.getStyleValue(style, 'mainText', 'ON,OFF').toString().split(',');
    h = this.getStyleValue(style, 'textSize', '17');
    if (x === 'on') {
      builder.setFillColor(y as string);
      builder.setFontColor(f[0] as string);
      builder.roundrect(0, 0, 0.75 * width, height, 10, 10);
    } else {
      builder.setFontColor(f[1] as string);
      builder.roundrect(0.25 * width, 0, 0.75 * width, height, 10, 10);
    }
    builder.fillAndStroke();
    builder.setFontSize(Number.parseFloat(String(h)) || 0);
    builder.setFontStyle(1);
    if (x === 'on') {
      builder.text(0.375 * width, 0.5 * height, 0, 0, g[0], 'center', 'middle', 0, 0, 0);
    } else if (x === 'off') {
      builder.text(0.625 * width, 0.5 * height, 0, 0, g[1], 'center', 'middle', 0, 0, 0);
    }
  }
}
