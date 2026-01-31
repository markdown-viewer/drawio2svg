// @ts-nocheck
import type { RenderContext, ShapeAttrs } from '../../../renderer.ts';
import { BaseShapeHandler } from '../../shape-registry.ts';

export class ElectricalLogicGatesDualInlineIcHandler extends BaseShapeHandler {
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
    builder.translate(d, e);
    d = this.getStyleValue(style, 'fontColor', '#000000');
    builder.setFontColor(d as string);
    d = this.getStyleValue(style, 'startPin', 'n');
    e = this.getStyleValue(style, 'pinLabelType', 'gen');
    f = decodeURIComponent(this.getStyleValue(style, 'labelNames', '').toString()).split(',');
    builder.begin();
    if ('n' == d || 's' == d) {
      builder.rect(10, 0, width - 20, height);
    } else {
      builder.rect(0, 10, width, height - 20);
    }
    builder.fillAndStroke();
    g = this.getStyleNumber(style, 'pinSpacing', 20);
    h = this.getStyleValue(style, 'pinStyle', 'line');
    k = parseFloat(this.getStyleValue(style, 'fontSize', '12'));
    l = 'n' == d || 's' == d ? parseInt(height / g) : parseInt(width / g);
    if ('line' == h) {
      builder.setFontSize(Number.parseFloat(String(0.8 * k)) || 0);
      h = 1;
      k = 0.5 * g;
      builder.begin();
      if ('n' == d || 's' == d) {
        for (; h * g <= height; ) {
          builder.moveTo(0, k);
          builder.lineTo(10, k);
          builder.moveTo(width - 10, k);
          builder.lineTo(width, k);
          m = 'n' == d ? h : l + h;
          if ('gen' == e) {
            builder.text(20, k, 0, 0, m.toString(), 'left', 'middle', 0, 0, 0);
          } else if (m - 1 < f.length) {
            builder.text(20, k, 0, 0, f[m - 1].toString(), 'left', 'middle', 0, 0, 0);
          }
          m = 'n' == d ? 2 * l - h + 1 : l - h + 1;
          if ('gen' == e) {
            builder.text(width - 20, k, 0, 0, m.toString(), 'right', 'middle', 0, 0, 0);
          } else if (m - 1 < f.length) {
            builder.text(width - 20, k, 0, 0, f[m - 1].toString(), 'right', 'middle', 0, 0, 0);
          }
          k += g;
          h++;
        }
      } else {
        for (; h * g <= width; ) {
          builder.moveTo(k, 0);
          builder.lineTo(k, 10);
          builder.moveTo(k, height - 10);
          builder.lineTo(k, height);
          m = 'e' == d ? l - h + 1 : 2 * l - h + 1;
          if ('gen' == e) {
            builder.text(k, 20, 0, 0, m.toString(), 'center', 'middle', 0, 0, 0);
          } else if (m - 1 < f.length) {
            builder.text(k, 20, 0, 0, f[m - 1].toString(), 'center', 'middle', 0, 0, 0);
          }
          m = 'e' == d ? l + h : h;
          if ('gen' == e) {
            builder.text(k, height - 20, 0, 0, m.toString(), 'center', 'middle', 0, 0, 0);
          } else if (m - 1 < f.length) {
            builder.text(k, height - 20, 0, 0, f[m - 1].toString(), 'center', 'middle', 0, 0, 0);
          }
          k += g;
          h++;
        }
      }
      builder.stroke();
    } else if ((builder.setFontSize(0.5 * k), (h = 1), (k = 0.5 * g), 'n' == d || 's' == d)) {
      for (; h * g <= height; ) {
        builder.begin();
        builder.rect(0, k - 0.25 * g, 10, 0.5 * g);
        builder.fillAndStroke();
        builder.begin();
        builder.rect(width - 10, k - 0.25 * g, 10, 0.5 * g);
        builder.fillAndStroke();
        m = 'n' == d ? h : l + h;
        if ('gen' == e) {
          builder.text(5, k + 1, 0, 0, m.toString(), 'center', 'middle', 0, 0, 0);
        } else if (m - 1 < f.length) {
          builder.text(5, k + 1, 0, 0, f[m - 1].toString(), 'center', 'middle', 0, 0, 0);
        }
        m = 'n' == d ? 2 * l - h + 1 : l - h + 1;
        if ('gen' == e) {
          builder.text(width - 5, k + 1, 0, 0, m.toString(), 'center', 'middle', 0, 0, 0);
        } else if (m - 1 < f.length) {
          builder.text(width - 5, k + 1, 0, 0, f[m - 1].toString(), 'center', 'middle', 0, 0, 0);
        }
        k += g;
        h++;
      }
    } else {
      for (; h * g <= width; ) {
        builder.begin();
        builder.rect(k - 0.25 * g, 0, 0.5 * g, 10);
        builder.fillAndStroke();
        builder.begin();
        builder.rect(k - 0.25 * g, height - 10, 0.5 * g, 10);
        builder.fillAndStroke();
        m = 'e' == d ? l - h + 1 : 2 * l - h + 1;
        if ('gen' == e) {
          builder.text(k, 5, 0, 0, m.toString(), 'center', 'middle', 0, 0, 0);
        } else if (m - 1 < f.length) {
          builder.text(k, 5, 0, 0, f[m - 1].toString(), 'center', 'middle', 0, 0, 0);
        }
        m = 'e' == d ? l + h : h;
        if ('gen' == e) {
          builder.text(k, height - 5, 0, 0, m.toString(), 'center', 'middle', 0, 0, 0);
        } else if (m - 1 < f.length) {
          builder.text(k, height - 5, 0, 0, f[m - 1].toString(), 'center', 'middle', 0, 0, 0);
        }
        k += g;
        h++;
      }
    }
    builder.setShadow(!1);
    builder.begin();
    switch (d) {
      case 'e':
        if (40 < height) {
          builder.moveTo(width, 0.5 * height - 10);
          builder.arcTo(12, 12, 0, 0, 0, width, 0.5 * height + 10);
        }
        break;
      case 's':
        if (40 < width) {
          builder.moveTo(0.5 * width - 10, height);
          builder.arcTo(12, 12, 0, 0, 1, 0.5 * width + 10, height);
        }
        break;
      case 'w':
        if (40 < height) {
          builder.moveTo(0, 0.5 * height - 10);
          builder.arcTo(12, 12, 0, 0, 1, 0, 0.5 * height + 10);
        }
        break;
      default:
        if (40 < width) {
          builder.moveTo(0.5 * width - 10, 0);
          builder.arcTo(12, 12, 0, 0, 0, 0.5 * width + 10, 0);
        }
    }
    builder.stroke();
    builder.restore();
  }
}
