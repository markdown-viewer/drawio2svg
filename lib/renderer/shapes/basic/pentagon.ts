import type { RenderContext, ShapeAttrs } from '../../../renderer.ts';
import { ActorShapeHandler } from '../../shape-registry.ts';

export class BasicPentagonHandler extends ActorShapeHandler {
  constructor(renderCtx: RenderContext) {
    super(renderCtx);
  }

  render(attrs: ShapeAttrs): void {
    const { builder, currentGroup, x, y, width, height, applyShapeAttrsToBuilder } = this.renderCtx;
    if (!builder || !currentGroup) return;

    // Pentagon vertices in normalized coordinates (0-1), matching the platform output
    // Start from bottom-left, counter-clockwise
    const normalizedPoints = [
      { x: 0.1907, y: 1.0 },    // bottom-left
      { x: 0.0, y: 0.367 },     // left
      { x: 0.5, y: 0.0 },       // top
      { x: 1.0, y: 0.367 },     // right
      { x: 0.8093, y: 1.0 },    // bottom-right
    ];

    const mapped = normalizedPoints.map((pt) => ({
      x: x + pt.x * width,
      y: y + pt.y * height,
    }));

    builder.setCanvasRoot(currentGroup);
    builder.save();
    applyShapeAttrsToBuilder(builder, attrs);
    builder.begin();
    builder.addPoints(mapped, false, 0, true);
    builder.fillAndStroke();
    builder.restore();
  }
}
