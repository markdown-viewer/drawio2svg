// @ts-nocheck
import type { RenderContext, ShapeAttrs } from '../../../renderer.ts';
import { BaseShapeHandler } from '../../shape-registry.ts';

export class Ios7uiCalloutHandler extends BaseShapeHandler {
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
    if (30 <= width && 20 <= height) {
      builder.begin();
      builder.moveTo(15, height - 3);
      builder.arcTo(20, 10, 0, 0, 1, 0, height);
      builder.arcTo(15, 15, 0, 0, 0, 10, height - 10);
      builder.lineTo(10, 10);
      builder.arcTo(10, 10, 0, 0, 1, 20, 0);
      builder.lineTo(width - 10, 0);
      builder.arcTo(10, 10, 0, 0, 1, width, 10);
      builder.lineTo(width, height - 10);
      builder.arcTo(10, 10, 0, 0, 1, width - 10, height);
      builder.lineTo(20, height);
      builder.arcTo(10, 10, 0, 0, 1, 15, height - 3);
      builder.close();
      builder.fillAndStroke();
    }
  }
}
