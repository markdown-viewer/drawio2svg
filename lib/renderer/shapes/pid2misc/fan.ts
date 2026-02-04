// @ts-nocheck
import type { RenderContext, ShapeAttrs } from '../../../renderer.ts';
import { BaseShapeHandler } from '../../shape-registry.ts';

export class Pid2miscFanHandler extends BaseShapeHandler {
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
    builder.ellipse(0, 0, width, height);
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
    builder.begin();
    builder.moveTo(0.3 * width, 0.045 * height);
    builder.lineTo(0.97 * width, 0.33 * height);
    builder.moveTo(0.3 * width, 0.955 * height);
    builder.lineTo(0.97 * width, 0.67 * height);
    builder.moveTo(0.4228 * width, 0.3655 * height);
    builder.arcTo(0.15 * width, 0.03 * height, 50, 0, 1, 0.5 * width, 0.5 * height);
    builder.arcTo(0.15 * width, 0.03 * height, 50, 0, 1, 0.3772 * width, 0.4045 * height);
    builder.arcTo(0.15 * width, 0.03 * height, 50, 0, 1, 0.3025 * width, 0.271 * height);
    builder.arcTo(0.15 * width, 0.03 * height, 50, 0, 1, 0.4228 * width, 0.3655 * height);
    builder.close();
    builder.moveTo(0.377 * width, 0.5973 * height);
    builder.arcTo(0.15 * width, 0.03 * height, -50, 0, 1, 0.4966 * width, 0.5019 * height);
    builder.arcTo(0.15 * width, 0.03 * height, -50, 0, 1, 0.423 * width, 0.636 * height);
    builder.arcTo(0.15 * width, 0.03 * height, -50, 0, 1, 0.3034 * width, 0.7314 * height);
    builder.arcTo(0.15 * width, 0.03 * height, -50, 0, 1, 0.377 * width, 0.5973 * height);
    builder.close();
    builder.stroke();
    builder.ellipse(0.5 * width, 0.47 * height, 0.3 * width, 0.06 * height);
    builder.stroke();
    x = this.getStyleValue(style, 'fanType', 'common');
    if (x === 'axial') {
      builder.begin();
      builder.moveTo(0.1 * width, 0.5 * height);
      builder.lineTo(0.3 * width, 0.5 * height);
      builder.stroke();
    } else if (x === 'radial') {
      builder.begin();
      builder.moveTo(0.2 * width, 0.4 * height);
      builder.lineTo(0.2 * width, 0.6 * height);
      builder.stroke();
    }
  }
}
