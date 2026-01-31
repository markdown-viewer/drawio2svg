// @ts-nocheck
import type { RenderContext, ShapeAttrs } from '../../../renderer.ts';
import { BaseShapeHandler } from '../../shape-registry.ts';

export class IosITopBarHandler extends BaseShapeHandler {
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
    builder.setAlpha(0.5);
    builder.setFillColor('#999999' as string);
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
    builder.setFillColor('#cccccc' as string);
    builder.setStrokeColor('#cccccc' as string);
    builder.setFontColor('#cccccc' as string);
    builder.setFontSize(Number.parseFloat(String(7.5)) || 0);
    builder.rect(5, 0.5 * height + 1.75, 1.5, 2.5);
    builder.fill();
    builder.rect(7, 0.5 * height + 0.75, 1.5, 3.5);
    builder.fill();
    builder.rect(9, 0.5 * height - 0.25, 1.5, 4.5);
    builder.fill();
    builder.rect(11, 0.5 * height - 1.25, 1.5, 5.5);
    builder.fill();
    builder.rect(13, 0.5 * height - 2.25, 1.5, 6.5);
    builder.fill();
    builder.rect(15, 0.5 * height - 3.25, 1.5, 7.5);
    builder.fill();
    builder.text(18, 0.5 * height, 0, 0, 'CARRIER', 'left', 'middle', 0, 0, 0);
    builder.text(0.5 * width, 0.5 * height, 0, 0, '11:15AM', 'center', 'middle', 0, 0, 0);
    builder.begin();
    builder.moveTo(width - 19, 0.5 * height - 2);
    builder.lineTo(width - 10, 0.5 * height - 2);
    builder.lineTo(width - 10, 0.5 * height + 2);
    builder.lineTo(width - 19, 0.5 * height + 2);
    builder.close();
    builder.fill();
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
