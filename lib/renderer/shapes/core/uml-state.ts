import type { RenderContext, ShapeAttrs } from '../../../renderer.ts';
import { RectangleShapeHandler } from '../../shape-registry.ts';

/**
 * UmlState shape - rounded rectangle with optional connection point and collapse symbol
 * Based on UMLStateShape from Shapes.js
 */
export class UmlStateHandler extends RectangleShapeHandler {
  constructor(renderCtx: RenderContext) {
    super(renderCtx);
  }

  render(attrs: ShapeAttrs): void {
    const { builder, currentGroup, x, y, width, height, applyShapeAttrsToBuilder, style } = this.renderCtx;
    if (!builder || !currentGroup) return;

    builder.setCanvasRoot(currentGroup);
    builder.save();
    applyShapeAttrsToBuilder(builder, attrs);

    const rounded = style.rounded ?? false;
    const absoluteArcSize = style.absoluteArcSize ?? false;
    let arcSize: number = Number(style.arcSize) || 0.1; // default arcSize in mxShape
    const connPoint = style.umlStateConnection as string | null;
    const sym = style.umlStateSymbol as string | null;

    // Calculate arcSize
    if (!absoluteArcSize) {
      arcSize = Math.min(width, height) * arcSize;
    }
    arcSize = Math.min(arcSize, width * 0.5, height * 0.5);

    if (!rounded) {
      arcSize = 0;
    }

    // Connection point offset
    const dx = connPoint != null ? 10 : 0;

    // Draw main rounded rectangle
    builder.begin();
    builder.moveTo(x + dx, y + arcSize);
    builder.arcTo(arcSize, arcSize, 0, 0, 1, x + dx + arcSize, y);
    builder.lineTo(x + width - arcSize, y);
    builder.arcTo(arcSize, arcSize, 0, 0, 1, x + width, y + arcSize);
    builder.lineTo(x + width, y + height - arcSize);
    builder.arcTo(arcSize, arcSize, 0, 0, 1, x + width - arcSize, y + height);
    builder.lineTo(x + dx + arcSize, y + height);
    builder.arcTo(arcSize, arcSize, 0, 0, 1, x + dx, y + height - arcSize);
    builder.close();
    builder.fillAndStroke();

    builder.setShadow(false);

    // Draw collapse state symbol
    if (sym === 'collapseState') {
      builder.roundrect(x + width - 40, y + height - 20, 10, 10, 3, 3);
      builder.stroke();
      builder.roundrect(x + width - 20, y + height - 20, 10, 10, 3, 3);
      builder.stroke();
      builder.begin();
      builder.moveTo(x + width - 30, y + height - 15);
      builder.lineTo(x + width - 20, y + height - 15);
      builder.stroke();
    }

    // Draw connection point
    if (connPoint === 'connPointRefEntry') {
      builder.ellipse(x, y + height * 0.5 - 10, 20, 20);
      builder.fillAndStroke();
    } else if (connPoint === 'connPointRefExit') {
      builder.ellipse(x, y + height * 0.5 - 10, 20, 20);
      builder.fillAndStroke();

      // X mark in the circle
      builder.begin();
      builder.moveTo(x + 5, y + height * 0.5 - 5);
      builder.lineTo(x + 15, y + height * 0.5 + 5);
      builder.moveTo(x + 15, y + height * 0.5 - 5);
      builder.lineTo(x + 5, y + height * 0.5 + 5);
      builder.stroke();
    }

    builder.restore();
  }
}
