// @ts-nocheck
import type { RenderContext, ShapeAttrs } from '../../../renderer.ts';
import { BaseShapeHandler } from '../../shape-registry.ts';

export class IosICloudProgressBarHandler extends BaseShapeHandler {
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
    builder.setShadow(!1);
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
    builder.setStrokeWidth(0.5);
    builder.setFillColor('#5C6E86' as string);
    builder.rect(0, 0.5 * height - 2.5, width, 5);
    builder.fill();
    b = this.getStyleNumber(style, 'barPos', 80);
    b = Math.min(b, 100);
    b = Math.max(b, 0);
    width = ((width - 0) * b) / 100;
    builder.setFillColor('#8AD155' as string);
    builder.rect(0, 0.5 * height - 2.5, width, 5);
    builder.fill();
  }
}
