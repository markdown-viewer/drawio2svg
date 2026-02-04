// @ts-nocheck
import type { RenderContext, ShapeAttrs } from '../../../renderer.ts';
import { BaseShapeHandler } from '../../shape-registry.ts';

export class AndroidStatusBarHandler extends BaseShapeHandler {
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
    getStencilShape?: RenderContext['getStencilShape'],
    renderStencilShape?: RenderContext['renderStencilShape']
  ): void {
    if (!builder) return;
    builder.rect(0, 0, width, height);
    builder.fill();
    builder.setFontColor(this.getStyleValue(style, 'fontColor', '#222222') as string);
    builder.setFontSize(Number.parseFloat(String(this.getStyleValue(style, 'fontSize', '5'))) || 0);
    builder.text(width - 30, 0.5 * height + 1, 0, 0, '12:00', 'left', 'middle', 0, 0, 0);
    builder.setFillColor('#444444' as string);
    builder.begin();
    builder.moveTo(width - 37, 0.5 * height + 6);
    builder.lineTo(width - 37, 0.5 * height - 5);
    builder.lineTo(width - 36, 0.5 * height - 5);
    builder.lineTo(width - 36, 0.5 * height - 6);
    builder.lineTo(width - 32, 0.5 * height - 6);
    builder.lineTo(width - 32, 0.5 * height - 5);
    builder.lineTo(width - 31, 0.5 * height - 5);
    builder.lineTo(width - 31, 0.5 * height + 6);
    builder.close();
    builder.fill();
    builder.setFillColor(this.getStyleValue(style, 'strokeColor', 'none') as string);
    builder.ellipse(width - 56, 0.5 * height + 2, 2, 2);
    builder.fillAndStroke();
    builder.setStrokeWidth(2);
    builder.begin();
    builder.moveTo(width - 52, 0.5 * height + 1);
    builder.arcTo(3.5, 3.5, 0, 0, 0, width - 58, 0.5 * height + 1);
    builder.stroke();
    builder.begin();
    builder.moveTo(width - 50, 0.5 * height - 1);
    builder.arcTo(6, 6, 0, 0, 0, width - 60, 0.5 * height - 1);
    builder.stroke();
    builder.setStrokeWidth(1);
    builder.rect(width - 51, 0.5 * height + 5, 2, 1);
    builder.fill();
    builder.rect(width - 48, 0.5 * height + 2, 2, 4);
    builder.fill();
    builder.rect(width - 45, 0.5 * height - 1, 2, 7);
    builder.fill();
    builder.rect(width - 42, 0.5 * height - 4, 2, 10);
    builder.fill();
    builder.rect(width - 37, 0.5 * height - 2, 6, 8);
    builder.fill();
  }
}
