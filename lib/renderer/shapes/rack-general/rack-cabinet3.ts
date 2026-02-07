// @ts-nocheck
import type { RenderContext, ShapeAttrs } from '../../../renderer.ts';
import { BaseShapeHandler } from '../../shape-registry.ts';

export class RackGeneralRackCabinet3Handler extends BaseShapeHandler {
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
    let b = width;
    let c = height;

    let f;
    let g;
    let h;
    let k;
    let l;
    f = this.getStyleNumber(style, 'rackUnitSize', 14.8);
    g = Math.round((c - 42) / f);
    h = parseFloat(this.getStyleValue(style, 'textSize', '12'));
    k = this.getStyleValue(style, 'numDisp', 'on');
    l = this.getStyleValue(style, 'rackUnitDirLeft', !0);
    if (k !== 'off') {
      if (l) {
        builder.translate(x + 2 * h, y);
      } else {
        builder.translate(x, y);
      }
      b -= 2 * h;
    } else {
      builder.translate(x, y);
    }
    c = g * f + 42;
    this.renderBackground(builder, 0, 0, b, c, style, getStencilShape, renderStencilShape);
    builder.setShadow(!1);
    this.renderForeground(builder, 0, 0, b, c, style, getStencilShape, renderStencilShape);
    if (k !== 'off') {
      this.render_sideText(builder, c, b, g, f, h, k, l);
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
    getStencilShape?: RenderContext['getStencilShape'],
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
    getStencilShape?: RenderContext['getStencilShape'],
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
    p5: any,
    p6: any,
    p7: any
  ): void {
    if (!builder) return;
    let k;
    let l;
    let m;
    k = this.getStyleValue(this.renderCtx.style, 'textColor', '#666666');
    l = this.getStyleNumber(this.renderCtx.style, 'startUnit', 1);
    builder.setFontSize(Number.parseFloat(String(p5)) || 0);
    builder.setFontColor(k as string);
    m = 0;
    if (!p7) {
      m = p2 + 2 * p5;
    }
    if (p6 === 'ascend') {
      for (p2 = 0; p2 < p3; p2++) {
        builder.text(
          m - p5,
          21 + 0.5 * p4 + p2 * p4,
          0,
          0,
          (p2 + l).toString(),
          'center',
          'middle',
          0,
          0,
          0
        );
      }
    } else if (p6 === 'descend' || p6 === 'dirOn') {
      for (p2 = 0; p2 < p3; p2++) {
        builder.text(
          m - p5,
          p1 - 21 - 0.5 * p4 - p2 * p4,
          0,
          0,
          (p2 + l).toString(),
          'center',
          'middle',
          0,
          0,
          0
        );
      }
    }
    builder.setStrokeColor(k as string);
    builder.begin();
    for (p2 = 0; p2 < p3 + 1; p2++) {
      builder.moveTo(m - 2 * p5, 21 + p2 * p4);
      builder.lineTo(m, 21 + p2 * p4);
    }
    builder.stroke();
  }
}
