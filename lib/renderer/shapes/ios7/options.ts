import type { RenderContext, ShapeAttrs } from '../../../renderer.ts';
import { RectangleShapeHandler } from '../../shape-registry.ts';

export class Ios7OptionsHandler extends RectangleShapeHandler {
  constructor(renderCtx: RenderContext) {
    super(renderCtx);
  }

  render(attrs: ShapeAttrs): void {
    const { builder, currentGroup, x, y, width, height } = this.renderCtx;
    if (!builder || !currentGroup) return;

    if (width <= 0 || height <= 0) return;

    const format = (value: number): number => Number(value.toFixed(2));
    const fillColor = attrs.fillColor === 'none' ? 'none' : attrs.fillColor;
    const barHeight = height / 5;

    builder.setCanvasRoot(currentGroup);
    builder.save();
    builder.setFillColor(fillColor);
    builder.setStrokeColor('none');
    builder.begin();
    for (const index of [0, 1, 2]) {
      const y0 = y + index * 2 * barHeight;
      builder.moveTo(format(x), format(y0));
      builder.lineTo(format(x + width), format(y0));
      builder.lineTo(format(x + width), format(y0 + barHeight));
      builder.lineTo(format(x), format(y0 + barHeight));
      builder.close();
    }
    builder.fill();
    builder.restore();

    const path = currentGroup.lastChild as Element | null;
    if (path) {
      path.setAttribute('pointer-events', 'all');
    }
  }
}
