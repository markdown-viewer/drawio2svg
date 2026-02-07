// @ts-nocheck
import type { RenderContext, ShapeAttrs } from '../../../renderer.ts';
import { BaseShapeHandler } from '../../shape-registry.ts';

export class Networks2IconHandler extends BaseShapeHandler {
  constructor(renderCtx: RenderContext) {
    super(renderCtx);
  }

  render(attrs: ShapeAttrs): void {
    const { builder, currentGroup, applyShapeAttrsToBuilder, x, y, width, height, style } =
      this.renderCtx;
    if (!builder || !currentGroup) return;
    if (width <= 0 || height <= 0) return;

    builder.setCanvasRoot(currentGroup);
    builder.save();
    applyShapeAttrsToBuilder(builder, attrs);

    let f;
    let g;
    f = this.getStyleValue(style, 'network2IconShadow', !1);
    g = this.getStyleValue(style, 'network2bgFillColor', 'none');
    builder.translate(x, y);
    'none' != g && this.render_background(builder, 0, 0, width, height);
    builder.setShadow(!1);
    if (f && 'none' != g) {
      this.render_longShadow(builder, 0, 0, width, height);
    }
    'none' != g
      ? (builder.translate(width / 7, height / 7),
        this.render_foreground(builder, 0, 0, width / 1.4, height / 1.4),
        builder.translate(-width / 7, -height / 7))
      : this.render_foreground(builder, 0, 0, width, height);
    builder.restore();
  }

  private render_longShadow(
    builder: RenderContext['builder'],
    p1: any,
    p2: any,
    p3: any,
    p4: any
  ): void {
    if (!builder) return;
    let f;
    let g;
    f = this.getStyleValue(this.renderCtx.style, 'network2Icon', null) + '_shadow';
    g = null;
    builder.setFillColor('#000000' as string);
    builder.setStrokeColor('none' as string);
    if (null != f) {
      g = f;
    }
    if (null != g) {
      this.renderStencilByName(
        g,
        p1,
        p2,
        p3,
        p4,
        undefined,
        this.renderCtx.style,
        this.renderCtx.getStencilShape,
        this.renderCtx.renderStencilShape
      );
    }
  }

  private render_background(
    builder: RenderContext['builder'],
    p1: any,
    p2: any,
    p3: any,
    p4: any
  ): void {
    if (!builder) return;
    let f;
    let g;
    let h;
    let k;
    f = this.getStyleValue(this.renderCtx.style, 'gradientColor', 'none');
    g = this.getStyleValue(this.renderCtx.style, 'gradientDirection', 'south');
    this.getStyleValue(this.renderCtx.style, 'fillColor', '#ffffff');
    h = this.getStyleValue(this.renderCtx.style, 'fillColor', '#ffffff');
    k = this.getStyleValue(this.renderCtx.style, 'network2bgFillColor', 'none');
    if ('none' == f) {
      builder.setFillColor(k as string);
    } else {
      builder.setGradient(k, f, 0, 0, p3, p4, g);
    }
    builder.roundrect(p1, p2, p3, p4, 0.03571 * p3, 0.03571 * p4);
    builder.fill();
    builder.setFillColor(h as string);
  }

  private render_foreground(
    builder: RenderContext['builder'],
    p1: any,
    p2: any,
    p3: any,
    p4: any
  ): void {
    if (!builder) return;
    let f;
    let g;
    let h;
    let k;
    let l;
    f = this.getStyleValue(this.renderCtx.style, 'network2Icon', null);
    g = null;
    if (null != f) {
      g = f;
    }
    if ('none' != this.getStyleValue(this.renderCtx.style, 'network2bgFillColor', 'none')) {
      f = this.getStyleValue(this.renderCtx.style, 'network2IconW', 1);
      h = this.getStyleValue(this.renderCtx.style, 'network2IconH', 1);
      k = this.getStyleValue(this.renderCtx.style, 'network2IconXOffset', 0);
      l = this.getStyleValue(this.renderCtx.style, 'network2IconYOffset', 0);
      if (null != g) {
        this.renderStencilByName(
          g,
          p1 + 0.5 * p3 * (1 - f) + k * p3,
          p2 + 0.5 * p4 * (1 - h) + l * p4,
          p3 * f,
          p4 * h,
          undefined,
          this.renderCtx.style,
          this.renderCtx.getStencilShape,
          this.renderCtx.renderStencilShape
        );
      }
    } else if (null != g) {
      this.renderStencilByName(
        g,
        p1,
        p2,
        p3,
        p4,
        undefined,
        this.renderCtx.style,
        this.renderCtx.getStencilShape,
        this.renderCtx.renderStencilShape
      );
    }
  }

  // renderStencilByName is inherited from BaseShapeHandler
}
