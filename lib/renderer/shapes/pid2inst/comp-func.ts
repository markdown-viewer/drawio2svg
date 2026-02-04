// @ts-nocheck
import type { RenderContext, ShapeAttrs } from '../../../renderer.ts';
import { BaseShapeHandler } from '../../shape-registry.ts';

export class Pid2instCompFuncHandler extends BaseShapeHandler {
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
    this.renderBackground(builder, x, y, width, height, style, getStencilShape, renderStencilShape);
    builder.setShadow(!1);
    this.renderForeground(builder, x, y, width, height, style, getStencilShape, renderStencilShape);
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
    builder.begin();
    builder.moveTo(0, 0.5 * height);
    builder.lineTo(0.25 * width, 0);
    builder.lineTo(0.75 * width, 0);
    builder.lineTo(width, 0.5 * height);
    builder.lineTo(0.75 * width, height);
    builder.lineTo(0.25 * width, height);
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
    getStencilShape?: RenderContext['getStencilShape'],
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
      builder.moveTo(0.01 * width, 0.48 * height);
      builder.lineTo(0.99 * width, 0.48 * height);
      builder.moveTo(0.01 * width, 0.52 * height);
      builder.lineTo(0.99 * width, 0.52 * height);
      builder.stroke();
    }
  }
}
