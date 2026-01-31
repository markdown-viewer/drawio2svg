import type { RenderContext, ShapeAttrs } from '../../../renderer.ts';
import { RhombusShapeHandler, type LabelOverrides, type PerimeterFn } from '../../shape-registry.ts';
import { getRhombusPerimeterPoint } from '../../../edge-router/perimeter/rhombus.ts';

export class RhombusHandler extends RhombusShapeHandler {
  constructor(renderCtx: RenderContext) {
    super(renderCtx);
  }

  getPerimeter(): PerimeterFn {
    return getRhombusPerimeterPoint;
  }

  getLabelOverrides(): LabelOverrides | null {
    return {
      alwaysUseLabelBounds: true,
      getLabelBounds: (style, x, y, width, height) => {
        const strokeColor = style.strokeColor as string | undefined;
        const spacingValue = style.spacing as string | undefined;
        if (strokeColor === 'none' && spacingValue === '0') {
          return { x: x - 2, y, width: width + 4, height };
        }
        return { x, y, width, height };
      }
    };
  }

  render(attrs: ShapeAttrs): void {
    const { builder, currentGroup, x, y, width, height, style, applyShapeAttrsToBuilder } = this.renderCtx;
    if (!builder || !currentGroup) return;

    const arcSize = (parseFloat(style.arcSize as string) || 20) / 2;
    builder.setCanvasRoot(currentGroup);
    builder.save();
    applyShapeAttrsToBuilder(builder, attrs);
    builder.begin();
    builder.addPoints(
      [
        { x: x + width / 2, y },
        { x: x + width, y: y + height / 2 },
        { x: x + width / 2, y: y + height },
        { x, y: y + height / 2 }
      ],
      attrs.rounded,
      arcSize,
      true
    );
    builder.fillAndStroke();
    builder.restore();
  }
}
