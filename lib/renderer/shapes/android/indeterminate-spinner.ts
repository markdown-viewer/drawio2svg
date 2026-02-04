// @ts-nocheck
import type { RenderContext, ShapeAttrs } from '../../../renderer.ts';
import { BaseShapeHandler } from '../../shape-registry.ts';

export class AndroidIndeterminateSpinnerHandler extends BaseShapeHandler {
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
    builder.setGradient(
      '#aaaaaa',
      '#dddddd',
      0.325 * width,
      0,
      0.675 * width,
      0.5 * height,
      'south',
      1,
      1
    );
    builder.begin();
    builder.moveTo(0.5 * width, 0.1 * height);
    builder.arcTo(0.4 * width, 0.4 * height, 0, 0, 0, 0.5 * width, 0.9 * height);
    builder.lineTo(0.5 * width, height);
    builder.arcTo(0.5 * width, 0.5 * height, 0, 0, 1, 0.5 * width, 0);
    builder.close();
    builder.fill();
    builder.setGradient(
      '#ffffff',
      '#dddddd',
      0.325 * width,
      0,
      0.675 * width,
      0.5 * height,
      'south',
      1,
      1
    );
    builder.begin();
    builder.moveTo(0.5 * width, 0.1 * height);
    builder.arcTo(0.4 * width, 0.4 * height, 0, 0, 1, 0.5 * width, 0.9 * height);
    builder.lineTo(0.5 * width, height);
    builder.arcTo(0.5 * width, 0.5 * height, 0, 0, 0, 0.5 * width, 0);
    builder.close();
    builder.fill();
  }
}
