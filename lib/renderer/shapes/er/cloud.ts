// @ts-nocheck
import type { RenderContext, ShapeAttrs } from '../../../renderer.ts';
import { BaseShapeHandler } from '../../shape-registry.ts';

export class ErCloudHandler extends BaseShapeHandler {
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
    const f = this.getStyleValue(style, 'buttonText', 'Entity');
    const g = this.getStyleValue(style, 'textColor', '#666666');
    const h = this.getStyleValue(style, 'fontSize', '17');

    builder.translate(x, y);
    b = Math.max(b, 20);
    c = Math.max(c, 20);
    this.renderBackground(builder, x, y, b, c, style, getStencilSvg, renderStencilShape, 10, g);
    builder.setShadow(!1);
    this.render_mainText(builder, x, y, b, c, f, h, g);
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
    renderStencilShape?: RenderContext['renderStencilShape'],
    extra1?: any,
    extra2?: any
  ): void {
    if (!builder) return;
    builder.begin();
    builder.moveTo(0.25 * width, 0.25 * height);
    builder.curveTo(0.05 * width, 0.25 * height, 0, 0.5 * height, 0.16 * width, 0.55 * height);
    builder.curveTo(0, 0.66 * height, 0.18 * width, 0.9 * height, 0.31 * width, 0.8 * height);
    builder.curveTo(0.4 * width, height, 0.7 * width, height, 0.8 * width, 0.8 * height);
    builder.curveTo(width, 0.8 * height, width, 0.6 * height, 0.875 * width, 0.5 * height);
    builder.curveTo(width, 0.3 * height, 0.8 * width, 0.1 * height, 0.625 * width, 0.2 * height);
    builder.curveTo(
      0.5 * width,
      0.05 * height,
      0.3 * width,
      0.05 * height,
      0.25 * width,
      0.25 * height
    );
    builder.fillAndStroke();
  }

  private render_mainText(
    builder: RenderContext['builder'],
    p1: any,
    p2: any,
    p3: any,
    p4: any,
    p5: any,
    p6: any,
    p7: any
  ): void {
    if (!builder) return;
    builder.begin();
    builder.setFontSize(Number.parseFloat(String(p6)) || 0);
    builder.setFontColor(p7 as string);
    builder.text(0.5 * p3, 0.5 * p4, 0, 0, p5, 'center', 'middle', 0, 0, 0);
  }
}
