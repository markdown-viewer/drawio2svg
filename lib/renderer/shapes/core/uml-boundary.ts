import type { RenderContext, ShapeAttrs } from '../../../renderer.ts';
import { EllipseShapeHandler, type LabelOverrides } from '../../shape-registry.ts';

/**
 * UmlBoundary shape - vertical line, horizontal connector, and circle
 * Based on UmlBoundaryShape from Shapes.js
 */
export class UmlBoundaryHandler extends EllipseShapeHandler {
  constructor(renderCtx: RenderContext) {
    super(renderCtx);
  }

  getLabelOverrides(): LabelOverrides | null {
    return {
      // Label should be centered in the ellipse area (right 5/6 of the shape)
      getLabelBounds: (_style, x, y, width, height) => {
        return { x: x + width / 6, y, width: width * 5 / 6, height };
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

    // Base line (vertical)
    builder.begin();
    builder.moveTo(x, y + height / 4);
    builder.lineTo(x, y + height * 3 / 4);
    builder.stroke();

    // Horizontal line
    builder.begin();
    builder.moveTo(x, y + height / 2);
    builder.lineTo(x + width / 6, y + height / 2);
    builder.stroke();

    // Circle
    builder.ellipse(x + width / 6, y, width * 5 / 6, height);
    builder.fillAndStroke();

    builder.restore();
  }
}
