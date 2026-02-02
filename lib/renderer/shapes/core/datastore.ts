import type { RenderContext, ShapeAttrs } from '../../../renderer.ts';
import { CylinderShapeHandler, type LabelOverrides } from '../../shape-registry.ts';

/**
 * Datastore shape - cylinder with multiple internal lines (database symbol)
 * Based on DataStoreShape from Shapes.js
 */
export class DatastoreHandler extends CylinderShapeHandler {
  constructor(renderCtx: RenderContext) {
    super(renderCtx);
  }

  // Override: DataStoreShape.prototype.getLabelMargins always applies (no boundedLbl check)
  getLabelOverrides(): LabelOverrides | null {
    return {
      getInset: (style, _width, height) => {
        const strokeWidth = parseFloat(style.strokeWidth as string) || 1;
        const dy = Math.min(height / 2, Math.round(height / 8) + strokeWidth - 1);
        const topMargin = 2.5 * dy;
        return { top: topMargin };
      },
      alwaysUseLabelBounds: true
    };
  }

  render(attrs: ShapeAttrs): void {
    const { builder, currentGroup, x, y, width, height, applyShapeAttrsToBuilder } = this.renderCtx;
    if (!builder || !currentGroup) return;

    builder.setCanvasRoot(currentGroup);
    builder.save();
    applyShapeAttrsToBuilder(builder, attrs);

    const strokeWidth = attrs.strokeWidth ?? 1;
    const dy = Math.min(height / 2, Math.round(height / 8) + strokeWidth - 1);

    // Draw main body (background)
    builder.begin();
    builder.moveTo(x, y + dy);
    builder.curveTo(x, y - dy / 3, x + width, y - dy / 3, x + width, y + dy);
    builder.lineTo(x + width, y + height - dy);
    builder.curveTo(x + width, y + height + dy / 3, x, y + height + dy / 3, x, y + height - dy);
    builder.close();
    builder.fillAndStroke();

    // Draw internal lines (foreground) - all in one path
    builder.setShadow(false);
    builder.begin();

    // First line
    builder.moveTo(x, y + dy);
    builder.curveTo(x, y + 2 * dy, x + width, y + 2 * dy, x + width, y + dy);

    // Second line
    builder.moveTo(x, y + dy + dy / 2);
    builder.curveTo(x, y + 2 * dy + dy / 2, x + width, y + 2 * dy + dy / 2, x + width, y + dy + dy / 2);

    // Third line
    builder.moveTo(x, y + dy + dy);
    builder.curveTo(x, y + 2 * dy + dy, x + width, y + 2 * dy + dy, x + width, y + dy + dy);

    builder.stroke();

    builder.restore();
  }
}
