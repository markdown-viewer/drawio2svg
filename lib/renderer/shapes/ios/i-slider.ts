// @ts-nocheck
import type { RenderContext, ShapeAttrs } from '../../../renderer.ts';
import { BaseShapeHandler } from '../../shape-registry.ts';

export class IosISliderHandler extends BaseShapeHandler {
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
    builder.setShadow(!1);
    this.renderForeground(builder, 0, 0, width, height, style, getStencilShape, renderStencilShape);
    builder.restore();
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
    let b;
    builder.setStrokeWidth(0.5);
    builder.setGradient('#444444', '#ffffff', 0, 0.5 * height - 2.5, width, 5, 'south', 1, 1);
    builder.roundrect(0, 0.5 * height - 2.5, width, 5, 2.5, 2.5);
    builder.fill();
    b = this.getStyleNumber(style, 'barPos', 80);
    b = Math.min(b, 100);
    b = Math.max(b, 0);
    width = ((width - 0) * b) / 100;
    builder.setGradient(
      '#96D1FF',
      '#003377',
      2.5,
      0.5 * height - 2.5,
      width - 2.5,
      5,
      'south',
      1,
      1
    );
    builder.begin();
    builder.moveTo(width, 0.5 * height - 2.5);
    builder.lineTo(width, 0.5 * height + 2.5);
    builder.lineTo(2.5, 0.5 * height + 2.5);
    builder.arcTo(2.5, 2.5, 0, 0, 1, 2.5, 0.5 * height - 2.5);
    builder.close();
    builder.fill();
    builder.setStrokeColor('#999999' as string);
    builder.setGradient('#444444', '#ffffff', width - 5, 0.5 * height - 5, 10, 10, 'north', 1, 1);
    builder.ellipse(width - 5, 0.5 * height - 5, 10, 10);
    builder.fillAndStroke();
  }
}
