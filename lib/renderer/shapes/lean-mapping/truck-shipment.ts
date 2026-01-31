// @ts-nocheck
import type { RenderContext, ShapeAttrs } from '../../../renderer.ts';
import { BaseShapeHandler } from '../../shape-registry.ts';

export class LeanMappingTruckShipmentHandler extends BaseShapeHandler {
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
    let b;
    builder.rect(0, 0, 0.6 * width, 0.8 * height);
    builder.fillAndStroke();
    builder.rect(0.6 * width, 0.35 * height, 0.4 * width, 0.45 * height);
    builder.fillAndStroke();
    b = this.getStyleValue(style, 'strokeColor', '#000000');
    builder.setFillColor(b as string);
    builder.ellipse(0.15 * width, 0.8 * height, 0.2 * width, 0.2 * height);
    builder.fillAndStroke();
    builder.ellipse(0.65 * width, 0.8 * height, 0.2 * width, 0.2 * height);
    builder.fillAndStroke();
  }
}
