// @ts-nocheck
import type { RenderContext, ShapeAttrs } from '../../../renderer.ts';
import { BaseShapeHandler } from '../../shape-registry.ts';

export class MockupNavigationCoverFlowHandler extends BaseShapeHandler {
  constructor(renderCtx: RenderContext) {
    super(renderCtx);
  }

  render(attrs: ShapeAttrs): void {
    const { builder, currentGroup, applyShapeAttrsToBuilder, x, y, width, height } = this.renderCtx;
    if (!builder || !currentGroup) return;
    if (width <= 0 || height <= 0) return;

    builder.setCanvasRoot(currentGroup);
    builder.save();
    applyShapeAttrsToBuilder(builder, attrs);

    builder.translate(x, y);
    builder.begin();
    builder.moveTo(0.0924 * width, 0.07 * height);
    builder.lineTo(0.005 * width, 0.01 * height);
    builder.lineTo(0.005 * width, 0.99 * height);
    builder.lineTo(0.0924 * width, 0.93 * height);
    builder.moveTo(0.1774 * width, 0.09 * height);
    builder.lineTo(0.0924 * width, 0.01 * height);
    builder.lineTo(0.0924 * width, 0.99 * height);
    builder.lineTo(0.1774 * width, 0.91 * height);
    builder.moveTo(0.3373 * width, 0.22 * height);
    builder.lineTo(0.1774 * width, 0.01 * height);
    builder.lineTo(0.1774 * width, 0.99 * height);
    builder.lineTo(0.3373 * width, 0.78 * height);
    builder.moveTo(0.912 * width, 0.07 * height);
    builder.lineTo(0.998 * width, 0.01 * height);
    builder.lineTo(0.998 * width, 0.99 * height);
    builder.lineTo(0.912 * width, 0.93 * height);
    builder.moveTo(0.8271 * width, 0.09 * height);
    builder.lineTo(0.912 * width, 0.01 * height);
    builder.lineTo(0.912 * width, 0.99 * height);
    builder.lineTo(0.8271 * width, 0.91 * height);
    builder.moveTo(0.6672 * width, 0.22 * height);
    builder.lineTo(0.8271 * width, 0.01 * height);
    builder.lineTo(0.8271 * width, 0.99 * height);
    builder.lineTo(0.6672 * width, 0.78 * height);
    builder.moveTo(0.3373 * width, 0.005 * height);
    builder.lineTo(0.3373 * width, 0.995 * height);
    builder.lineTo(0.6672 * width, 0.995 * height);
    builder.lineTo(0.6672 * width, 0.005 * height);
    builder.close();
    builder.fillAndStroke();
    builder.restore();
  }
}
