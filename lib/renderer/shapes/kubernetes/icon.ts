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
    builder.translate(d, y);
    d = 'mxgraph.kubernetes.frame';
    builder.setFillColor(h as string);
    this.renderStencilByName(
      d,
      0,
      0,
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
      0.03 * width,
      0.03 * height,
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
        0.2 * width,
        0.2 * height,
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

  // renderStencilByName is inherited from BaseShapeHandler
}
