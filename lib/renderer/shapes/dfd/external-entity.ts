// @ts-nocheck
import type { RenderContext, ShapeAttrs } from '../../../renderer.ts';
import { BaseShapeHandler } from '../../shape-registry.ts';

export class DfdExternalEntityHandler extends BaseShapeHandler {
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
    builder.begin();
    builder.moveTo(0, 0);
    builder.lineTo(width - 10, 0);
    builder.lineTo(width, 10);
    builder.lineTo(width, height);
    builder.lineTo(10, height);
    builder.lineTo(0, height - 10);
    builder.close();
    builder.fillAndStroke();
    builder.setShadow(!1);
    builder.setFillColor('#000000' as string);
    builder.setAlpha(0.5);
    builder.begin();
    builder.moveTo(0, 0);
    builder.lineTo(width - 10, 0);
    builder.lineTo(width, 10);
    builder.lineTo(10, 10);
    builder.lineTo(10, height);
    builder.lineTo(0, height - 10);
    builder.close();
    builder.fill();
    d = parseFloat(this.getStyleValue(style, 'opacity', '100'));
    builder.setAlpha(d / 100);
    builder.begin();
    builder.moveTo(0, 0);
    builder.lineTo(width - 10, 0);
    builder.lineTo(width, 10);
    builder.lineTo(width, height);
    builder.lineTo(10, height);
    builder.lineTo(0, height - 10);
    builder.close();
    builder.moveTo(10, height);
    builder.lineTo(10, 10);
    builder.lineTo(width, 10);
    builder.moveTo(0, 0);
    builder.lineTo(10, 10);
    builder.stroke();
    builder.restore();
  }
}
