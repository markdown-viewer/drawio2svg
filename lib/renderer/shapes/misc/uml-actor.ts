import type { RenderContext, ShapeAttrs } from '../../../renderer.ts';
import { ActorShapeHandler } from '../../shape-registry.ts';

export class UmlActorHandler extends ActorShapeHandler {
  constructor(renderCtx: RenderContext) {
    super(renderCtx);
  }

  render(attrs: ShapeAttrs): void {
    const { builder, currentGroup, x, y, width, height, applyShapeAttrsToBuilder } = this.renderCtx;
    if (!builder || !currentGroup) return;

    const headR = Math.min(width, height * 0.25) / 2;
    const headCx = x + width / 2;
    const headCy = y + headR;
    const bodyTop = y + headR * 2;
    const bodyMid = y + height * (2 / 3);
    const bodyBot = y + height;
    const armY = y + height / 3;

    builder.setCanvasRoot(currentGroup);
    builder.save();
    applyShapeAttrsToBuilder(builder, attrs);
    builder.ellipse(headCx - headR, headCy - headR, headR * 2, headR * 2);
    builder.fillAndStroke();

    builder.setFillColor(null);
    builder.setFillAlpha(1);
    builder.begin();
    // Body: head bottom to body mid
    builder.addPoints(
      [
        { x: headCx, y: bodyTop },
        { x: headCx, y: bodyMid }
      ],
      false,
      0,
      false
    );
    // Left arm: from center to left
    builder.addPoints(
      [
        { x: headCx, y: armY },
        { x, y: armY }
      ],
      false,
      0,
      false
    );
    // Right arm: from center to right
    builder.addPoints(
      [
        { x: headCx, y: armY },
        { x: x + width, y: armY }
      ],
      false,
      0,
      false
    );
    // Left leg
    builder.addPoints(
      [
        { x: headCx, y: bodyMid },
        { x, y: bodyBot }
      ],
      false,
      0,
      false
    );
    // Right leg
    builder.addPoints(
      [
        { x: headCx, y: bodyMid },
        { x: x + width, y: bodyBot }
      ],
      false,
      0,
      false
    );
    builder.stroke();
    builder.restore();
  }
}
