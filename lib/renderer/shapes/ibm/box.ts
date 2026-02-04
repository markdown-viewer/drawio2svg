// @ts-nocheck
import type { RenderContext, ShapeAttrs } from '../../../renderer.ts';
import { BaseShapeHandler } from '../../shape-registry.ts';

export class IbmBoxHandler extends BaseShapeHandler {
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

    const __tx = d;
    const __ty = y;
    builder.translate(d, y);
    builder.begin();
    builder.rect(0, 0, width, height);
    builder.fillAndStroke();
    d = this.getStyleValue(style, 'strokeColor', 'none');
    builder.setFillColor(d as string);
    builder.setStrokeColor('none' as string);
    switch (this.getStyleValue(style, 'prType', '')) {
      case 'cloud':
        d = 'mxgraph.ibm.cloudtag';
        this.renderStencilByName(
          d,
          __tx + 0,
          __ty + 0,
          25,
          25,
          undefined,
          style,
          getStencilShape,
          renderStencilShape
        );
        break;
      case 'vpc':
        d = 'mxgraph.ibm.vpctag';
        this.renderStencilByName(
          d,
          __tx + 0,
          __ty + 0,
          25,
          25,
          undefined,
          style,
          getStencilShape,
          renderStencilShape
        );
        break;
      case 'region':
        d = 'mxgraph.ibm.regiontag';
        this.renderStencilByName(
          d,
          __tx + 0,
          __ty + 0,
          25,
          25,
          undefined,
          style,
          getStencilShape,
          renderStencilShape
        );
        break;
      case 'zone':
        d = 'mxgraph.ibm.zonetag';
        this.renderStencilByName(
          d,
          __tx + 0,
          __ty + 0,
          25,
          25,
          undefined,
          style,
          getStencilShape,
          renderStencilShape
        );
        break;
      case 'subnet':
        d = 'mxgraph.ibm.subnettag';
        this.renderStencilByName(
          d,
          __tx + 0,
          __ty + 0,
          25,
          25,
          undefined,
          style,
          getStencilShape,
          renderStencilShape
        );
        break;
      case 'public':
        d = 'mxgraph.ibm.publictag';
        this.renderStencilByName(
          d,
          __tx + 0,
          __ty + 0,
          25,
          25,
          undefined,
          style,
          getStencilShape,
          renderStencilShape
        );
        break;
      case 'enterprise':
        d = 'mxgraph.ibm.enterprisetag';
        this.renderStencilByName(
          d,
          __tx + 0,
          __ty + 0,
          25,
          25,
          undefined,
          style,
          getStencilShape,
          renderStencilShape
        );
        break;
      case 'classic':
        ((d = 'mxgraph.ibm.classictag'), d.drawShape(builder, this, 0, 0, 25, 25));
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
