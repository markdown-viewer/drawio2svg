// @ts-nocheck
import type { RenderContext, ShapeAttrs } from '../../../renderer.ts';
import { BaseShapeHandler } from '../../shape-registry.ts';

export class ArchimateTechHandler extends BaseShapeHandler {
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
    builder.translate(width - 30, 15);
    this.renderForeground(
      builder,
      width - 30,
      15,
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
    builder.begin();
    builder.moveTo(0, 10);
    builder.lineTo(10, 0);
    builder.lineTo(width, 0);
    builder.lineTo(width, height - 10);
    builder.lineTo(width - 10, height);
    builder.lineTo(0, height);
    builder.close();
    builder.moveTo(0, 10);
    builder.lineTo(width - 10, 10);
    builder.lineTo(width - 10, height);
    builder.moveTo(width, 0);
    builder.lineTo(width - 10, 10);
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
    x = this.getStyleValue(style, 'techType', 'device');
    builder.setDashed(!1);
    if (x === 'device') {
      builder.roundrect(0, 0, width, 0.88 * height, 0.05 * width, 0.05 * height);
      builder.stroke();
      builder.begin();
      builder.moveTo(0.1 * width, 0.88 * height);
      builder.lineTo(0, height);
      builder.lineTo(width, height);
      builder.lineTo(0.9 * width, 0.88 * height);
      builder.stroke();
    } else if (x === 'plateau') {
      x = this.getStyleValue(style, 'strokeColor', '#000000');
      builder.setFillColor(x as string);
      builder.rect(0.4 * width, 0, 0.6 * width, 0.2 * height);
      builder.fill();
      builder.rect(0.2 * width, 0.4 * height, 0.6 * width, 0.2 * height);
      builder.fill();
      builder.rect(0, 0.8 * height, 0.6 * width, 0.2 * height);
      builder.fill();
    }
  }
}
