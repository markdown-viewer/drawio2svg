import type { RenderContext, ShapeAttrs } from '../../../renderer.ts';
import { RectangleShapeHandler } from '../../shape-registry.ts';

export class Ios7SelectHandler extends RectangleShapeHandler {
  constructor(renderCtx: RenderContext) {
    super(renderCtx);
  }

  render(attrs: ShapeAttrs): void {
    const { builder, currentGroup, x, y, width, height } = this.renderCtx;
    if (!builder || !currentGroup) return;

    if (width <= 0 || height <= 0) return;

    const format = (value: number): number => Number(value.toFixed(2));
    const fillColor = attrs.fillColor === 'none' ? 'none' : attrs.fillColor;
    const strokeColor = attrs.strokeColor === 'none' ? 'none' : attrs.strokeColor;

    const cx = x + width / 2;
    const cy = y + height / 2;
    const rx = width / 2;
    const ry = height / 2;

    const ellipse = builder.createEllipse(format(cx), format(cy), format(rx), format(ry), {
      fill: fillColor,
      stroke: 'none',
      'pointer-events': 'all'
    });
    currentGroup.appendChild(ellipse);

    builder.setCanvasRoot(currentGroup);
    builder.save();
    builder.setFillColor(null);
    builder.setStrokeColor(strokeColor);
    builder.setStrokeWidth(format(width * 0.02));
    builder.setMiterLimit(10);
    builder.begin();
    builder.addPoints(
      [
        { x: format(x + width * 0.2), y: format(y + height * 0.55) },
        { x: format(x + width * 0.3), y: format(y + height * 0.7) },
        { x: format(x + width * 0.85), y: format(y + height * 0.25) }
      ],
      false,
      0,
      false
    );
    builder.stroke();
    builder.restore();

    const checkPath = currentGroup.lastChild as Element | null;
    if (checkPath) {
      checkPath.setAttribute('pointer-events', 'all');
    }
  }
}
