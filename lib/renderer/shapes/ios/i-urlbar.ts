// @ts-nocheck
import type { RenderContext, ShapeAttrs } from '../../../renderer.ts';
import { BaseShapeHandler } from '../../shape-registry.ts';

export class IosIURLBarHandler extends BaseShapeHandler {
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
    builder.setGradient('#cccccc', '#003377', 0, 0, width, height, 'south', 1, 1);
    builder.rect(0, 0, width, height);
    builder.fill();
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
    builder.setFillColor('#ffffff' as string);
    builder.setStrokeColor('#008cff' as string);
    builder.roundrect(0.0287 * width, 0.625 * height - 6.25, 0.7184 * width, 12.5, 6.25, 6.25);
    builder.fillAndStroke();
    builder.setGradient(
      '#cccccc',
      '#001144',
      0.7816 * width,
      0.625 * height - 6.25,
      0.1868 * width,
      12.5,
      'south',
      1,
      1
    );
    builder.setStrokeColor('#000000' as string);
    builder.roundrect(0.7816 * width, 0.625 * height - 6.25, 0.1868 * width, 12.5, 2.5, 2.5);
    builder.fillAndStroke();
    builder.setFillColor('#bbbbbb' as string);
    builder.ellipse(0.7471 * width - 11.5, 0.625 * height - 5, 10, 10);
    builder.fill();
    builder.setStrokeColor('#ffffff' as string);
    builder.setStrokeWidth(1.5);
    builder.begin();
    builder.moveTo(0.7471 * width - 8.5, 0.625 * height - 2.5);
    builder.lineTo(0.7471 * width - 3.5, 0.625 * height + 2.5);
    builder.moveTo(0.7471 * width - 8.5, 0.625 * height + 2.5);
    builder.lineTo(0.7471 * width - 3.5, 0.625 * height - 2.5);
    builder.stroke();
    b = decodeURIComponent(this.getStyleValue(style, 'buttonText', '').toString()).split(',');
    builder.setFontColor('#425664' as string);
    builder.setFontStyle(1);
    builder.setFontSize(Number.parseFloat(String(8)) || 0);
    builder.text(0.5 * width, 0.2 * height, 0, 0, b[0], 'center', 'middle', 0, 0, 0);
    builder.setFontColor('#000000' as string);
    builder.text(0.06 * width, 0.625 * height, 0, 0, b[1], 'left', 'middle', 0, 0, 0);
    builder.setFontColor('#ffffff' as string);
    builder.text(0.875 * width, 0.625 * height, 0, 0, b[2], 'center', 'middle', 0, 0, 0);
  }
}
