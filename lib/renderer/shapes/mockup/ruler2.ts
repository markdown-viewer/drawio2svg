// @ts-nocheck
import type { RenderContext, ShapeAttrs } from '../../../renderer.ts';
import { BaseShapeHandler } from '../../shape-registry.ts';

export class MockupMiscRuler2Handler extends BaseShapeHandler {
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
    this.renderBackground(builder, 0, 0, width, height, style, getStencilSvg, renderStencilShape);
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
    builder.rect(0, 0, width, height);
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
    f = this.getStyleValue(style, 'rulerOrient', 'down');
    y = this.getStyleValue(style, 'fontColor', '#000000');
    x = this.getStyleNumber(style, 'dx', 100);
    style.spacingLeft = Math.round(1000 * Math.max(0, Math.min(width, x))) / 1000 - 4;
    x = Math.max(x / 10, 1);
    builder.setFontColor(y as string);
    y = x;
    g = 1;
    if (f === 'down') {
      for (builder.begin(); y < width; ) {
        f = g % 10;
        if (0 === f) {
          builder.moveTo(y, height - 10);
          builder.lineTo(y, height);
          f = this.renderCtx.label;
          if (!isNaN(f)) {
            builder.stroke();
            f = (g * Math.round(100 * f)) / 1000;
            if (10 != g && 0 != f) {
              builder.text(y, 0.5 * (height - 10), 0, 0, f.toString(), 'center', 'middle', 0, 0, 0);
            }
            builder.begin();
          }
        } else {
          if (5 === f) {
            builder.moveTo(y, height - 6);
          } else {
            builder.moveTo(y, height - 4);
          }
          builder.lineTo(y, height);
        }
        y += x;
        g += 1;
      }
      builder.stroke();
    } else if (f === 'up') {
      for (builder.begin(); y < width; ) {
        f = g % 10;
        if (0 === f) {
          builder.moveTo(y, 10);
          builder.lineTo(y, 0);
          f = this.renderCtx.label;
          if (!isNaN(f)) {
            builder.stroke();
            f = (g * Math.round(100 * f)) / 1000;
            if (10 != g && 0 != f) {
              builder.text(y, 0.5 * (height + 10), 0, 0, f.toString(), 'center', 'middle', 0, 0, 0);
            }
            builder.begin();
          }
        } else {
          if (5 === f) {
            builder.moveTo(y, 6);
          } else {
            builder.moveTo(y, 4);
          }
          builder.lineTo(y, 0);
        }
        y += x;
        g += 1;
      }
      builder.stroke();
    }
  }
}
