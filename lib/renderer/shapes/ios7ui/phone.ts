// @ts-nocheck
import type { RenderContext, ShapeAttrs } from '../../../renderer.ts';
import { BaseShapeHandler } from '../../shape-registry.ts';

export class Ios7uiPhoneHandler extends BaseShapeHandler {
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
    builder.roundrect(0, 0, width, height, 25, 25);
    builder.fillAndStroke();
    builder.setShadow(!1);
    this.renderForeground(
      builder,
      x,
      y,
      width,
      height,
      style,
      getStencilSvg,
      renderStencilShape,
      25
    );
    builder.restore();
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
    builder.rect(0.0625 * width, 0.15 * height, 0.875 * width, 0.7 * height);
    builder.stroke();
    builder.ellipse(0.4875 * width, 0.04125 * height, 0.025 * width, 0.0125 * height);
    builder.stroke();
    builder.roundrect(
      0.375 * width,
      0.075 * height,
      0.25 * width,
      0.01875 * height,
      0.02 * width,
      0.01 * height
    );
    builder.stroke();
    builder.ellipse(0.4 * width, 0.875 * height, 0.2 * width, 0.1 * height);
    builder.stroke();
    builder.roundrect(
      0.4575 * width,
      0.905 * height,
      0.085 * width,
      0.04375 * height,
      0.00625 * height,
      0.00625 * height
    );
    builder.stroke();
  }
}
