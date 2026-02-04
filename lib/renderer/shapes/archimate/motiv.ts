// @ts-nocheck
import type { RenderContext, ShapeAttrs } from '../../../renderer.ts';
import { BaseShapeHandler } from '../../shape-registry.ts';

export class ArchimateMotivHandler extends BaseShapeHandler {
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

    builder.translate(x, y);
    this.renderBackground(builder, 0, 0, width, height, style, getStencilShape, renderStencilShape);
    builder.setShadow(!1);
    builder.translate(width - 20, 5);
    this.renderForeground(
      builder,
      width - 20,
      5,
      15,
      15,
      style,
      getStencilShape,
      renderStencilShape
    );
    builder.restore();
  }

  private renderBackground(
    builder: RenderContext['builder'],
    x: number,
    y: number,
    width: number,
    height: number,
    style: RenderContext['style'],
    getStencilShape?: RenderContext['getStencilShape'],
    renderStencilShape?: RenderContext['renderStencilShape']
  ): void {
    if (!builder) return;
    builder.begin();
    builder.moveTo(10, 0);
    builder.lineTo(width - 10, 0);
    builder.lineTo(width, 10);
    builder.lineTo(width, height - 10);
    builder.lineTo(width - 10, height);
    builder.lineTo(10, height);
    builder.lineTo(0, height - 10);
    builder.lineTo(0, 10);
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
    getStencilShape?: RenderContext['getStencilShape'],
    renderStencilShape?: RenderContext['renderStencilShape']
  ): void {
    if (!builder) return;
    x = this.getStyleValue(style, 'motivType', 'stake');
    builder.setDashed(!1);
    if (x === 'stake') {
      builder.translate(0, 4);
      height -= 8;
      builder.begin();
      builder.moveTo(0.8 * width, 0);
      builder.lineTo(0.2 * width, 0);
      builder.arcTo(0.2 * width, 0.5 * height, 0, 0, 0, 0.2 * width, height);
      builder.lineTo(0.8 * width, height);
      builder.stroke();
      builder.ellipse(0.6 * width, 0, 0.4 * width, height);
      builder.stroke();
    } else if (x === 'driver') {
      builder.ellipse(0.1 * width, 0.1 * height, 0.8 * width, 0.8 * height);
      builder.stroke();
      builder.begin();
      builder.moveTo(0, 0.5 * height);
      builder.lineTo(width, 0.5 * height);
      builder.moveTo(0.5 * width, 0);
      builder.lineTo(0.5 * width, height);
      builder.moveTo(0.145 * width, 0.145 * height);
      builder.lineTo(0.855 * width, 0.855 * height);
      builder.moveTo(0.145 * width, 0.855 * height);
      builder.lineTo(0.855 * width, 0.145 * height);
      builder.stroke();
      x = this.getStyleValue(style, 'strokeColor', '#000000');
      builder.setFillColor(x as string);
      builder.ellipse(0.35 * width, 0.35 * height, 0.3 * width, 0.3 * height);
      builder.fillAndStroke();
    } else if (x === 'assess') {
      builder.ellipse(0.2 * width, 0, 0.8 * width, 0.8 * height);
      builder.stroke();
      builder.begin();
      builder.moveTo(0, height);
      builder.lineTo(0.32 * width, 0.68 * height);
      builder.stroke();
    } else if (x === 'goal') {
      builder.ellipse(0, 0, width, height);
      builder.stroke();
      builder.ellipse(0.15 * width, 0.15 * height, 0.7 * width, 0.7 * height);
      builder.stroke();
      x = this.getStyleValue(style, 'strokeColor', '#000000');
      builder.setFillColor(x as string);
      builder.ellipse(0.3 * width, 0.3 * height, 0.4 * width, 0.4 * height);
      builder.fillAndStroke();
    } else if (x === 'req') {
      builder.translate(0, 4);
      height -= 8;
      builder.begin();
      builder.moveTo(0.25 * width, 0);
      builder.lineTo(width, 0);
      builder.lineTo(0.75 * width, height);
      builder.lineTo(0, height);
      builder.close();
      builder.stroke();
    } else if (x === 'const') {
      builder.translate(0, 4);
      height -= 8;
      builder.begin();
      builder.moveTo(0.25 * width, 0);
      builder.lineTo(width, 0);
      builder.lineTo(0.75 * width, height);
      builder.lineTo(0, height);
      builder.close();
      builder.moveTo(0.45 * width, 0);
      builder.lineTo(0.2 * width, height);
      builder.stroke();
    } else if (x === 'princ') {
      builder.begin();
      builder.moveTo(0.05 * width, 0.05 * height);
      builder.arcTo(2.3 * width, 2.3 * height, 0, 0, 1, 0.95 * width, 0.05 * height);
      builder.arcTo(2.3 * width, 2.3 * height, 0, 0, 1, 0.95 * width, 0.95 * height);
      builder.arcTo(2.3 * width, 2.3 * height, 0, 0, 1, 0.05 * width, 0.95 * height);
      builder.arcTo(2.3 * width, 2.3 * height, 0, 0, 1, 0.05 * width, 0.05 * height);
      builder.close();
      builder.stroke();
      x = this.getStyleValue(style, 'strokeColor', '#000000');
      builder.setFillColor(x as string);
      builder.begin();
      builder.moveTo(0.45 * width, 0.7 * height);
      builder.lineTo(0.42 * width, 0.15 * height);
      builder.lineTo(0.58 * width, 0.15 * height);
      builder.lineTo(0.55 * width, 0.7 * height);
      builder.close();
      builder.fill();
      builder.rect(0.45 * width, 0.75 * height, 0.1 * width, 0.1 * height);
      builder.fill();
    }
  }
}
