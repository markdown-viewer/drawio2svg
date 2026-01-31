// @ts-nocheck
import type { RenderContext, ShapeAttrs } from '../../../renderer.ts';
import { BaseShapeHandler } from '../../shape-registry.ts';

export class Ios7uiAppBarHandler extends BaseShapeHandler {
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
    builder.fill();
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
    builder.setFillColor(this.getStyleValue(style, 'fillColor2', '#222222') as string);
    builder.ellipse(5, 0.5 * height - 1.5, 3, 3);
    builder.fill();
    builder.ellipse(9, 0.5 * height - 1.5, 3, 3);
    builder.fill();
    builder.ellipse(13, 0.5 * height - 1.5, 3, 3);
    builder.fill();
    builder.ellipse(17, 0.5 * height - 1.5, 3, 3);
    builder.fill();
    builder.ellipse(21, 0.5 * height - 1.5, 3, 3);
    builder.fill();
    builder.ellipse(54, 0.5 * height + 2, 2, 2);
    builder.fillAndStroke();
    builder.setStrokeWidth(2);
    builder.begin();
    builder.moveTo(52, 0.5 * height + 1);
    builder.arcTo(3.5, 3.5, 0, 0, 1, 58, 0.5 * height + 1);
    builder.stroke();
    builder.begin();
    builder.moveTo(50, 0.5 * height - 1);
    builder.arcTo(6, 6, 0, 0, 1, 60, 0.5 * height - 1);
    builder.stroke();
    builder.begin();
    builder.moveTo(width - 19, 0.5 * height - 2);
    builder.lineTo(width - 6, 0.5 * height - 2);
    builder.lineTo(width - 6, 0.5 * height + 2);
    builder.lineTo(width - 19, 0.5 * height + 2);
    builder.close();
    builder.fill();
    builder.setStrokeWidth(1);
    builder.begin();
    builder.moveTo(width - 44, 0.5 * height - 2.5);
    builder.lineTo(width - 36, 0.5 * height + 2.5);
    builder.lineTo(width - 40, 0.5 * height + 5);
    builder.lineTo(width - 40, 0.5 * height - 5);
    builder.lineTo(width - 36, 0.5 * height - 2.5);
    builder.lineTo(width - 44, 0.5 * height + 2.5);
    builder.stroke();
    builder.begin();
    builder.moveTo(width - 20, 0.5 * height - 3);
    builder.lineTo(width - 5, 0.5 * height - 3);
    builder.lineTo(width - 5, 0.5 * height - 1);
    builder.lineTo(width - 3.5, 0.5 * height - 1);
    builder.lineTo(width - 3.5, 0.5 * height + 1);
    builder.lineTo(width - 5, 0.5 * height + 1);
    builder.lineTo(width - 5, 0.5 * height + 3);
    builder.lineTo(width - 20, 0.5 * height + 3);
    builder.close();
    builder.stroke();
  }
}
