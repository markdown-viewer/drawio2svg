// @ts-nocheck
import type { RenderContext, ShapeAttrs } from '../../../renderer.ts';
import { BaseShapeHandler } from '../../shape-registry.ts';

export class LeanMappingOrdersHandler extends BaseShapeHandler {
  constructor(renderCtx: RenderContext) {
    super(renderCtx);
  }

  render(attrs: ShapeAttrs): void {
    const { builder, currentGroup, applyShapeAttrsToBuilder, x, y, width, height, style } =
      this.renderCtx;
    if (!builder || !currentGroup) return;
    if (width <= 0 || height <= 0) return;

    builder.setCanvasRoot(currentGroup);
    builder.save();
    applyShapeAttrsToBuilder(builder, attrs);
    let d = x;

    builder.translate(d, y);
    builder.rect(0, 0.56 * height, width, 0.44 * height);
    builder.fillAndStroke();
    d = parseFloat(this.getStyleValue(style, 'strokeWidth', '2'));
    builder.setStrokeWidth(0.5 * d);
    builder.begin();
    builder.moveTo(0.04 * width, 0.5418 * height);
    builder.lineTo(0.94 * width, 0.5418 * height);
    builder.moveTo(0.0522 * width, 0.5088 * height);
    builder.lineTo(0.9522 * width, 0.5088 * height);
    builder.moveTo(0.05 * width, 0.4738 * height);
    builder.lineTo(0.95 * width, 0.4738 * height);
    builder.moveTo(0.0456 * width, 0.4427 * height);
    builder.lineTo(0.9456 * width, 0.4427 * height);
    builder.moveTo(0.0422 * width, 0.4135 * height);
    builder.lineTo(0.9422 * width, 0.4135 * height);
    builder.moveTo(0.0533 * width, 0.3804 * height);
    builder.lineTo(0.9533 * width, 0.3804 * height);
    builder.moveTo(0.0556 * width, 0.3454 * height);
    builder.lineTo(0.9556 * width, 0.3454 * height);
    builder.moveTo(0.05 * width, 0.3143 * height);
    builder.lineTo(0.95 * width, 0.3143 * height);
    builder.moveTo(0.0489 * width, 0.2832 * height);
    builder.lineTo(0.0489 * width, 0.2832 * height);
    builder.moveTo(0.0544 * width, 0.254 * height);
    builder.lineTo(0.9544 * width, 0.254 * height);
    builder.moveTo(0.0489 * width, 0.221 * height);
    builder.lineTo(0.9489 * width, 0.221 * height);
    builder.moveTo(0.0556 * width, 0.1918 * height);
    builder.lineTo(0.9556 * width, 0.1918 * height);
    builder.moveTo(0.0522 * width, 0.1587 * height);
    builder.lineTo(0.9522 * width, 0.1587 * height);
    builder.moveTo(0.0544 * width, 0.1276 * height);
    builder.lineTo(0.9544 * width, 0.1276 * height);
    builder.moveTo(0.0544 * width, 0.0965 * height);
    builder.lineTo(0.9544 * width, 0.0965 * height);
    builder.moveTo(0.0556 * width, 0.0654 * height);
    builder.lineTo(0.9556 * width, 0.0654 * height);
    builder.moveTo(0.0533 * width, 0.0304 * height);
    builder.lineTo(0.9533 * width, 0.0304 * height);
    builder.moveTo(0.0556 * width, 0);
    builder.lineTo(0.9556 * width, 0);
    builder.stroke();
    builder.restore();
  }
}
