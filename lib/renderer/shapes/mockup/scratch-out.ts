// @ts-nocheck
import type { RenderContext, ShapeAttrs } from '../../../renderer.ts';
import { BaseShapeHandler } from '../../shape-registry.ts';

export class MockupMarkupScratchOutHandler extends BaseShapeHandler {
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
    builder.moveTo(0.038 * width, 0.095 * height);
    builder.curveTo(
      0.038 * width,
      0.095 * height,
      0.289 * width,
      -0.045 * height,
      0.186 * width,
      0.05 * height
    );
    builder.curveTo(
      0.084 * width,
      0.145 * height,
      -0.046 * width,
      0.251 * height,
      0.072 * width,
      0.208 * height
    );
    builder.curveTo(
      0.191 * width,
      0.164 * height,
      0.522 * width,
      -0.09 * height,
      0.366 * width,
      0.062 * height
    );
    builder.curveTo(
      0.21 * width,
      0.215 * height,
      -0.094 * width,
      0.38 * height,
      0.108 * width,
      0.304 * height
    );
    builder.curveTo(
      0.309 * width,
      0.228 * height,
      0.73 * width,
      -0.126 * height,
      0.544 * width,
      0.096 * height
    );
    builder.curveTo(
      0.358 * width,
      0.319 * height,
      -0.168 * width,
      0.592 * height,
      0.108 * width,
      0.476 * height
    );
    builder.curveTo(
      0.382 * width,
      0.36 * height,
      0.972 * width,
      -0.138 * height,
      0.779 * width,
      0.114 * height
    );
    builder.curveTo(
      0.585 * width,
      0.365 * height,
      -0.12 * width,
      0.688 * height,
      0.071 * width,
      0.639 * height
    );
    builder.curveTo(
      0.262 * width,
      0.59 * height,
      1.174 * width,
      0.012 * height,
      0.936 * width,
      0.238 * height
    );
    builder.curveTo(
      0.699 * width,
      0.462 * height,
      -0.216 * width,
      0.855 * height,
      0.085 * width,
      0.806 * height
    );
    builder.curveTo(
      0.386 * width,
      0.758 * height,
      1.185 * width,
      0.26 * height,
      0.935 * width,
      0.534 * height
    );
    builder.curveTo(
      0.685 * width,
      0.808 * height,
      -0.186 * width,
      0.94 * height,
      0.236 * width,
      0.895 * height
    );
    builder.curveTo(
      0.659 * width,
      0.85 * height,
      1.095 * width,
      0.608 * height,
      0.905 * width,
      0.769 * height
    );
    builder.curveTo(
      0.715 * width,
      0.93 * height,
      0.286 * width,
      0.962 * height,
      0.661 * width,
      0.931 * height
    );
    builder.stroke();
    builder.restore();
  }
}
