// @ts-nocheck
import type { RenderContext, ShapeAttrs } from '../../../renderer.ts';
import { BaseShapeHandler } from '../../shape-registry.ts';

export class MockupMiscRulerHandler extends BaseShapeHandler {
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
    this.renderForeground(builder, 0, 0, width, height, style, getStencilSvg, renderStencilShape);
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
    let b;
    let c;
    let f;
    let g;
    b = this.getStyleValue(style, 'rulerOrient', 'down');
    c = this.getStyleValue(style, 'unitSize', '10');
    f = c = Math.max(c, 1);
    g = 1;
    if (b === 'down') {
      for (builder.begin(); f < width; ) {
        b = g % 10;
        if (0 === b) {
          builder.moveTo(f, 0.5 * height);
        } else if (5 === b) {
          builder.moveTo(f, 0.7 * height);
        } else {
          builder.moveTo(f, 0.8 * height);
        }
        builder.lineTo(f, height);
        f += c;
        g += 1;
      }
      builder.stroke();
    } else if (b === 'up') {
      for (builder.begin(); f < width; ) {
        b = g % 10;
        if (0 === b) {
          builder.moveTo(f, 0.5 * height);
        } else if (5 === b) {
          builder.moveTo(f, 0.3 * height);
        } else {
          builder.moveTo(f, 0.2 * height);
        }
        builder.lineTo(f, 0);
        f += c;
        g += 1;
      }
      builder.stroke();
    }
  }
}
