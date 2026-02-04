// @ts-nocheck
import type { RenderContext, ShapeAttrs } from '../../../renderer.ts';
import { BaseShapeHandler } from '../../shape-registry.ts';

export class MockupTextStickyNoteHandler extends BaseShapeHandler {
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
    this.renderForeground(builder, 0, 0, width, height, style, getStencilShape, renderStencilShape);
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
    builder.setFillColor('#ffffcc' as string);
    builder.begin();
    builder.moveTo(0.03 * width, 0.07 * height);
    builder.lineTo(0.89 * width, 0.06 * height);
    builder.arcTo(2.81 * width, 2.92 * height, 1, 0, 0, 0.99 * width, 0.98 * height);
    builder.lineTo(0.09 * width, 0.99 * height);
    builder.arcTo(2.81 * width, 2.92 * height, 1, 0, 1, 0.03 * width, 0.07 * height);
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
    renderStencilShape?: RenderContext['renderStencilShape']
  ): void {
    if (!builder) return;
    let b;
    let c;
    let f;
    let g;
    b = this.getStyleValue(style, 'mainText', 'Note line 1,Note line 2,Note line 3')
      .toString()
      .split(',');
    c = this.getStyleValue(style, 'textColor', '#666666').toString();
    f = this.getStyleValue(style, 'textSize', '17').toString();
    builder.setFillColor('#ff3300' as string);
    builder.begin();
    builder.moveTo(0.28 * width, 0);
    builder.lineTo(0.59 * width, 0);
    builder.lineTo(0.6 * width, 0.12 * height);
    builder.lineTo(0.28 * width, 0.13 * height);
    builder.close();
    builder.fill();
    builder.setFontSize(Number.parseFloat(String(f)) || 0);
    builder.setFontColor(c as string);
    c = b.length * f * 1.5;
    for (g = 0; g < b.length; g++) {
      builder.text(
        width / 2,
        (height - c) / 2 + g * f * 1.5 + 0.75 * f,
        0,
        0,
        b[g],
        'center',
        'middle',
        0,
        0,
        0
      );
    }
  }
}
