// @ts-nocheck
import type { RenderContext, ShapeAttrs } from '../../../renderer.ts';
import { BaseShapeHandler, type LabelOverrides } from '../../shape-registry.ts';

export class C4PersonHandler extends BaseShapeHandler {
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
    let d = x;
    let e = y;

    builder.translate(d, e);
    d = Math.min(width / 2, height / 3);
    e = d / 2;
    builder.ellipse(0.5 * width - 0.5 * d, 0, d, d);
    builder.fillAndStroke();
    builder.begin();
    builder.moveTo(0, 0.8 * d + e);
    builder.arcTo(e, e, 0, 0, 1, e, 0.8 * d);
    builder.lineTo(width - e, 0.8 * d);
    builder.arcTo(e, e, 0, 0, 1, width, 0.8 * d + e);
    builder.lineTo(width, height - e);
    builder.arcTo(e, e, 0, 0, 1, width - e, height);
    builder.lineTo(e, height);
    builder.arcTo(e, e, 0, 0, 1, 0, height - e);
    builder.close();
    builder.fillAndStroke();
    builder.setShadow(!1);
    builder.ellipse(0.5 * width - 0.5 * d, 0, d, d);
    builder.fillAndStroke();
    builder.restore();
  }

  getLabelOverrides(): LabelOverrides | null {
    return {
      getLabelBounds: (_style, x, y, width, height) => {
        const left = 0;
        const top = 0.8 * Math.min(width / 2, height / 3);
        const right = 0;
        const bottom = 0;
        return {
          x: x + left,
          y: y + top,
          width: Math.max(0, width - left - right),
          height: Math.max(0, height - top - bottom),
        };
      },
      alwaysUseLabelBounds: true,
    };
  }
}
