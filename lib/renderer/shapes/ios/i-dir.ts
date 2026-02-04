// @ts-nocheck
import type { RenderContext, ShapeAttrs } from '../../../renderer.ts';
import { BaseShapeHandler } from '../../shape-registry.ts';

export class IosIDirHandler extends BaseShapeHandler {
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
    builder.setStrokeWidth(0.5);
    builder.setStrokeColor('#008cff' as string);
    builder.ellipse(0, 0, width, height);
    builder.stroke();
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
    builder.setAlpha(1);
    builder.setGradient(
      '#ffffff',
      '#ffffff',
      0.29 * width,
      0.2 * height,
      0.42 * width,
      0.3 * height,
      'north',
      1,
      0
    );
    builder.begin();
    builder.moveTo(0.29 * width, 0.2 * height);
    builder.lineTo(0.5 * width, 0.5 * height);
    builder.lineTo(0.71 * width, 0.2 * height);
    builder.fillAndStroke();
    builder.setStrokeColor('#006cdf' as string);
    builder.setGradient(
      '#ffffff',
      '#007cef',
      0.47 * width,
      0.47 * height,
      0.06 * width,
      0.06 * height,
      'south',
      1,
      1
    );
    builder.setAlpha(1);
    builder.ellipse(0.47 * width, 0.47 * height, 0.06 * width, 0.06 * height);
    builder.fillAndStroke();
    builder.setFillColor('#ffffff' as string);
    builder.setAlpha(0.8);
    builder.ellipse(0.4825 * width, 0.4825 * height, 0.015 * width, 0.015 * height);
    builder.fill();
  }
}
