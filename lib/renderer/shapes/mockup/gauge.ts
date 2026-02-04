// @ts-nocheck
import type { RenderContext, ShapeAttrs } from '../../../renderer.ts';
import { BaseShapeHandler } from '../../shape-registry.ts';

export class MockupGraphicsGaugeHandler extends BaseShapeHandler {
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
    this.renderBackground(builder, 0, 0, width, height, style, getStencilShape, renderStencilShape);
    builder.setShadow(!1);
    this.renderForeground(builder, 0, 0, width, height, style, getStencilShape, renderStencilShape);
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
    builder.ellipse(0, 0, width, height);
    builder.fillAndStroke();
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
    let f;
    let g;
    let h;
    let k;
    let l;
    b = this.getStyleNumber(style, 'gaugePos', 0);
    c = decodeURIComponent(
      this.getStyleValue(style, 'scaleColors', '#888888,#aaaaaa,#444444').toString()
    ).split(',');
    f = this.getStyleValue(style, 'gaugeLabels', 'CPU[%],0,100').toString().split(',');
    g = this.getStyleValue(style, 'needleColor', '#008cff');
    h = this.getStyleValue(style, 'fillColor', '#ffffff');
    k = this.getStyleValue(style, 'textColor', '#666666');
    l = this.getStyleValue(style, 'textSize', '12');
    b = Math.max(0, b);
    b = Math.min(100, b);
    builder.setFillColor(c[1] as string);
    builder.begin();
    builder.moveTo(0.05 * width, 0.5 * height);
    builder.arcTo(0.4 * width, 0.4 * height, 0, 0, 1, 0.95 * width, 0.5 * height);
    builder.lineTo(width, 0.5 * height);
    builder.arcTo(0.5 * width, 0.5 * height, 0, 0, 0, 0, 0.5 * height);
    builder.close();
    builder.fill();
    builder.setFillColor(c[0] as string);
    builder.begin();
    builder.moveTo(0.05 * width, 0.5 * height);
    builder.arcTo(0.45 * width, 0.45 * height, 0, 0, 0, 0.182 * width, 0.818 * height);
    builder.lineTo(0.146 * width, 0.854 * height);
    builder.arcTo(0.5 * width, 0.5 * height, 0, 0, 1, 0, 0.5 * height);
    builder.close();
    builder.fill();
    builder.setFillColor(c[2] as string);
    builder.begin();
    builder.moveTo(width, 0.5 * height);
    builder.arcTo(0.5 * width, 0.5 * height, 0, 0, 1, 0.854 * width, 0.854 * height);
    builder.lineTo(0.818 * width, 0.818 * height);
    builder.arcTo(0.45 * width, 0.45 * height, 0, 0, 0, 0.95 * width, 0.5 * height);
    builder.close();
    builder.fill();
    builder.setFontSize(Number.parseFloat(String(l)) || 0);
    builder.setFontColor(k as string);
    builder.text(0.5 * width, 0.3 * height, 0, 0, f[0], 'center', 'middle', 0, 0, 0);
    builder.text(0.2 * width, 0.85 * height, 0, 0, f[1], 'left', 'middle', 0, 0, 0);
    builder.text(0.8 * width, 0.85 * height, 0, 0, f[2], 'right', 'middle', 0, 0, 0);
    b = 0.75 * ((2 * Math.PI * parseFloat(b)) / 100) + 1.25 * Math.PI;
    c = 0.5 * width + 0.38 * width * Math.sin(b);
    f = 0.5 * height - 0.38 * height * Math.cos(b);
    builder.setFillColor(g as string);
    builder.begin();
    builder.moveTo(c, f);
    c = 0.5 * width + 0.05 * width * Math.cos(b);
    f = 0.5 * height + 0.05 * height * Math.sin(b);
    builder.lineTo(c, f);
    g = 0.5 * width + -0.05 * width * Math.sin(b);
    c = 0.5 * height - -0.05 * height * Math.cos(b);
    builder.arcTo(0.05 * width, 0.05 * height, 0, 0, 1, g, c);
    g = 0.5 * width - 0.05 * width * Math.cos(b);
    c = 0.5 * height - 0.05 * height * Math.sin(b);
    builder.arcTo(0.05 * width, 0.05 * height, 0, 0, 1, g, c);
    builder.close();
    builder.fill();
    builder.setFillColor(h as string);
    builder.begin();
    builder.moveTo(0.49 * width, 0.49 * height);
    builder.lineTo(0.51 * width, 0.49 * height);
    builder.lineTo(0.51 * width, 0.51 * height);
    builder.lineTo(0.49 * width, 0.51 * height);
    builder.close();
    builder.fill();
    builder.begin();
    builder.ellipse(0, 0, width, height);
    builder.stroke();
    builder.begin();
    builder.moveTo(0.146 * width, 0.854 * height);
    builder.lineTo(0.219 * width, 0.781 * height);
    builder.moveTo(0.854 * width, 0.854 * height);
    builder.lineTo(0.781 * width, 0.781 * height);
    builder.stroke();
  }
}
