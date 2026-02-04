// @ts-nocheck
import type { RenderContext, ShapeAttrs } from '../../../renderer.ts';
import { BaseShapeHandler } from '../../shape-registry.ts';

export class MockupPieChartHandler extends BaseShapeHandler {
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
    this.renderBackground(builder, x, y, width, height, style, getStencilShape, renderStencilShape);
    builder.setShadow(!1);
    this.renderForeground(builder, x, y, width, height, style, getStencilShape, renderStencilShape);
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
    let f;
    let g = 0;
    let h = 0;
    let k;
    let l;
    let m;
    let n;
    let p;
    let q;
    let t;
    x = this.getStyleValue(style, 'parts', '10,20,30').toString().split(',');
    y = x.length;
    for (
      f = String(
        this.getStyleValue(style, 'partColors', '#333333,#666666,#999999').toString()
      ).split(','),
        g = 0,
        h = 0;
      h < y;
      h++
    ) {
      g += parseInt(x[h], 10);
    }
    for (h = 0; h < y; h++) {
      if (f.length > h) {
        builder.setFillColor(f[h] as string);
      } else {
        builder.setFillColor('#ff0000' as string);
      }
      k = 0;
      l = parseInt(x[h], 10) / g;
      if (0.5 === l) {
        l = 0.501;
      }
      for (m = 0; m < h; m++) {
        k += parseInt(x[m], 10) / g;
      }
      l += k;
      n = 2 * Math.PI * k;
      p = 2 * Math.PI * l;
      m = 0.5 * width - width * Math.sin(n) * 0.5;
      n = 0.5 * height - height * Math.cos(n) * 0.5;
      q = 0.5 * width - width * Math.sin(p) * 0.5;
      p = 0.5 * height - height * Math.cos(p) * 0.5;
      t = 1;
      if (0.5 > l - k) {
        t = 0;
      }
      builder.begin();
      builder.moveTo(0.5 * width, 0.5 * height);
      builder.lineTo(q, p);
      builder.arcTo(0.5 * width, 0.5 * height, 0, t, 1, m, n);
      builder.close();
      builder.fillAndStroke();
    }
  }
}
