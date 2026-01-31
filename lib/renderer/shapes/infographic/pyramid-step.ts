// @ts-nocheck
import type { RenderContext, ShapeAttrs } from '../../../renderer.ts';
import { ActorShapeHandler } from '../../shape-registry.ts';

export class InfographicPyramidStepHandler extends ActorShapeHandler {
  constructor(renderCtx: RenderContext) {
    super(renderCtx);
  }

  render(attrs: ShapeAttrs): void {
    const { builder, currentGroup, applyShapeAttrsToBuilder, x, y, width, height } = this.renderCtx;
    if (!builder || !currentGroup) return;
    if (width <= 0 || height <= 0) return;

    builder.setCanvasRoot(currentGroup);
    builder.save();
    applyShapeAttrsToBuilder(builder, attrs);
    let d = x;

    builder.translate(d, y);
    d = Math.max(0.1 * width, 0);
    builder.begin();
    builder.moveTo(0, d);
    builder.lineTo(0.5 * width, 0);
    builder.lineTo(width, d);
    builder.lineTo(width, height);
    builder.lineTo(0, height);
    builder.close();
    builder.fillAndStroke();
    builder.setShadow(!1);
    builder.setFillColor('#ffffff' as string);
    builder.setFillAlpha('0.2');
    builder.begin();
    builder.moveTo(0, d);
    builder.lineTo(0.5 * width, 0);
    builder.lineTo(0.5 * width, height);
    builder.lineTo(0, height);
    builder.close();
    builder.fill();
    builder.setFillColor('#000000' as string);
    builder.begin();
    builder.moveTo(width, d);
    builder.lineTo(width, height);
    builder.lineTo(0.5 * width, height);
    builder.lineTo(0.5 * width, 0);
    builder.close();
    builder.fill();
    builder.begin();
    builder.moveTo(0, d);
    builder.lineTo(0.5 * width, 0);
    builder.lineTo(width, d);
    builder.lineTo(width, height);
    builder.lineTo(0, height);
    builder.close();
    builder.stroke();
    builder.restore();
  }
}
