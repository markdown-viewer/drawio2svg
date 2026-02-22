import type { RenderContext, ShapeAttrs } from '../../../renderer.ts';
import { ActorShapeHandler } from '../../shape-registry.ts';

export class UmlActorHandler extends ActorShapeHandler {
  constructor(renderCtx: RenderContext) {
    super(renderCtx);
  }

  render(attrs: ShapeAttrs): void {
    const { builder, currentGroup, style, x, y, width, height, applyShapeAttrsToBuilder } = this.renderCtx;
    if (!builder || !currentGroup) return;

    const actorStyle = (style.actorStyle as string) || '';

    builder.setCanvasRoot(currentGroup);
    builder.save();
    applyShapeAttrsToBuilder(builder, attrs);

    if (actorStyle === 'awesome') {
      renderAwesome(builder, x, y, width, height);
    } else if (actorStyle === 'hollow') {
      renderHollow(builder, x, y, width, height);
    } else {
      renderStickman(builder, x, y, width, height);

      // Business variant (actor/): draw a chord in the lower-right area of the head circle.
      if (style.business === '1') {
        const headR = Math.min(width, height * 0.25) / 2;
        const headCx = x + width / 2;
        const headCy = y + headR;
        const alpha = 21 * Math.PI / 64;
        const p1x = headCx + headR * Math.cos(Math.PI / 4 + alpha);
        const p1y = headCy + headR * Math.sin(Math.PI / 4 + alpha);
        const p2x = headCx + headR * Math.cos(Math.PI / 4 - alpha);
        const p2y = headCy + headR * Math.sin(Math.PI / 4 - alpha);
        builder.setShadow(false);
        builder.begin();
        builder.moveTo(p1x, p1y);
        builder.lineTo(p2x, p2y);
        builder.stroke();
      }
    }

    builder.restore();
  }
}

// ── Stickman (default) ──────────────────────────────────────────────────────

function renderStickman(builder: any, x: number, y: number, width: number, height: number): void {
  const headR = Math.min(width, height * 0.25) / 2;
  const headCx = x + width / 2;
  const headCy = y + headR;
  const bodyTop = y + headR * 2;
  const bodyMid = y + height * (2 / 3);
  const bodyBot = y + height;
  const armY = y + height / 3;

  builder.ellipse(headCx - headR, headCy - headR, headR * 2, headR * 2);
  builder.fillAndStroke();

  builder.setFillColor(null);
  builder.setFillAlpha(1);
  builder.begin();
  // Body: head bottom to body mid
  builder.addPoints(
    [
      { x: headCx, y: bodyTop },
      { x: headCx, y: bodyMid }
    ],
    false, 0, false
  );
  // Left arm
  builder.addPoints(
    [
      { x: headCx, y: armY },
      { x, y: armY }
    ],
    false, 0, false
  );
  // Right arm
  builder.addPoints(
    [
      { x: headCx, y: armY },
      { x: x + width, y: armY }
    ],
    false, 0, false
  );
  // Left leg
  builder.addPoints(
    [
      { x: headCx, y: bodyMid },
      { x, y: bodyBot }
    ],
    false, 0, false
  );
  // Right leg
  builder.addPoints(
    [
      { x: headCx, y: bodyMid },
      { x: x + width, y: bodyBot }
    ],
    false, 0, false
  );
  builder.stroke();
}

// ── Awesome (person silhouette with rounded body) ───────────────────────────
// Proportions from PlantUML ActorAwesome (official 54×60 bounding box).

