// @ts-nocheck
import type { RenderContext, ShapeAttrs } from '../../../renderer.ts';
import { BaseShapeHandler } from '../../shape-registry.ts';

export class RackGeneralRackCabinet2Handler extends BaseShapeHandler {
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

    let f;
    let g;
    let h;
    let k;
    f = this.getStyleNumber(style, 'unitNum', 12);
    g = this.getStyleNumber(style, 'rackUnitSize', 14.8);
    h = parseFloat(this.getStyleValue(style, 'textSize', '12'));
    k = this.getStyleValue(style, 'numDisp', 'on');
    if (k !== 'off') {
      builder.translate(x + 2 * h, y);
      b -= 2 * h;
    } else {
      builder.translate(x, y);
    }
    c = f * g + 42;
    this.renderBackground(builder, 0, 0, b, c, style, getStencilSvg, renderStencilShape);
    builder.setShadow(!1);
    this.renderForeground(builder, 0, 0, b, c, style, getStencilSvg, renderStencilShape);
    if (k !== 'off') {
      this.render_sideText(builder, c, f, g, h, k);
    }
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
    let b;
    b = this.getStyleValue(style, 'fillColor2', '#ffffff');
    builder.setFillColor(b as string);
    builder.rect(0, 0, width, height);
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
    renderStencilShape?: RenderContext['renderStencilShape']
  ): void {
    if (!builder) return;
    let b;
    b = this.getStyleValue(style, 'fillColor', '#f4f4f4');
    builder.setFillColor(b as string);
    builder.rect(0, 0, width, 21);
    builder.fillAndStroke();
    builder.rect(0, height - 21, width, 21);
    builder.fillAndStroke();
    builder.rect(0, 21, 9, height - 42);
    builder.fillAndStroke();
    builder.rect(width - 9, 21, 9, height - 42);
    builder.fillAndStroke();
    builder.ellipse(2.5, 7.5, 6, 6);
    builder.stroke();
    builder.ellipse(width - 8.5, 7.5, 6, 6);
    builder.stroke();
    builder.ellipse(2.5, height - 13.5, 6, 6);
    builder.stroke();
    builder.ellipse(width - 8.5, height - 13.5, 6, 6);
    builder.stroke();
  }

  private render_sideText(
    builder: RenderContext['builder'],
    p1: any,
    p2: any,
    p3: any,
    p4: any,
    p5: any
  ): void {
    if (!builder) return;
    let g;
    let h;
    g = this.getStyleValue(this.renderCtx.style, 'textColor', '#666666');
    h = this.getStyleNumber(this.renderCtx.style, 'startUnit', 1);
    builder.setFontSize(Number.parseFloat(String(p4)) || 0);
    builder.setFontColor(g as string);
    if (p5 === 'ascend') {
      for (p5 = 0; p5 < p2; p5++) {
        builder.text(
          -p4,
          21 + 0.5 * p3 + p5 * p3,
          0,
          0,
          (p5 + h).toString(),
          'center',
          'middle',
          0,
          0,
          0
        );
      }
    } else if (p5 === 'descend' || p5 === 'dirOn') {
      for (p5 = 0; p5 < p2; p5++) {
        builder.text(
          -p4,
          p1 - 21 - 0.5 * p3 - p5 * p3,
          0,
          0,
          (p5 + h).toString(),
          'center',
          'middle',
          0,
          0,
          0
        );
      }
    }
    builder.setStrokeColor(g as string);
    builder.begin();
    for (p5 = 0; p5 < p2 + 1; p5++) {
      (builder.moveTo(-2 * p4, 21 + p5 * p3), builder.lineTo(0, 21 + p5 * p3));
    }
    builder.stroke();
  }
}
