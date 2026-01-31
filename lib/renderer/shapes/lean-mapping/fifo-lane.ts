// @ts-nocheck
import type { RenderContext, ShapeAttrs } from '../../../renderer.ts';
import { BaseShapeHandler } from '../../shape-registry.ts';

export class LeanMappingFifoLaneHandler extends BaseShapeHandler {
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
    let d = x;

    builder.translate(d, y);
    d = parseFloat(this.getStyleValue(style, 'fontSize', '8'));
    this.renderBackground(
      builder,
      0,
      0,
      width,
      height,
      style,
      getStencilSvg,
      renderStencilShape,
      d
    );
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
    renderStencilShape?: RenderContext['renderStencilShape'],
    extra1?: any
  ): void {
    if (!builder) return;
    extra1 = Math.min(1.5 * extra1, height);
    builder.begin();
    builder.moveTo(0, extra1);
    builder.lineTo(width, extra1);
    builder.moveTo(0, height);
    builder.lineTo(width, height);
    builder.stroke();
    builder.rect(0.02 * width, extra1 + 4, 0.26 * width, height - extra1 - 8);
    builder.fillAndStroke();
    builder.ellipse(0.35 * width, extra1 + 4, 0.26 * width, height - extra1 - 8);
    builder.fillAndStroke();
    builder.begin();
    builder.moveTo(0.69 * width, extra1 + 4);
    builder.lineTo(0.98 * width, extra1 + 4);
    builder.lineTo(0.835 * width, height - 4);
    builder.close();
    builder.fillAndStroke();
  }
}
