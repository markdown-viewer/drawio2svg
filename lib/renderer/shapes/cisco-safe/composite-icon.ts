// @ts-nocheck
import type { RenderContext, ShapeAttrs } from '../../../renderer.ts';
import { BaseShapeHandler } from '../../shape-registry.ts';

export class CiscoSafeCompositeIconHandler extends BaseShapeHandler {
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

    let f;
    let g;
    let h;
    let k;
    let l;
    let m;
    f = this.getStyleValue(style, 'strokeColor', 'none');
    g = this.getStyleValue(style, 'bgColor', '#C2E0AE');
    h = this.getStyleValue(style, 'fillColor', '#ffffff');
    k = this.getStyleValue(style, 'shadow', !1);
    l = parseFloat(this.getStyleValue(style, 'opacity', !1));
    builder.translate(d, e);
    d = this.getStyleValue(style, 'bgIcon', '');
    e = this.getStyleValue(style, 'resIcon', '');
    m = e;
    if (null != m && 'mxgraph.cisco_safe.architecture.generic_appliance' != d) {
      this.renderStencilByName(
        m,
        0,
        0,
        width,
        height,
        undefined,
        style,
        getStencilShape,
        renderStencilShape
      );
    }
    builder.setFillColor(f as string);
    builder.setStrokeColor('none' as string);
    builder.setShadow(!1);
    if ('ellipse' == d) {
      builder.begin();
      if (100 > width) {
        builder.ellipse(0.01 * width, 0.01 * height, 0.98 * width, 0.98 * height);
      } else {
        builder.ellipse(1, 1, width - 2, height - 2);
      }
      builder.fill();
    } else if ('threat1' == d) {
      builder.begin();
      builder.ellipse(0.18 * width, 0.16 * height, 0.66 * width, 0.65 * height);
      builder.fill();
    } else if ('threat2' == d) {
      builder.begin();
      builder.ellipse(0.01 * width, 0.01 * height, 0.98 * width, 0.6 * height);
      builder.fill();
    } else if ('threat3' == d) {
      builder.begin();
      builder.ellipse(0.18 * width, 0.2 * height, 0.64 * width, 0.79 * height);
      builder.fill();
    } else if ('threat4' == d) {
      builder.begin();
      builder.ellipse(0.09 * width, 0.03 * height, 0.82 * width, 0.77 * height);
      builder.fill();
    } else if ('threat5' == d) {
      builder.begin();
      builder.ellipse(0.16 * width, 0.01 * height, 0.67 * width, 0.72 * height);
      builder.fill();
    } else if ('mxgraph.cisco_safe.architecture.generic_appliance' == d) {
      builder.setShadow(k);
      builder.setFillColor(g as string);
      builder.begin();
      builder.moveTo(0, 0.3 * height);
      builder.arcTo(0.3 * width, 0.3 * height, 0, 0, 1, 0.3 * width, 0);
      builder.lineTo(0.7 * width, 0);
      builder.arcTo(0.3 * width, 0.3 * height, 0, 0, 1, width, 0.3 * height);
      builder.lineTo(width, 0.7 * height);
      builder.arcTo(0.3 * width, 0.3 * height, 0, 0, 1, 0.7 * width, height);
      builder.lineTo(0.3 * width, height);
      builder.arcTo(0.3 * width, 0.3 * height, 0, 0, 1, 0, 0.7 * height);
      builder.close();
      builder.fill();
      builder.setShadow(!1);
      builder.setFillColor(f as string);
      m = d;
      if (null != m) {
        this.renderStencilByName(
          m,
          0.26 * width,
          0.26 * height,
          0.48 * width,
          0.48 * height,
          undefined,
          style,
          getStencilShape,
          renderStencilShape
        );
      }
      builder.setAlpha(0.5);
      builder.setFillColor('#ffffff' as string);
      builder.ellipse(0.105 * width, 0.48 * height, 0.04 * width, 0.04 * height);
      builder.fill();
      builder.ellipse(0.855 * width, 0.48 * height, 0.04 * width, 0.04 * height);
      builder.fill();
      builder.ellipse(0.48 * width, 0.105 * height, 0.04 * width, 0.04 * height);
      builder.fill();
      builder.ellipse(0.48 * width, 0.855 * height, 0.04 * width, 0.04 * height);
      builder.fill();
      builder.ellipse(0.17 * width, 0.17 * height, 0.04 * width, 0.04 * height);
      builder.fill();
      builder.ellipse(0.79 * width, 0.17 * height, 0.04 * width, 0.04 * height);
      builder.fill();
      builder.ellipse(0.79 * width, 0.79 * height, 0.04 * width, 0.04 * height);
      builder.fill();
      builder.ellipse(0.17 * width, 0.79 * height, 0.04 * width, 0.04 * height);
      builder.fill();
      builder.setAlpha(l / 100);
    } else {
      m = d;
      if (null != m) {
        if (100 > width) {
          this.renderStencilByName(
            m,
            0.01 * width,
            0.01 * height,
            0.98 * width,
            0.98 * height,
            undefined,
            style,
            getStencilShape,
            renderStencilShape
          );
        } else {
          this.renderStencilByName(
            m,
            1,
            1,
            width - 2,
            height - 2,
            undefined,
            style,
            getStencilShape,
            renderStencilShape
          );
        }
      }
    }
    m = e;
    if (null != m) {
      builder.setFillColor(h as string);
      if ('mxgraph.cisco_safe.architecture.generic_appliance' == d) {
        this.renderStencilByName(
          m,
          0.25 * width,
          0.25 * height,
          0.5 * width,
          0.5 * height,
          undefined,
          style,
          getStencilShape,
          renderStencilShape
        );
      } else {
        this.renderStencilByName(
          m,
          0,
          0,
          width,
          height,
          undefined,
          style,
          getStencilShape,
          renderStencilShape
        );
      }
    }
    builder.restore();
  }

  // renderStencilByName is inherited from BaseShapeHandler
}