export function renderAwesome(builder: any, x: number, y: number, w: number, h: number): void {
  const cx = x + w / 2;

  // Head: circular, diameter ≈ 53.3% of total height
  const headR = Math.min(w * 0.2963, h * 0.2667);
  const headCy = y + headR;

  builder.ellipse(cx - headR, headCy - headR, headR * 2, headR * 2);
  builder.fillAndStroke();

  // Body: from head bottom to total bottom
  const bodyTop = y + headR * 2;   // shoulder level = head bottom
  const bodyBot = y + h;
  const bodyH = bodyBot - bodyTop;

  const neckGap = bodyH * 0.1429;          // 4/28
  const neckY = bodyTop + neckGap;
  const shoulderOfs = w * 0.2037;          // 11/54  shoulder offset from center
  const sCp1 = w * 0.0741;                // 4/54   shoulder curve cp1 x offset
  const sCp2 = w * 0.1296;                // 7/54   shoulder curve cp2 x offset
  const armpitCp1x = w * 0.1481;          // 8/54   armpit cp1 x offset from shoulder
  const armpitCp2y = bodyH * 0.2857;      // 8/28   armpit cp2 y offset from bodyTop
  const armpitEndY = bodyH * 0.5714;      // 16/28  armpit end y offset from bodyTop
  const cornerR = bodyH * 0.2857;          // 8/28   bottom corner radius
  const cCp = cornerR * 0.5;              // corner control-point offset

  builder.begin();
  // Start at neck bottom (center)
  builder.moveTo(cx, neckY);
  // Right shoulder: curve up from neck to shoulder point
  builder.curveTo(cx + sCp1, neckY, cx + sCp2, neckY, cx + shoulderOfs, bodyTop);
  // Right armpit: curve from shoulder down the right side
  builder.curveTo(cx + shoulderOfs + armpitCp1x, bodyTop, x + w, bodyTop + armpitCp2y, x + w, bodyTop + armpitEndY);
  // Right side straight down
  builder.lineTo(x + w, bodyBot - cornerR);
  // Bottom-right corner
  builder.curveTo(x + w, bodyBot - cornerR + cCp, x + w - cornerR + cCp, bodyBot, x + w - cornerR, bodyBot);
  // Bottom edge
  builder.lineTo(x + cornerR, bodyBot);
  // Bottom-left corner
  builder.curveTo(x + cornerR - cCp, bodyBot, x, bodyBot - cornerR + cCp, x, bodyBot - cornerR);
  // Left side straight up
  builder.lineTo(x, bodyTop + armpitEndY);
  // Left armpit: curve from left side up to left shoulder
  builder.curveTo(x, bodyTop + armpitCp2y, cx - shoulderOfs - armpitCp1x, bodyTop, cx - shoulderOfs, bodyTop);
  // Left shoulder: curve from shoulder back to neck center
  builder.curveTo(cx - sCp2, neckY, cx - sCp1, neckY, cx, neckY);
  builder.close();
  builder.fillAndStroke();
}

// ── Hollow (person outline with V-legs) ─────────────────────────────────────

export function renderHollow(builder: any, x: number, y: number, width: number, height: number): void {
  // Proportions derived from PlantUML Hollow actor rendering
  const cx = x + width / 2;
  const headR = Math.min(width * 0.18, height * 0.14);
  const headCy = y + headR;

  // Head (small circle)
  builder.ellipse(cx - headR, headCy - headR, headR * 2, headR * 2);
  builder.fillAndStroke();

  // Body: T-shirt shape with V-legs
  const shoulderTop = y + headR * 2 + height * 0.03;
  const shoulderBot = shoulderTop + height * 0.16;
  const innerW = width * 0.24;   // torso width ratio
  const crotchY = shoulderBot + height * 0.07;
  const footY = y + height;

  builder.begin();
  // Start top-left of shoulders
  builder.moveTo(x, shoulderTop);
  // Left shoulder down to armpit
  builder.lineTo(x, shoulderBot);
  // Armpit to inner left of torso
  builder.lineTo(cx - innerW / 2, shoulderBot);
  // Torso down to crotch
  builder.lineTo(cx - innerW / 2, crotchY);
  // Left leg: diagonally out-left to foot
  builder.lineTo(x, footY - (footY - crotchY) * 0.13);
  // Left foot: kick inward
  builder.lineTo(x + width * 0.168, footY);
  // Left leg back up to crotch center
  builder.lineTo(cx, crotchY + (footY - crotchY) * 0.35);
  // Right leg down to right foot
  builder.lineTo(x + width - width * 0.168, footY);
  // Right foot: kick outward
  builder.lineTo(x + width, footY - (footY - crotchY) * 0.13);
  // Right leg back up to crotch
  builder.lineTo(cx + innerW / 2, crotchY);
  // Torso up to armpit
  builder.lineTo(cx + innerW / 2, shoulderBot);
  // Right armpit to right shoulder
  builder.lineTo(x + width, shoulderBot);
  // Right shoulder up to top
  builder.lineTo(x + width, shoulderTop);
  builder.close();
  builder.fillAndStroke();
}
