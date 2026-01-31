// @ts-nocheck
import type { RenderContext, ShapeAttrs } from '../../../renderer.ts';
import { BaseShapeHandler } from '../../shape-registry.ts';

export class ErIeHandler extends BaseShapeHandler {
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
    let b = width;
    let c = height;
    const f = this.getStyleValue(style, 'textColor', '#666666');
    const g = this.getStyleValue(style, 'fontSize', '17');

    builder.translate(x, y);
    b = Math.max(b, c / 1.5);
    c = Math.max(c, 5 * g);
    this.renderBackground(builder, x, y, b, c, style, getStencilSvg, renderStencilShape);
    builder.setShadow(!1);
    this.renderForeground(builder, x, y, b, c, style, getStencilSvg, renderStencilShape, g, f);
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
    builder.begin();
    builder.moveTo(0, 0);
    builder.lineTo(width, 0);
    builder.lineTo(width, height);
    builder.lineTo(0, height);
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
    getStencilSvg?: RenderContext['getStencilSvg'],
    renderStencilShape?: RenderContext['renderStencilShape'],
    extra1?: any,
    extra2?: any
  ): void {
    if (!builder) return;
    builder.begin();
    builder.moveTo(0, 0.2 * height);
    builder.lineTo(width, 0.2 * height);
    builder.moveTo(0, 0.4 * height);
    builder.lineTo(width, 0.4 * height);
    builder.moveTo(0, 0.6 * height);
    builder.lineTo(width, 0.6 * height);
    builder.moveTo(0, 0.8 * height);
    builder.lineTo(width, 0.8 * height);
    builder.moveTo(0.5 * width, 0.2 * height);
    builder.lineTo(0.5 * width, height);
    builder.stroke();
    builder.begin();
    builder.setFontSize(Number.parseFloat(String(extra1)) || 0);
    builder.setFontColor(extra2 as string);
    builder.text(
      0.5 * width,
      0.1 * height,
      0,
      0,
      'ERD Information Engineering Notation',
      'center',
      'middle',
      0,
      0,
      0
    );
    builder.setFontSize(Number.parseFloat(String(0.85 * extra1)) || 0);
    builder.text(0.52 * width, 0.3 * height, 0, 0, 'Zero or one', 'left', 'middle', 0, 0, 0);
    builder.text(0.52 * width, 0.5 * height, 0, 0, 'One only', 'left', 'middle', 0, 0, 0);
    builder.text(0.52 * width, 0.7 * height, 0, 0, 'Zero or more', 'left', 'middle', 0, 0, 0);
    builder.text(0.52 * width, 0.9 * height, 0, 0, 'One or more', 'left', 'middle', 0, 0, 0);
    x = height / 12;
    builder.begin();
    builder.moveTo(0.04 * width, 0.3 * height);
    builder.lineTo(0.46 * width, 0.3 * height);
    builder.moveTo(0.46 * width - x, 0.25 * height);
    builder.lineTo(0.46 * width - x, 0.35 * height);
    builder.moveTo(0.04 * width, 0.5 * height);
    builder.lineTo(0.46 * width, 0.5 * height);
    builder.moveTo(0.46 * width - 2 * x, 0.45 * height);
    builder.lineTo(0.46 * width - 2 * x, 0.55 * height);
    builder.moveTo(0.46 * width - 2.5 * x, 0.45 * height);
    builder.lineTo(0.46 * width - 2.5 * x, 0.55 * height);
    builder.moveTo(0.04 * width, 0.7 * height);
    builder.lineTo(0.46 * width, 0.7 * height);
    builder.moveTo(0.46 * width, 0.65 * height);
    builder.lineTo(0.46 * width - 2 * x, 0.7 * height);
    builder.lineTo(0.46 * width, 0.75 * height);
    builder.stroke();
    builder.moveTo(0.04 * width, 0.9 * height);
    builder.lineTo(0.46 * width, 0.9 * height);
    builder.moveTo(0.46 * width, 0.85 * height);
    builder.lineTo(0.46 * width - 2 * x, 0.9 * height);
    builder.lineTo(0.46 * width, 0.95 * height);
    builder.moveTo(0.46 * width - 2.5 * x, 0.85 * height);
    builder.lineTo(0.46 * width - 2.5 * x, 0.95 * height);
    builder.stroke();
    builder.begin();
    builder.ellipse(0.46 * width - 3 * x, 0.3 * height - 0.5 * x, x, x);
    builder.fillAndStroke();
    builder.begin();
    builder.ellipse(0.46 * width - 3 * x, 0.7 * height - 0.5 * x, x, x);
    builder.fillAndStroke();
  }
}
