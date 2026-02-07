// @ts-nocheck
import type { RenderContext, ShapeAttrs } from '../../../renderer.ts';
import { BaseShapeHandler } from '../../shape-registry.ts';

export class Gcp2HexIconHandler extends BaseShapeHandler {
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
    builder.translate(d, e);
    f = this.getStyleValue(style, 'prIcon', 'compute_engine');
    g = this.getStyleValue(style, 'prType', '');
    d = parseInt(this.getStyleNumber(style, 'instNum', 0));
    e = this.getStyleValue(style, 'fillColor', '#ffffff');
    h = this.getStyleValue(style, 'opacity', '100');
    this.getStyleValue(style, 'strokeColor', 'none');
    k = this.getStyleValue(style, 'strokeWidth', 1);
    l = Math.min(width, height);
    switch (g) {
      case 'dynamic':
        g = 'mxgraph.gcp2.outline_blank_2';
        builder.setAlpha((0.5 * h) / 100);
        builder.setStrokeColor('none' as string);
        this.renderStencilByName(
          g,
          0.21 * width,
          0.12 * height,
          0.58 * width,
          0.76 * height,
          undefined,
          style,
          getStencilShape,
          renderStencilShape
        );
        break;
      case 'multiple':
        g = 'mxgraph.gcp2.outline_blank_2';
        builder.setAlpha((0.5 * h) / 100);
        builder.setStrokeColor('none' as string);
        this.renderStencilByName(
          g,
          0.21 * width,
          0.12 * height,
          0.58 * width,
          0.76 * height,
          undefined,
          style,
          getStencilShape,
          renderStencilShape
        );
        m = 'mxgraph.gcp2.outline_blank_3';
        builder.setAlpha((0.7 * h) / 100);
        builder.setStrokeColor('none' as string);
        this.renderStencilByName(
          m,
          0.17 * width,
          0.13 * height,
          0.66 * width,
          0.74 * height,
          undefined,
          style,
          getStencilShape,
          renderStencilShape
        );
        break;
      case 'shared':
        g = 'mxgraph.gcp2.outline_blank_1';
        style['strokeWidth'] = 0.038 * l;
        builder.setAlpha((0.4 * h) / 100);
        builder.setStrokeColor(e as string);
        builder.setFillColor('none' as string);
        this.renderStencilByName(
          g,
          0.02 * width,
          0 * height,
          0.96 * width,
          height,
          undefined,
          style,
          getStencilShape,
          renderStencilShape
        );
        m = 'mxgraph.gcp2.outline_blank_2';
        builder.setAlpha((0.7 * h) / 100);
        this.renderStencilByName(
          m,
          0.14 * width,
          0.01 * height,
          0.72 * width,
          0.98 * height,
          undefined,
          style,
          getStencilShape,
          renderStencilShape
        );
        builder.setAlpha(h / 100);
        builder.setFillColor('#ffffff' as string);
        this.renderStencilByName(
          g,
          0.13 * width,
          0.12 * height,
          0.74 * width,
          0.76 * height,
          undefined,
          style,
          getStencilShape,
          renderStencilShape
        );
        style['strokeWidth'] = k;
        break;
      case 'replica':
        g = 'mxgraph.gcp2.outline_blank_1';
        style['strokeWidth'] = 0.038 * l;
        builder.setAlpha((0.4 * h) / 100);
        builder.setStrokeColor(e as string);
        builder.setFillColor('none' as string);
        this.renderStencilByName(
          g,
          0.02 * width,
          0 * height,
          0.96 * width,
          height,
          undefined,
          style,
          getStencilShape,
          renderStencilShape
        );
        builder.setAlpha((0.7 * h) / 100);
        this.renderStencilByName(
          g,
          0.075 * width,
          0.06 * height,
          0.85 * width,
          0.88 * height,
          undefined,
          style,
          getStencilShape,
          renderStencilShape
        );
        builder.setAlpha(h / 100);
        builder.setFillColor('#ffffff' as string);
        this.renderStencilByName(
          g,
          0.13 * width,
          0.12 * height,
          0.74 * width,
          0.76 * height,
          undefined,
          style,
          getStencilShape,
          renderStencilShape
        );
        style['strokeWidth'] = k;
        break;
      case 'dynamic2':
        g = 'mxgraph.gcp2.outline_blank_2';
        builder.setAlpha((0.5 * h) / 100);
        builder.setStrokeColor('none' as string);
        this.renderStencilByName(
          g,
          0.14 * width,
          0.01 * height,
          0.72 * width,
          0.98 * height,
          undefined,
          style,
          getStencilShape,
          renderStencilShape
        );
        m = 'mxgraph.gcp2.outline_blank_1';
        style['strokeWidth'] = 0.01 * l;
        builder.setStrokeColor(e as string);
        builder.setAlpha(h / 100);
        builder.setFillColor('#ffffff' as string);
        this.renderStencilByName(
          m,
          0.13 * width,
          0.12 * height,
          0.74 * width,
          0.76 * height,
          undefined,
          style,
          getStencilShape,
          renderStencilShape
        );
        style['strokeWidth'] = k;
        break;
      case 'dynamic3':
        g = 'mxgraph.gcp2.outline_blank_2';
        builder.setStrokeColor('none' as string);
        this.renderStencilByName(
          g,
          0.14 * width,
          0.01 * height,
          0.72 * width,
          0.98 * height,
          undefined,
          style,
          getStencilShape,
          renderStencilShape
        );
        m = 'mxgraph.gcp2.outline_blank_1';
        style['strokeWidth'] = 0.01 * l;
        builder.setStrokeColor(e as string);
        builder.setAlpha(h / 100);
        builder.setFillColor('#ffffff' as string);
        this.renderStencilByName(
          m,
          0.13 * width,
          0.12 * height,
          0.74 * width,
          0.76 * height,
          undefined,
          style,
          getStencilShape,
          renderStencilShape
        );
        style['strokeWidth'] = k;
        break;
      case 'highmem':
        g = 'mxgraph.gcp2.outline_highmem';
        builder.setAlpha((0.5 * h) / 100);
        builder.setStrokeColor('none' as string);
        this.renderStencilByName(
          g,
          0,
          0.56 * height,
          width,
          0.28 * height,
          undefined,
          style,
          getStencilShape,
          renderStencilShape
        );
        break;
      case 'highcomp':
        g = 'mxgraph.gcp2.outline_highcomp';
        builder.setAlpha((0.5 * h) / 100);
        builder.setStrokeColor('none' as string);
        this.renderStencilByName(
          g,
          0,
          0.16 * height,
          width,
          0.28 * height,
          undefined,
          style,
          getStencilShape,
          renderStencilShape
        );
        break;
      case 'backend':
        g = 'mxgraph.gcp2.outline_blank_1';
        builder.setFillColor('#FCC64D' as string);
        this.renderStencilByName(
          g,
          0.12 * width,
          0.11 * height,
          0.76 * width,
          0.78 * height,
          undefined,
          style,
          getStencilShape,
          renderStencilShape
        );
        break;
      case 'input':
        g = 'mxgraph.gcp2.outline_blank_1';
        builder.setFillColor('#A5DA40' as string);
        this.renderStencilByName(
          g,
          0.12 * width,
          0.11 * height,
          0.76 * width,
          0.78 * height,
          undefined,
          style,
          getStencilShape,
          renderStencilShape
        );
    }
    builder.setAlpha(h / 100);
    f = 'mxgraph.gcp2.' + f;
    if (null != f) {
      builder.setFillColor(e as string);
      builder.setStrokeColor('none' as string);
      this.renderStencilByName(
        f,
        0.17 * width,
        0.16 * height,
        0.66 * width,
        0.68 * height,
        undefined,
        style,
        getStencilShape,
        renderStencilShape
      );
    }
    if (0 < d) {
      builder.setFillColor('#ffffff' as string);
      builder.setStrokeColor('#ffffff' as string);
      builder.setStrokeWidth(0.038 * l);
      builder.ellipse(0.2 * width, 0, 0.18 * width, 0.22 * height);
      builder.fillAndStroke();
      builder.setAlpha((0.5 * h) / 100);
      builder.setStrokeColor(e as string);
      builder.ellipse(0.2 * width, 0, 0.18 * width, 0.22 * height);
      builder.stroke();
      builder.setAlpha(h / 100);
      builder.setFontColor('#4E6B89' as string);
      builder.setFontStyle(1);
      builder.setFontSize(Number.parseFloat(String(0.1 * Math.min(width, height))) || 0);
      builder.text(
        0.29 * width,
        0.11 * height + 1,
        0,
        0,
        d.toString(),
        'center',
        'middle',
        0,
        0,
        0
      );
    }
    builder.restore();
  }

  // renderStencilByName is inherited from BaseShapeHandler
}
