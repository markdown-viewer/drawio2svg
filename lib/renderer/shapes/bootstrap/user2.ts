// @ts-nocheck
import type { RenderContext, ShapeAttrs } from '../../../renderer.ts';
import { BaseShapeHandler } from '../../shape-registry.ts';

export class BootstrapUser2Handler extends BaseShapeHandler {
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
    builder.moveTo(0, 0.95 * height);
    builder.arcTo(0.3 * width, 0.3 * height, 0, 0, 1, 0.02 * width, 0.87 * height);
    builder.arcTo(0.1 * width, 0.1 * height, 0, 0, 1, 0.08 * width, 0.812 * height);
    builder.arcTo(3 * width, 3 * height, 0, 0, 1, 0.29 * width, 0.732 * height);
    builder.arcTo(0.15 * width, 0.15 * height, 0, 0, 0, 0.385 * width, 0.607 * height);
    builder.arcTo(0.11 * width, 0.11 * height, 0, 0, 0, 0.355 * width, 0.53 * height);
    builder.arcTo(0.3 * width, 0.3 * height, 0, 0, 1, 0.305 * width, 0.44 * height);
    builder.arcTo(0.33 * width, 0.38 * height, 0, 0, 1, 0.312 * width, 0.15 * height);
    builder.arcTo(0.218 * width, 0.218 * height, 0, 0, 1, 0.688 * width, 0.15 * height);
    builder.arcTo(0.33 * width, 0.38 * height, 0, 0, 1, 0.693 * width, 0.44 * height);
    builder.arcTo(0.25 * width, 0.25 * height, 0, 0, 1, 0.645 * width, 0.53 * height);
    builder.arcTo(0.1 * width, 0.1 * height, 0, 0, 0, 0.612 * width, 0.6 * height);
    builder.arcTo(0.15 * width, 0.15 * height, 0, 0, 0, 0.7 * width, 0.726 * height);
    builder.arcTo(3 * width, 3 * height, 0, 0, 1, 0.92 * width, 0.812 * height);
    builder.arcTo(0.1 * width, 0.1 * height, 0, 0, 1, 0.97 * width, 0.865 * height);
    builder.arcTo(0.2 * width, 0.2 * height, 0, 0, 1, 0.995 * width, 0.952 * height);
    builder.close();
    builder.fill();
    builder.restore();
  }
}
