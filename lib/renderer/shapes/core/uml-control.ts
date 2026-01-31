import type { RenderContext, ShapeAttrs } from '../../../renderer.ts';
import { EllipseShapeHandler, type LabelOverrides } from '../../shape-registry.ts';

/**
 * UmlControl shape - circle with antenna/arrow on top
 * Based on UmlControlShape from Shapes.js
 */
export class UmlControlHandler extends EllipseShapeHandler {
  constructor(renderCtx: RenderContext) {
    super(renderCtx);
  }

  getLabelOverrides(): LabelOverrides | null {
    return {
      // getLabelBounds: y + height/8, height * 7/8
      getLabelBounds: (_style, x, y, width, height) => {
        return { x, y: y + height / 8, width, height: height * 7 / 8 };
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

    // Upper line (antenna part 1)
    builder.begin();
    builder.moveTo(x + width * 3 / 8, y + height / 8 * 1.1);
    builder.lineTo(x + width * 5 / 8, y);
    builder.stroke();

    // Circle
    builder.ellipse(x, y + height / 8, width, height * 7 / 8);
    builder.fillAndStroke();

    // Lower line (antenna part 2 - foreground)
    builder.begin();
    builder.moveTo(x + width * 3 / 8, y + height / 8 * 1.1);
    builder.lineTo(x + width * 5 / 8, y + height / 4);
    builder.stroke();

    builder.restore();
  }
}
