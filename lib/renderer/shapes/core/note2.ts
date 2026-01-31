import type { RenderContext, ShapeAttrs } from '../../../renderer.ts';
import { RectangleShapeHandler } from '../../shape-registry.ts';

/**
 * Note2 shape - note/sticky note with folded corner
 * Based on NoteShape/NoteShape2 from Shapes.js
 */
export class Note2Handler extends RectangleShapeHandler {
  constructor(renderCtx: RenderContext) {
    super(renderCtx);
  }

  render(attrs: ShapeAttrs): void {
    const { builder, currentGroup, x, y, width, height, applyShapeAttrsToBuilder, style } = this.renderCtx;
    if (!builder || !currentGroup) return;

    builder.setCanvasRoot(currentGroup);
    builder.save();
    applyShapeAttrsToBuilder(builder, attrs);

    const s = Math.max(0, Math.min(width, Math.min(height, Number(style.size) || 30)));
    const op = Math.max(-1, Math.min(1, Number(style.darkOpacity) || 0));

    // Draw main body
    builder.begin();
    builder.moveTo(x, y);
    builder.lineTo(x + width - s, y);
    builder.lineTo(x + width, y + s);
    builder.lineTo(x + width, y + height);
    builder.lineTo(x, y + height);
    builder.lineTo(x, y);
    builder.close();
    builder.fillAndStroke();

    builder.setShadow(false);

    // Draw fold shadow if darkOpacity != 0
    if (op !== 0) {
      builder.setFillAlpha(Math.abs(op));
      builder.setFillColor(op < 0 ? '#FFFFFF' : '#000000');
      builder.begin();
      builder.moveTo(x + width - s, y);
      builder.lineTo(x + width - s, y + s);
      builder.lineTo(x + width, y + s);
      builder.close();
      builder.fill();
    }

    // Draw fold lines
    builder.begin();
    builder.moveTo(x + width - s, y);
    builder.lineTo(x + width - s, y + s);
    builder.lineTo(x + width, y + s);
    builder.stroke();

    builder.restore();
  }
}
