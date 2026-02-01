// @ts-nocheck
import type { RenderContext, ShapeAttrs } from '../../../renderer.ts';
import { BaseShapeHandler } from '../../shape-registry.ts';

export class BootstrapLeftButtonStripedHandler extends BaseShapeHandler {
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
    let e = y;

    let f;
    let rSize;
    builder.translate(d, e);
    rSize = 5;
    builder.begin();
    builder.moveTo(width, 0);
    builder.lineTo(width, height);
    builder.lineTo(rSize, height);
    builder.arcTo(rSize, rSize, 0, 0, 1, 0, height - rSize);
    builder.lineTo(0, rSize);
    builder.arcTo(rSize, rSize, 0, 0, 1, rSize, 0);
    builder.close();
    builder.fill();
    builder.setAlpha('0.2');
    d = 0.5 * height;
    builder.setFillColor('#ffffff' as string);
    builder.begin();
    builder.moveTo(0, 0.75 * height);
    builder.lineTo(0, 0.25 * height);
    builder.lineTo(0.75 * height, height);
    builder.lineTo(0.25 * height, height);
    builder.close();
    builder.fill();
    e = !1;
    for (f = 0.5 * d; !e; ) {
      builder.begin();
      builder.moveTo(f, 0);
      if (f + d >= width) {
        builder.lineTo(width, 0);
        builder.lineTo(width, width - f);
      } else {
        builder.lineTo(f + d, 0);
        if (f + d + height > width) {
          builder.lineTo(width, width - f - d);
          if (width - f > height) {
            builder.lineTo(width, height);
            builder.lineTo(f + height, height);
          } else {
            builder.lineTo(width, width - f);
          }
        } else {
          builder.lineTo(f + d + height, height);
          builder.lineTo(f + height, height);
        }
      }
      builder.close();
      builder.fill();
      f += 2 * d;
      if (f > width) {
        e = !0;
      }
    }
    builder.restore();
  }
}
