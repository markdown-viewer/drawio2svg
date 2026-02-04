// @ts-nocheck
import type { RenderContext, ShapeAttrs } from '../../../renderer.ts';
import { BaseShapeHandler } from '../../shape-registry.ts';

export class Aws3dSecureConnectionHandler extends BaseShapeHandler {
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
    d = Math.min((d * width) / 57, (d * height) / 34);
    builder.setStrokeWidth(d);
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
    builder.begin();
    builder.moveTo(0.0058 * width, 0.3889 * height);
    builder.arcTo(0.2096 * width, 0.3536 * height, 0, 0, 1, 0.0774 * width, 0.1856 * height);
    builder.arcTo(0.5241 * width, 0.8839 * height, 0, 0, 1, 0.308 * width, 0.0262 * height);
    builder.arcTo(0.8735 * width, 1.4732 * height, 0, 0, 1, 0.6417 * width, 0.056 * height);
    builder.arcTo(0.6988 * width, 1.1786 * height, 0, 0, 1, 0.9106 * width, 0.277 * height);
    builder.arcTo(0.2621 * width, 0.442 * height, 0, 0, 1, width, 0.5451 * height);
    builder.arcTo(0.2096 * width, 0.3536 * height, 0, 0, 1, 0.9474 * width, 0.7808 * height);
    builder.arcTo(0.4368 * width, 0.7366 * height, 0, 0, 1, 0.7186 * width, 0.9605 * height);
    builder.arcTo(0.8735 * width, 1.4732 * height, 0, 0, 1, 0.3045 * width, 0.9104 * height);
    builder.arcTo(0.6115 * width, 1.0312 * height, 0, 0, 1, 0.0687 * width, 0.6747 * height);
    builder.arcTo(0.2096 * width, 0.3536 * height, 0, 0, 1, 0.0058 * width, 0.3889 * height);
    builder.close();
    builder.fill();
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
    x = this.getStyleValue(style, 'strokeColor', '#000000');
    builder.setFillColor(x as string);
    builder.begin();
    builder.moveTo(0.2661 * width, 0.5068 * height);
    builder.lineTo(0.5002 * width, 0.7336 * height);
    builder.lineTo(0.6626 * width, 0.5775 * height);
    builder.lineTo(0.6469 * width, 0.5539 * height);
    builder.lineTo(0.6958 * width, 0.5097 * height);
    builder.arcTo(0.0874 * width, 0.1473 * height, 0, 0, 0, 0.7325 * width, 0.4066 * height);
    builder.arcTo(0.0874 * width, 0.1473 * height, 0, 0, 0, 0.6889 * width, 0.3153 * height);
    builder.arcTo(0.1747 * width, 0.2946 * height, 0, 0, 0, 0.5928 * width, 0.2622 * height);
    builder.arcTo(0.1398 * width, 0.2357 * height, 0, 0, 0, 0.5107 * width, 0.3005 * height);
    builder.lineTo(0.446 * width, 0.3654 * height);
    builder.lineTo(0.4268 * width, 0.3477 * height);
    builder.close();
    builder.moveTo(0.4949 * width, 0.4184 * height);
    builder.lineTo(0.5491 * width, 0.3624 * height);
    builder.arcTo(0.1222 * width, 0.2062 * height, 0, 0, 1, 0.6277 * width, 0.3536 * height);
    builder.arcTo(0.0874 * width, 0.1179 * height, 0, 0, 1, 0.6679 * width, 0.3978 * height);
    builder.arcTo(0.0175 * width, 0.0295 * height, 0, 0, 1, 0.6626 * width, 0.439 * height);
    builder.lineTo(0.5928 * width, 0.5068 * height);
    builder.close();
    builder.fill();
  }
}
