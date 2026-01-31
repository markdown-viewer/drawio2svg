import type { RenderContext, ShapeAttrs } from '../../../renderer.ts';
import { RectangleShapeHandler } from '../../shape-registry.ts';

/**
 * Module shape - rectangle with protruding connectors (UML component)
 * Based on ModuleShape from Shapes.js
 */
export class ModuleHandler extends RectangleShapeHandler {
  constructor(renderCtx: RenderContext) {
    super(renderCtx);
  }

  render(attrs: ShapeAttrs): void {
    const { builder, currentGroup, x, y, width, height, applyShapeAttrsToBuilder, style } = this.renderCtx;
    if (!builder || !currentGroup) return;

    builder.setCanvasRoot(currentGroup);
    builder.save();
    applyShapeAttrsToBuilder(builder, attrs);

    const dx = parseFloat(String(style.jettyWidth ?? 20));
    const dy = parseFloat(String(style.jettyHeight ?? 10));
    const x0 = dx / 2;
    const x1 = x0 + dx / 2;
    const y0 = Math.min(dy, height - dy);
    const y1 = Math.min(y0 + 2 * dy, height - dy);

    // Draw main body (background)
    builder.begin();
    builder.moveTo(x + x0, y);
    builder.lineTo(x + width, y);
    builder.lineTo(x + width, y + height);
    builder.lineTo(x + x0, y + height);
    builder.lineTo(x + x0, y + y1 + dy);
    builder.lineTo(x, y + y1 + dy);
    builder.lineTo(x, y + y1);
    builder.lineTo(x + x0, y + y1);
    builder.lineTo(x + x0, y + y0 + dy);
    builder.lineTo(x, y + y0 + dy);
    builder.lineTo(x, y + y0);
    builder.lineTo(x + x0, y + y0);
    builder.close();
    builder.fillAndStroke();

    // Draw connector boxes (foreground)
    builder.setShadow(false);
    builder.begin();
    builder.moveTo(x + x0, y + y0);
    builder.lineTo(x + x1, y + y0);
    builder.lineTo(x + x1, y + y0 + dy);
    builder.lineTo(x + x0, y + y0 + dy);
    builder.moveTo(x + x0, y + y1);
    builder.lineTo(x + x1, y + y1);
    builder.lineTo(x + x1, y + y1 + dy);
    builder.lineTo(x + x0, y + y1 + dy);
    builder.stroke();

    builder.restore();
  }
}
