import type { RenderContext, ShapeAttrs } from '../../../renderer.ts';
import { RhombusShapeHandler } from '../../shape-registry.ts';

export class FlowchartDecisionHandler extends RhombusShapeHandler {
  constructor(renderCtx: RenderContext) {
    super(renderCtx);
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
      false,
      arcSize,
      true
    );
    builder.fillAndStroke();
    builder.restore();
  }
}
