// @ts-nocheck
import type { RenderContext, ShapeAttrs } from '../../../renderer.ts';
import { BaseShapeHandler } from '../../shape-registry.ts';

export class IosIDownloadBarHandler extends BaseShapeHandler {
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
    builder.setGradient('#00ccff', '#0066cc', 0, 0, width, height, 'south', 1, 1);
    builder.rect(0, 0, width, height);
    builder.fill();
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
    let c;
    b = decodeURIComponent(this.getStyleValue(style, 'buttonText', ''));
    builder.setFontColor('#ffffff' as string);
    builder.setFontStyle(1);
    builder.setFontSize(Number.parseFloat(String(8)) || 0);
    builder.text(0.5 * width, 0.2 * height, 0, 0, b, 'center', 'middle', 0, 0, 0);
    c = this.getStyleNumber(style, 'barPos', 80);
    c = Math.min(c, 100);
    c = Math.max(c, 0);
    b = 0.1 * width;
    c = b + ((width - 2 * b) * c) / 100;
    builder.setStrokeWidth(0.5);
    builder.setGradient(
      '#96D1FF',
      '#003377',
      b,
      0.65 * height - 2.5,
      width - 2 * b,
      5,
      'north',
      1,
      1
    );
    builder.roundrect(b, 0.65 * height - 2.5, width - 2 * b, 5, 2.5, 2.5);
    builder.fill();
    builder.setGradient(
      '#aaaaaa',
      '#ffffff',
      b + 2.5,
      0.65 * height - 2.5,
      c - b - 2.5,
      5,
      'north',
      1,
      1
    );
    builder.begin();
    builder.moveTo(c, 0.65 * height - 2.5);
    builder.arcTo(2.5, 2.5, 0, 0, 1, c, 0.65 * height + 2.5);
    builder.lineTo(b + 2.5, 0.65 * height + 2.5);
    builder.arcTo(2.5, 2.5, 0, 0, 1, b + 2.5, 0.65 * height - 2.5);
    builder.close();
    builder.fill();
  }
}
