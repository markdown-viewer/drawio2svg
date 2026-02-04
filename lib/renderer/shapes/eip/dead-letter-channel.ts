// @ts-nocheck
import type { RenderContext, ShapeAttrs } from '../../../renderer.ts';
import { BaseShapeHandler } from '../../shape-registry.ts';

export class EipDeadLetterChannelHandler extends BaseShapeHandler {
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
    builder.setGradient('#e6e6e6', '#808080', 0, 0, width, height, 'south', 1, 1);
    builder.begin();
    builder.moveTo(8, 0.5 * height + 10);
    builder.arcTo(12, 12, 0, 0, 1, 8, 0.5 * height - 10);
    builder.lineTo(width - 8, 0.5 * height - 10);
    builder.arcTo(12, 12, 0, 0, 1, width - 8, 0.5 * height + 10);
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
    builder.setFillColor('#e6e6e6' as string);
    builder.begin();
    builder.moveTo(width - 8, 0.5 * height - 10);
    builder.arcTo(12, 12, 0, 0, 1, width - 8, 0.5 * height + 10);
    builder.arcTo(12, 12, 0, 0, 1, width - 8, 0.5 * height - 10);
    builder.fillAndStroke();
    builder.setFillColor('#ff0000' as string);
    builder.setStrokeWidth('1');
    builder.begin();
    builder.moveTo(0.5 * width - 6, 0.5 * height - 3);
    builder.lineTo(0.5 * width - 3, 0.5 * height - 6);
    builder.lineTo(0.5 * width + 3, 0.5 * height - 6);
    builder.lineTo(0.5 * width + 6, 0.5 * height - 3);
    builder.lineTo(0.5 * width + 6, 0.5 * height + 3);
    builder.lineTo(0.5 * width + 3, 0.5 * height + 6);
    builder.lineTo(0.5 * width - 3, 0.5 * height + 6);
    builder.lineTo(0.5 * width - 6, 0.5 * height + 3);
    builder.close();
    builder.fillAndStroke();
    builder.setStrokeWidth('2');
    builder.setStrokeColor('#ffffff' as string);
    builder.begin();
    builder.moveTo(0.5 * width - 4, 0.5 * height);
    builder.lineTo(0.5 * width + 4, 0.5 * height);
    builder.stroke();
  }
}
