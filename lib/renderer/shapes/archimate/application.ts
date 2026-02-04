// @ts-nocheck
import type { RenderContext, ShapeAttrs } from '../../../renderer.ts';
import { BaseShapeHandler } from '../../shape-registry.ts';

export class ArchimateApplicationHandler extends BaseShapeHandler {
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
    getStencilShape?: RenderContext['getStencilShape'],
    renderStencilShape?: RenderContext['renderStencilShape']
  ): void {
    if (!builder) return;
    x = this.getStyleValue(style, 'appType', 'comp');
    builder.setDashed(!1);
    if (x === 'comp') {
      builder.translate(1, 0);
      width -= 2;
      builder.rect(0.25 * width, 0, 0.75 * width, height);
      builder.stroke();
      builder.rect(0, 0.25 * height, 0.5 * width, 0.15 * height);
      builder.fillAndStroke();
      builder.rect(0, 0.6 * height, 0.5 * width, 0.15 * height);
      builder.fillAndStroke();
    } else if (x === 'collab') {
      builder.translate(0, 3);
      height -= 6;
      builder.ellipse(0, 0, 0.6 * width, height);
      builder.stroke();
      builder.ellipse(0.4 * width, 0, 0.6 * width, height);
      builder.fillAndStroke();
    } else if (x === 'interface') {
      builder.translate(0, 4);
      height -= 8;
      builder.ellipse(0.5 * width, 0, 0.5 * width, height);
      builder.stroke();
      builder.begin();
      builder.moveTo(0, 0.5 * height);
      builder.lineTo(0.5 * width, 0.5 * height);
      builder.stroke();
    } else if (x === 'interface2') {
      builder.translate(0, 1);
      height -= 2;
      builder.begin();
      builder.moveTo(0, 0.5 * height);
      builder.lineTo(0.6 * width, 0.5 * height);
      builder.moveTo(width, 0);
      builder.arcTo(0.4 * width, 0.5 * height, 0, 0, 0, width, height);
      builder.stroke();
    } else if (x === 'function') {
      builder.begin();
      builder.moveTo(0.5 * width, 0);
      builder.lineTo(width, 0.2 * height);
      builder.lineTo(width, height);
      builder.lineTo(0.5 * width, 0.8 * height);
      builder.lineTo(0, height);
      builder.lineTo(0, 0.2 * height);
      builder.close();
      builder.stroke();
    } else if (x === 'interaction') {
      builder.begin();
      builder.moveTo(0.55 * width, 0);
      builder.arcTo(0.45 * width, 0.5 * height, 0, 0, 1, 0.55 * width, height);
      builder.close();
      builder.moveTo(0.45 * width, 0);
      builder.arcTo(0.45 * width, 0.5 * height, 0, 0, 0, 0.45 * width, height);
      builder.close();
      builder.stroke();
    } else if (x === 'service') {
      builder.translate(0, 3);
      height -= 6;
      builder.begin();
      builder.moveTo(width - 0.5 * height, 0);
      builder.arcTo(0.5 * height, 0.5 * height, 0, 0, 1, width - 0.5 * height, height);
      builder.lineTo(0, height);
      builder.arcTo(0.5 * height, 0.5 * height, 0, 0, 1, 0, 0);
      builder.close();
      builder.stroke();
    } else if (x === 'node') {
      builder.begin();
      builder.moveTo(0, 0.25 * height);
      builder.lineTo(0.25 * width, 0);
      builder.lineTo(width, 0);
      builder.lineTo(width, 0.75 * height);
      builder.lineTo(0.75 * width, height);
      builder.lineTo(0, height);
      builder.close();
      builder.moveTo(0, 0.25 * height);
      builder.lineTo(0.75 * width, 0.25 * height);
      builder.lineTo(0.75 * width, height);
      builder.moveTo(width, 0);
      builder.lineTo(0.75 * width, 0.25 * height);
      builder.stroke();
    } else if (x === 'network') {
      builder.translate(0, 2);
      height -= 4;
      builder.begin();
      builder.moveTo(0.4 * width, 0.2 * height);
      builder.lineTo(0.85 * width, 0.2 * height);
      builder.lineTo(0.6 * width, 0.8 * height);
      builder.lineTo(0.15 * width, 0.8 * height);
      builder.close();
      builder.stroke();
      y = this.getStyleValue(style, 'strokeColor', '#000000');
      builder.setFillColor(y as string);
      builder.ellipse(0.25 * width, 0, 0.3 * width, 0.4 * height);
      builder.fill();
      builder.ellipse(0.7 * width, 0, 0.3 * width, 0.4 * height);
      builder.fill();
      builder.ellipse(0, 0.6 * height, 0.3 * width, 0.4 * height);
      builder.fill();
      builder.ellipse(0.45 * width, 0.6 * height, 0.3 * width, 0.4 * height);
      builder.fill();
    } else if (x === 'commPath') {
      builder.translate(0, 5);
      height -= 10;
      builder.begin();
      builder.moveTo(0.1 * width, 0);
      builder.lineTo(0, 0.5 * height);
      builder.lineTo(0.1 * width, height);
      builder.moveTo(0.9 * width, 0);
      builder.lineTo(width, 0.5 * height);
      builder.lineTo(0.9 * width, height);
      builder.stroke();
      builder.setDashed(!0);
      builder.begin();
      builder.moveTo(0, 0.5 * height);
      builder.lineTo(width, 0.5 * height);
      builder.stroke();
    } else if (x === 'sysSw') {
      builder.ellipse(0.3 * width, 0, 0.7 * width, 0.7 * height);
      builder.stroke();
      builder.ellipse(0, 0.02 * height, 0.98 * width, 0.98 * height);
      builder.fillAndStroke();
    } else if (x === 'artifact') {
      builder.translate(2, 0);
      width -= 4;
      builder.begin();
      builder.moveTo(0, 0);
      builder.lineTo(0.7 * width, 0);
      builder.lineTo(width, 0.22 * height);
      builder.lineTo(width, height);
      builder.lineTo(0, height);
      builder.close();
      builder.moveTo(0.7 * width, 0);
      builder.lineTo(0.7 * width, 0.22 * height);
      builder.lineTo(width, 0.22 * height);
      builder.stroke();
    } else if (x === 'actor') {
      builder.translate(3, 0);
      width -= 6;
      builder.ellipse(0.2 * width, 0, 0.6 * width, 0.3 * height);
      builder.stroke();
      builder.begin();
      builder.moveTo(0.5 * width, 0.3 * height);
      builder.lineTo(0.5 * width, 0.75 * height);
      builder.moveTo(0, 0.45 * height);
      builder.lineTo(width, 0.45 * height);
      builder.moveTo(0, height);
      builder.lineTo(0.5 * width, 0.75 * height);
      builder.lineTo(width, height);
      builder.stroke();
    }
    if (x === 'role') {
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
    }
  }
}
