// @ts-nocheck
import type { RenderContext, ShapeAttrs } from '../../../renderer.ts';
import { BaseShapeHandler } from '../../shape-registry.ts';

export class MockupMiscRevisionTableHandler extends BaseShapeHandler {
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
    this.renderBackground(builder, 0, 0, width, height, style, getStencilShape, renderStencilShape);
    builder.setShadow(!1);
    this.renderForeground(builder, 0, 0, width, height, style, getStencilShape, renderStencilShape);
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
    builder.rect(0, 0, width, height);
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
    let b;
    let c;
    let f;
    b = this.getStyleValue(style, 'mainText', '').toString().split(',');
    c = this.getStyleValue(style, 'textColor', '#999999');
    f = this.getStyleValue(style, 'textSize', '17');
    builder.begin();
    builder.moveTo(0, 0.33 * height);
    builder.lineTo(width, 0.33 * height);
    builder.moveTo(0, 0.67 * height);
    builder.lineTo(width, 0.67 * height);
    builder.moveTo(0.125 * width, 0.33 * height);
    builder.lineTo(0.125 * width, height);
    builder.moveTo(0.5 * width, 0.33 * height);
    builder.lineTo(0.5 * width, height);
    builder.stroke();
    builder.setFontSize(Number.parseFloat(String(f)) || 0);
    builder.setFontColor(c as string);
    builder.text(0.5 * width, 0.165 * height, 0, 0, b[0], 'center', 'middle', 0, 0, 0);
    builder.text(0.0625 * width, 0.5 * height, 0, 0, b[1], 'center', 'middle', 0, 0, 0);
    builder.text(0.3125 * width, 0.5 * height, 0, 0, b[2], 'center', 'middle', 0, 0, 0);
    builder.text(0.75 * width, 0.5 * height, 0, 0, b[3], 'center', 'middle', 0, 0, 0);
    builder.text(0.0625 * width, 0.835 * height, 0, 0, b[4], 'center', 'middle', 0, 0, 0);
    builder.text(0.3125 * width, 0.835 * height, 0, 0, b[5], 'center', 'middle', 0, 0, 0);
    builder.text(0.75 * width, 0.835 * height, 0, 0, b[6], 'center', 'middle', 0, 0, 0);
  }
}
