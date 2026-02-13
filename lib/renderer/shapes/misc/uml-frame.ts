import type { RenderContext, ShapeAttrs } from '../../../renderer.ts';
import type { MxStyle } from '../../../parser.ts';
import { RectangleShapeHandler, type LabelOverrides } from '../../shape-registry.ts';

export class UmlFrameHandler extends RectangleShapeHandler {
  constructor(renderCtx: RenderContext) {
    super(renderCtx);
  }

  getLabelOverrides(): LabelOverrides | null {
    return {
      alwaysUseLabelBounds: true,
      getLabelBounds: (style: MxStyle, x: number, y: number, width: number, height: number) => {
        const corner = parseFloat(style.corner as string) || 10;
        const tabWidth = Math.min(width, Math.max(corner, parseFloat(style.width as string) || 60));
        const tabHeight = Math.min(height, Math.max(corner * 1.5, parseFloat(style.height as string) || 30));
        return {
          x,
          y,
          width: tabWidth,
          height: tabHeight
        };
      }
    };
  }

  render(attrs: ShapeAttrs): void {
    const { builder, currentGroup, style, x, y, width, height, applyShapeAttrsToBuilder } = this.renderCtx;
    if (!builder || !currentGroup) return;

    const corner = parseFloat(style.corner as string) || 10;
    const w0 = Math.min(width, Math.max(corner, parseFloat(style.width as string) || 60));
    const h0 = Math.min(height, Math.max(corner * 1.5, parseFloat(style.height as string) || 30));
    const tabSlope = Math.min(w0, corner);
    const bg = (style.swimlaneFillColor as string) || 'none';

    builder.setCanvasRoot(currentGroup);
    builder.save();

    if (bg !== 'none') {
      builder.setFillColor(bg);
      builder.rect(x, y, width, height);
      builder.fill();
    }

    applyShapeAttrsToBuilder(builder, attrs);

    builder.begin();
    builder.addPoints(
      [
        { x, y },
        { x: x + w0, y },
        { x: x + w0, y: y + Math.max(0, h0 - corner * 1.5) },
        { x: x + Math.max(0, w0 - tabSlope), y: y + h0 },
        { x, y: y + h0 }
      ],
      false,
      0,
      true
    );
    builder.fillAndStroke();

    const tabEl = currentGroup.lastChild as Element | null;
    if (tabEl) {
      tabEl.setAttribute('pointer-events', 'all');
    }

    builder.begin();
    builder.addPoints(
      [
        { x: x + w0, y },
        { x: x + width, y },
        { x: x + width, y: y + height },
        { x, y: y + height },
        { x, y: y + h0 }
      ],
      false,
      0,
      false
    );
    builder.stroke();

    builder.restore();
  }
}
