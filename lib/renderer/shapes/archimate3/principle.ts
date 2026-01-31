// @ts-nocheck
import type { RenderContext, ShapeAttrs } from '../../../renderer.ts';
import { BaseShapeHandler } from '../../shape-registry.ts';

export class Archimate3PrincipleHandler extends BaseShapeHandler {
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
    builder.begin();
    builder.moveTo(0.05 * width, 0.05 * height);
    builder.arcTo(2.3 * width, 2.3 * height, 0, 0, 1, 0.95 * width, 0.05 * height);
    builder.arcTo(2.3 * width, 2.3 * height, 0, 0, 1, 0.95 * width, 0.95 * height);
    builder.arcTo(2.3 * width, 2.3 * height, 0, 0, 1, 0.05 * width, 0.95 * height);
    builder.arcTo(2.3 * width, 2.3 * height, 0, 0, 1, 0.05 * width, 0.05 * height);
    builder.close();
    builder.fillAndStroke();
    x = this.getStyleValue(style, 'strokeColor', '#000000');
    builder.setFillColor(x as string);
    builder.begin();
    builder.moveTo(0.45 * width, 0.7 * height);
    builder.lineTo(0.42 * width, 0.15 * height);
    builder.lineTo(0.58 * width, 0.15 * height);
    builder.lineTo(0.55 * width, 0.7 * height);
    builder.close();
    builder.fill();
    builder.rect(0.45 * width, 0.75 * height, 0.1 * width, 0.1 * height);
    builder.fill();
  }
}
