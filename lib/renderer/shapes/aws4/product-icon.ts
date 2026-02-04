// @ts-nocheck
import type { RenderContext, ShapeAttrs } from '../../../renderer.ts';
import { BaseShapeHandler } from '../../shape-registry.ts';

export class Aws4ProductIconHandler extends BaseShapeHandler {
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
    let d = x;
    let e = y;
    let c = height;

    let f;
    let g;
    let h;
    let k;
    const __tx = d;
    const __ty = e;
    builder.translate(d, e);
    f = e = d = parseFloat(this.getStyleValue(style, 'opacity', '100'));
    if ('none' == g) {
      e = 0;
    }
    if ('none' == h) {
      f = 0;
    }
    d = this.getStyleValue(style, 'strokeColor', 'none');
    builder.setFillColor(d as string);
    builder.begin();
    builder.moveTo(0, 0);
    builder.lineTo(width, 0);
    builder.lineTo(width, c);
    builder.lineTo(0, c);
    builder.close();
    builder.fill();
    builder.setShadow(!1);
    g = this.getStyleValue(style, 'fillColor', '#ffffff');
    h = this.getStyleValue(style, 'gradientColor', g);
    k = this.getStyleValue(style, 'gradientDirection', 'south');
    builder.setFillColor(g as string);
    builder.setGradient(g, h, 0, 0, width, c, k, e, f);
    builder.begin();
    builder.moveTo(1, 1);
    builder.lineTo(width - 1, 1);
    builder.lineTo(width - 1, width - 1);
    builder.lineTo(1, width - 1);
    builder.close();
    builder.fill();
    c = this.getStyleValue(style, 'prIcon', '');
    c = c;
    if (null != c) {
      builder.setFillColor(d as string);
      builder.setStrokeColor('none' as string);
      this.renderStencilByName(
        c,
        __tx + (1 + 0.15 * width),
        __ty + (1 + 0.15 * width),
        0.7 * width - 2,
        0.7 * width - 2,
        undefined,
        style,
        getStencilShape,
        renderStencilShape
      );
    }
    builder.restore();
  }

  private renderStencilByName(
    name: string,
    x: number,
    y: number,
    width: number,
    height: number,
    fillColor: string | undefined,
    style: RenderContext['style'],
    getStencilShape?: RenderContext['getStencilShape'],
    renderStencilShape?: RenderContext['renderStencilShape']
  ): void {
    if (!getStencilShape || !renderStencilShape) return;
    if (!name) return;
    const styleFill = this.getStyleValue(style, 'fillColor', '#ffffff') as string;
    const builderFill = this.renderCtx.builder?.getCurrentFillColor?.() ?? null;
    const rawFill = typeof fillColor === 'string' ? fillColor : undefined;
    let resolvedFill = rawFill ?? builderFill ?? styleFill;
    if (rawFill && builderFill && rawFill === styleFill && builderFill !== styleFill) {
      resolvedFill = builderFill;
    }
    if (
      (style.shape as string | undefined) === 'mxgraph.gcp2.hexIcon' &&
      rawFill === '#FCC64D' &&
      builderFill
    ) {
      resolvedFill = builderFill;
    }
    const shapeName = style.shape as string | undefined;
    const isGcpHexStencil =
      shapeName === 'mxgraph.gcp2.hexIcon' && String(name).startsWith('mxgraph.gcp2.');
    const aspect = isGcpHexStencil ? (style.aspect as any) : 'fixed';
    const stencilStyle = {
      shape: String(name),
      fillColor: resolvedFill,
      strokeColor: 'none',
      ...(aspect ? { aspect } : {}),
    } as any;
    const stencilShape = getStencilShape(stencilStyle.shape);
    if (!stencilShape) return;
    const ctx = { x, y, width, height, style: stencilStyle };
    renderStencilShape(ctx, stencilShape);
  }
}
