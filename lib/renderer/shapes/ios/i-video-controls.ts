// @ts-nocheck
import type { RenderContext, ShapeAttrs } from '../../../renderer.ts';
import { BaseShapeHandler } from '../../shape-registry.ts';

export class IosIVideoControlsHandler extends BaseShapeHandler {
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
    builder.setStrokeWidth(1);
    builder.setFillColor('#000000' as string);
    builder.setStrokeColor('#bbbbbb' as string);
    builder.setAlpha(0.7);
    builder.roundrect(0, 0, width, height, 5, 5);
    builder.fillAndStroke();
    builder.setShadow(!1);
    this.renderForeground(
      builder,
      0,
      0,
      width,
      height,
      style,
      getStencilSvg,
      renderStencilShape,
      5
    );
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
    renderStencilShape?: RenderContext['renderStencilShape'],
    extra1?: any
  ): void {
    if (!builder) return;
    let c;
    let f;
    builder.setGradient('#ffffff', '#ffffff', 0, 0, width, 0.5 * height, 'south', 0.8, 0.1);
    builder.begin();
    builder.moveTo(0, extra1);
    builder.arcTo(extra1, extra1, 0, 0, 1, extra1, 0);
    builder.lineTo(width - extra1, 0);
    builder.arcTo(extra1, extra1, 0, 0, 1, width, extra1);
    builder.lineTo(width, 0.5 * height);
    builder.lineTo(0, 0.5 * height);
    builder.close();
    builder.fill();
    builder.setAlpha(1);
    builder.setFillColor('#ffffff' as string);
    builder.setStrokeColor('#ffffff' as string);
    c = 0.1 * width;
    f = 0.35 * height;
    builder.begin();
    builder.moveTo(c - 7.5, f - 2.5);
    builder.arcTo(6, 6, 0, 0, 1, c, f - 2.5);
    builder.arcTo(6, 6, 0, 0, 1, c + 7.5, f - 2.5);
    builder.lineTo(c + 7.5, f + 4);
    builder.arcTo(6, 6, 0, 0, 0, c, f + 4);
    builder.arcTo(6, 6, 0, 0, 0, c - 7.5, f + 4);
    builder.close();
    builder.stroke();
    builder.begin();
    builder.moveTo(c, f - 2.5);
    builder.lineTo(c, f + 4);
    builder.stroke();
    c = 0.3 * width;
    builder.rect(c - 7.5, f - 5, 1, 10);
    builder.fill();
    builder.begin();
    builder.moveTo(c - 6.5, f);
    builder.lineTo(c + 0.5, f - 5);
    builder.lineTo(c + 0.5, f + 5);
    builder.close();
    builder.fill();
    builder.begin();
    builder.moveTo(c + 0.5, f);
    builder.lineTo(c + 7.5, f - 5);
    builder.lineTo(c + 7.5, f + 5);
    builder.close();
    builder.fill();
    c = 0.5 * width;
    builder.begin();
    builder.moveTo(c - 6, f - 5);
    builder.lineTo(c + 6, f);
    builder.lineTo(c - 6, f + 5);
    builder.close();
    builder.fill();
    c = 0.7 * width;
    builder.begin();
    builder.moveTo(c - 7.5, f - 5);
    builder.lineTo(c - 0.5, f);
    builder.lineTo(c - 7.5, f + 5);
    builder.close();
    builder.fill();
    builder.begin();
    builder.moveTo(c - 0.5, f - 5);
    builder.lineTo(c + 6.5, f);
    builder.lineTo(c - 0.5, f + 5);
    builder.close();
    builder.fill();
    builder.rect(c + 6.5, f - 5, 1, 10);
    builder.fill();
    c = 0.9 * width;
    builder.rect(c - 7.5, f - 4, 15, 8);
    builder.stroke();
    builder.setStrokeWidth(0.5);
    builder.begin();
    builder.moveTo(c - 7.5, f - 4);
    builder.lineTo(c, f + 1.5);
    builder.lineTo(c + 7.5, f - 4);
    builder.stroke();
    builder.begin();
    builder.moveTo(c - 7.5, f + 4);
    builder.lineTo(c - 2, f);
    builder.stroke();
    builder.begin();
    builder.moveTo(c + 7.5, f + 4);
    builder.lineTo(c + 2, f);
    builder.stroke();
    builder.setGradient(
      '#444444',
      '#ffffff',
      0.1 * width,
      0.75 * height - 2.5,
      0.8 * width,
      5,
      'south',
      1,
      1
    );
    builder.roundrect(0.1 * width, 0.75 * height - 2.5, 0.8 * width, 5, 2.5, 2.5);
    builder.fill();
    c = this.getStyleNumber(style, 'barPos', 80);
    c = Math.min(c, 100);
    c = Math.max(c, 0);
    f = 0.1 * width;
    c = f + ((width - 2 * f) * c) / 100;
    builder.setGradient(
      '#96D1FF',
      '#003377',
      0.1 * width,
      0.75 * height - 5,
      c - 0.1 * width,
      10,
      'south',
      1,
      1
    );
    builder.begin();
    builder.moveTo(c, 0.75 * height - 2.5);
    builder.lineTo(c, 0.75 * height + 2.5);
    builder.lineTo(0.1 * width + 2.5, 0.75 * height + 2.5);
    builder.arcTo(2.5, 2.5, 0, 0, 1, 0.1 * width + 2.5, 0.75 * height - 2.5);
    builder.close();
    builder.fill();
    builder.setStrokeColor('#999999' as string);
    builder.setGradient('#444444', '#ffffff', c - 5, 0.75 * height - 5, 10, 10, 'north', 1, 1);
    builder.ellipse(c - 5, 0.75 * height - 5, 10, 10);
    builder.fillAndStroke();
    builder.setStrokeColor('#dddddd' as string);
    builder.roundrect(0, 0, width, height, extra1, extra1);
    builder.stroke();
  }
}
