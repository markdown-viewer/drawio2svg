// @ts-nocheck
import type { RenderContext, ShapeAttrs } from '../../../renderer.ts';
import { BaseShapeHandler } from '../../shape-registry.ts';

export class GmdlSlider2Handler extends BaseShapeHandler {
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
    x = this.getStyleNumber(style, 'handleSize', 10);
    y = this.getStyleNumber(style, 'barPos', 40) / 100;
    y = Math.max(0, Math.min(1, y));
    builder.save();
    builder.setStrokeColor('#bbbbbb' as string);
    builder.begin();
    builder.moveTo(0, 0.5 * height);
    builder.lineTo(width, 0.5 * height);
    builder.fillAndStroke();
    builder.restore();
    builder.begin();
    builder.moveTo(0, 0.5 * height);
    builder.lineTo(y * width, 0.5 * height);
    builder.fillAndStroke();
    builder.begin();
    builder.ellipse(y * width - 0.5 * x, 0.5 * height - 0.5 * x, x, x);
    builder.fillAndStroke();
  }
}
