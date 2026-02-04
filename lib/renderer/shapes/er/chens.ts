// @ts-nocheck
import type { RenderContext, ShapeAttrs } from '../../../renderer.ts';
import { BaseShapeHandler } from '../../shape-registry.ts';

export class ErChensHandler extends BaseShapeHandler {
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
    const f = this.getStyleValue(style, 'textColor', '#666666');
    const g = this.getStyleValue(style, 'fontSize', '17');

    builder.translate(x, y);
    b = Math.max(b, 40);
    c = Math.max(c, 40);
    this.renderBackground(builder, x, y, b, c, style, getStencilShape, renderStencilShape);
    builder.setShadow(!1);
    this.renderForeground(builder, x, y, b, c, style, getStencilShape, renderStencilShape, g, f);
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
    builder.begin();
    builder.moveTo(0, 0);
    builder.lineTo(width, 0);
    builder.lineTo(width, height);
    builder.lineTo(0, height);
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
    builder.begin();
    builder.moveTo(0, 0.25 * height);
    builder.lineTo(width, 0.25 * height);
    builder.moveTo(0, 0.5 * height);
    builder.lineTo(width, 0.5 * height);
    builder.moveTo(0, 0.75 * height);
    builder.lineTo(width, 0.75 * height);
    builder.moveTo(0.25 * width, 0.5 * height);
    builder.lineTo(0.25 * width, height);
    builder.moveTo(0.5 * width, 0.25 * height);
    builder.lineTo(0.5 * width, height);
    builder.moveTo(0.75 * width, 0.5 * height);
    builder.lineTo(0.75 * width, height);
    builder.stroke();
    builder.begin();
    builder.setFontSize(Number.parseFloat(String(extra1)) || 0);
    builder.setFontColor(extra2 as string);
    builder.text(
      0.5 * width,
      0.125 * height,
      0,
      0,
      "ERD Peter Chen's Notation",
      'center',
      'middle',
      0,
      0,
      0
    );
    builder.setFontSize(Number.parseFloat(String(0.85 * extra1)) || 0);
    builder.text(0.25 * width, 0.375 * height, 0, 0, 'Cardinality', 'center', 'middle', 0, 0, 0);
    builder.text(0.75 * width, 0.375 * height, 0, 0, 'Optionality', 'center', 'middle', 0, 0, 0);
    builder.setFontSize(Number.parseFloat(String(0.7 * extra1)) || 0);
    builder.text(0.125 * width, 0.625 * height, 0, 0, '1', 'center', 'middle', 0, 0, 0);
    builder.text(0.375 * width, 0.625 * height, 0, 0, 'One', 'center', 'middle', 0, 0, 0);
    builder.text(0.625 * width, 0.625 * height, 0, 0, '0', 'center', 'middle', 0, 0, 0);
    builder.text(0.875 * width, 0.625 * height, 0, 0, 'Optional', 'center', 'middle', 0, 0, 0);
    builder.text(0.125 * width, 0.875 * height, 0, 0, 'N', 'center', 'middle', 0, 0, 0);
    builder.text(0.375 * width, 0.875 * height, 0, 0, 'Many', 'center', 'middle', 0, 0, 0);
    builder.text(0.625 * width, 0.875 * height, 0, 0, '1', 'center', 'middle', 0, 0, 0);
    builder.text(0.875 * width, 0.875 * height, 0, 0, 'Mandatory', 'center', 'middle', 0, 0, 0);
  }
}
