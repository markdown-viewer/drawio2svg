// @ts-nocheck
import type { RenderContext, ShapeAttrs } from '../../../renderer.ts';
import { BaseShapeHandler } from '../../shape-registry.ts';

export class KubernetesIconHandler extends BaseShapeHandler {
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

    let f;
    let g;
    let h;
    f = this.getStyleValue(style, 'prIcon', '');
    g = this.getStyleValue(style, 'fillColor', '#ffffff');
    h = this.getStyleValue(style, 'strokeColor', '#ffffff');
    const __tx = d;
    const __ty = y;
    builder.translate(d, y);
    d = 'mxgraph.kubernetes.frame';
    builder.setFillColor(h as string);
    this.renderStencilByName(
      d,
      __tx + 0,
      __ty + 0,
      width,
      height,
      undefined,
      style,
      getStencilShape,
      renderStencilShape
    );
    builder.setFillColor(g as string);
    this.renderStencilByName(
      d,
      __tx + 0.03 * width,
      __ty + 0.03 * height,
      0.94 * width,
      0.94 * height,
      undefined,
      style,
      getStencilShape,
      renderStencilShape
    );
    f = 'mxgraph.kubernetes.' + f;
    if (null != f) {
      builder.setFillColor(h as string);
      this.renderStencilByName(
        f,
        __tx + 0.2 * width,
        __ty + 0.2 * height,
        0.6 * width,
        0.6 * height,
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
