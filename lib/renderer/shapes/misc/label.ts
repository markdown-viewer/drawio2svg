import type { RenderContext, ShapeAttrs } from '../../../renderer.ts';
import { RectangleShapeHandler } from '../../shape-registry.ts';

export class LabelHandler extends RectangleShapeHandler {
  constructor(renderCtx: RenderContext) {
    super(renderCtx);
  }

  render(attrs: ShapeAttrs): void {
    const { builder, currentGroup, applyShapeAttrsToBuilder, x, y, width, height, style } = this.renderCtx;
    if (!builder || !currentGroup) return;

    const { rounded } = attrs;
    const isTextShape = style.text === true || style.text === '1' || style.shape === 'text' || style.shape === 'label';
    const format = (value: number): number => Number(value.toFixed(2));
    const rectX = isTextShape ? format(x) : x;
    const rectY = isTextShape ? format(y) : y;
    const rectW = isTextShape ? format(width) : width;
    const rectH = isTextShape ? format(height) : height;

    builder.setCanvasRoot(currentGroup);
    builder.save();
    applyShapeAttrsToBuilder(builder, attrs);
    if (rounded) {
      let r: number;
      const absoluteArcSize = style.absoluteArcSize === '1' || style.absoluteArcSize === true;
      if (absoluteArcSize) {
        const arcSizeValue = parseFloat(style.arcSize as string);
        const arcSize = Number.isFinite(arcSizeValue) ? arcSizeValue : 20;
        r = Math.min(width / 2, Math.min(height / 2, arcSize / 2));
      } else {
        const arcSizeValue = parseFloat(style.arcSize as string);
        const f = (Number.isFinite(arcSizeValue) ? arcSizeValue : 15) / 100;
        r = Math.min(width * f, height * f);
      }
      builder.roundrect(rectX, rectY, rectW, rectH, r, r);
    } else {
      builder.rect(rectX, rectY, rectW, rectH);
    }
    builder.fillAndStroke();
    builder.restore();
  }
}
