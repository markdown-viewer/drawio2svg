// @ts-nocheck
import type { RenderContext, ShapeAttrs } from '../../../renderer.ts';
import { BaseShapeHandler } from '../../shape-registry.ts';

export class RackGeneralRackNumberingHandler extends BaseShapeHandler {
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
    let c = height;
    const f = this.getStyleNumber(style, 'unitNum', 42);
    const g = this.getStyleNumber(style, 'unitHeight', 14.8);
    const h = parseFloat(this.getStyleValue(style, 'textSize', '12'));

    builder.translate(x, y);
    c = f * g;
    this.renderBackground(builder, 0, 0, width, c, style, getStencilShape, renderStencilShape, h);
    builder.setShadow(!1);
    this.render_sideText(builder, width, c, f, g, h);
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
    builder.rect(3 * extra1, 0, 160.9, height);
    builder.fillAndStroke();
  }

  private render_sideText(
    builder: RenderContext['builder'],
    p1: any,
    p2: any,
    p3: any,
    p4: any,
    p5: any
  ): void {
    if (!builder) return;
    let g;
    p1 = this.getStyleValue(this.renderCtx.style, 'textColor', '#666666');
    g = this.getStyleValue(this.renderCtx.style, 'numDir', 'descend');
    builder.setFontSize(Number.parseFloat(String(p5)) || 0);
    builder.setFontColor(p1 as string);
    if (g === 'ascend') {
      for (p1 = 0; p1 < p3; p1++) {
        builder.text(
          p5,
          0.5 * p4 + p1 * p4,
          0,
          0,
          (p1 + 1).toString(),
          'center',
          'middle',
          0,
          0,
          0
        );
      }
    } else {
      for (p1 = 0; p1 < p3; p1++) {
        builder.text(
          p5,
          p2 - 0.5 * p4 - p1 * p4,
          0,
          0,
          (p1 + 1).toString(),
          'center',
          'middle',
          0,
          0,
          0
        );
      }
    }
    builder.setStrokeColor('#dddddd' as string);
    builder.begin();
    for (p1 = 0; p1 < p3 + 1; p1++) {
      (builder.moveTo(0, p1 * p4), builder.lineTo(3 * p5, p1 * p4));
    }
    builder.stroke();
  }
}
