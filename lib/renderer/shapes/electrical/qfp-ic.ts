// @ts-nocheck
import type { RenderContext, ShapeAttrs } from '../../../renderer.ts';
import { BaseShapeHandler } from '../../shape-registry.ts';

export class ElectricalLogicGatesQfpIcHandler extends BaseShapeHandler {
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
    builder.translate(d, e);
    builder.begin();
    builder.moveTo(15, 10);
    builder.lineTo(width - 15, 10);
    builder.lineTo(width - 10, 15);
    builder.lineTo(width - 10, height - 15);
    builder.lineTo(width - 15, height - 10);
    builder.lineTo(15, height - 10);
    builder.lineTo(10, height - 15);
    builder.lineTo(10, 15);
    builder.close();
    builder.fillAndStroke();
    d = this.getStyleNumber(style, 'pinSpacing', 20);
    f = this.getStyleValue(style, 'pinStyle', 'line');
    e = this.getStyleValue(style, 'pinLabelType', 'gen');
    g = decodeURIComponent(this.getStyleValue(style, 'labelNames', '').toString()).split(',');
    h = parseFloat(this.getStyleValue(style, 'fontSize', '12'));
    k = this.getStyleValue(style, 'fontColor', '#000000');
    builder.setFontColor(k as string);
    k = this.getStyleValue(style, 'startPin', 'sw');
    if ('line' == f) {
      builder.setFontSize(Number.parseFloat(String(0.8 * h)) || 0);
      f = 1;
      h = 0.5 * d + 20;
      builder.begin();
      for (
        l = parseInt((height - d - 40) / d) + 1, m = parseInt((width - d - 40) / d) + 1;
        h <= height - 0.5 * d - 20;
      ) {
        builder.moveTo(0, h);
        builder.lineTo(10, h);
        builder.moveTo(width - 10, h);
        builder.lineTo(width, h);
        switch (k) {
          case 'nw':
            n = f;
            break;
          case 'ne':
            n = m + f;
            break;
          case 'se':
            n = l + m + f;
            break;
          default:
            n = l + 2 * m + f;
        }
        if ('gen' == e) {
          builder.text(20, h, 0, 0, n.toString(), 'center', 'middle', 0, 0, 0);
        } else if (n - 1 < g.length) {
          builder.text(20, h, 0, 0, g[n - 1].toString(), 'center', 'middle', 0, 0, 0);
        }
        switch (k) {
          case 'nw':
            n = m + 2 * l - f + 1;
            break;
          case 'ne':
            n = 2 * m + 2 * l - f + 1;
            break;
          case 'se':
            n = l - f + 1;
            break;
          default:
            n = m + l - f + 1;
        }
        if ('gen' == e) {
          builder.text(width - 20, h, 0, 0, n.toString(), 'center', 'middle', 0, 0, 0);
        } else if (n - 1 < g.length) {
          builder.text(width - 20, h, 0, 0, g[n - 1].toString(), 'center', 'middle', 0, 0, 0);
        }
        h += d;
        f++;
      }
      f = 1;
      for (h = 0.5 * d + 20; h <= width - 0.5 * d - 20; ) {
        builder.moveTo(h, 0);
        builder.lineTo(h, 10);
        builder.moveTo(h, height - 10);
        builder.lineTo(h, height);
        switch (k) {
          case 'nw':
            n = l + f;
            break;
          case 'ne':
            n = l + m + f;
            break;
          case 'se':
            n = 2 * l + m + f;
            break;
          default:
            n = f;
        }
        if ('gen' == e) {
          builder.text(h, height - 20, 0, 0, n.toString(), 'center', 'middle', 0, 0, 0);
        } else if (n - 1 < g.length) {
          builder.text(h, height - 20, 0, 0, g[n - 1].toString(), 'center', 'middle', 0, 0, 0);
        }
        switch (k) {
          case 'nw':
            n = 2 * m + 2 * l - f + 1;
            break;
          case 'ne':
            n = m - f + 1;
            break;
          case 'se':
            n = m + l - f + 1;
            break;
          default:
            n = 2 * m + l - f + 1;
        }
        if ('gen' == e) {
          builder.text(h, 20, 0, 0, n.toString(), 'center', 'middle', 0, 0, 0);
        } else if (n - 1 < g.length) {
          builder.text(h, 20, 0, 0, g[n - 1].toString(), 'center', 'middle', 0, 0, 0);
        }
        h += d;
        f++;
      }
      builder.stroke();
    } else {
      builder.setFontSize(Number.parseFloat(String(0.5 * h)) || 0);
      f = 1;
      h = 0.5 * d + 20;
      l = parseInt((height - d - 40) / d) + 1;
      for (m = parseInt((width - d - 40) / d) + 1; h <= height - 0.5 * d - 20; ) {
        builder.begin();
        builder.rect(0, h - 0.25 * d, 10, 0.5 * d);
        builder.fillAndStroke();
        builder.begin();
        builder.rect(width - 10, h - 0.25 * d, 10, 0.5 * d);
        builder.fillAndStroke();
        switch (k) {
          case 'nw':
            n = f;
            break;
          case 'ne':
            n = m + f;
            break;
          case 'se':
            n = l + m + f;
            break;
          default:
            n = l + 2 * m + f;
        }
        if ('gen' == e) {
          builder.text(5, h + 1, 0, 0, n.toString(), 'center', 'middle', 0, 0, 0);
        } else if (n - 1 < g.length) {
          builder.text(5, h + 1, 0, 0, g[n - 1].toString(), 'center', 'middle', 0, 0, 0);
        }
        switch (k) {
          case 'nw':
            n = m + 2 * l - f + 1;
            break;
          case 'ne':
            n = 2 * m + 2 * l - f + 1;
            break;
          case 'se':
            n = l - f + 1;
            break;
          default:
            n = m + l - f + 1;
        }
        if ('gen' == e) {
          builder.text(width - 5, h + 1, 0, 0, n.toString(), 'center', 'middle', 0, 0, 0);
        } else if (n - 1 < g.length) {
          builder.text(width - 5, h + 1, 0, 0, g[n - 1].toString(), 'center', 'middle', 0, 0, 0);
        }
        h += d;
        f++;
      }
      f = 1;
      for (h = 0.5 * d + 20; h <= width - 0.5 * d - 20; ) {
        builder.begin();
        builder.rect(h - 0.25 * d, 0, 0.5 * d, 10);
        builder.fillAndStroke();
        builder.begin();
        builder.rect(h - 0.25 * d, height - 10, 0.5 * d, 10);
        builder.fillAndStroke();
        switch (k) {
          case 'nw':
            n = l + f;
            break;
          case 'ne':
            n = l + m + f;
            break;
          case 'se':
            n = 2 * l + m + f;
            break;
          default:
            n = f;
        }
        if ('gen' == e) {
          builder.text(h, height - 4, 0, 0, n.toString(), 'center', 'middle', 0, 0, 0);
        } else if (n - 1 < g.length) {
          builder.text(h, height - 4, 0, 0, g[n - 1].toString(), 'center', 'middle', 0, 0, 0);
        }
        switch (k) {
          case 'nw':
            n = 2 * m + 2 * l - f + 1;
            break;
          case 'ne':
            n = m - f + 1;
            break;
          case 'se':
            n = m + l - f + 1;
            break;
          default:
            n = 2 * m + l - f + 1;
        }
        if ('gen' == e) {
          builder.text(h, 6, 0, 0, n.toString(), 'center', 'middle', 0, 0, 0);
        } else if (n - 1 < g.length) {
          builder.text(h, 6, 0, 0, g[n - 1].toString(), 'center', 'middle', 0, 0, 0);
        }
        h += d;
        f++;
      }
    }
    builder.setShadow(!1);
    if (40 < width) {
      builder.setFillColor(this.getStyleValue(style, 'strokeColor', '#000000') as string);
      builder.begin();
      switch (k) {
        case 'nw':
          builder.ellipse(15, 15, 10, 10);
          break;
        case 'ne':
          builder.ellipse(width - 25, 15, 10, 10);
          break;
        case 'se':
          builder.ellipse(width - 25, height - 25, 10, 10);
          break;
        default:
          builder.ellipse(15, height - 25, 10, 10);
      }
      builder.fillAndStroke();
    }
    builder.restore();
  }
}
