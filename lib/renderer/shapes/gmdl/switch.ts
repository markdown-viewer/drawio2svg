// @ts-nocheck
import type { RenderContext, ShapeAttrs } from '../../../renderer.ts';
import { BaseShapeHandler } from '../../shape-registry.ts';

export class GmdlSwitchHandler extends BaseShapeHandler {
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

    const f = this.getStyleValue(style, 'switchState', 'on');

    builder.translate(x, y);
    this.renderBackground(
      builder,
      x,
      y,
      width,
      height,
      style,
      getStencilShape,
      renderStencilShape,
      f
    );
    builder.setShadow(!0);
    this.renderForeground(
      builder,
      x,
      y,
      width,
      height,
      style,
      getStencilShape,
      renderStencilShape,
      f
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
    extra1?: any
  ): void {
    if (!builder) return;
    builder.begin();
    if (extra1 === 'on') {
      builder.save();
      builder.setAlpha('0.5');
      builder.moveTo(0.135 * width, 0.8 * height);
      builder.arcTo(0.135 * width, 0.3 * height, 0, 0, 1, 0.135 * width, 0.2 * height);
      builder.lineTo(0.675 * width, 0.2 * height);
      builder.arcTo(0.135 * width, 0.3 * height, 0, 0, 1, 0.675 * width, 0.8 * height);
      builder.close();
      builder.fillAndStroke();
      builder.restore();
    } else {
      builder.setFillColor('#BCBBBB' as string);
      builder.moveTo(0.225 * width, 0.8 * height);
      builder.arcTo(0.135 * width, 0.3 * height, 0, 0, 1, 0.225 * width, 0.2 * height);
      builder.lineTo(0.865 * width, 0.2 * height);
      builder.arcTo(0.135 * width, 0.3 * height, 0, 0, 1, 0.865 * width, 0.8 * height);
      builder.close();
      builder.fillAndStroke();
    }
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
    extra1?: any
  ): void {
    if (!builder) return;
    builder.begin();
    if (extra1 === 'on') {
      builder.ellipse(0.36 * width, 0, 0.64 * width, height);
    } else {
      builder.setFillColor('#F1F1F1' as string);
      builder.ellipse(0, 0, 0.64 * width, height);
    }
    builder.fillAndStroke();
  }
}
