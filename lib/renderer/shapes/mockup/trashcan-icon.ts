// @ts-nocheck
import type { RenderContext, ShapeAttrs } from '../../../renderer.ts';
import { BaseShapeHandler } from '../../shape-registry.ts';

export class MockupMiscTrashcanIconHandler extends BaseShapeHandler {
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

    let f;
    f = this.getStyleValue(style, 'strokeColor', '#999999');
    builder.translate(x, y);
    builder.roundrect(0, 0, width, height, 0.05 * width, 0.05 * height);
    builder.fillAndStroke();
    builder.setShadow(!1);
    builder.setFillColor(f as string);
    builder.begin();
    builder.moveTo(0.24 * width, 0.24 * height);
    builder.arcTo(0.04 * width, 0.04 * height, 0, 0, 1, 0.24 * width, 0.16 * height);
    builder.lineTo(0.4 * width, 0.16 * height);
    builder.lineTo(0.4 * width, 0.12 * height);
    builder.lineTo(0.6 * width, 0.12 * height);
    builder.lineTo(0.6 * width, 0.16 * height);
    builder.lineTo(0.76 * width, 0.16 * height);
    builder.arcTo(0.04 * width, 0.04 * height, 0, 0, 1, 0.76 * width, 0.24 * height);
    builder.close();
    builder.fill();
    builder.roundrect(
      0.26 * width,
      0.3 * height,
      0.1 * width,
      0.6 * height,
      0.06 * width,
      0.06 * height
    );
    builder.fill();
    builder.roundrect(
      0.44 * width,
      0.3 * height,
      0.1 * width,
      0.6 * height,
      0.06 * width,
      0.06 * height
    );
    builder.fill();
    builder.roundrect(
      0.62 * width,
      0.3 * height,
      0.1 * width,
      0.6 * height,
      0.06 * width,
      0.06 * height
    );
    builder.fill();
    builder.restore();
  }
}
