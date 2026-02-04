// @ts-nocheck
import type { RenderContext, ShapeAttrs } from '../../../renderer.ts';
import { BaseShapeHandler } from '../../shape-registry.ts';

export class Aws3dWebServerHandler extends BaseShapeHandler {
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
    let d = x;

    builder.translate(d, y);
    d = parseFloat(this.getStyleValue(style, 'strokeWidth', '1'));
    d = Math.min((d * width) / 123, (d * height) / 106);
    this.renderBackground(
      builder,
      0,
      0,
      width,
      height,
      style,
      getStencilShape,
      renderStencilShape,
      d
    );
    builder.setShadow(!1);
    this.renderForeground(
      builder,
      0,
      0,
      width,
      height,
      style,
      getStencilShape,
      renderStencilShape,
      d
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
    renderStencilShape?: RenderContext['renderStencilShape'],
    extra1?: any
  ): void {
    if (!builder) return;
    builder.setStrokeWidth(extra1);
    builder.save();
    builder.save();
    builder.setStrokeWidth(2 * extra1);
    builder.setStrokeColor('#292929' as string);
    builder.setLineJoin('round');
    builder.begin();
    builder.moveTo(0, 0.6651 * height);
    builder.lineTo(0, 0.3349 * height);
    builder.lineTo(0.5 * width, 0);
    builder.lineTo(width, 0.3349 * height);
    builder.lineTo(width, 0.6651 * height);
    builder.lineTo(0.5 * width, height);
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
    renderStencilShape?: RenderContext['renderStencilShape'],
    extra1?: any
  ): void {
    if (!builder) return;
    builder.restore();
    builder.setShadow(!1);
    builder.setFillColor('#000000' as string);
    x = this.getStyleValue(style, 'shadingCols', '0.1,0.3').toString().split(',');
    y = this.getStyleValue(style, 'flipH', '0');
    if ('0' == y) {
      builder.setAlpha(x[0]);
    } else {
      builder.setAlpha(x[1]);
    }
    builder.begin();
    builder.moveTo(0, 0.3349 * height);
    builder.lineTo(0.5 * width, 0.6651 * height);
    builder.lineTo(0.5 * width, height);
    builder.lineTo(0, 0.6651 * height);
    builder.close();
    builder.fill();
    if ('0' == y) {
      builder.setAlpha(x[1]);
    } else {
      builder.setAlpha(x[0]);
    }
    builder.begin();
    builder.moveTo(0.5 * width, 0.6651 * height);
    builder.lineTo(width, 0.3349 * height);
    builder.lineTo(width, 0.6651 * height);
    builder.lineTo(0.5 * width, height);
    builder.close();
    builder.fill();
    builder.restore();
    builder.setShadow(!1);
    builder.setLineJoin('round');
    builder.begin();
    builder.moveTo(0, 0.3349 * height);
    builder.lineTo(0.5 * width, 0.6651 * height);
    builder.lineTo(0.5 * width, height);
    builder.lineTo(0, 0.6651 * height);
    builder.close();
    builder.stroke();
    builder.begin();
    builder.moveTo(0.5 * width, 0.6651 * height);
    builder.lineTo(width, 0.3349 * height);
    builder.lineTo(width, 0.6651 * height);
    builder.lineTo(0.5 * width, height);
    builder.close();
    builder.stroke();
    builder.setLineJoin('miter');
    x = this.getStyleValue(style, 'strokeColor', '#000000');
    builder.setFillColor(x as string);
    builder.begin();
    builder.moveTo(0.374 * width, 0.5189 * height);
    builder.arcTo(0.0325 * width, 0.0236 * height, 0, 0, 1, 0.374 * width, 0.4858 * height);
    builder.lineTo(0.4797 * width, 0.4151 * height);
    builder.arcTo(0.0325 * width, 0.0236 * height, 0, 0, 1, 0.5203 * width, 0.4151 * height);
    builder.lineTo(0.626 * width, 0.4858 * height);
    builder.arcTo(0.0325 * width, 0.0236 * height, 0, 0, 1, 0.626 * width, 0.516 * height);
    builder.lineTo(0.5203 * width, 0.5868 * height);
    builder.arcTo(0.0325 * width, 0.0236 * height, 0, 0, 1, 0.4797 * width, 0.5868 * height);
    builder.close();
    builder.fill();
    builder.setStrokeWidth(2 * extra1);
    builder.setStrokeColor('#292929' as string);
    builder.setLineJoin('round');
    builder.begin();
    builder.moveTo(0, 0.6651 * height);
    builder.lineTo(0, 0.3349 * height);
    builder.lineTo(0.5 * width, 0);
    builder.lineTo(width, 0.3349 * height);
    builder.lineTo(width, 0.6651 * height);
    builder.lineTo(0.5 * width, height);
    builder.close();
    builder.stroke();
  }
}
