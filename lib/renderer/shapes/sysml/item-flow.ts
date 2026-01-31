// @ts-nocheck
import type { RenderContext, ShapeAttrs } from '../../../renderer.ts';
import { BaseShapeHandler } from '../../shape-registry.ts';

export class SysmlItemFlowHandler extends BaseShapeHandler {
  constructor(renderCtx: RenderContext) {
    super(renderCtx);
  }

  render(attrs: ShapeAttrs): void {
    const { builder, currentGroup, applyShapeAttrsToBuilder, x, y, width, height, style } =
      this.renderCtx;
    if (!builder || !currentGroup) return;
    if (width <= 0 || height <= 0) return;

    builder.setCanvasRoot(currentGroup);
    builder.save();
    applyShapeAttrsToBuilder(builder, attrs);

    let f;
    let g;
    f = this.getStyleValue(style, 'flowDir', 'none').toLowerCase();
    g = this.getStyleValue(style, 'flowType', 'none');
    if ('n' === f) {
      builder.rect(x, y + 10, width, height - 10);
      builder.fillAndStroke();
      builder.setShadow(!1);
      builder.rect(x + 0.5 * width - 10, y, 20, 20);
      builder.fillAndStroke();
      if ('in' === g) {
        this.render_drawDown(builder, x + 0.5 * width - 5, y + 2, 10, 16);
      } else if ('out' === g) {
        this.render_drawUp(builder, x + 0.5 * width - 5, y + 2, 10, 16);
      }
    } else if ('s' === f) {
      builder.rect(x, y, width, height - 10);
      builder.fillAndStroke();
      builder.setShadow(!1);
      builder.rect(x + 0.5 * width - 10, y + height - 20, 20, 20);
      builder.fillAndStroke();
      if ('in' === g) {
        this.render_drawUp(builder, x + 0.5 * width - 5, y + height - 18, 10, 16);
      } else if ('out' === g) {
        this.render_drawDown(builder, x + 0.5 * width - 5, y + height - 18, 10, 16);
      }
    } else if ('w' === f) {
      builder.rect(x + 10, y, width - 10, height);
      builder.fillAndStroke();
      builder.setShadow(!1);
      builder.rect(x, y + 0.5 * height - 10, 20, 20);
      builder.fillAndStroke();
      if ('in' === g) {
        this.render_drawRight(builder, x + 2, y + 0.5 * height - 5, 16, 10);
      } else if ('out' === g) {
        this.render_drawLeft(builder, x + 2, y + 0.5 * height - 5, 16, 10);
      }
    } else if ('e' === f) {
      builder.rect(x, y, width - 10, height);
      builder.fillAndStroke();
      builder.setShadow(!1);
      builder.rect(x + width - 20, y + 0.5 * height - 10, 20, 20);
      builder.fillAndStroke();
      if ('in' === g) {
        this.render_drawLeft(builder, x + width - 18, y + 0.5 * height - 5, 16, 10);
      } else if ('out' === g) {
        this.render_drawRight(builder, x + width - 18, y + 0.5 * height - 5, 16, 10);
      }
    }
    builder.restore();
  }

  private render_drawDown(
    builder: RenderContext['builder'],
    p1: any,
    p2: any,
    p3: any,
    p4: any
  ): void {
    if (!builder) return;
    builder.begin();
    builder.moveTo(p1 + 0.5 * p3, p2);
    builder.lineTo(p1 + 0.5 * p3, p2 + p4);
    builder.moveTo(p1, p2 + 0.75 * p4);
    builder.lineTo(p1 + 0.5 * p3, p2 + p4);
    builder.lineTo(p1 + p3, p2 + 0.75 * p4);
    builder.stroke();
  }

  private render_drawUp(
    builder: RenderContext['builder'],
    p1: any,
    p2: any,
    p3: any,
    p4: any
  ): void {
    if (!builder) return;
    builder.begin();
    builder.moveTo(p1 + 0.5 * p3, p2 + p4);
    builder.lineTo(p1 + 0.5 * p3, p2);
    builder.moveTo(p1, p2 + 0.25 * p4);
    builder.lineTo(p1 + 0.5 * p3, p2);
    builder.lineTo(p1 + p3, p2 + 0.25 * p4);
    builder.stroke();
  }

  private render_drawRight(
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

  private render_drawLeft(
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
}
