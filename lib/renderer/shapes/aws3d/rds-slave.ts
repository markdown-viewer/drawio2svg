// @ts-nocheck
import type { RenderContext, ShapeAttrs } from '../../../renderer.ts';
import { BaseShapeHandler } from '../../shape-registry.ts';

export class Aws3dRdsSlaveHandler extends BaseShapeHandler {
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
    let d = x;
    let e = y;
    let f = parseFloat(this.getStyleValue(style, 'strokeWidth', '1'));

    builder.translate(d, e);
    d = (f * width) / 123;
    f = (f * height) / 133;
    e = this.getStyleValue(style, 'strokeColor2', '#292929');
    f = Math.min(d, f);
    builder.setStrokeWidth(f);
    this.renderBackground(
      builder,
      0,
      0,
      width,
      height,
      style,
      getStencilSvg,
      renderStencilShape,
      f,
      e
    );
    builder.setShadow(!1);
    this.renderForeground(
      builder,
      0,
      0,
      width,
      height,
      style,
      getStencilSvg,
      renderStencilShape,
      f,
      e
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
    getStencilSvg?: RenderContext['getStencilSvg'],
    renderStencilShape?: RenderContext['renderStencilShape'],
    extra1?: any,
    extra2?: any
  ): void {
    if (!builder) return;
    builder.save();
    builder.save();
    builder.setStrokeWidth(2 * extra1);
    builder.setStrokeColor(extra2 as string);
    builder.setLineJoin('round');
    builder.begin();
    builder.moveTo(0, 0.7331 * height);
    builder.lineTo(0, 0.3346 * height);
    builder.lineTo(0.126 * width, 0.1316 * height);
    builder.lineTo(0.374 * width, 0);
    builder.lineTo(0.626 * width, 0);
    builder.lineTo(0.874 * width, 0.1316 * height);
    builder.lineTo(width, 0.3346 * height);
    builder.lineTo(width, 0.7331 * height);
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
    getStencilSvg?: RenderContext['getStencilSvg'],
    renderStencilShape?: RenderContext['renderStencilShape'],
    extra1?: any,
    extra2?: any
  ): void {
    if (!builder) return;
    builder.restore();
    builder.setShadow(!1);
    builder.setFillColor('#000000' as string);
    builder.setAlpha('0.1');
    builder.begin();
    builder.moveTo(0.126 * width, 0.1316 * height);
    builder.lineTo(0.126 * width, 0.267 * height);
    builder.lineTo(0.378 * width, 0.4023 * height);
    builder.lineTo(0.5 * width, 0.6015 * height);
    builder.lineTo(0.5 * width, height);
    builder.lineTo(0, 0.7331 * height);
    builder.lineTo(0, 0.3346 * height);
    builder.close();
    builder.moveTo(0.874 * width, 0.267 * height);
    builder.lineTo(0.874 * width, 0.1316 * height);
    builder.lineTo(width, 0.3308 * height);
    builder.fill();
    builder.setAlpha('0.3');
    builder.begin();
    builder.moveTo(0.5 * width, height);
    builder.lineTo(0.5 * width, 0.6015 * height);
    builder.lineTo(0.622 * width, 0.4023 * height);
    builder.lineTo(0.874 * width, 0.267 * height);
    builder.lineTo(width, 0.3308 * height);
    builder.lineTo(width, 0.7331 * height);
    builder.close();
    builder.fill();
    builder.restore();
    x = this.getStyleValue(style, 'strokeColor', '#000000');
    builder.setFillColor(x as string);
    builder.setShadow(!1);
    builder.begin();
    builder.moveTo(0.2457 * width, 0.2137 * height);
    builder.lineTo(0.5393 * width, 0.0593 * height);
    builder.lineTo(0.6875 * width, 0.1377 * height);
    builder.arcTo(0.0871 * width, 0.0799 * height, 0, 0, 1, 0.7137 * width, 0.1625 * height);
    builder.arcTo(0.0348 * width, 0.032 * height, 0, 0, 1, 0.7076 * width, 0.1968 * height);
    builder.arcTo(0.1743 * width, 0.1599 * height, 0, 0, 1, 0.6597 * width, 0.2249 * height);
    builder.arcTo(0.1307 * width, 0.1199 * height, 0, 0, 1, 0.5943 * width, 0.232 * height);
    builder.arcTo(0.1307 * width, 0.1199 * height, 0, 0, 1, 0.5542 * width, 0.2225 * height);
    builder.arcTo(0.0871 * width, 0.0799 * height, 0, 0, 1, 0.5673 * width, 0.2353 * height);
    builder.arcTo(0.0261 * width, 0.024 * height, 0, 0, 1, 0.5611 * width, 0.2729 * height);
    builder.lineTo(0.4889 * width, 0.316 * height);
    builder.arcTo(0.0261 * width, 0.024 * height, 0, 0, 0, 0.4766 * width, 0.3352 * height);
    builder.lineTo(0.4052 * width, 0.2992 * height);
    builder.arcTo(0.0173 * width, 0.0159 * height, 0, 0, 1, 0.4121 * width, 0.2841 * height);
    builder.lineTo(0.4914 * width, 0.2368 * height);
    builder.arcTo(0.0218 * width, 0.02 * height, 0, 0, 0, 0.4897 * width, 0.2129 * height);
    builder.lineTo(0.4409 * width, 0.1857 * height);
    builder.lineTo(0.3145 * width, 0.2529 * height);
    builder.close();
    builder.moveTo(0.4801 * width, 0.1633 * height);
    builder.lineTo(0.5263 * width, 0.1865 * height);
    builder.arcTo(0.0871 * width, 0.0799 * height, 0, 0, 0, 0.583 * width, 0.1905 * height);
    builder.arcTo(0.1307 * width, 0.1199 * height, 0, 0, 0, 0.6196 * width, 0.1721 * height);
    builder.arcTo(0.0261 * width, 0.024 * height, 0, 0, 0, 0.6117 * width, 0.1441 * height);
    builder.lineTo(0.5655 * width, 0.1193 * height);
    builder.fill();
    builder.setLineJoin('round');
    builder.begin();
    builder.moveTo(0.126 * width, 0.1316 * height);
    builder.lineTo(0.126 * width, 0.267 * height);
    builder.lineTo(0.378 * width, 0.4023 * height);
    builder.lineTo(0.5 * width, 0.6015 * height);
    builder.lineTo(0.622 * width, 0.4023 * height);
    builder.lineTo(0.874 * width, 0.267 * height);
    builder.lineTo(0.874 * width, 0.1316 * height);
    builder.moveTo(0, 0.3346 * height);
    builder.lineTo(0.126 * width, 0.267 * height);
    builder.moveTo(0.5 * width, 0.6015 * height);
    builder.lineTo(0.5 * width, height);
    builder.moveTo(width, 0.3346 * height);
    builder.lineTo(0.87 * width, 0.267 * height);
    builder.moveTo(0.378 * width, 0.4023 * height);
    builder.lineTo(0.622 * width, 0.4023 * height);
    builder.stroke();
    builder.setStrokeWidth(2 * extra1);
    builder.setStrokeColor(extra2 as string);
    builder.begin();
    builder.moveTo(0, 0.7331 * height);
    builder.lineTo(0, 0.3346 * height);
    builder.lineTo(0.126 * width, 0.1316 * height);
    builder.lineTo(0.374 * width, 0);
    builder.lineTo(0.626 * width, 0);
    builder.lineTo(0.874 * width, 0.1316 * height);
    builder.lineTo(width, 0.3346 * height);
    builder.lineTo(width, 0.7331 * height);
    builder.lineTo(0.5 * width, height);
    builder.close();
    builder.stroke();
  }
}
