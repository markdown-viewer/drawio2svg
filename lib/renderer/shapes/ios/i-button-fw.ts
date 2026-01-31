// @ts-nocheck
import type { RenderContext, ShapeAttrs } from '../../../renderer.ts';
import { BaseShapeHandler } from '../../shape-registry.ts';

export class IosIButtonFwHandler extends BaseShapeHandler {
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

    let f;
    let g;
    let h;
    f = decodeURIComponent(this.getStyleValue(style, 'buttonText', 'Main Text'));
    g = this.getStyleValue(style, 'textColor2', '#666666').toString();
    h = this.getStyleValue(style, 'fontSize', '17').toString();
    builder.translate(x, y);
    this.renderBackground(builder, x, y, width, height, style, getStencilSvg, renderStencilShape);
    builder.setShadow(!1);
    this.render_mainText(builder, x, y, width, height, f, h, g);
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
    x = this.getStyleValue(style, 'fillColor', '').toString();
    y = this.getStyleValue(style, 'fillColor2', '').toString();
    builder.setGradient(x, y, 0, 0, width, height, 'south', 1, 1);
    rSize = 2.5;
    builder.begin();
    builder.moveTo(0, rSize);
    builder.arcTo(rSize, rSize, 0, 0, 1, rSize, 0);
    builder.lineTo(width - 10, 0);
    builder.lineTo(width - 0.87, 0.5 * height - 0.75);
    builder.arcTo(rSize, rSize, 0, 0, 1, width - 0.87, 0.5 * height + 0.75);
    builder.lineTo(width - 10, height);
    builder.lineTo(rSize, height);
    builder.arcTo(rSize, rSize, 0, 0, 1, 0, height - rSize);
    builder.close();
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
    builder.text(0.5 * p3 - 2.5, 0.5 * p4, 0, 0, p5, 'center', 'middle', 0, 0, 0);
  }
}
