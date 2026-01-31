// @ts-nocheck
import type { RenderContext, ShapeAttrs } from '../../../renderer.ts';
import { BaseShapeHandler } from '../../shape-registry.ts';

export class SysmlPort3Handler extends BaseShapeHandler {
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

    builder.rect(x + 0.07 * width, y, 0.86 * width, height);
    builder.fillAndStroke();
    builder.rect(x, y + 0.125 * height, 0.14 * width, 0.25 * height);
    builder.fillAndStroke();
    builder.rect(x, y + 0.625 * height, 0.14 * width, 0.25 * height);
    builder.fillAndStroke();
    builder.rect(x + 0.86 * width, y + 0.375 * height, 0.14 * width, 0.25 * height);
    builder.fillAndStroke();
    this.render_drawIn(builder, x + 0.01 * width, y + 0.2 * height, 0.11 * width, 0.1 * height);
    this.render_drawOut(builder, x + 0.02 * width, y + 0.7 * height, 0.11 * width, 0.1 * height);
    this.render_drawInOut(builder, x + 0.88 * width, y + 0.45 * height, 0.1 * width, 0.1 * height);
    builder.restore();
  }

  private render_drawIn(
    builder: RenderContext['builder'],
    p1: any,
    p2: any,
    p3: any,
    p4: any
  ): void {
    if (!builder) return;
    builder.begin();
    builder.moveTo(p1, p2 + 0.5 * p4);
    builder.lineTo(p1 + p3, p2 + 0.5 * p4);
    builder.moveTo(p1 + 0.75 * p3, p2);
    builder.lineTo(p1 + p3, p2 + 0.5 * p4);
    builder.lineTo(p1 + 0.75 * p3, p2 + p4);
    builder.stroke();
  }

  private render_drawOut(
    builder: RenderContext['builder'],
    p1: any,
    p2: any,
    p3: any,
    p4: any
  ): void {
    if (!builder) return;
    builder.begin();
    builder.moveTo(p1, p2 + 0.5 * p4);
    builder.lineTo(p1 + p3, p2 + 0.5 * p4);
    builder.moveTo(p1 + 0.25 * p3, p2);
    builder.lineTo(p1, p2 + 0.5 * p4);
    builder.lineTo(p1 + 0.25 * p3, p2 + p4);
    builder.stroke();
  }

  private render_drawInOut(
    builder: RenderContext['builder'],
    p1: any,
    p2: any,
    p3: any,
    p4: any
  ): void {
    if (!builder) return;
    builder.begin();
    builder.moveTo(p1 + 0.75 * p3, p2);
    builder.lineTo(p1 + p3, p2 + 0.5 * p4);
    builder.lineTo(p1 + 0.75 * p3, p2 + p4);
    builder.moveTo(p1 + 0.25 * p3, p2);
    builder.lineTo(p1, p2 + 0.5 * p4);
    builder.lineTo(p1 + 0.25 * p3, p2 + p4);
    builder.stroke();
  }
}
