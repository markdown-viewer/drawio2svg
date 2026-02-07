// @ts-nocheck
import type { RenderContext, ShapeAttrs } from '../../../renderer.ts';
import { ActorShapeHandler } from '../../shape-registry.ts';

export class BasicPatternFillRectHandler extends ActorShapeHandler {
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
    d = this.getStyleValue(style, 'strokeColor', '#000000');
    e = this.getStyleValue(style, 'strokeWidth', '1');
    builder.rect(0, 0, width, height);
    builder.fill();
    f = this.getStyleValue(style, 'fillStrokeColor', '#cccccc');
    g = this.getStyleNumber(style, 'fillStrokeWidth', 1);
    builder.setStrokeColor(f as string);
    builder.setStrokeWidth(g);
    f = this.getStyleNumber(style, 'step', 5);
    g = this.getStyleValue(style, 'fillStyle', 'none');
    if ('diag' == g || 'diagGrid' == g) {
      f *= 1.41;
      h = 0;
      for (builder.begin(); h < height + width; ) {
        if (h <= height) {
          builder.moveTo(0, h);
        } else {
          builder.moveTo(h - height, height);
        }
        if (h <= width) {
          builder.lineTo(h, 0);
        } else {
          builder.lineTo(width, h - width);
        }
        h += f;
      }
      builder.stroke();
    } else if ('vert' == g || 'grid' == g) {
      builder.begin();
      for (h = 0; h <= width; ) {
        builder.moveTo(h, 0);
        builder.lineTo(h, height);
        h += f;
      }
      builder.stroke();
    }
    if ('diagRev' == g || 'diagGrid' == g) {
      if ('diagRev' == g) {
        f *= 1.41;
      }
      h = 0;
      for (builder.begin(); h < height + width; ) {
        if (h <= height) {
          builder.moveTo(width, h);
          if (h <= width) {
            builder.lineTo(width - h, 0);
          } else {
            builder.lineTo(width - width, h - width);
          }
        } else {
          builder.moveTo(width - h + height, height);
          if (h <= width) {
            builder.lineTo(width - h, 0);
          } else {
            builder.lineTo(0, h - width);
          }
        }
        h += f;
      }
      builder.stroke();
    } else if ('hor' == g || 'grid' == g) {
      builder.begin();
      for (h = 0; h <= height; ) {
        builder.moveTo(0, h);
        builder.lineTo(width, h);
        h += f;
      }
      builder.stroke();
    }
    builder.setStrokeColor(d as string);
    builder.setStrokeWidth(e);
    builder.begin();
    builder.moveTo(0, 0);
    if ('1' == this.getStyleValue(style, 'top', '1')) {
      builder.lineTo(width, 0);
    } else {
      builder.moveTo(width, 0);
    }
    if ('1' == this.getStyleValue(style, 'right', '1')) {
      builder.lineTo(width, height);
    } else {
      builder.moveTo(width, height);
    }
    if ('1' == this.getStyleValue(style, 'bottom', '1')) {
      builder.lineTo(0, height);
    } else {
      builder.moveTo(0, height);
    }
    if ('1' == this.getStyleValue(style, 'left', '1')) {
      builder.lineTo(0, 0);
    }
    builder.end();
    builder.stroke();
    builder.restore();
  }
}
