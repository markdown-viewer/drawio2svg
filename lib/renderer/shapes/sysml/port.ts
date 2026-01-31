// @ts-nocheck
import type { RenderContext, ShapeAttrs } from '../../../renderer.ts';
import { BaseShapeHandler } from '../../shape-registry.ts';

export class SysmlPortHandler extends BaseShapeHandler {
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

    builder.translate(x, y);
    builder.rect(0, 0, width, height);
    builder.fillAndStroke();
    switch (this.getStyleValue(style, 'sysMLPortType', 'empty')) {
      case 'flowN':
        builder.begin();
        builder.moveTo(0.25 * width, 0.5 * height);
        builder.lineTo(0.5 * width, 0.25 * height);
        builder.lineTo(0.75 * width, 0.5 * height);
        builder.moveTo(0.5 * width, 0.25 * height);
        builder.lineTo(0.5 * width, 0.75 * height);
        builder.stroke();
        break;
      case 'flowE':
        builder.begin();
        builder.moveTo(0.5 * width, 0.25 * height);
        builder.lineTo(0.75 * width, 0.5 * height);
        builder.lineTo(0.5 * width, 0.75 * height);
        builder.moveTo(0.75 * width, 0.5 * height);
        builder.lineTo(0.25 * width, 0.5 * height);
        builder.stroke();
        break;
      case 'flowS':
        builder.begin();
        builder.moveTo(0.25 * width, 0.5 * height);
        builder.lineTo(0.5 * width, 0.75 * height);
        builder.lineTo(0.75 * width, 0.5 * height);
        builder.moveTo(0.5 * width, 0.75 * height);
        builder.lineTo(0.5 * width, 0.25 * height);
        builder.stroke();
        break;
      case 'flowW':
        builder.begin();
        builder.moveTo(0.5 * width, 0.25 * height);
        builder.lineTo(0.25 * width, 0.5 * height);
        builder.lineTo(0.5 * width, 0.75 * height);
        builder.moveTo(0.25 * width, 0.5 * height);
        builder.lineTo(0.75 * width, 0.5 * height);
        builder.stroke();
        break;
      case 'doubleH':
        builder.begin();
        builder.moveTo(0.6 * width, 0.25 * height);
        builder.lineTo(0.85 * width, 0.5 * height);
        builder.lineTo(0.6 * width, 0.75 * height);
        builder.moveTo(0.4 * width, 0.25 * height);
        builder.lineTo(0.15 * width, 0.5 * height);
        builder.lineTo(0.4 * width, 0.75 * height);
        builder.stroke();
        break;
      case 'doubleV':
        (builder.begin(),
          builder.moveTo(0.25 * width, 0.6 * height),
          builder.lineTo(0.5 * width, 0.85 * height),
          builder.lineTo(0.75 * width, 0.6 * height),
          builder.moveTo(0.25 * width, 0.4 * height),
          builder.lineTo(0.5 * width, 0.15 * height),
          builder.lineTo(0.75 * width, 0.4 * height),
          builder.stroke());
    }
    builder.restore();
  }
}
