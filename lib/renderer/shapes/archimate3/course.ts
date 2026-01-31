// @ts-nocheck
import type { RenderContext, ShapeAttrs } from '../../../renderer.ts';
import { BaseShapeHandler } from '../../shape-registry.ts';

export class Archimate3CourseHandler extends BaseShapeHandler {
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
    x = this.getStyleValue(style, 'strokeWidth', 1);
    builder.ellipse(0.4 * width, 0, 0.6 * width, 0.6 * height);
    builder.fillAndStroke();
    builder.ellipse(0.5 * width, 0.1 * height, 0.4 * width, 0.4 * height);
    builder.stroke();
    builder.setStrokeWidth(3 * x);
    builder.setLineCap('round');
    builder.begin();
    builder.moveTo(0, height);
    builder.arcTo(0.7 * width, 0.7 * height, 0, 0, 1, 0.41 * width, 0.56 * height);
    builder.moveTo(0.14 * width, 0.54 * height);
    builder.lineTo(0.41 * width, 0.56 * height);
    builder.lineTo(0.3 * width, 0.78 * height);
    builder.stroke();
    x = this.getStyleValue(style, 'strokeColor', '#000000');
    builder.setFillColor(x as string);
    builder.ellipse(0.6 * width, 0.2 * height, 0.2 * width, 0.2 * height);
    builder.fill();
  }
}
