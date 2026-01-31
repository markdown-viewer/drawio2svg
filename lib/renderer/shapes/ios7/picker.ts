import type { RenderContext, ShapeAttrs } from '../../../renderer.ts';
import { RectangleShapeHandler } from '../../shape-registry.ts';

export class Ios7PickerHandler extends RectangleShapeHandler {
  constructor(renderCtx: RenderContext) {
    super(renderCtx);
  }

  render(attrs: ShapeAttrs): void {
    const { builder, currentGroup, x, y, width, height } = this.renderCtx;
    if (!builder || !currentGroup) return;

    if (width <= 0 || height <= 0) return;

    const format = (value: number): number => Number(value.toFixed(2));
    const strokeColor = attrs.strokeColor === 'none' ? 'none' : attrs.strokeColor;

    const baseY = 62;
    const baseW = 175;
    const baseH = 160;
    const scaleX = width / baseW;
    const scaleY = height / baseH;

    const line1Y = y + (127.35 - baseY) * scaleY;
    const line2Y = y + (158.9 - baseY) * scaleY;
    const strokeWidth = format(2 * Math.min(scaleX, scaleY));

    builder.setCanvasRoot(currentGroup);
    builder.save();
    builder.setFillColor(null);
    builder.setStrokeColor(strokeColor);
    builder.setStrokeWidth(strokeWidth);
    builder.setMiterLimit(10);
    builder.begin();
    builder.moveTo(format(x), format(line1Y));
    builder.lineTo(format(x + width), format(line1Y));
    builder.moveTo(format(x), format(line2Y));
    builder.lineTo(format(x + width), format(line2Y));
    builder.stroke();
    builder.restore();

    const path = currentGroup.lastChild as Element | null;
    if (path) {
      path.setAttribute('pointer-events', 'all');
    }
  }
}
