import type { RenderContext, ShapeAttrs } from '../../../renderer.ts';
import { RectangleShapeHandler } from '../../shape-registry.ts';
import { renderAwesome, renderHollow } from './uml-actor.ts';

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
      const actorStyle = ((style.actorStyle as string) || '').toLowerCase();
      if (actorStyle === 'awesome') {
        renderAwesome(builder, x, y, width, actualSize);
      } else if (actorStyle === 'hollow') {
        renderHollow(builder, x, y, width, actualSize);
      } else {
        renderLifelineStickman(builder, x, y, width, actualSize);
      }
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
    } else if (participant === 'umlDatabase') {
      // Cylinder shape (database icon)
      const capH = actualSize * 0.22;
      const hw = width / 2;
      const cx = x + hw;

      // Body: top elliptical cap -> sides -> bottom elliptical cap
      builder.begin();
      builder.moveTo(x, y + capH);
      builder.curveTo(x, y, cx, y, cx, y);
      builder.curveTo(cx, y, x + width, y, x + width, y + capH);
      builder.lineTo(x + width, y + actualSize - capH);
      builder.curveTo(x + width, y + actualSize, cx, y + actualSize, cx, y + actualSize);
      builder.curveTo(cx, y + actualSize, x, y + actualSize, x, y + actualSize - capH);
      builder.close();
      builder.fillAndStroke();

      // Top cap closing line (inner ellipse rim)
      builder.setFillColor(null);
      builder.setFillAlpha(1);
      builder.begin();
      builder.moveTo(x, y + capH);
      builder.curveTo(x, y + capH * 2, cx, y + capH * 2, cx, y + capH * 2);
      builder.curveTo(cx, y + capH * 2, x + width, y + capH * 2, x + width, y + capH);
      builder.stroke();
    } else if (participant === 'umlCollections') {
      // Two stacked rectangles with small offset (proportional to icon size)
      const offset = Math.round(actualSize * 0.14);

      // Back rectangle (shifted right and up)
      builder.rect(x + offset, y, width - offset, actualSize - offset);
      builder.fillAndStroke();

      // Front rectangle
      builder.rect(x, y + offset, width - offset, actualSize - offset);
      builder.fillAndStroke();
    } else if (participant === 'umlQueue') {
      // Horizontal stadium shape (queue icon)
      const dx = Math.round(actualSize * 0.18);
      const midY = y + actualSize / 2;

      // Main body path
      builder.begin();
      builder.moveTo(x + dx, y);
      builder.lineTo(x + width - dx, y);
      builder.curveTo(x + width, y, x + width, midY, x + width, midY);
      builder.curveTo(x + width, midY, x + width, y + actualSize, x + width - dx, y + actualSize);
      builder.lineTo(x + dx, y + actualSize);
      builder.curveTo(x, y + actualSize, x, midY, x, midY);
      builder.curveTo(x, midY, x, y, x + dx, y);
      builder.close();
      builder.fillAndStroke();

      // Inner divider line on the right
      builder.setFillColor(null);
      builder.setFillAlpha(1);
      builder.begin();
      builder.moveTo(x + width - dx, y);
      builder.curveTo(x + width - dx * 2, y, x + width - dx * 2, midY, x + width - dx * 2, midY);
      builder.curveTo(x + width - dx * 2, midY, x + width - dx * 2, y + actualSize, x + width - dx, y + actualSize);
      builder.stroke();
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

// ── Actor shape helpers for lifeline ────────────────────────────────────────

function renderLifelineStickman(builder: any, x: number, y: number, width: number, actualSize: number): void {
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
    [{ x: headCx, y: bodyTop }, { x: headCx, y: bodyMid }],
    false, 0, false
  );
  builder.addPoints(
    [{ x, y: armY }, { x: x + width, y: armY }],
    false, 0, false
  );
  builder.addPoints(
    [{ x: headCx, y: bodyMid }, { x, y: bodyBot }],
    false, 0, false
  );
  builder.addPoints(
    [{ x: headCx, y: bodyMid }, { x: x + width, y: bodyBot }],
    false, 0, false
  );
  builder.stroke();
}

