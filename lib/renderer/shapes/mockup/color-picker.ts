// @ts-nocheck
import type { RenderContext, ShapeAttrs } from '../../../renderer.ts';
import { BaseShapeHandler } from '../../shape-registry.ts';

export class MockupFormsColorPickerHandler extends BaseShapeHandler {
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
    f = this.getStyleValue(style, 'chosenColor', '#aaddff');
    builder.translate(x, y);
    builder.setStrokeColor('#999999' as string);
    builder.roundrect(0, 0, width, height, 0.05 * width, 0.05 * height);
    builder.fillAndStroke();
    builder.setShadow(!1);
    builder.setFillColor(f as string);
    builder.rect(0.1 * width, 0.1 * height, 0.8 * width, 0.8 * height);
    builder.fill();
    builder.setFillColor('#ffffff' as string);
    builder.begin();
    builder.moveTo(0.75 * width, 0.75 * height);
    builder.lineTo(0.75 * width, height);
    builder.lineTo(0.95 * width, height);
    builder.arcTo(0.05 * width, 0.05 * height, 0, 0, 0, width, 0.95 * height);
    builder.lineTo(width, 0.75 * height);
    builder.close();
    builder.fill();
    builder.setFillColor('#999999' as string);
    builder.begin();
    builder.moveTo(0.77 * width, 0.77 * height);
    builder.lineTo(0.875 * width, 0.98 * height);
    builder.lineTo(0.98 * width, 0.77 * height);
    builder.close();
    builder.fill();
    builder.roundrect(0, 0, width, height, 0.05 * width, 0.05 * height);
    builder.stroke();
    builder.restore();
  }
}
