// @ts-nocheck
import type { RenderContext, ShapeAttrs } from '../../../renderer.ts';
import { BaseShapeHandler } from '../../shape-registry.ts';

export class Pid2miscConveyorHandler extends BaseShapeHandler {
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
    let f;
    x = Math.min(height, 0.5 * width);
    builder.begin();
    builder.moveTo(0.5 * x, 0);
    builder.lineTo(width - 0.5 * x, 0);
    builder.stroke();
    builder.ellipse(0, 0, x, x);
    builder.fillAndStroke();
    builder.ellipse(width - x, 0, x, x);
    builder.fillAndStroke();
    builder.begin();
    builder.moveTo(0.5 * x, x);
    builder.lineTo(width - 0.5 * x, x);
    builder.stroke();
    width -= 1.8 * x;
    y = 0.9 * x;
    height = 0.7 * x;
    for (f = 0; f < width; f += height) {
      builder.rect(y + f, 0, 0.2 * x, 0.1 * x);
      builder.fillAndStroke();
      builder.rect(y + f, 0.9 * x, 0.2 * x, 0.1 * x);
      builder.fillAndStroke();
    }
  }
}
