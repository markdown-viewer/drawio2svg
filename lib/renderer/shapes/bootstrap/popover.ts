// @ts-nocheck
import type { RenderContext, ShapeAttrs } from '../../../renderer.ts';
import { ActorShapeHandler } from '../../shape-registry.ts';

export class BootstrapPopoverHandler extends ActorShapeHandler {
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
    let d = x;
    let e = y;

    let f;
    let g;
    let h;
    builder.translate(d, e);
    d = parseInt(this.getStyleNumber(style, 'rSize', 10));
    e = Math.max(0, Math.min(width, this.getStyleNumber(style, 'dx', 0.5)));
    f = Math.max(0, Math.min(height, this.getStyleNumber(style, 'dy', 0.5)));
    g = Math.max(e - f, 0);
    h = Math.min(e + f, width);
    builder.begin();
    builder.moveTo(d, 0);
    builder.lineTo(width - d, 0);
    builder.arcTo(d, d, 0, 0, 1, width, d);
    builder.lineTo(width, height - f - d);
    builder.arcTo(d, d, 0, 0, 1, width - d, height - f);
    builder.lineTo(h, height - f);
    builder.lineTo(e, height);
    builder.lineTo(g, height - f);
    builder.lineTo(d, height - f);
    builder.arcTo(d, d, 0, 0, 1, 0, height - f - d);
    builder.lineTo(0, d);
    builder.arcTo(d, d, 0, 0, 1, d, 0);
    builder.close();
    builder.fillAndStroke();
    builder.restore();
  }
}
