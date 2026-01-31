// @ts-nocheck
import type { RenderContext, ShapeAttrs } from '../../../renderer.ts';
import { BaseShapeHandler } from '../../shape-registry.ts';

export class LeanMappingPushArrowHandler extends BaseShapeHandler {
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
    builder.begin();
    builder.moveTo(0, 0.17 * height);
    builder.lineTo(0.75 * width, 0.17 * height);
    builder.lineTo(0.75 * width, 0);
    builder.lineTo(width, 0.5 * height);
    builder.lineTo(0.75 * width, height);
    builder.lineTo(0.75 * width, 0.83 * height);
    builder.lineTo(0, 0.83 * height);
    builder.close();
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
    renderStencilShape?: RenderContext['renderStencilShape'],
    extra1?: any
  ): void {
    if (!builder) return;
    extra1 = this.getStyleValue(style, 'strokeColor', '#000000');
    builder.setFillColor(extra1 as string);
    builder.rect(0, 0.17 * height, 0.12 * width, 0.66 * height);
    builder.fill();
    builder.rect(0.24 * width, 0.17 * height, 0.12 * width, 0.66 * height);
    builder.fill();
    builder.rect(0.48 * width, 0.17 * height, 0.12 * width, 0.66 * height);
    builder.fill();
    builder.begin();
    builder.moveTo(0.72 * width, 0.17 * height);
    builder.lineTo(0.75 * width, 0.17 * height);
    builder.lineTo(0.75 * width, 0);
    builder.lineTo(width, 0.5 * height);
    builder.lineTo(0.75 * width, height);
    builder.lineTo(0.75 * width, 0.83 * height);
    builder.lineTo(0.72 * width, 0.83 * height);
    builder.close();
    builder.fill();
  }
}
