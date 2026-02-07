import type { RenderContext, ShapeAttrs } from '../../../renderer.ts';
import { RectangleShapeHandler } from '../../shape-registry.ts';

export class UmlLifelineHandler extends RectangleShapeHandler {
  constructor(renderCtx: RenderContext) {
    super(renderCtx);
  }

  render(attrs: ShapeAttrs): void {
    const { builder, currentGroup, applyShapeAttrsToBuilder, x, y, width, height, style } = this.renderCtx;
    if (!builder || !currentGroup) return;

    const size = parseFloat(style.size as string) || 40;
    const actualSize = Math.min(height, size);
    const lifelineDashed = style.lifelineDashed !== 0 && style.lifelineDashed !== '0' && style.lifelineDashed !== false;
    const participant = (style.participant as string) || '';

    builder.setCanvasRoot(currentGroup);
    builder.save();
    applyShapeAttrsToBuilder(builder, attrs);

    if (participant === 'umlActor') {
      const headR = Math.min(width, actualSize * 0.25) / 2;
      const headCx = x + width / 2;
      const headCy = y + headR;
      const bodyTop = y + headR * 2;
      const bodyMid = y + actualSize * 0.55;
      const bodyBot = y + actualSize;
      const armY = y + actualSize * 0.28;

      builder.ellipse(headCx - headR, headCy - headR, headR * 2, headR * 2);
      builder.fillAndStroke();

      builder.setFillColor(null);
      builder.setFillAlpha(1);
      builder.begin();
      builder.addPoints(
        [
          { x: headCx, y: bodyTop },
          { x: headCx, y: bodyMid }
        ],
        false,
        0,
        false
      );
      builder.addPoints(
        [
          { x, y: armY },
          { x: x + width, y: armY }
        ],
        false,
        0,
        false
      );
      builder.addPoints(
        [
          { x: headCx, y: bodyMid },
          { x, y: bodyBot }
        ],
        false,
        0,
        false
      );
      builder.addPoints(
        [
          { x: headCx, y: bodyMid },
          { x: x + width, y: bodyBot }
        ],
        false,
        0,
        false
      );
      builder.stroke();
    } else if (participant === 'umlControl') {
      const ellipseHeight = actualSize * 0.875;
      const ellipseY = y + actualSize * 0.125;
      const ellipseCx = x + width / 2;
      const ellipseCy = ellipseY + ellipseHeight / 2;

      builder.ellipse(ellipseCx - width / 2, ellipseCy - ellipseHeight / 2, width, ellipseHeight);
      builder.fillAndStroke();

      builder.setFillColor(null);
      builder.setFillAlpha(1);
      const apexX = x + width * 0.375;
      const apexY = y + actualSize * 0.1375;
      builder.begin();
      builder.addPoints(
        [
          { x: apexX, y: apexY },
          { x: x + width * 0.625, y }
        ],
        false,
        0,
        false
      );
      builder.stroke();
      builder.begin();
      builder.addPoints(
        [
          { x: apexX, y: apexY },
          { x: x + width * 0.625, y: y + actualSize * 0.25 }
        ],
        false,
        0,
        false
      );
      builder.stroke();
    } else if (participant === 'umlEntity') {
      builder.ellipse(x, y, width, actualSize);
      builder.fillAndStroke();

      builder.setFillColor(null);
      builder.setFillAlpha(1);
      builder.begin();
      builder.addPoints(
        [
          { x: x + width * 0.125, y: y + actualSize },
          { x: x + width * 0.875, y: y + actualSize }
        ],
        false,
        0,
        false
      );
      builder.stroke();
    } else if (participant === 'umlBoundary') {
      // Vertical bar on the left
      builder.begin();
      builder.addPoints(
        [
          { x, y: y + actualSize / 4 },
          { x, y: y + actualSize * 3 / 4 }
        ],
        false,
        0,
        false
      );
      builder.stroke();
      // Horizontal connector from bar to ellipse
      builder.begin();
      builder.addPoints(
        [
          { x, y: y + actualSize / 2 },
          { x: x + width / 6, y: y + actualSize / 2 }
        ],
        false,
        0,
        false
      );
      builder.stroke();
      // Ellipse occupying the right 5/6 of width
      builder.ellipse(x + width / 6, y, width * 5 / 6, actualSize);
      builder.fillAndStroke();
    } else if (attrs.rounded) {
      let r: number;
      const absoluteArcSize = style.absoluteArcSize === '1' || style.absoluteArcSize === true;
      if (absoluteArcSize) {
        const arcSize = parseFloat(style.arcSize as string) || 20;
        r = Math.min(width / 2, Math.min(actualSize / 2, arcSize / 2));
      } else {
        const f = (parseFloat(style.arcSize as string) || 15) / 100;
        r = Math.min(width * f, actualSize * f);
      }
      builder.roundrect(x, y, width, actualSize, r, r);
      builder.fillAndStroke();

      const rectEl = currentGroup.lastChild as Element | null;
      if (rectEl) {
        rectEl.setAttribute('pointer-events', 'all');
      }
    } else if (participant !== 'umlActor' && participant !== 'umlControl') {
      builder.rect(x, y, width, actualSize);
      builder.fillAndStroke();

      const rectEl = currentGroup.lastChild as Element | null;
      if (rectEl) {
        rectEl.setAttribute('pointer-events', 'all');
      }
    }

    if (actualSize < height) {
      builder.setFillColor(null);
      builder.setDashed(lifelineDashed);
      builder.begin();
      builder.addPoints(
        [
          { x: x + width / 2, y: y + actualSize },
          { x: x + width / 2, y: y + height }
        ],
        false,
        0,
        false
      );
      builder.stroke();

      const lineEl = currentGroup.lastChild as Element | null;
      if (lineEl) {
        lineEl.setAttribute('pointer-events', 'all');
      }
    }

    builder.restore();
  }
}
