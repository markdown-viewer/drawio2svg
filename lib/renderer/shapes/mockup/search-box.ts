// @ts-nocheck
import type { RenderContext, ShapeAttrs } from '../../../renderer.ts';
import { BaseShapeHandler } from '../../shape-registry.ts';

export class MockupSearchBoxHandler extends BaseShapeHandler {
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

    builder.translate(x, y);
    this.renderBackground(builder, 0, 0, width, height, style, getStencilSvg, renderStencilShape);
    builder.setShadow(!1);
    this.renderForeground(builder, 0, 0, width, height, style, getStencilSvg, renderStencilShape);
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
    getStencilSvg?: RenderContext['getStencilSvg'],
    renderStencilShape?: RenderContext['renderStencilShape']
  ): void {
    if (!builder) return;
    let b;
    let c;
    let f;
    let g;
    b = this.getStyleValue(style, 'mainText', 'Search');
    c = this.getStyleValue(style, 'textColor', '#666666');
    f = this.getStyleValue(style, 'strokeColor2', '#008cff');
    g = this.getStyleValue(style, 'textSize', '17');
    builder.setFontColor(c as string);
    builder.setFontSize(Number.parseFloat(String(g)) || 0);
    builder.text(5, 0.5 * height, 0, 0, b, 'left', 'middle', 0, 0, 0);
    builder.setStrokeColor(f as string);
    builder.ellipse(width - 15, 0.5 * height - 8, 10, 10);
    builder.stroke();
    builder.begin();
    builder.moveTo(width - 19, 0.5 * height + 9);
    builder.lineTo(width - 13, 0.5 * height + 1);
    builder.stroke();
  }
}
