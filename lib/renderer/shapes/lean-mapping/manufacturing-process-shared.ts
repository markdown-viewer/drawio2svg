// @ts-nocheck
import type { RenderContext, ShapeAttrs } from '../../../renderer.ts';
import { BaseShapeHandler } from '../../shape-registry.ts';

export class LeanMappingManufacturingProcessSharedHandler extends BaseShapeHandler {
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
    let d = x;

    builder.translate(d, y);
    d = parseFloat(this.getStyleValue(style, 'fontSize', '8'));
    this.renderBackground(builder, 0, 0, width, height, style, getStencilSvg, renderStencilShape);
    builder.setShadow(!1);
    this.renderForeground(
      builder,
      0,
      0,
      width,
      height,
      style,
      getStencilSvg,
      renderStencilShape,
      d
    );
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
    renderStencilShape?: RenderContext['renderStencilShape'],
    extra1?: any
  ): void {
    if (!builder) return;
    let c;
    let f;
    let g;
    let h;
    let k;
    extra1 = Math.min(1.5 * extra1, height);
    builder.begin();
    builder.moveTo(0, extra1);
    builder.lineTo(width, extra1);
    builder.stroke();
    c = 0;
    builder.begin();
    f = parseFloat(this.getStyleValue(style, 'strokeWidth', '2'));
    for (builder.setStrokeWidth(0.5 * f); c < height + width; ) {
      if (((c += 10), c > extra1)) {
        f = Math.max(0, c - height);
        g = Math.min(c, height);
        h = Math.min(c - extra1, width);
        k = Math.max(c - width, extra1);
        if (f < width) {
          builder.moveTo(f, g);
          builder.lineTo(h, k);
        }
      }
    }
    builder.stroke();
  }
}
