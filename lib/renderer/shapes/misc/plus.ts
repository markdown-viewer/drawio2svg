import type { RenderContext, ShapeAttrs } from '../../../renderer.ts';
import { RectangleShapeHandler } from '../../shape-registry.ts';

export class PlusHandler extends RectangleShapeHandler {
  constructor(renderCtx: RenderContext) {
    super(renderCtx);
  }

  render(attrs: ShapeAttrs): void {
    const { builder, currentGroup, x, y, width, height, applyShapeAttrsToBuilder } = this.renderCtx;
    if (!builder || !currentGroup) return;

    const { strokeColor } = attrs;

    builder.setCanvasRoot(currentGroup);
    builder.save();
    applyShapeAttrsToBuilder(builder, attrs);
    builder.rect(x, y, width, height);
    builder.fillAndStroke();

    const rect = currentGroup.lastChild as Element | null;
    if (rect) {
      rect.setAttribute('pointer-events', 'all');
    }

    const lineRatio = 0.55;
    const marginX = (width - width * lineRatio) / 2;
    const marginY = (height - height * lineRatio) / 2;
    const centerX = x + width / 2;
    const centerY = y + height / 2;

    builder.setFillColor(null);
    builder.setStrokeColor(strokeColor);
    builder.begin();
    builder.addPoints(
      [
        { x: centerX, y: y + marginY },
        { x: centerX, y: y + height - marginY }
      ],
      false,
      0,
      false
    );
    builder.addPoints(
      [
        { x: x + marginX, y: centerY },
        { x: x + width - marginX, y: centerY }
      ],
      false,
      0,
      false
    );
    builder.stroke();
    builder.restore();

    const plusPath = currentGroup.lastChild as Element | null;
    if (plusPath) {
      plusPath.setAttribute('pointer-events', 'all');
    }
  }
}
