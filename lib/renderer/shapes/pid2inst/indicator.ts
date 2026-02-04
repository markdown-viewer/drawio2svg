// @ts-nocheck
import type { RenderContext, ShapeAttrs } from '../../../renderer.ts';
import { BaseShapeHandler } from '../../shape-registry.ts';

export class Pid2instIndicatorHandler extends BaseShapeHandler {
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
    this.renderBackground(builder, x, y, width, height, style, getStencilShape, renderStencilShape);
    builder.setShadow(!1);
    this.renderForeground(builder, x, y, width, height, style, getStencilShape, renderStencilShape);
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
    x = this.getStyleValue(style, 'indType', 'inst');
    builder.begin();
    builder.moveTo(0.5 * width, width);
    builder.lineTo(0.5 * width, height);
    builder.stroke();
    if (x === 'inst') {
      builder.ellipse(0, 0, width, width);
      builder.fillAndStroke();
    } else if (x === 'ctrl') {
      builder.rect(0, 0, width, width);
      builder.fillAndStroke();
    } else if (x === 'func') {
      builder.begin();
      builder.moveTo(0, 0.5 * width);
      builder.lineTo(0.25 * width, 0);
      builder.lineTo(0.75 * width, 0);
      builder.lineTo(width, 0.5 * width);
      builder.lineTo(0.75 * width, width);
      builder.lineTo(0.25 * width, width);
      builder.close();
      builder.fillAndStroke();
    } else if (x === 'plc') {
      builder.rect(0, 0, width, width);
      builder.fillAndStroke();
    }
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
    x = this.getStyleValue(style, 'mounting', 'field');
    y = this.getStyleValue(style, 'indType', 'inst');
    if (y === 'ctrl') {
      builder.ellipse(0, 0, width, width);
      builder.stroke();
    } else if (y === 'plc') {
      builder.begin();
      builder.moveTo(0, 0.5 * width);
      builder.lineTo(0.5 * width, 0);
      builder.lineTo(width, 0.5 * width);
      builder.lineTo(0.5 * width, width);
      builder.close();
      builder.stroke();
    }
    if (x === 'room') {
      builder.begin();
      builder.moveTo(0, 0.5 * width);
      builder.lineTo(width, 0.5 * width);
      builder.stroke();
    } else if (x === 'inaccessible') {
      builder.setDashed(!0);
      builder.begin();
      builder.moveTo(0, 0.5 * width);
      builder.lineTo(width, 0.5 * width);
      builder.stroke();
    } else if (x === 'local') {
      builder.begin();
      builder.moveTo(0.005 * width, 0.48 * width);
      builder.lineTo(0.995 * width, 0.48 * width);
      builder.moveTo(0.005 * width, 0.52 * width);
      builder.lineTo(0.995 * width, 0.52 * width);
      builder.stroke();
    }
  }
}
