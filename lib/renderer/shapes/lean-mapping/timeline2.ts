// @ts-nocheck
import type { RenderContext, ShapeAttrs } from '../../../renderer.ts';
import { BaseShapeHandler } from '../../shape-registry.ts';

export class LeanMappingTimeline2Handler extends BaseShapeHandler {
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
    let d = x;
    let e = y;

    let f;
    let g;
    let h;
    let k;
    let l;
    let m;
    let n;
    let p;
    builder.translate(d, e);
    f = this.getStyleNumber(style, 'dy1', 0);
    d = this.getStyleNumber(style, 'dx2', 0);
    e = this.getStyleNumber(style, 'dy2', 0);
    g = this.getStyleNumber(style, 'dx3', 0);
    h = this.getStyleNumber(style, 'dy3', 0);
    k = this.getStyleNumber(style, 'dx4', 0);
    l = this.getStyleNumber(style, 'dy4', 0);
    m = this.getStyleNumber(style, 'dx5', 0);
    n = this.getStyleNumber(style, 'dy5', 0);
    p = this.getStyleNumber(style, 'dy6', 0);
    builder.begin();
    if (0.5 >= f) {
      builder.moveTo(0, 0);
      f = !0;
    } else {
      builder.moveTo(0, height);
      f = !1;
    }
    if (0.5 >= e && f) {
      builder.lineTo(d, 0);
      f = !0;
    } else if (0.5 < e && !f) {
      builder.lineTo(d, height);
      f = !1;
    } else if (0.5 >= e && !f) {
      builder.lineTo(d, height);
      builder.lineTo(d, 0);
      f = !0;
    } else {
      builder.lineTo(d, 0);
      builder.lineTo(d, height);
      f = !1;
    }
    if (0.5 >= h && f) {
      builder.lineTo(g, 0);
      f = !0;
    } else if (0.5 < h && !f) {
      builder.lineTo(g, height);
      f = !1;
    } else if (0.5 >= h && !f) {
      builder.lineTo(g, height);
      builder.lineTo(g, 0);
      f = !0;
    } else {
      builder.lineTo(g, 0);
      builder.lineTo(g, height);
      f = !1;
    }
    if (0.5 >= l && f) {
      builder.lineTo(k, 0);
      f = !0;
    } else if (0.5 < l && !f) {
      builder.lineTo(k, height);
      f = !1;
    } else if (0.5 >= l && !f) {
      builder.lineTo(k, height);
      builder.lineTo(k, 0);
      f = !0;
    } else {
      builder.lineTo(k, 0);
      builder.lineTo(k, height);
      f = !1;
    }
    if (0.5 >= n && f) {
      builder.lineTo(m, 0);
      f = !0;
    } else if (0.5 < n && !f) {
      builder.lineTo(m, height);
      f = !1;
    } else if (0.5 >= n && !f) {
      builder.lineTo(m, height);
      builder.lineTo(m, 0);
      f = !0;
    } else {
      builder.lineTo(m, 0);
      builder.lineTo(m, height);
      f = !1;
    }
    if (0.5 >= p && f) {
      builder.lineTo(width, 0);
    } else if (0.5 < p && !f) {
      builder.lineTo(width, height);
    } else if (0.5 >= p && !f) {
      builder.lineTo(width, height);
      builder.lineTo(width, 0);
    } else {
      builder.lineTo(width, 0);
      builder.lineTo(width, height);
    }
    builder.stroke();
    builder.restore();
  }
}
