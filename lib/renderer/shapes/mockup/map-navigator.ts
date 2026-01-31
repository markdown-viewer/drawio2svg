// @ts-nocheck
import type { RenderContext, ShapeAttrs } from '../../../renderer.ts';
import { BaseShapeHandler } from '../../shape-registry.ts';

export class MockupNavigationMapNavigatorHandler extends BaseShapeHandler {
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
    builder.ellipse(0, 0, width, 0.6 * height);
    builder.fillAndStroke();
    builder.begin();
    builder.moveTo(0.35 * width, 0.584 * height);
    builder.lineTo(0.35 * width, 0.95 * height);
    builder.arcTo(0.083 * width, 0.05 * height, 0, 0, 0, 0.43 * width, height);
    builder.lineTo(0.56 * width, height);
    builder.arcTo(0.083 * width, 0.05 * height, 0, 0, 0, 0.65 * width, 0.95 * height);
    builder.lineTo(0.65 * width, 0.584 * height);
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
    b = this.getStyleValue(style, 'fillColor2', '#99ddff');
    c = this.getStyleValue(style, 'strokeColor2', 'none');
    f = this.getStyleValue(style, 'strokeColor3', '#ffffff');
    builder.setFillColor(b as string);
    builder.setStrokeColor(c as string);
    builder.ellipse(0.4 * width, 0.65 * height, 0.2 * width, 0.12 * height);
    builder.fillAndStroke();
    builder.ellipse(0.4 * width, 0.85 * height, 0.2 * width, 0.12 * height);
    builder.fillAndStroke();
    builder.begin();
    builder.moveTo(0.1806 * width, 0.34 * height);
    builder.lineTo(0.1357 * width, 0.366 * height);
    builder.lineTo(0.0228 * width, 0.3 * height);
    builder.lineTo(0.1357 * width, 0.234 * height);
    builder.lineTo(0.1806 * width, 0.26 * height);
    builder.lineTo(0.1142 * width, 0.3 * height);
    builder.close();
    builder.fillAndStroke();
    builder.begin();
    builder.moveTo(0.433 * width, 0.108 * height);
    builder.lineTo(0.3881 * width, 0.08 * height);
    builder.lineTo(0.4994 * width, 0.012 * height);
    builder.lineTo(0.6123 * width, 0.08 * height);
    builder.lineTo(0.5658 * width, 0.108 * height);
    builder.lineTo(0.4994 * width, 0.068 * height);
    builder.close();
    builder.fillAndStroke();
    builder.begin();
    builder.moveTo(0.8198 * width, 0.262 * height);
    builder.lineTo(0.868 * width, 0.233 * height);
    builder.lineTo(0.9776 * width, 0.3 * height);
    builder.lineTo(0.868 * width, 0.367 * height);
    builder.lineTo(0.8198 * width, 0.341 * height);
    builder.lineTo(0.8863 * width, 0.3 * height);
    builder.close();
    builder.fillAndStroke();
    builder.begin();
    builder.moveTo(0.5641 * width, 0.493 * height);
    builder.lineTo(0.6123 * width, 0.522 * height);
    builder.lineTo(0.4994 * width, 0.588 * height);
    builder.lineTo(0.3881 * width, 0.521 * height);
    builder.lineTo(0.4363 * width, 0.493 * height);
    builder.lineTo(0.4994 * width, 0.533 * height);
    builder.close();
    builder.fillAndStroke();
    builder.begin();
    builder.moveTo(0.3333 * width, 0.32 * height);
    builder.lineTo(0.3333 * width, 0.28 * height);
    builder.lineTo(0.4163 * width, 0.3 * height);
    builder.close();
    builder.moveTo(0.4662 * width, 0.2 * height);
    builder.lineTo(0.5326 * width, 0.2 * height);
    builder.lineTo(0.4994 * width, 0.25 * height);
    builder.close();
    builder.moveTo(0.6654 * width, 0.28 * height);
    builder.lineTo(0.6654 * width, 0.32 * height);
    builder.lineTo(0.5824 * width, 0.3 * height);
    builder.close();
    builder.moveTo(0.5326 * width, 0.4 * height);
    builder.lineTo(0.4662 * width, 0.4 * height);
    builder.lineTo(0.4994 * width, 0.35 * height);
    builder.close();
    builder.fillAndStroke();
    builder.setStrokeWidth(2);
    builder.setStrokeColor(f as string);
    builder.begin();
    builder.moveTo(0.5 * width, 0.67 * height);
    builder.lineTo(0.5 * width, 0.75 * height);
    builder.moveTo(0.43 * width, 0.71 * height);
    builder.lineTo(0.57 * width, 0.71 * height);
    builder.moveTo(0.43 * width, 0.91 * height);
    builder.lineTo(0.57 * width, 0.91 * height);
    builder.stroke();
  }
}
