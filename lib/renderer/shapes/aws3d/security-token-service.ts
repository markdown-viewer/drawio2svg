// @ts-nocheck
import type { RenderContext, ShapeAttrs } from '../../../renderer.ts';
import { BaseShapeHandler } from '../../shape-registry.ts';

export class Aws3dSecurityTokenServiceHandler extends BaseShapeHandler {
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
    builder.moveTo(0.4773 * width, 0.1915 * height);
    builder.arcTo(0.1274 * width, 0.12 * height, 0, 0, 1, 0.4358 * width, 0.1968 * height);
    builder.arcTo(0.1107 * width, 0.1044 * height, 0, 0, 1, 0.3937 * width, 0.1905 * height);
    builder.arcTo(0.0554 * width, 0.0522 * height, 0, 0, 1, 0.3682 * width, 0.1707 * height);
    builder.arcTo(0.0332 * width, 0.0313 * height, 0, 0, 1, 0.3699 * width, 0.1414 * height);
    builder.arcTo(0.0775 * width, 0.0731 * height, 0, 0, 1, 0.4009 * width, 0.118 * height);
    builder.arcTo(0.1107 * width, 0.1044 * height, 0, 0, 1, 0.4524 * width, 0.1059 * height);
    builder.arcTo(0.1107 * width, 0.1044 * height, 0, 0, 1, 0.5028 * width, 0.1112 * height);
    builder.arcTo(0.0664 * width, 0.0626 * height, 0, 0, 1, 0.531 * width, 0.1315 * height);
    builder.arcTo(0.0332 * width, 0.0313 * height, 0, 0, 1, 0.531 * width, 0.1597 * height);
    builder.lineTo(0.5615 * width, 0.1754 * height);
    builder.lineTo(0.5526 * width, 0.1905 * height);
    builder.lineTo(0.5759 * width, 0.1999 * height);
    builder.lineTo(0.5753 * width, 0.2109 * height);
    builder.lineTo(0.5792 * width, 0.2161 * height);
    builder.lineTo(0.6135 * width, 0.2182 * height);
    builder.lineTo(0.6113 * width, 0.2416 * height);
    builder.lineTo(0.5819 * width, 0.2474 * height);
    builder.close();
    builder.moveTo(0.4756 * width, 0.1816 * height);
    builder.arcTo(0.0554 * width, 0.0522 * height, 0, 0, 0, 0.5 * width, 0.1691 * height);
    builder.arcTo(0.0332 * width, 0.0313 * height, 0, 0, 0, 0.5144 * width, 0.1435 * height);
    builder.arcTo(0.0277 * width, 0.0261 * height, 0, 0, 0, 0.4967 * width, 0.1247 * height);
    builder.arcTo(0.0554 * width, 0.0522 * height, 0, 0, 0, 0.4729 * width, 0.1174 * height);
    builder.arcTo(0.1107 * width, 0.1044 * height, 0, 0, 0, 0.4452 * width, 0.1169 * height);
    builder.arcTo(0.0831 * width, 0.0783 * height, 0, 0, 0, 0.4197 * width, 0.1232 * height);
    builder.arcTo(0.0554 * width, 0.0522 * height, 0, 0, 0, 0.397 * width, 0.1357 * height);
    builder.arcTo(0.0388 * width, 0.0365 * height, 0, 0, 0, 0.3859 * width, 0.1555 * height);
    builder.arcTo(0.0305 * width, 0.0287 * height, 0, 0, 0, 0.4053 * width, 0.178 * height);
    builder.arcTo(0.072 * width, 0.0678 * height, 0, 0, 0, 0.4385 * width, 0.1863 * height);
    builder.arcTo(0.0831 * width, 0.0783 * height, 0, 0, 0, 0.4596 * width, 0.1848 * height);
    builder.arcTo(0.0664 * width, 0.0626 * height, 0, 0, 0, 0.4756 * width, 0.1816 * height);
    builder.fill();
    builder.setStrokeWidth(1.5 * extra1);
    builder.setLineJoin('round');
    builder.setLineCap('round');
    builder.begin();
    builder.moveTo(0.4939 * width, 0.1326 * height);
    builder.lineTo(0.4474 * width, 0.1508 * height);
    builder.lineTo(0.4812 * width, 0.1576 * height);
    builder.moveTo(0.4889 * width, 0.1733 * height);
    builder.lineTo(0.4939 * width, 0.1775 * height);
    builder.moveTo(0.5061 * width, 0.1576 * height);
    builder.lineTo(0.5199 * width, 0.1597 * height);
    builder.moveTo(0.5094 * width, 0.1394 * height);
    builder.lineTo(0.5244 * width, 0.1378 * height);
    builder.moveTo(0.4945 * width, 0.1247 * height);
    builder.lineTo(0.4994 * width, 0.1185 * height);
    builder.moveTo(0.4679 * width, 0.1175 * height);
    builder.lineTo(0.4707 * width, 0.1117 * height);
    builder.moveTo(0.4396 * width, 0.1195 * height);
    builder.lineTo(0.4374 * width, 0.1138 * height);
    builder.moveTo(0.412 * width, 0.1284 * height);
    builder.lineTo(0.4059 * width, 0.1232 * height);
    builder.moveTo(0.3948 * width, 0.1441 * height);
    builder.lineTo(0.3804 * width, 0.1425 * height);
    builder.moveTo(0.3931 * width, 0.1608 * height);
    builder.lineTo(0.3804 * width, 0.1649 * height);
    builder.moveTo(0.4059 * width, 0.1754 * height);
    builder.lineTo(0.3998 * width, 0.1801 * height);
    builder.moveTo(0.4308 * width, 0.1822 * height);
    builder.lineTo(0.4286 * width, 0.1884 * height);
    builder.moveTo(0.4618 * width, 0.1827 * height);
    builder.lineTo(0.4635 * width, 0.1868 * height);
    builder.stroke();
    builder.setStrokeWidth(2 * extra1);
    builder.setStrokeColor(extra2 as string);
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
