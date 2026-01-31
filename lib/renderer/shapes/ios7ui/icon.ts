// @ts-nocheck
import type { RenderContext, ShapeAttrs } from '../../../renderer.ts';
import { BaseShapeHandler } from '../../shape-registry.ts';

export class Ios7uiIconHandler extends BaseShapeHandler {
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
    this.renderForeground(builder, 0, 0, width, height, style, getStencilSvg, renderStencilShape);
    builder.restore();
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
    let b;
    builder.setGradient(
      '#00D0F0',
      '#0080F0',
      0.325 * width,
      0,
      0.675 * width,
      0.5 * height,
      'south',
      1,
      1
    );
    builder.roundrect(0, 0, width, height, 0.1 * width, 0.1 * height);
    builder.fill();
    b = this.getStyleValue(style, 'buttonText', '');
    builder.setFontColor('#ffffff' as string);
    builder.setFontStyle(1);
    builder.setFontSize(Number.parseFloat(String(8)) || 0);
    builder.text(0.5 * width, 0.5 * height, 0, 0, b, 'center', 'middle', 0, 0, 0);
  }
}
