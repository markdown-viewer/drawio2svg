import type { RenderContext, ShapeAttrs } from '../../../renderer.ts';
import { CylinderShapeHandler, type LabelOverrides } from '../../shape-registry.ts';

/**
 * Cylinder3 shape - flexible cylinder with optional lid
 * Based on CylinderShape3 from Shapes.js
 */
export class Cylinder3Handler extends CylinderShapeHandler {
  constructor(renderCtx: RenderContext) {
    super(renderCtx);
  }

  // Override: CylinderShape3.prototype.getLabelMargins has different calculation
  // - size is pixel value (default 15), not ratio
  // - includes bottom margin
  getLabelOverrides(): LabelOverrides | null {
    return {
      getInset: (style, _width, height) => {
        let size = Number(style.size) || 15;
        
        const lidValue = style.lid;
        const lid = lidValue !== false && lidValue !== 0 && lidValue !== '0' && lidValue !== 'false';
        if (!lid) {
          size /= 2;
        }
        
        const topMargin = Math.min(height, size * 2);
        const bottomMargin = Math.max(0, size * 0.3);
        return { top: topMargin, bottom: bottomMargin };
      },
      requiresBoundedLbl: true
    };
  }

  render(attrs: ShapeAttrs): void {
    const { builder, currentGroup, x, y, width, height, applyShapeAttrsToBuilder, style } = this.renderCtx;
    if (!builder || !currentGroup) return;

    builder.setCanvasRoot(currentGroup);
    builder.save();
    applyShapeAttrsToBuilder(builder, attrs);

    const defaultSize = 15;
    const size = Math.max(0, Math.min(height * 0.5, Number(style.size) || defaultSize));
    // lid can be 0, "0", false, or "false" to disable
    const lidValue = style.lid;
    const lid = lidValue !== false && lidValue !== 0 && lidValue !== '0' && lidValue !== 'false';

    if (size === 0) {
      builder.rect(x, y, width, height);
      builder.fillAndStroke();
    } else {
      builder.begin();

      if (lid) {
        builder.moveTo(x, y + size);
        builder.arcTo(width * 0.5, size, 0, 0, 1, x + width * 0.5, y);
        builder.arcTo(width * 0.5, size, 0, 0, 1, x + width, y + size);
      } else {
        // No lid: arc curves outward instead of inward
        builder.moveTo(x, y);
        builder.arcTo(width * 0.5, size, 0, 0, 0, x + width * 0.5, y + size);
        builder.arcTo(width * 0.5, size, 0, 0, 0, x + width, y);
      }

      builder.lineTo(x + width, y + height - size);
      builder.arcTo(width * 0.5, size, 0, 0, 1, x + width * 0.5, y + height);
      builder.arcTo(width * 0.5, size, 0, 0, 1, x, y + height - size);
      builder.close();
      builder.fillAndStroke();

      if (lid) {
        builder.setShadow(false);
        builder.begin();
        builder.moveTo(x + width, y + size);
        builder.arcTo(width * 0.5, size, 0, 0, 1, x + width * 0.5, y + 2 * size);
        builder.arcTo(width * 0.5, size, 0, 0, 1, x, y + size);
        builder.stroke();
      }
    }

    builder.restore();
  }
}
