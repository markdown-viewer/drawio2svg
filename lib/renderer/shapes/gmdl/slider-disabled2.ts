// @ts-nocheck
import type { RenderContext, ShapeAttrs } from '../../../renderer.ts';
import { BaseShapeHandler } from '../../shape-registry.ts';

export class GmdlSliderDisabled2Handler extends BaseShapeHandler {
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
    builder.setShadow(!0);
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
    y = this.getStyleNumber(style, 'handleSize', 10);
    x = this.getStyleNumber(style, 'hPos', 50) / 100;
    x = Math.min(Math.max(x, 0), 1);
    builder.ellipse(width * x - 0.5 * y, 0.5 * (height - y), y, y);
    builder.fillAndStroke();
    y = width * x - 7;
    x = width * x + 7;
    if (0 < y) {
      builder.begin();
      builder.moveTo(0, 0.5 * height);
      builder.lineTo(y, 0.5 * height);
      builder.stroke();
    }
    if (x < width) {
      builder.begin();
      builder.moveTo(x, 0.5 * height);
      builder.lineTo(width, 0.5 * height);
      builder.stroke();
    }
  }
}
