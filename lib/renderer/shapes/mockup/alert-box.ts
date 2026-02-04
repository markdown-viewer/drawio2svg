// @ts-nocheck
import type { RenderContext, ShapeAttrs } from '../../../renderer.ts';
import { BaseShapeHandler } from '../../shape-registry.ts';

export class MockupContainersAlertBoxHandler extends BaseShapeHandler {
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
    let b = width;
    let c = height;
    const f = this.getStyleValue(style, 'fillColor', '#ffffff');
    const g = this.getStyleValue(style, 'strokeColor', '#666666');
    const h = this.getStyleValue(style, 'strokeColor2', '#008cff');
    const k = this.getStyleValue(style, 'strokeColor3', '#c4c4c4');

    builder.translate(x, y);
    c = Math.max(c, 75);
    b = Math.max(b, 90);
    this.renderBackground(builder, x, y, b, c, style, getStencilShape, renderStencilShape, f, g);
    builder.setShadow(!1);
    this.renderForeground(builder, x, y, b, c, style, getStencilShape, renderStencilShape, g, k, h);
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
    builder.setFillColor(extra1 as string);
    builder.setStrokeColor(extra2 as string);
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
    renderStencilShape?: RenderContext['renderStencilShape'],
    extra1?: any,
    extra2?: any,
    extra3?: any
  ): void {
    if (!builder) return;
    let k;
    this.getStyleValue(style, 'strokeWidth', '1');
    builder.setStrokeColor(extra3 as string);
    builder.ellipse(width - 25, 5, 20, 20);
    builder.stroke();
    builder.setStrokeColor(extra2 as string);
    builder.begin();
    builder.moveTo(0, 30);
    builder.lineTo(width, 30);
    builder.stroke();
    extra3 = this.getStyleValue(style, 'mainText', 'Window Title').toString();
    x = this.getStyleValue(style, 'subText', 'Sub Text').toString().split(',');
    y = this.getStyleValue(style, 'buttonText', 'OK,Cancel').toString().split(',');
    k = this.getStyleValue(style, 'textColor', '#666666');
    extra1 = this.getStyleValue(style, 'textSize', '17').toString();
    extra2 = y.length;
    extra2 = (width - 10 * (extra2 + 1)) / extra2;
    builder.setFontColor(k as string);
    builder.setFontSize(Number.parseFloat(String(extra1)) || 0);
    builder.text(10, 15, 0, 0, extra3, 'left', 'middle', 0, 0, 0);
    extra3 = 10;
    for (k = 0; k < y.length; k++) {
      if ('' !== y[k]) {
        builder.rect(extra3, height - 10 - 1.5 * extra1, extra2, 1.5 * extra1);
        builder.stroke();
        builder.text(
          extra3 + 0.5 * extra2,
          height - 10 - 0.75 * extra1,
          0,
          0,
          y[k],
          'center',
          'middle',
          0,
          0,
          0
        );
      }
      extra3 = extra3 + extra2 + 10;
    }
    for (k = 0; k < x.length; k++) {
      builder.text(
        0.5 * width,
        30 + extra1 * (1.5 * k + 0.75),
        0,
        0,
        x[k],
        'center',
        'middle',
        0,
        0,
        0
      );
    }
    builder.stroke();
  }
}
