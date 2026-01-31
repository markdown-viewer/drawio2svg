// @ts-nocheck
import type { RenderContext, ShapeAttrs } from '../../../renderer.ts';
import { BaseShapeHandler } from '../../shape-registry.ts';

export class Pid2instSharedContHandler extends BaseShapeHandler {
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
    renderStencilShape?: RenderContext['renderStencilShape']
  ): void {
    if (!builder) return;
    x = this.getStyleValue(style, 'mounting', 'field');
    builder.ellipse(0, 0, width, height);
    builder.fillAndStroke();
    if (x === 'room') {
      builder.begin();
      builder.moveTo(0, 0.5 * height);
      builder.lineTo(width, 0.5 * height);
      builder.stroke();
    } else if (x === 'inaccessible') {
      builder.setDashed(!0);
      builder.begin();
      builder.moveTo(0, 0.5 * height);
      builder.lineTo(width, 0.5 * height);
      builder.stroke();
    } else if (x === 'local') {
      builder.begin();
      builder.moveTo(0.005 * width, 0.48 * height);
      builder.lineTo(0.995 * width, 0.48 * height);
      builder.moveTo(0.005 * width, 0.52 * height);
      builder.lineTo(0.995 * width, 0.52 * height);
      builder.stroke();
    }
  }
}
