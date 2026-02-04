// @ts-nocheck
import type { RenderContext, ShapeAttrs } from '../../../renderer.ts';
import { BaseShapeHandler } from '../../shape-registry.ts';

export class MockupTextBulletedListHandler extends BaseShapeHandler {
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
    renderStencilShape?: RenderContext['renderStencilShape']
  ): void {
    if (!builder) return;
    let b;
    let c;
    let f;
    width = this.getStyleValue(style, 'mainText', 'Note line 1,Note line 2,Note line 3')
      .toString()
      .split(',');
    b = this.getStyleValue(style, 'textColor', '#666666');
    height = this.getStyleValue(style, 'textSize', '17');
    c = this.getStyleValue(style, 'bulletStyle', 'none');
    builder.setFontColor(b as string);
    builder.setFontSize(Number.parseFloat(String(height)) || 0);
    for (b = 0; b < width.length; b++) {
      f =
        c === 'number'
          ? b + 1 + ') ' + width[b]
          : c === 'hyphen'
            ? '- ' + width[b]
            : c === 'dot'
              ? String.fromCharCode(8226) + ' ' + width[b]
              : '  ' + width[b];
      builder.text(10, b * height * 1.5 + 0.75 * height, 0, 0, f, 'left', 'middle', 0, 0, 0);
    }
  }
}
