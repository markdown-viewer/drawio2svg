import type { RenderContext, ShapeAttrs } from '../../../renderer.ts';
import { RectangleShapeHandler } from '../../shape-registry.ts';
import { normalizeColor } from '../../color.ts';

export class Ios7CurrentLocationHandler extends RectangleShapeHandler {
  constructor(renderCtx: RenderContext) {
    super(renderCtx);
  }

  render(attrs: ShapeAttrs): void {
    const { builder, currentGroup, style, x, y, width, height } = this.renderCtx;
    if (!builder || !currentGroup) return;

    if (width <= 0 || height <= 0) return;

    const format = (value: number): number => Number(value.toFixed(2));
    const cx = format(x + width / 2);
    const cy = format(y + height / 2);
    const rx = format(width / 2);
    const ry = format(height / 2);
    const innerRx = format(width / 10);
    const innerRy = format(height / 10);

    const fillColor = attrs.fillColor === 'none' ? 'none' : attrs.fillColor;
    const strokeColor = attrs.strokeColor === 'none' ? 'none' : attrs.strokeColor;
    const outerFillRaw = style.fillColor2 as string | undefined;
    const outerFill = outerFillRaw && outerFillRaw !== 'none' ? normalizeColor(outerFillRaw) : '#c6e2ff';

    const outer = builder.createEllipse(cx, cy, rx, ry, {
      fill: outerFill,
      'fill-opacity': 0.5,
      stroke: 'none',
      'pointer-events': 'all'
    });
    currentGroup.appendChild(outer);

    const placeholder = builder.createRect(format(x), format(y), 0, 0, {
      fill: 'none',
      stroke: strokeColor,
      'stroke-width': attrs.strokeWidth || 1,
      'pointer-events': 'all'
    });
    currentGroup.appendChild(placeholder);

    const inner = builder.createEllipse(cx, cy, innerRx, innerRy, {
      fill: fillColor,
      stroke: strokeColor,
      'stroke-width': (attrs.strokeWidth || 1) * 0.6,
      'pointer-events': 'all'
    });
    currentGroup.appendChild(inner);
  }
}
