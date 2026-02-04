// @ts-nocheck
import type { RenderContext, ShapeAttrs } from '../../../renderer.ts';
import { BaseShapeHandler } from '../../shape-registry.ts';

export class Archimate3OutcomeHandler extends BaseShapeHandler {
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
    x = this.getStyleValue(style, 'strokeWidth', 1);
    builder.ellipse(0, 0.2 * width, 0.8 * width, 0.8 * height);
    builder.fillAndStroke();
    builder.ellipse(0.15 * width, 0.35 * width, 0.5 * width, 0.5 * height);
    builder.stroke();
    builder.ellipse(0.3 * width, 0.5 * width, 0.2 * width, 0.2 * height);
    builder.stroke();
    builder.setStrokeWidth(3 * x);
    builder.setLineCap('round');
    builder.begin();
    builder.moveTo(0.4 * width, 0.6 * height);
    builder.lineTo(0.9 * width, 0.1 * height);
    builder.moveTo(0.42 * width, 0.4 * height);
    builder.lineTo(0.4 * width, 0.6 * height);
    builder.lineTo(0.6 * width, 0.58 * height);
    builder.moveTo(0.8 * width, 0);
    builder.lineTo(0.75 * width, 0.25 * height);
    builder.lineTo(width, 0.2 * height);
    builder.stroke();
  }
}
