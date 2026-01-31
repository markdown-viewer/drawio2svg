// @ts-nocheck
import type { RenderContext, ShapeAttrs } from '../../../renderer.ts';
import { BaseShapeHandler } from '../../shape-registry.ts';

export class IosIAlphaListHandler extends BaseShapeHandler {
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

    builder.translate(d, y);
    builder.setShadow(!1);
    d = this.getStyleValue(style, 'fontSize', '8');
    builder.setFontColor('#999999' as string);
    builder.setFontSize(Number.parseFloat(String(d)) || 0);
    builder.text(0.5 * width, 0.069 * height, 0, 0, 'A', 'center', 'middle', 0, 0, 0);
    builder.text(0.5 * width, 0.1035 * height, 0, 0, 'B', 'center', 'middle', 0, 0, 0);
    builder.text(0.5 * width, 0.138 * height, 0, 0, 'C', 'center', 'middle', 0, 0, 0);
    builder.text(0.5 * width, 0.1725 * height, 0, 0, 'D', 'center', 'middle', 0, 0, 0);
    builder.text(0.5 * width, 0.207 * height, 0, 0, 'E', 'center', 'middle', 0, 0, 0);
    builder.text(0.5 * width, 0.2415 * height, 0, 0, 'F', 'center', 'middle', 0, 0, 0);
    builder.text(0.5 * width, 0.276 * height, 0, 0, 'G', 'center', 'middle', 0, 0, 0);
    builder.text(0.5 * width, 0.3105 * height, 0, 0, 'H', 'center', 'middle', 0, 0, 0);
    builder.text(0.5 * width, 0.345 * height, 0, 0, 'I', 'center', 'middle', 0, 0, 0);
    builder.text(0.5 * width, 0.3795 * height, 0, 0, 'J', 'center', 'middle', 0, 0, 0);
    builder.text(0.5 * width, 0.414 * height, 0, 0, 'K', 'center', 'middle', 0, 0, 0);
    builder.text(0.5 * width, 0.4485 * height, 0, 0, 'L', 'center', 'middle', 0, 0, 0);
    builder.text(0.5 * width, 0.483 * height, 0, 0, 'M', 'center', 'middle', 0, 0, 0);
    builder.text(0.5 * width, 0.5175 * height, 0, 0, 'N', 'center', 'middle', 0, 0, 0);
    builder.text(0.5 * width, 0.552 * height, 0, 0, 'O', 'center', 'middle', 0, 0, 0);
    builder.text(0.5 * width, 0.5865 * height, 0, 0, 'P', 'center', 'middle', 0, 0, 0);
    builder.text(0.5 * width, 0.621 * height, 0, 0, 'Q', 'center', 'middle', 0, 0, 0);
    builder.text(0.5 * width, 0.6555 * height, 0, 0, 'R', 'center', 'middle', 0, 0, 0);
    builder.text(0.5 * width, 0.69 * height, 0, 0, 'S', 'center', 'middle', 0, 0, 0);
    builder.text(0.5 * width, 0.7245 * height, 0, 0, 'T', 'center', 'middle', 0, 0, 0);
    builder.text(0.5 * width, 0.759 * height, 0, 0, 'U', 'center', 'middle', 0, 0, 0);
    builder.text(0.5 * width, 0.7935 * height, 0, 0, 'V', 'center', 'middle', 0, 0, 0);
    builder.text(0.5 * width, 0.828 * height, 0, 0, 'W', 'center', 'middle', 0, 0, 0);
    builder.text(0.5 * width, 0.8625 * height, 0, 0, 'X', 'center', 'middle', 0, 0, 0);
    builder.text(0.5 * width, 0.897 * height, 0, 0, 'Y', 'center', 'middle', 0, 0, 0);
    builder.text(0.5 * width, 0.9315 * height, 0, 0, 'Z', 'center', 'middle', 0, 0, 0);
    builder.text(0.5 * width, 0.966 * height, 0, 0, '#', 'center', 'middle', 0, 0, 0);
    builder.setStrokeColor('#999999' as string);
    builder.ellipse(0.5 * width - 2.25, 0.0345 * height - 3.5, 4.5, 4.5);
    builder.stroke();
    builder.begin();
    builder.moveTo(0.5 * width - 4.25, 0.0345 * height + 3);
    builder.lineTo(0.5 * width - 1.75, 0.0345 * height);
    builder.stroke();
    builder.restore();
  }
}
