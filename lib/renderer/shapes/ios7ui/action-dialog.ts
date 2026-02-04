// @ts-nocheck
import type { RenderContext, ShapeAttrs } from '../../../renderer.ts';
import { BaseShapeHandler } from '../../shape-registry.ts';

export class Ios7uiActionDialogHandler extends BaseShapeHandler {
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

    let f;
    let g;
    let h;
    let k;
    f = this.getStyleValue(style, 'mainText', 'Main Text');
    g = this.getStyleValue(style, 'subText', 'Sub Text');
    h = this.getStyleValue(style, 'textColor', '#666666');
    k = this.getStyleValue(style, 'textSize', '17');
    builder.translate(x, y);
    this.renderBackground(builder, x, y, width, height, style, getStencilShape, renderStencilShape);
    builder.setShadow(!1);
    builder.setFillColor('#e0e0e0' as string);
    builder.roundrect(
      0.05 * width,
      0.1 * height,
      0.9 * width,
      0.35 * height,
      0.025 * width,
      0.05 * height
    );
    builder.fill();
    builder.roundrect(
      0.05 * width,
      0.55 * height,
      0.9 * width,
      0.35 * height,
      0.025 * width,
      0.05 * height
    );
    builder.fill();
    builder.setFontStyle(1);
    this.render_mainText(builder, x, y, width, height, f, k, h);
    this.render_subText(builder, x, y, width, height, g, k / 1.4, h);
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
    renderStencilShape?: RenderContext['renderStencilShape']
  ): void {
    if (!builder) return;
    builder.rect(0, 0, width, height);
    builder.fill();
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
    builder.text(0.5 * p3, 0.4 * p4, 0, 0, p5, 'center', 'middle', 0, 0, 0);
  }

  private render_subText(
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
    builder.text(0.5 * p3, 0.7 * p4, 0, 0, p5, 'center', 'middle', 0, 0, 0);
  }
}
