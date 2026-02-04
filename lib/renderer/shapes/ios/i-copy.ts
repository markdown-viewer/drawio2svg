// @ts-nocheck
import type { RenderContext, ShapeAttrs } from '../../../renderer.ts';
import { BaseShapeHandler } from '../../shape-registry.ts';

export class IosICopyHandler extends BaseShapeHandler {
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
    this.renderBackground(
      builder,
      0,
      0,
      width,
      height,
      style,
      getStencilShape,
      renderStencilShape,
      5
    );
    builder.setShadow(!1);
    this.renderForeground(
      builder,
      0,
      0,
      width,
      height,
      style,
      getStencilShape,
      renderStencilShape,
      5
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
    renderStencilShape?: RenderContext['renderStencilShape'],
    extra1?: any
  ): void {
    if (!builder) return;
    builder.begin();
    builder.moveTo(0, extra1);
    builder.arcTo(extra1, extra1, 0, 0, 1, extra1, 0);
    builder.lineTo(width - extra1, 0);
    builder.arcTo(extra1, extra1, 0, 0, 1, width, extra1);
    builder.lineTo(width, height - extra1 - 7.5);
    builder.arcTo(extra1, extra1, 0, 0, 1, width - extra1, height - 7.5);
    builder.lineTo(0.5 * width + 7.5, height - 7.5);
    builder.lineTo(0.5 * width, height);
    builder.lineTo(0.5 * width - 7.5, height - 7.5);
    builder.lineTo(extra1, height - 7.5);
    builder.arcTo(extra1, extra1, 0, 0, 1, 0, height - extra1 - 7.5);
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
    renderStencilShape?: RenderContext['renderStencilShape'],
    extra1?: any
  ): void {
    if (!builder) return;
    let c;
    c = this.getStyleValue(style, 'fillColor3', '#00ff00');
    builder.setGradient(c, c, 0, 0, width, 0.5 * height, 'south', 0.8, 0.1);
    builder.begin();
    builder.moveTo(0, extra1);
    builder.arcTo(extra1, extra1, 0, 0, 1, extra1, 0);
    builder.lineTo(width - extra1, 0);
    builder.arcTo(extra1, extra1, 0, 0, 1, width, extra1);
    builder.lineTo(width, 0.5 * (height - 7.5));
    builder.lineTo(0, 0.5 * (height - 7.5));
    builder.close();
    builder.fill();
    extra1 = decodeURIComponent(this.getStyleValue(style, 'buttonText', ''));
    c = this.getStyleValue(style, 'textColor', '#00ff00');
    builder.setFontColor(c as string);
    builder.setFontSize(Number.parseFloat(String(8.5)) || 0);
    builder.text(0.5 * width, 0.45 * (height - 7.5), 0, 0, extra1, 'center', 'middle', 0, 0, 0);
  }
}
