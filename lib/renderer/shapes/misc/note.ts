import type { RenderContext, ShapeAttrs } from '../../../renderer.ts';
import { RectangleShapeHandler } from '../../shape-registry.ts';

export class NoteHandler extends RectangleShapeHandler {
  constructor(renderCtx: RenderContext) {
    super(renderCtx);
  }

  render(attrs: ShapeAttrs): void {
    const { builder, currentGroup, style, x, y, width, height, applyShapeAttrsToBuilder } = this.renderCtx;
    if (!builder || !currentGroup) return;

    const sizeRaw = parseFloat(style.size as string);
    const foldSize = Math.max(0, Math.min(width, Math.min(height, Number.isFinite(sizeRaw) ? sizeRaw : 30)));
    const darkOpacityRaw = parseFloat(style.darkOpacity as string);
    const darkOpacity = Number.isFinite(darkOpacityRaw) ? Math.max(-1, Math.min(1, darkOpacityRaw)) : 0;

    builder.setCanvasRoot(currentGroup);
    builder.save();
    applyShapeAttrsToBuilder(builder, attrs);
    builder.begin();
    builder.addPoints(
      [
        { x, y },
        { x: x + width - foldSize, y },
        { x: x + width, y: y + foldSize },
        { x: x + width, y: y + height },
        { x, y: y + height },
        { x, y }
      ],
      false,
      0,
      true
    );
    builder.fillAndStroke();

    builder.setShadow(false);

    if (darkOpacity !== 0) {
      builder.setFillAlpha(Math.abs(darkOpacity));
      builder.setFillColor(darkOpacity < 0 ? '#FFFFFF' : '#000000');
      builder.begin();
      builder.addPoints(
        [
          { x: x + width - foldSize, y },
          { x: x + width - foldSize, y: y + foldSize },
          { x: x + width, y: y + foldSize }
        ],
        false,
        0,
        true
      );
      builder.fill();
    }

    builder.begin();
    builder.addPoints(
      [
        { x: x + width - foldSize, y },
        { x: x + width - foldSize, y: y + foldSize },
        { x: x + width, y: y + foldSize }
      ],
      false,
      0,
      false
    );
    builder.stroke();
    builder.restore();
  }
}
