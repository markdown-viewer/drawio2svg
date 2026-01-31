import type { RenderContext, ShapeAttrs } from '../../../renderer.ts';
import { RectangleShapeHandler } from '../../shape-registry.ts';

export class ComponentHandler extends RectangleShapeHandler {
  constructor(renderCtx: RenderContext) {
    super(renderCtx);
  }

  render(attrs: ShapeAttrs): void {
    const { builder, currentGroup, x, y, width, height, applyShapeAttrsToBuilder } = this.renderCtx;
    if (!builder || !currentGroup) return;

    const tabWidth = Math.min(16, width / 2);
    const tabHeight = Math.min(12, height / 2);
    const gap = Math.max(0, Math.round((height - 2 * tabHeight) / 3));

    const topY = y + gap;
    const bottomY = y + gap * 2 + tabHeight;
    const rightX = x + width;
    const innerX = x + tabWidth;
    const innerRight = innerX + tabWidth;

    builder.setCanvasRoot(currentGroup);
    builder.save();
    applyShapeAttrsToBuilder(builder, attrs);

    // Main body with left tabs
    builder.begin();
    builder.moveTo(innerX, y);
    builder.lineTo(rightX, y);
    builder.lineTo(rightX, y + height);
    builder.lineTo(innerX, y + height);
    builder.lineTo(innerX, bottomY + tabHeight);
    builder.lineTo(x, bottomY + tabHeight);
    builder.lineTo(x, bottomY);
    builder.lineTo(innerX, bottomY);
    builder.lineTo(innerX, topY + tabHeight);
    builder.lineTo(x, topY + tabHeight);
    builder.lineTo(x, topY);
    builder.lineTo(innerX, topY);
    builder.close();
    builder.fillAndStroke();

    // Tab outlines inside the body
    builder.setFillColor(null);
    builder.begin();
    builder.moveTo(innerX, topY);
    builder.lineTo(innerRight, topY);
    builder.lineTo(innerRight, topY + tabHeight);
    builder.lineTo(innerX, topY + tabHeight);
    builder.moveTo(innerX, bottomY);
    builder.lineTo(innerRight, bottomY);
    builder.lineTo(innerRight, bottomY + tabHeight);
    builder.lineTo(innerX, bottomY + tabHeight);
    builder.stroke();

    builder.restore();
  }
}
