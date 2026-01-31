// @ts-nocheck
import type { RenderContext, ShapeAttrs } from '../../../renderer.ts';
import { BaseShapeHandler } from '../../shape-registry.ts';

export class IosILockButtonHandler extends BaseShapeHandler {
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
    builder.setShadow(!1);
    builder.setAlpha(0.7);
    builder.setGradient('#4A4F56', '#70757B', 0, 0, width, height, 'north', 1, 1);
    builder.rect(0, 0, width, height);
    builder.fill();
    builder.setAlpha(0.8);
    builder.setGradient('#18232D', '#1F2933', 10, 10, 154, 30, 'north', 1, 1);
    builder.roundrect(10, 0.5 * height - 15, width - 20, 30, 7.5, 7.5);
    builder.fill();
    builder.setAlpha(1);
    builder.setGradient('#E9F3FD', '#ADB7C1', 12.5, 12.5, 40, 25, 'south', 1, 1);
    builder.roundrect(12.5, 0.5 * height - 12.5, 40, 25, 5, 5);
    builder.fill();
    builder.setAlpha(0.8);
    builder.setStrokeWidth(0.5);
    builder.setStrokeColor('#aabbbb' as string);
    builder.setGradient('#AEB7C1', '#667079', 20, 17.5, 25, 15, 'south', 1, 1);
    builder.begin();
    builder.moveTo(20, 0.5 * height - 3.5);
    builder.lineTo(35, 0.5 * height - 3.5);
    builder.lineTo(35, 0.5 * height - 7.5);
    builder.lineTo(45, 0.5 * height);
    builder.lineTo(35, 0.5 * height + 7.5);
    builder.lineTo(35, 0.5 * height + 3.5);
    builder.lineTo(20, 0.5 * height + 3.5);
    builder.close();
    builder.fillAndStroke();
    if ('' != this.getStyleValue(style, 'mainText', null)) {
      builder.setFontSize(Number.parseFloat(String(12.5)) || 0);
      builder.setFontColor('#cccccc' as string);
      builder.text(
        width / 2 + 20.5,
        height / 2,
        0,
        0,
        'slide to unlock',
        'center',
        'middle',
        0,
        0,
        0
      );
    }
    builder.restore();
  }
}
