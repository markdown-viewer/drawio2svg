// @ts-nocheck
import type { RenderContext, ShapeAttrs } from '../../../renderer.ts';
import { BaseShapeHandler } from '../../shape-registry.ts';

export class Pid2miscColumnHandler extends BaseShapeHandler {
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

    builder.translate(x, y);
    this.renderBackground(builder, x, y, width, height, style, getStencilSvg, renderStencilShape);
    builder.setShadow(!1);
    this.renderForeground(builder, x, y, width, height, style, getStencilSvg, renderStencilShape);
    builder.restore();
  }

  private renderBackground(
    builder: RenderContext['builder'],
    x: number,
    y: number,
    width: number,
    height: number,
    style: RenderContext['style'],
    getStencilSvg?: RenderContext['getStencilSvg'],
    renderStencilShape?: RenderContext['renderStencilShape']
  ): void {
    if (!builder) return;
    height = Math.max(height, 30);
    builder.begin();
    builder.moveTo(0, 15);
    builder.arcTo(0.5 * width, 15, 0, 0, 1, width, 15);
    builder.lineTo(width, height - 15);
    builder.arcTo(0.5 * width, 15, 0, 0, 1, 0, height - 15);
    builder.close();
    builder.fillAndStroke();
  }

  private renderForeground(
    builder: RenderContext['builder'],
    x: number,
    y: number,
    width: number,
    height: number,
    style: RenderContext['style'],
    getStencilSvg?: RenderContext['getStencilSvg'],
    renderStencilShape?: RenderContext['renderStencilShape']
  ): void {
    if (!builder) return;
    let f;
    let g;
    let h;
    let k;
    let l;
    let m;
    f = this.getStyleValue(style, 'columnType', 'common');
    if (f === 'fixed') {
      g = 1.2 * width;
      x = height - 50;
      y = (x % g) * 0.5 + 25;
      builder.begin();
      for (height = 0; height <= x - g; height += g) {
        (builder.moveTo(0, height + y + 0.1 * g),
          builder.lineTo(width, height + y + 0.1 * g),
          builder.moveTo(0, height + y + 0.9 * g),
          builder.lineTo(width, height + y + 0.9 * g),
          builder.moveTo(0, height + y + 0.1 * g),
          builder.lineTo(width, height + y + 0.9 * g),
          builder.moveTo(0, height + y + 0.9 * g),
          builder.lineTo(width, height + y + 0.1 * g));
      }
      builder.stroke();
    } else if (f === 'tray') {
      g = 0.2 * width;
      x = height - 50;
      y = (x % g) * 0.5 + 25;
      builder.setDashed(!0);
      builder.begin();
      for (height = 0; height <= x; height += g) {
        (builder.moveTo(0, height + y), builder.lineTo(width, height + y));
      }
      builder.stroke();
    } else if (f === 'fluid') {
      g = 0.1 * width;
      f = 0.1 * width;
      x = height - 50;
      y = 25;
      h = 0.02 * Math.min(width, height);
      this.getStyleValue(style, 'fillColor', '#ffffff');
      k = this.getStyleValue(style, 'dashed', '0');
      l = this.getStyleValue(style, 'strokeColor', '#000000');
      builder.setFillColor(l as string);
      builder.setDashed(!0);
      builder.begin();
      builder.moveTo(0, 25);
      builder.lineTo(width, 25);
      builder.moveTo(0, height - 25);
      builder.lineTo(width, height - 25);
      builder.stroke();
      if ('0' === k) {
        builder.setDashed(!1);
      } else {
        builder.setDashed(!0);
      }
      k = 0;
      for (height = y + 0.5 * g; height < x + y - h; height += g) {
        m = f;
        l = k % 2;
        if (0 === l) {
          m = 0.5 * f;
        }
        for (l = m; l < width; l += f) {
          (builder.ellipse(l, height, h, h), builder.fillAndStroke());
        }
        k++;
      }
    } else if (f === 'baffle') {
      g = 0.2 * width;
      x = height - 50 - g;
      y = 25 + 0.5 * g;
      builder.setDashed(!0);
      builder.begin();
      builder.moveTo(0, 25);
      builder.lineTo(width, 25);
      builder.moveTo(0, height - 25);
      builder.lineTo(width, height - 25);
      builder.stroke();
      k = 0;
      builder.begin();
      for (height = y + 0.5 * g; height < x + y; height += g) {
        l = k % 2;
        if (0 === l) {
          builder.moveTo(0, height);
          builder.lineTo(0.9 * width, height);
          builder.lineTo(0.9 * width, height - 0.3 * g);
        } else {
          builder.moveTo(0.1 * width, height - 0.5 * g);
          builder.lineTo(0.1 * width, height);
          builder.lineTo(width, height);
        }
        k++;
      }
      builder.stroke();
    } else if (f === 'valve' || f === 'bubble') {
      g = 0.2 * width;
      x = height - 50 - g;
      y = 25 + 0.5 * g;
      k = this.getStyleValue(style, 'dashed', '0');
      builder.setFillColor(l as string);
      builder.setDashed(!0);
      builder.begin();
      builder.moveTo(0, 25);
      builder.lineTo(width, 25);
      builder.moveTo(0, height - 25);
      builder.lineTo(width, height - 25);
      builder.stroke();
      if ('0' === k) {
        builder.setDashed(!1);
      } else {
        builder.setDashed(!0);
      }
      builder.begin();
      for (height = y + 0.5 * g; height < x + y; height += g) {
        builder.moveTo(0, height);
        builder.lineTo(0.4 * width, height);
        if (f === 'valve') {
          builder.moveTo(0.4 * width, height - 0.2 * g);
          builder.lineTo(0.6 * width, height - 0.2 * g);
        } else if (f === 'bubble') {
          builder.moveTo(0.25 * width, height - 0.2 * g);
          builder.arcTo(3 * g, 3 * g, 0, 0, 1, 0.75 * width, height - 0.2 * g);
        }
        builder.moveTo(0.6 * width, height);
        builder.lineTo(width, height);
      }
      builder.stroke();
    } else if (f === 'nozzle') {
      g = 1.2 * width;
      x = height - 50;
      y = (x % g) * 0.5 + 25;
      k = this.getStyleValue(style, 'dashed', 0);
      for (height = 0; height <= x - g; height += g) {
        builder.setDashed(!0);
        builder.begin();
        builder.moveTo(0, height + y + 0.2 * g);
        builder.lineTo(width, height + y + 0.2 * g);
        builder.moveTo(0, height + y + 0.8 * g);
        builder.lineTo(width, height + y + 0.8 * g);
        builder.stroke();
        if (0 === k) {
          builder.setDashed(!1);
        } else {
          builder.setDashed(!0);
        }
        builder.begin();
        builder.moveTo(0, height + y + 0.2 * g);
        builder.lineTo(width, height + y + 0.8 * g);
        builder.moveTo(0, height + y + 0.8 * g);
        builder.lineTo(width, height + y + 0.2 * g);
        if (0 !== height) {
          builder.moveTo(0, height + y);
          builder.lineTo(0.5 * width, height + y);
          builder.moveTo(0.5 * width - 0.08 * g, height + y + 0.08 * g);
          builder.lineTo(0.5 * width, height + y);
          builder.lineTo(0.5 * width + 0.08 * g, height + y + 0.08 * g);
          builder.moveTo(0.5 * width, height + y);
          builder.lineTo(0.5 * width, height + y + 0.08 * g);
        }
        builder.stroke();
      }
      builder.stroke();
    }
  }
}
