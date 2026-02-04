// @ts-nocheck
import type { RenderContext, ShapeAttrs } from '../../../renderer.ts';
import { BaseShapeHandler } from '../../shape-registry.ts';

export class GmdlSliderDiscreteDotsHandler extends BaseShapeHandler {
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
    builder.setShadow(!0);
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
    let f;
    let g;
    this.getStyleNumber(style, 'handleSize', 10);
    x = this.getStyleNumber(style, 'barPos', 40) / 100;
    y = parseFloat(this.getStyleValue(style, 'fontSize', '12'));
    f = this.getStyleValue(style, 'fontColor', '#000000');
    g = this.getStyleValue(style, 'bright', '1');
    x = Math.max(0, Math.min(1, x));
    builder.save();
    builder.setStrokeColor('#bebebe' as string);
    builder.begin();
    builder.moveTo(0, 0.5 * height + 22.5);
    builder.lineTo(width, 0.5 * height + 22.5);
    builder.fillAndStroke();
    builder.restore();
    if (0.1 >= x) {
      builder.setFillColor('#bebebe' as string);
    }
    builder.begin();
    builder.moveTo(0, 0.5 * height + 22.5);
    builder.lineTo(x * width, 0.5 * height + 22.5);
    builder.fillAndStroke();
    builder.begin();
    builder.moveTo(x * width, 0.5 * height + 15.5);
    builder.lineTo(x * width - 10.5, 0.5 * height + 2.5);
    builder.arcTo(15, 15, 0, 0, 1, x * width, 0.5 * height - 22.5);
    builder.arcTo(15, 15, 0, 0, 1, x * width + 10.5, 0.5 * height + 2.5);
    builder.close();
    builder.fill();
    if ('1' == g) {
      builder.setFillColor('#000000' as string);
    } else {
      builder.setFillColor('#ffffff' as string);
    }
    builder.ellipse(-1.5, 0.5 * height + 21, 3, 3);
    builder.fill();
    builder.ellipse(0.2 * width - 1.5, 0.5 * height + 21, 3, 3);
    builder.fill();
    builder.ellipse(0.4 * width - 1.5, 0.5 * height + 21, 3, 3);
    builder.fill();
    builder.ellipse(0.6 * width - 1.5, 0.5 * height + 21, 3, 3);
    builder.fill();
    builder.ellipse(0.8 * width - 1.5, 0.5 * height + 21, 3, 3);
    builder.fill();
    builder.ellipse(width - 1.5, 0.5 * height + 21, 3, 3);
    builder.fill();
    builder.setFontSize(Number.parseFloat(String(y)) || 0);
    builder.setFontColor(f as string);
    builder.text(
      x * width,
      0.5 * height - 9,
      0,
      0,
      Math.round(100 * x).toString(),
      'center',
      'middle',
      0,
      0,
      0
    );
  }
}
