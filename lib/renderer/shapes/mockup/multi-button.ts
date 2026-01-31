// @ts-nocheck
import type { RenderContext, ShapeAttrs } from '../../../renderer.ts';
import { BaseShapeHandler } from '../../shape-registry.ts';

export class MockupButtonsMultiButtonHandler extends BaseShapeHandler {
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
    let k;
    f = this.getStyleValue(style, 'mainText', 'Main Text');
    g = this.getStyleValue(style, 'subText', 'Sub Text');
    h = this.getStyleValue(style, 'textColor', '#666666');
    k = this.getStyleValue(style, 'textSize', '17');
    builder.translate(x, y);
    this.renderBackground(builder, x, y, width, height, style, getStencilSvg, renderStencilShape);
    builder.setShadow(!1);
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
    getStencilSvg?: RenderContext['getStencilSvg'],
    renderStencilShape?: RenderContext['renderStencilShape']
  ): void {
    if (!builder) return;
    x = this.getStyleValue(style, 'buttonStyle', 'round').toString();
    builder.begin();
    if (x === 'round') {
      builder.moveTo(0, 10);
      builder.arcTo(10, 10, 0, 0, 1, 10, 0);
      builder.lineTo(width - 10, 0);
      builder.arcTo(10, 10, 0, 0, 1, width, 10);
      builder.lineTo(width, height - 10);
      builder.arcTo(10, 10, 0, 0, 1, width - 10, height);
      builder.lineTo(10, height);
      builder.arcTo(10, 10, 0, 0, 1, 0, height - 10);
    } else if (x === 'chevron') {
      builder.moveTo(0, 0.1 * height);
      builder.arcTo(0.0372 * width, 0.1111 * height, 0, 0, 1, 0.0334 * width, 0);
      builder.lineTo(0.768 * width, 0);
      builder.arcTo(0.0722 * width, 0.216 * height, 0, 0, 1, 0.8014 * width, 0.0399 * height);
      builder.lineTo(0.99 * width, 0.4585 * height);
      builder.arcTo(0.09 * width, 0.1 * height, 0, 0, 1, 0.99 * width, 0.5415 * height);
      builder.lineTo(0.8014 * width, 0.9568 * height);
      builder.arcTo(0.0722 * width, 0.216 * height, 0, 0, 1, 0.768 * width, height);
      builder.lineTo(0.0334 * width, height);
      builder.arcTo(0.0372 * width, 0.1111 * height, 0, 0, 1, 0, 0.9 * height);
    }
    builder.close();
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
