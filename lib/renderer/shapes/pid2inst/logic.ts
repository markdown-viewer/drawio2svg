// @ts-nocheck
import type { RenderContext, ShapeAttrs } from '../../../renderer.ts';
import { BaseShapeHandler } from '../../shape-registry.ts';

export class Pid2instLogicHandler extends BaseShapeHandler {
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
    builder.begin();
    builder.moveTo(0, 0.5 * height);
    builder.lineTo(0.5 * width, 0);
    builder.lineTo(width, 0.5 * height);
    builder.lineTo(0.5 * width, height);
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
    renderStencilShape?: RenderContext['renderStencilShape']
  ): void {
    if (!builder) return;
    x = this.getStyleValue(style, 'mounting', 'field');
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
      builder.moveTo(0.02 * width, 0.48 * height);
      builder.lineTo(0.98 * width, 0.48 * height);
      builder.moveTo(0.02 * width, 0.52 * height);
      builder.lineTo(0.98 * width, 0.52 * height);
      builder.stroke();
    }
  }
}
