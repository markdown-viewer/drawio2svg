// @ts-nocheck
import type { RenderContext, ShapeAttrs } from '../../../renderer.ts';
import { BaseShapeHandler } from '../../shape-registry.ts';

export class SysmlPackage2Handler extends BaseShapeHandler {
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
    this.renderBackground(builder, x, y, width, height, style, getStencilSvg, renderStencilShape);
    builder.setShadow(!1);
    this.renderForeground(builder, x, y, width, height, style, getStencilSvg, renderStencilShape);
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
    builder.stroke();
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
    x = parseInt(this.getStyleNumber(style, 'labelX', 90));
    x = Math.min(x, width);
    if (20 < x) {
      builder.begin();
      builder.moveTo(0, 20);
      builder.lineTo(x - 10, 20);
      builder.lineTo(x, 10);
      builder.lineTo(x, 0);
      builder.lineTo(0, 0);
      builder.close();
      builder.fillAndStroke();
    }
  }
}
