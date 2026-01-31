import type { RenderContext, ShapeAttrs } from '../../../renderer.ts';
import { ActorShapeHandler } from '../../shape-registry.ts';

export class Ios7RightHandler extends ActorShapeHandler {
  constructor(renderCtx: RenderContext) {
    super(renderCtx);
  }

  render(attrs: ShapeAttrs): void {
    const { builder, currentGroup, x, y, width, height } = this.renderCtx;
    if (!builder || !currentGroup) return;

    if (width <= 0 || height <= 0) return;

    const format = (value: number): number => Number(value.toFixed(2));
    const strokeColor = attrs.strokeColor === 'none' ? 'none' : attrs.strokeColor;

    builder.setCanvasRoot(currentGroup);
    builder.save();
    builder.setFillColor(null);
    builder.setStrokeColor(strokeColor);
    builder.setMiterLimit(10);
    builder.begin();
    builder.addPoints(
      [
        { x: format(x), y: format(y) },
        { x: format(x + width), y: format(y + height / 2) },
        { x: format(x), y: format(y + height) }
      ],
      false,
      0,
      false
    );
    builder.stroke();
    builder.restore();

    const path = currentGroup.lastChild as Element | null;
    if (path) {
      path.setAttribute('pointer-events', 'all');
    }
  }
}
