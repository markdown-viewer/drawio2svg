// @ts-nocheck
import type { RenderContext, ShapeAttrs } from '../../../renderer.ts';
import { BaseShapeHandler } from '../../shape-registry.ts';

export class IosIAppBarHandler extends BaseShapeHandler {
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
    builder.setGradient('#eeeeee', '#999999', 0, 0, width, height, 'south', 1, 1);
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
    builder.setFillColor('#0099ff' as string);
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
    builder.setFillColor('#999999' as string);
    builder.ellipse(width - 56.5, 0.5 * height - 4, 8, 8);
    builder.fill();
    builder.setStrokeColor('#cccccc' as string);
    builder.begin();
    builder.moveTo(width - 52.5, 0.5 * height - 3);
    builder.lineTo(width - 52.5, 0.5 * height);
    builder.lineTo(width - 54.5, 0.5 * height);
    builder.stroke();
    builder.setStrokeWidth(0.5);
    builder.setStrokeColor('#333333' as string);
    builder.setFillColor('#990000' as string);
    builder.begin();
    builder.moveTo(width - 45.5, 0.5 * height);
    builder.lineTo(width - 37.5, 0.5 * height - 5);
    builder.lineTo(width - 41.5, 0.5 * height + 4);
    builder.lineTo(width - 42, 0.5 * height + 0.5);
    builder.close();
    builder.fillAndStroke();
    builder.setFillColor('#999999' as string);
    builder.setStrokeColor('#999999' as string);
    builder.begin();
    builder.moveTo(width - 28.5, 0.5 * height + 3.5);
    builder.arcTo(3.5, 3.5, 0, 1, 1, width - 26.5, 0.5 * height + 1);
    builder.stroke();
    builder.begin();
    builder.moveTo(width - 27.25, 0.5 * height + 0.25);
    builder.lineTo(width - 25.75, 0.5 * height + 0.25);
    builder.lineTo(width - 26.5, 0.5 * height + 1.5);
    builder.close();
    builder.fillAndStroke();
    builder.begin();
    builder.moveTo(width - 31, 0.5 * height - 0.5);
    builder.arcTo(1, 1.5, 0, 0, 1, width - 29, 0.5 * height - 0.5);
    builder.stroke();
    builder.rect(width - 31.5, 0.5 * height - 0.5, 3, 2);
    builder.fillAndStroke();
    builder.setGradient('#eeeeee', '#444444', width - 20, 0.5 * height - 3, 16.5, 6, 'north', 1, 1);
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
    builder.fill();
    builder.setGradient('#E2FFEB', '#008215', width - 20, 0.5 * height - 3, 10, 6, 'south', 1, 1);
    builder.begin();
    builder.moveTo(width - 20, 0.5 * height - 3);
    builder.lineTo(width - 10, 0.5 * height - 3);
    builder.lineTo(width - 10, 0.5 * height + 3);
    builder.lineTo(width - 20, 0.5 * height + 3);
    builder.close();
    builder.fill();
    builder.setStrokeColor('#666666' as string);
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
