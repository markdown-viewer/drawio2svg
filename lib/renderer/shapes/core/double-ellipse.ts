import type { RenderContext, ShapeAttrs } from '../../../renderer.ts';
import { DoubleEllipseShapeHandler, type LabelOverrides } from '../../shape-registry.ts';

export class DoubleEllipseHandler extends DoubleEllipseShapeHandler {
  constructor(renderCtx: RenderContext) {
    super(renderCtx);
  }

  getLabelOverrides(): LabelOverrides | null {
    return {
      inset: { left: 4, right: 4 }
    };
  }

  render(attrs: ShapeAttrs): void {
    const { builder, currentGroup, x, y, width, height, applyShapeAttrsToBuilder } = this.renderCtx;
    if (!builder || !currentGroup) return;

    const cx = x + width / 2;
    const cy = y + height / 2;

    builder.setCanvasRoot(currentGroup);
    builder.save();
    applyShapeAttrsToBuilder(builder, attrs);
    builder.ellipse(x, y, width, height);
    builder.fillAndStroke();

    const inset = 4;
    const innerRx = Math.max(0, width / 2 - inset);
    const innerRy = Math.max(0, height / 2 - inset);
    builder.setFillColor(null);
    builder.setFillAlpha(1);
    builder.setStrokeColor(attrs.strokeColor === 'none' ? null : attrs.strokeColor);
    builder.setStrokeWidth(attrs.strokeWidth);
    if (attrs.dashPattern && attrs.dashPattern.trim() !== '' && attrs.dashPattern.trim() !== 'none') {
      builder.setDashed(true);
      builder.setDashPattern(attrs.dashPattern.trim());
    } else {
      builder.setDashed(attrs.dashed);
      builder.setDashPattern('3 3');
    }
    builder.ellipse(cx - innerRx, cy - innerRy, innerRx * 2, innerRy * 2);
    builder.stroke();
    builder.restore();
  }
}
