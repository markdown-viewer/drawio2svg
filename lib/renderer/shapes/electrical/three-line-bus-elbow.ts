// @ts-nocheck
import type { RenderContext, ShapeAttrs } from '../../../renderer.ts';
import { BaseShapeHandler } from '../../shape-registry.ts';

export class ElectricalTransmissionThreeLineBusElbowHandler extends BaseShapeHandler {
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

    let f;
    f = Math.max(0, Math.min(width, this.getStyleNumber(style, 'notch', 0)));
    builder.translate(d, y);
    builder.begin();
    builder.moveTo(0, height);
    builder.lineTo(width, height);
    builder.lineTo(width, 0);
    builder.stroke();
    d = Math.min(width, f);
    f = Math.min(height, f);
    builder.begin();
    builder.moveTo(0, height - f);
    builder.lineTo(width - d, height - f);
    builder.lineTo(width - d, 0);
    builder.stroke();
    builder.begin();
    builder.moveTo(0, height - f / 2);
    builder.lineTo(width - d / 2, height - f / 2);
    builder.lineTo(width - d / 2, 0);
    builder.stroke();
    builder.restore();
  }
}
