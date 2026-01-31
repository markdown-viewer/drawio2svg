import type { RenderContext, ShapeAttrs } from '../../../renderer.ts';
import { normalizeColor } from '../../color.ts';
import { EllipseShapeHandler } from '../../shape-registry.ts';

export class WaypointHandler extends EllipseShapeHandler {
  constructor(renderCtx: RenderContext) {
    super(renderCtx);
  }

  render(attrs: ShapeAttrs): void {
    const { builder, currentGroup, x, y, width, height, style, applyShapeAttrsToElement } = this.renderCtx;
    if (!builder || !currentGroup) return;

    const sizeRaw = parseFloat(style.size as string);
    const size = Number.isFinite(sizeRaw) ? sizeRaw : 6;
    const radius = size / 2;
    const cx = x + width / 2;
    const cy = y + height / 2;

    const ellipse = builder.createEllipse(cx, cy, radius, radius, {
      'pointer-events': 'all'
    });
    applyShapeAttrsToElement(ellipse, attrs);
    const rawStrokeColor = style.strokeColor as string | undefined;
    const strokeFallback = rawStrokeColor ? normalizeColor(rawStrokeColor) : attrs.strokeColor;
    const fillColor = attrs.fillColor === 'none' ? strokeFallback : attrs.fillColor;
    if (fillColor && fillColor !== 'none') {
      ellipse.setAttribute('fill', fillColor);
    }
    ellipse.setAttribute('stroke', 'none');
    currentGroup.appendChild(ellipse);

    const rect = builder.createRect(x, y, width, height, {
      fill: 'none',
      stroke: 'none',
      'pointer-events': 'all'
    });
    currentGroup.appendChild(rect);
  }
}
