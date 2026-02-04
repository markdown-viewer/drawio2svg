// @ts-nocheck
import type { RenderContext, ShapeAttrs } from '../../../renderer.ts';
import { BaseShapeHandler } from '../../shape-registry.ts';

export class Aws4Group2Handler extends BaseShapeHandler {
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
    let b = width;

    const __tx = d;
    const __ty = y;
    builder.translate(d, y);
    d = 25;
    builder.begin();
    builder.moveTo(0, 0);
    builder.lineTo(b, 0);
    builder.lineTo(b, height);
    builder.lineTo(0, height);
    builder.close();
    builder.fillAndStroke();
    builder.setShadow(!1);
    b = this.getStyleValue(style, 'strokeColor', '#000000');
    builder.setFillColor(b as string);
    builder.begin();
    builder.moveTo(0, 0);
    builder.lineTo(d, 0);
    builder.lineTo(d, d);
    builder.lineTo(0, d);
    builder.close();
    builder.fill();
    b = this.getStyleValue(style, 'grIcon', '');
    b = b;
    if (null != b) {
      d = this.getStyleValue(style, 'grIconSize', d);
      builder.setFillAlpha(this.getStyleNumber(style, 'strokeOpacity', 100) / 100);
      builder.setFillColor('#ffffff' as string);
      builder.setStrokeColor('none' as string);
      this.renderStencilByName(
        b,
        __tx + 0.1 * d,
        __ty + 0.1 * d,
        0.8 * d,
        0.8 * d,
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
