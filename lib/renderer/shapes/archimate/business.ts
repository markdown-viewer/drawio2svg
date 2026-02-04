// @ts-nocheck
import type { RenderContext, ShapeAttrs } from '../../../renderer.ts';
import { BaseShapeHandler } from '../../shape-registry.ts';

export class ArchimateBusinessHandler extends BaseShapeHandler {
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
    this.renderBackground(builder, 0, 0, width, height, style, getStencilShape, renderStencilShape);
    builder.setShadow(!1);
    builder.translate(width - 20, 5);
    this.renderForeground(
      builder,
      width - 20,
      5,
      15,
      15,
      style,
      getStencilShape,
      renderStencilShape
    );
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
    builder.roundrect(0, 0, width, height, 10, 10);
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
    x = this.getStyleValue(style, 'busType', 'process');
    builder.setDashed(!1);
    if (x === 'process') {
      builder.translate(0, 2);
      height -= 4;
      builder.begin();
      builder.moveTo(0, 0.15 * height);
      builder.lineTo(0.65 * width, 0.15 * height);
      builder.lineTo(0.65 * width, 0);
      builder.lineTo(width, 0.5 * height);
      builder.lineTo(0.65 * width, height);
      builder.lineTo(0.65 * width, 0.85 * height);
      builder.lineTo(0, 0.85 * height);
      builder.close();
      builder.stroke();
    } else if (x === 'function') {
      builder.translate(2, 0);
      width -= 4;
      builder.begin();
      builder.moveTo(0, 0.15 * height);
      builder.lineTo(0.5 * width, 0);
      builder.lineTo(width, 0.15 * height);
      builder.lineTo(width, height);
      builder.lineTo(0.5 * width, 0.85 * height);
      builder.lineTo(0, height);
      builder.close();
      builder.stroke();
    } else if (x === 'interaction') {
      builder.begin();
      builder.moveTo(0.55 * width, 0);
      builder.arcTo(0.45 * width, 0.5 * height, 0, 0, 1, 0.55 * width, height);
      builder.close();
      builder.moveTo(0.45 * width, 0);
      builder.arcTo(0.45 * width, 0.5 * height, 0, 0, 0, 0.45 * width, height);
      builder.close();
      builder.stroke();
    } else if (x === 'event') {
      builder.translate(0, 3);
      height -= 6;
      builder.begin();
      builder.moveTo(width - 0.5 * height, 0);
      builder.arcTo(0.5 * height, 0.5 * height, 0, 0, 1, width - 0.5 * height, height);
      builder.lineTo(0, height);
      builder.arcTo(0.5 * height, 0.5 * height, 0, 0, 0, 0, 0);
      builder.close();
      builder.stroke();
    } else if (x === 'service') {
      builder.translate(0, 3);
      height -= 6;
      builder.begin();
      builder.moveTo(width - 0.5 * height, 0);
      builder.arcTo(0.5 * height, 0.5 * height, 0, 0, 1, width - 0.5 * height, height);
      builder.lineTo(0, height);
      builder.arcTo(0.5 * height, 0.5 * height, 0, 0, 1, 0, 0);
      builder.close();
      builder.stroke();
    }
  }
}
