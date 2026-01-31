// @ts-nocheck
import type { RenderContext, ShapeAttrs } from '../../../renderer.ts';
import { BaseShapeHandler } from '../../shape-registry.ts';

export class BootstrapRatingHandler extends BaseShapeHandler {
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
    let b = width;

    let f;
    let g;
    b = this.getStyleValue(style, 'ratingStyle', 'star');
    f = this.getStyleValue(style, 'grade', '5');
    g = this.getStyleNumber(style, 'ratingScale', 10);
    builder.translate(d, y);
    if (b === 'star') {
      for (d = 0; d < f; d++) {
        (builder.begin(),
          builder.moveTo(d * height * 1.2, 0.33 * height),
          builder.lineTo(d * height * 1.2 + 0.364 * height, 0.33 * height),
          builder.lineTo(d * height * 1.2 + 0.475 * height, 0),
          builder.lineTo(d * height * 1.2 + 0.586 * height, 0.33 * height),
          builder.lineTo(d * height * 1.2 + 0.95 * height, 0.33 * height),
          builder.lineTo(d * height * 1.2 + 0.66 * height, 0.551 * height),
          builder.lineTo(d * height * 1.2 + 0.775 * height, 0.9 * height),
          builder.lineTo(d * height * 1.2 + 0.475 * height, 0.684 * height),
          builder.lineTo(d * height * 1.2 + 0.175 * height, 0.9 * height),
          builder.lineTo(d * height * 1.2 + 0.29 * height, 0.551 * height),
          builder.close(),
          builder.fillAndStroke());
      }
    } else if (b === 'heart') {
      for (d = 0; d < f; d++) {
        (builder.begin(),
          builder.moveTo(d * height * 1.2 + 0.519 * height, 0.947 * height),
          builder.curveTo(
            d * height * 1.2 + 0.558 * height,
            0.908 * height,
            d * height * 1.2 + 0.778 * height,
            0.682 * height,
            d * height * 1.2 + 0.916 * height,
            0.54 * height
          ),
          builder.curveTo(
            d * height * 1.2 + 1.039 * height,
            0.414 * height,
            d * height * 1.2 + 1.036 * height,
            0.229 * height,
            d * height * 1.2 + 0.924 * height,
            0.115 * height
          ),
          builder.curveTo(
            d * height * 1.2 + 0.812 * height,
            0,
            d * height * 1.2 + 0.631 * height,
            0,
            d * height * 1.2 + 0.519 * height,
            0.115 * height
          ),
          builder.curveTo(
            d * height * 1.2 + 0.408 * height,
            0,
            d * height * 1.2 + 0.227 * height,
            0,
            d * height * 1.2 + 0.115 * height,
            0.115 * height
          ),
          builder.curveTo(
            d * height * 1.2 + 0.03 * height,
            0.229 * height,
            d * height * 1.2,
            0.414 * height,
            d * height * 1.2 + 0.123 * height,
            0.54 * height
          ),
          builder.close(),
          builder.fillAndStroke());
      }
    }
    d = this.getStyleValue(style, 'emptyFillColor', '#ffffff');
    builder.setFillColor(d as string);
    if (b === 'star') {
      for (d = f; d < g; d++) {
        (builder.begin(),
          builder.moveTo(d * height * 1.2, 0.33 * height),
          builder.lineTo(d * height * 1.2 + 0.364 * height, 0.33 * height),
          builder.lineTo(d * height * 1.2 + 0.475 * height, 0),
          builder.lineTo(d * height * 1.2 + 0.586 * height, 0.33 * height),
          builder.lineTo(d * height * 1.2 + 0.95 * height, 0.33 * height),
          builder.lineTo(d * height * 1.2 + 0.66 * height, 0.551 * height),
          builder.lineTo(d * height * 1.2 + 0.775 * height, 0.9 * height),
          builder.lineTo(d * height * 1.2 + 0.475 * height, 0.684 * height),
          builder.lineTo(d * height * 1.2 + 0.175 * height, 0.9 * height),
          builder.lineTo(d * height * 1.2 + 0.29 * height, 0.551 * height),
          builder.close(),
          builder.fillAndStroke());
      }
    } else if (b === 'heart') {
      for (d = f; d < g; d++) {
        (builder.begin(),
          builder.moveTo(d * height * 1.2 + 0.519 * height, 0.947 * height),
          builder.curveTo(
            d * height * 1.2 + 0.558 * height,
            0.908 * height,
            d * height * 1.2 + 0.778 * height,
            0.682 * height,
            d * height * 1.2 + 0.916 * height,
            0.54 * height
          ),
          builder.curveTo(
            d * height * 1.2 + 1.039 * height,
            0.414 * height,
            d * height * 1.2 + 1.036 * height,
            0.229 * height,
            d * height * 1.2 + 0.924 * height,
            0.115 * height
          ),
          builder.curveTo(
            d * height * 1.2 + 0.812 * height,
            0,
            d * height * 1.2 + 0.631 * height,
            0,
            d * height * 1.2 + 0.519 * height,
            0.115 * height
          ),
          builder.curveTo(
            d * height * 1.2 + 0.408 * height,
            0,
            d * height * 1.2 + 0.227 * height,
            0,
            d * height * 1.2 + 0.115 * height,
            0.115 * height
          ),
          builder.curveTo(
            d * height * 1.2 + 0.03 * height,
            0.229 * height,
            d * height * 1.2,
            0.414 * height,
            d * height * 1.2 + 0.123 * height,
            0.54 * height
          ),
          builder.close(),
          builder.fillAndStroke());
      }
    }
    builder.restore();
  }
}
