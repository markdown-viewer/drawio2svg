// @ts-nocheck
import type { RenderContext, ShapeAttrs } from '../../../renderer.ts';
import { BaseShapeHandler } from '../../shape-registry.ts';

export class MockupMiscPlaybackControlsHandler extends BaseShapeHandler {
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

    c = Math.max(c, 30);
    b = Math.max(225, b);
    builder.translate(x, y);
    this.renderBackground(builder, 0, 0, b, c, style, getStencilShape, renderStencilShape, 30);
    builder.setShadow(!1);
    this.renderForeground(builder, b, c, 30, 22, style, getStencilShape, renderStencilShape);
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
    builder.rect(0, 0.5 * (height - extra1), width, extra1);
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
    let f;
    let g;
    let h;
    x = this.getStyleValue(style, 'fillColor2', '#99ddff');
    f = this.getStyleValue(style, 'strokeColor2', 'none');
    g = this.getStyleValue(style, 'fillColor3', '#ffffff');
    h = this.getStyleValue(style, 'strokeColor3', 'none');
    builder.setStrokeColor(f as string);
    builder.setFillColor(x as string);
    builder.ellipse(10, 0.5 * y - 0.5 * height, height, height);
    builder.fillAndStroke();
    builder.ellipse(40, 0.5 * y - 0.5 * height, height, height);
    builder.fillAndStroke();
    builder.ellipse(70, 0.5 * y - 0.5 * height, height, height);
    builder.fillAndStroke();
    builder.ellipse(100, 0.5 * y - 0.5 * height, height, height);
    builder.fillAndStroke();
    builder.ellipse(130, 0.5 * y - 0.5 * height, height, height);
    builder.fillAndStroke();
    builder.ellipse(160, 0.5 * y - 0.5 * height, height, height);
    builder.fillAndStroke();
    builder.ellipse(190, 0.5 * y - 0.5 * height, height, height);
    builder.fillAndStroke();
    builder.setStrokeColor(h as string);
    builder.setFillColor(g as string);
    y = 0.5 * y - 0.5 * width;
    builder.begin();
    builder.moveTo(16, y + 10);
    builder.lineTo(16, y + 20);
    builder.lineTo(18, y + 20);
    builder.lineTo(18, y + 10);
    builder.close();
    builder.moveTo(20, y + 15);
    builder.lineTo(25, y + 20);
    builder.lineTo(25, y + 10);
    builder.close();
    builder.fillAndStroke();
    builder.begin();
    builder.moveTo(44, y + 15);
    builder.lineTo(49, y + 20);
    builder.lineTo(49, y + 10);
    builder.close();
    builder.moveTo(51, y + 15);
    builder.lineTo(56, y + 20);
    builder.lineTo(56, y + 10);
    builder.close();
    builder.fillAndStroke();
    builder.begin();
    builder.moveTo(77, y + 15);
    builder.lineTo(82, y + 20);
    builder.lineTo(82, y + 10);
    builder.close();
    builder.fillAndStroke();
    builder.begin();
    builder.moveTo(108, y + 10);
    builder.lineTo(108, y + 20);
    builder.lineTo(110, y + 20);
    builder.lineTo(110, y + 10);
    builder.close();
    builder.moveTo(117, y + 15);
    builder.lineTo(112, y + 20);
    builder.lineTo(112, y + 10);
    builder.close();
    builder.fillAndStroke();
    builder.begin();
    builder.moveTo(144, y + 15);
    builder.lineTo(139, y + 20);
    builder.lineTo(139, y + 10);
    builder.close();
    builder.fillAndStroke();
    builder.begin();
    builder.moveTo(171, y + 15);
    builder.lineTo(166, y + 20);
    builder.lineTo(166, y + 10);
    builder.close();
    builder.moveTo(178, y + 15);
    builder.lineTo(173, y + 20);
    builder.lineTo(173, y + 10);
    builder.close();
    builder.fillAndStroke();
    builder.begin();
    builder.moveTo(203, y + 10);
    builder.lineTo(203, y + 20);
    builder.lineTo(205, y + 20);
    builder.lineTo(205, y + 10);
    builder.close();
    builder.moveTo(201, y + 15);
    builder.lineTo(196, y + 20);
    builder.lineTo(196, y + 10);
    builder.close();
    builder.fillAndStroke();
  }
}
