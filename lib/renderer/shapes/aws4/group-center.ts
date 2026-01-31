// @ts-nocheck
import type { RenderContext, ShapeAttrs } from '../../../renderer.ts';
import { BaseShapeHandler } from '../../shape-registry.ts';

export class Aws4GroupCenterHandler extends BaseShapeHandler {
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
    let e = y;
    let c = height;

    const __tx = d;
    const __ty = e;
    builder.translate(d, e);
    e = this.getStyleValue(style, 'grStroke', '1');
    d = 25;
    builder.begin();
    builder.moveTo(0, 0);
    builder.lineTo(width, 0);
    builder.lineTo(width, c);
    builder.lineTo(0, c);
    builder.close();
    if ('1' == e || this.getStyleNumber(style, 'outline', 0)) {
      builder.fillAndStroke();
    } else {
      builder.fill();
    }
    builder.setShadow(!1);
    c = this.getStyleValue(style, 'grIcon', '');
    c = c;
    if (null != c) {
      e = this.getStyleValue(style, 'strokeColor', '#000000');
      d = this.getStyleValue(style, 'grIconSize', d);
      builder.setFillAlpha(this.getStyleNumber(style, 'strokeOpacity', 100) / 100);
      builder.setFillColor(e as string);
      builder.setStrokeColor('none' as string);
      this.renderStencilByName(
        c,
        __tx + 0.5 * (width - d),
        __ty + 0,
        d,
        d,
        e,
        style,
        getStencilSvg,
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
    getStencilSvg?: RenderContext['getStencilSvg'],
    renderStencilShape?: RenderContext['renderStencilShape']
  ): void {
    if (!getStencilSvg || !renderStencilShape) return;
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
    const svg = getStencilSvg(stencilStyle);
    if (!svg) return;
    renderStencilShape({ x, y, width, height, style: stencilStyle }, svg);
  }
}
