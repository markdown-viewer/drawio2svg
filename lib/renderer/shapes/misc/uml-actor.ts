import type { RenderContext, ShapeAttrs } from '../../../renderer.ts';
import { ActorShapeHandler } from '../../shape-registry.ts';

export class UmlActorHandler extends ActorShapeHandler {
  constructor(renderCtx: RenderContext) {
    super(renderCtx);
  }

  render(attrs: ShapeAttrs): void {
    const { builder, currentGroup, style, x, y, width, height, applyShapeAttrsToBuilder } = this.renderCtx;
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

    // Business variant (actor/): draw a chord in the lower-right area of the head circle.
    // Based on PlantUML ActorStickMan.specialBusiness: chord from angle (pi/4 + alpha) to (pi/4 - alpha),
    // where alpha = 21*pi/64. The chord stays on the perimeter (not through center).
    if (style.business === '1') {
      const alpha = 21 * Math.PI / 64;
      const p1x = headCx + headR * Math.cos(Math.PI / 4 + alpha);
      const p1y = headCy + headR * Math.sin(Math.PI / 4 + alpha);
      const p2x = headCx + headR * Math.cos(Math.PI / 4 - alpha);
      const p2y = headCy + headR * Math.sin(Math.PI / 4 - alpha);
      builder.setShadow(false);
      builder.begin();
      builder.moveTo(p1x, p1y);
      builder.lineTo(p2x, p2y);
      builder.stroke();
    }

    builder.restore();
  }
}
