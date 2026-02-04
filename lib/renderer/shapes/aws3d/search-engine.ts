// @ts-nocheck
import type { RenderContext, ShapeAttrs } from '../../../renderer.ts';
import { BaseShapeHandler } from '../../shape-registry.ts';

export class Aws3dSearchEngineHandler extends BaseShapeHandler {
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
    let e = y;
    let f = parseFloat(this.getStyleValue(style, 'strokeWidth', '1'));

    builder.translate(d, e);
    d = (f * width) / 180;
    f = (f * height) / 192;
    e = this.getStyleValue(style, 'strokeColor2', '#292929');
    f = Math.min(d, f);
    this.renderBackground(
      builder,
      0,
      0,
      width,
      height,
      style,
      getStencilShape,
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
      getStencilShape,
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
    getStencilShape?: RenderContext['getStencilShape'],
    renderStencilShape?: RenderContext['renderStencilShape'],
    extra1?: any,
    extra2?: any
  ): void {
    if (!builder) return;
    builder.setStrokeWidth(extra1);
    builder.save();
    builder.save();
    builder.save();
    builder.setStrokeWidth(2 * extra1);
    builder.setStrokeColor(extra2 as string);
    builder.setLineJoin('round');
    builder.begin();
    builder.moveTo(0, 0.7281 * height);
    builder.lineTo(0.1667 * width, 0.5444 * height);
    builder.lineTo(0.1667 * width, 0.1832 * height);
    builder.lineTo(0.5011 * width, 0);
    builder.lineTo(0.8333 * width, 0.1832 * height);
    builder.lineTo(0.8333 * width, 0.5446 * height);
    builder.lineTo(width, 0.7281 * height);
    builder.lineTo(0.7486 * width, 0.7735 * height);
    builder.lineTo(0.5819 * width, 0.8617 * height);
    builder.lineTo(0.5011 * width, height);
    builder.lineTo(0.4169 * width, 0.8653 * height);
    builder.lineTo(0.2475 * width, 0.7704 * height);
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
    extra1?: any,
    extra2?: any
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
    builder.moveTo(0.1672 * width, 0.1837 * height);
    builder.lineTo(0.4989 * width, 0.3638 * height);
    builder.lineTo(0.4989 * width, 0.7291 * height);
    builder.lineTo(0.5825 * width, 0.8633 * height);
    builder.lineTo(0.4989 * width, height);
    builder.lineTo(0.4164 * width, 0.8622 * height);
    builder.lineTo(0.2458 * width, 0.7719 * height);
    builder.lineTo(0, 0.7276 * height);
    builder.lineTo(0.1661 * width, 0.5454 * height);
    builder.close();
    builder.moveTo(0.7486 * width, 0.7714 * height);
    builder.lineTo(0.8317 * width, 0.5459 * height);
    builder.lineTo(width, 0.727 * height);
    builder.close();
    builder.fill();
    if ('0' == y) {
      builder.setAlpha(x[1]);
    } else {
      builder.setAlpha(x[0]);
    }
    builder.begin();
    builder.moveTo(0.4989 * width, 0.3643 * height);
    builder.lineTo(0.8317 * width, 0.1827 * height);
    builder.lineTo(0.8317 * width, 0.5465 * height);
    builder.lineTo(0.7508 * width, 0.7714 * height);
    builder.lineTo(0.5836 * width, 0.8633 * height);
    builder.lineTo(0.4989 * width, 0.727 * height);
    builder.close();
    builder.fill();
    builder.restore();
    builder.setShadow(!1);
    builder.setLineJoin('round');
    builder.begin();
    builder.moveTo(0.1672 * width, 0.1837 * height);
    builder.lineTo(0.4989 * width, 0.3638 * height);
    builder.lineTo(0.4989 * width, 0.7291 * height);
    builder.lineTo(0.5825 * width, 0.8633 * height);
    builder.lineTo(0.4989 * width, height);
    builder.lineTo(0.4164 * width, 0.8622 * height);
    builder.lineTo(0.2458 * width, 0.7719 * height);
    builder.lineTo(0, 0.7276 * height);
    builder.lineTo(0.1661 * width, 0.5454 * height);
    builder.close();
    builder.moveTo(0.7486 * width, 0.7714 * height);
    builder.lineTo(0.8317 * width, 0.5459 * height);
    builder.lineTo(width, 0.727 * height);
    builder.close();
    builder.moveTo(0.4989 * width, 0.3643 * height);
    builder.lineTo(0.8317 * width, 0.1827 * height);
    builder.lineTo(0.8317 * width, 0.5465 * height);
    builder.lineTo(0.7508 * width, 0.7714 * height);
    builder.lineTo(0.5836 * width, 0.8633 * height);
    builder.lineTo(0.4989 * width, 0.727 * height);
    builder.close();
    builder.moveTo(0.1667 * width, 0.5459 * height);
    builder.lineTo(0.2486 * width, 0.7704 * height);
    builder.moveTo(0.4164 * width, 0.8633 * height);
    builder.lineTo(0.4989 * width, 0.727 * height);
    builder.lineTo(0.4989 * width, height);
    builder.stroke();
    builder.restore();
    builder.setShadow(!1);
    x = this.getStyleValue(style, 'strokeColor', '#000000');
    builder.setFillColor(x as string);
    builder.begin();
    builder.moveTo(0.3427 * width, 0.179 * height);
    builder.arcTo(0.0277 * width, 0.0261 * height, 0, 0, 1, 0.3267 * width, 0.1487 * height);
    builder.arcTo(0.0664 * width, 0.0365 * height, 0, 0, 1, 0.3621 * width, 0.1227 * height);
    builder.arcTo(0.1052 * width, 0.0992 * height, 0, 0, 1, 0.4247 * width, 0.1195 * height);
    builder.arcTo(0.1274 * width, 0.12 * height, 0, 0, 1, 0.4884 * width, 0.1018 * height);
    builder.arcTo(0.1329 * width, 0.1253 * height, 0, 0, 1, 0.5548 * width, 0.1112 * height);
    builder.arcTo(0.0377 * width, 0.0344 * height, 0, 0, 1, 0.572 * width, 0.166 * height);
    builder.arcTo(0.0388 * width, 0.0365 * height, 0, 0, 1, 0.6047 * width, 0.1775 * height);
    builder.arcTo(0.021 * width, 0.0198 * height, 0, 0, 1, 0.5936 * width, 0.2046 * height);
    builder.arcTo(0.0332 * width, 0.0313 * height, 0, 0, 1, 0.6008 * width, 0.2416 * height);
    builder.arcTo(0.072 * width, 0.0678 * height, 0, 0, 1, 0.5437 * width, 0.2677 * height);
    builder.arcTo(0.1052 * width, 0.0939 * height, 0, 0, 1, 0.4828 * width, 0.2563 * height);
    builder.close();
    builder.moveTo(0.448 * width, 0.2156 * height);
    builder.arcTo(0.0111 * width, 0.0104 * height, 0, 0, 0, 0.459 * width, 0.2255 * height);
    builder.arcTo(0.0138 * width, 0.013 * height, 0, 0, 0, 0.4729 * width, 0.2182 * height);
    builder.lineTo(0.4773 * width, 0.1874 * height);
    builder.arcTo(0.0664 * width, 0.0626 * height, 0, 0, 0, 0.5116 * width, 0.1759 * height);
    builder.arcTo(0.0277 * width, 0.0626 * height, 0, 0, 0, 0.5233 * width, 0.1503 * height);
    builder.arcTo(0.0554 * width, 0.0261 * height, 0, 0, 0, 0.5022 * width, 0.1336 * height);
    builder.arcTo(0.0886 * width, 0.0835 * height, 0, 0, 0, 0.4607 * width, 0.1305 * height);
    builder.arcTo(0.0664 * width, 0.0626 * height, 0, 0, 0, 0.4313 * width, 0.142 * height);
    builder.arcTo(0.0332 * width, 0.0313 * height, 0, 0, 0, 0.4175 * width, 0.1597 * height);
    builder.arcTo(0.0249 * width, 0.0235 * height, 0, 0, 0, 0.4313 * width, 0.1822 * height);
    builder.arcTo(0.0443 * width, 0.0418 * height, 0, 0, 0, 0.4535 * width, 0.1884 * height);
    builder.close();
    builder.moveTo(0.4718 * width, 0.1764 * height);
    builder.arcTo(0.0443 * width, 0.0418 * height, 0, 0, 1, 0.4496 * width, 0.1754 * height);
    builder.arcTo(0.0221 * width, 0.0157 * height, 0, 0, 1, 0.4369 * width, 0.1634 * height);
    builder.arcTo(0.0221 * width, 0.0183 * height, 0, 0, 1, 0.4496 * width, 0.1467 * height);
    builder.arcTo(0.0609 * width, 0.0574 * height, 0, 0, 1, 0.4759 * width, 0.1414 * height);
    builder.arcTo(0.0388 * width, 0.0365 * height, 0, 0, 1, 0.5033 * width, 0.1514 * height);
    builder.arcTo(0.0443 * width, 0.0209 * height, 0, 0, 1, 0.495 * width, 0.1701 * height);
    builder.arcTo(0.0388 * width, 0.0365 * height, 0, 0, 1, 0.4718 * width, 0.1764 * height);
    builder.close();
    builder.fill();
    builder.setStrokeWidth(2 * extra1);
    builder.setStrokeColor(extra2 as string);
    builder.setLineJoin('round');
    builder.begin();
    builder.moveTo(0, 0.7281 * height);
    builder.lineTo(0.1667 * width, 0.5444 * height);
    builder.lineTo(0.1667 * width, 0.1832 * height);
    builder.lineTo(0.5011 * width, 0);
    builder.lineTo(0.8333 * width, 0.1832 * height);
    builder.lineTo(0.8333 * width, 0.5446 * height);
    builder.lineTo(width, 0.7281 * height);
    builder.lineTo(0.7486 * width, 0.7735 * height);
    builder.lineTo(0.5819 * width, 0.8617 * height);
    builder.lineTo(0.5011 * width, height);
    builder.lineTo(0.4169 * width, 0.8653 * height);
    builder.lineTo(0.2475 * width, 0.7704 * height);
    builder.close();
    builder.stroke();
  }
}
