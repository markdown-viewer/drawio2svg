// @ts-nocheck
import type { RenderContext, ShapeAttrs } from '../../../renderer.ts';
import { BaseShapeHandler } from '../../shape-registry.ts';

export class Ios7uiDownloadBarHandler extends BaseShapeHandler {
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
    this.renderForeground(builder, 0, 0, width, height, style, getStencilShape, renderStencilShape);
    builder.restore();
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
    b = this.getStyleValue(style, 'buttonText', '');
    builder.setFontStyle(1);
    builder.text(0.5 * width, 0.2 * height, 0, 0, b, 'center', 'middle', 0, 0, 0);
    b = this.getStyleNumber(style, 'barPos', 80);
    b = Math.min(b, 100);
    b = Math.max(b, 0);
    b = (width * b) / 100;
    builder.setStrokeWidth(2);
    builder.setStrokeColor(this.getStyleValue(style, 'fillColor', '') as string);
    builder.begin();
    builder.moveTo(0, 0.5 * height);
    builder.lineTo(width, 0.5 * height);
    builder.stroke();
    builder.setStrokeColor(this.getStyleValue(style, 'strokeColor', '') as string);
    builder.begin();
    builder.moveTo(0, 0.5 * height);
    builder.lineTo(b, 0.5 * height);
    builder.stroke();
  }
}
