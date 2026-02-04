// @ts-nocheck
import type { RenderContext, ShapeAttrs } from '../../../renderer.ts';
import { BaseShapeHandler } from '../../shape-registry.ts';

export class Archimate3NetworkHandler extends BaseShapeHandler {
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
    builder.translate(0, 2);
    height -= 4;
    builder.begin();
    builder.moveTo(0.4 * width, 0.2 * height);
    builder.lineTo(0.85 * width, 0.2 * height);
    builder.lineTo(0.6 * width, 0.8 * height);
    builder.lineTo(0.15 * width, 0.8 * height);
    builder.close();
    builder.stroke();
    x = this.getStyleValue(style, 'strokeColor', '#000000');
    builder.setFillColor(x as string);
    builder.ellipse(0.25 * width, 0, 0.3 * width, 0.4 * height);
    builder.fill();
    builder.ellipse(0.7 * width, 0, 0.3 * width, 0.4 * height);
    builder.fill();
    builder.ellipse(0, 0.6 * height, 0.3 * width, 0.4 * height);
    builder.fill();
    builder.ellipse(0.45 * width, 0.6 * height, 0.3 * width, 0.4 * height);
    builder.fill();
  }
}
