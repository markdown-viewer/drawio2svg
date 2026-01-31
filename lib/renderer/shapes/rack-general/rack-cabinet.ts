// @ts-nocheck
import type { RenderContext, ShapeAttrs } from '../../../renderer.ts';
import { BaseShapeHandler } from '../../shape-registry.ts';

export class RackGeneralRackCabinetHandler extends BaseShapeHandler {
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
    b = this.getStyleNumber(style, 'unitNum', 12);
    f = this.getStyleNumber(style, 'unitHeight', 14.8);
    g = parseFloat(this.getStyleValue(style, 'textSize', '12'));
    h = this.getStyleValue(style, 'numDisp', 'on');
    if (h !== 'off') {
      builder.translate(x + 2 * g, y);
    } else {
      builder.translate(x, y);
    }
    c = b * f + 42;
    this.renderBackground(builder, 0, 0, c, height, style, getStencilSvg, renderStencilShape);
    builder.setShadow(!1);
    this.renderForeground(builder, 0, 0, c, height, style, getStencilSvg, renderStencilShape);
    if (h !== 'off') {
      this.render_sideText(builder, c, b, f, g, h);
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
    builder.setFillColor('#ffffff' as string);
    builder.rect(0, 0, 180, width);
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
    builder.setFillColor('#f4f4f4' as string);
    builder.rect(0, 0, 180, 21);
    builder.fillAndStroke();
    builder.rect(0, width - 21, 180, 21);
    builder.fillAndStroke();
    builder.rect(0, 21, 9, width - 42);
    builder.fillAndStroke();
    builder.rect(171, 21, 9, width - 42);
    builder.fillAndStroke();
    builder.ellipse(2.5, 7.5, 6, 6);
    builder.stroke();
    builder.ellipse(171.5, 7.5, 6, 6);
    builder.stroke();
    builder.ellipse(2.5, width - 13.5, 6, 6);
    builder.stroke();
    builder.ellipse(171.5, width - 13.5, 6, 6);
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
