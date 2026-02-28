import type { CellState, Point } from '../types.ts';

// ============================================================================
// getHexagonPerimeterPoint - calculate hexagon perimeter intersection point
// ============================================================================

const intersection = (
  x0: number,
  y0: number,
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  x3: number,
  y3: number
): Point | null => {
  const denom = ((y3 - y2) * (x1 - x0)) - ((x3 - x2) * (y1 - y0));
  const numeA = ((x3 - x2) * (y0 - y2)) - ((y3 - y2) * (x0 - x2));
  const numeB = ((x1 - x0) * (y0 - y2)) - ((y1 - y0) * (x0 - x2));

  const ua = numeA / denom;
  const ub = numeB / denom;

  const eps = 0.000001;

  if (ua >= -eps && ua <= 1.0 + eps && ub >= -eps && ub <= 1.0 + eps) {
    const x = x0 + ua * (x1 - x0);
    const y = y0 + ua * (y1 - y0);
    return { x, y };
  }

  return null;
};

export function getHexagonPerimeterPoint(
  bounds: CellState,
  next: Point,
  orthogonal: boolean = false
): Point {
  const x = bounds.x;
  const y = bounds.y;
  const w = bounds.width;
  const h = bounds.height;

  const cx = x + w / 2;
  const cy = y + h / 2;
  const px = next.x;
  const py = next.y;
  const dx = px - cx;
  const dy = py - cy;
  const alpha = -Math.atan2(dy, dx);
  const pi = Math.PI;
  const pi2 = Math.PI / 2;

  let result: Point = { x: cx, y: cy };

  const direction = (bounds.direction || 'east').toString().toLowerCase();
  const vertical = direction === 'north' || direction === 'south';

  // Compute actual corner offset from style fixedSize/size
  const isFixed = bounds.fixedSize === true;
  const sizeRaw = bounds.size;
  // s = horizontal corner offset for non-vertical hexagons (replaces hardcoded w/4)
  const s = isFixed
    ? Math.max(0, Math.min(w * 0.5, Number.isFinite(sizeRaw) ? sizeRaw! : 20))
    : w * Math.max(0, Math.min(1, Number.isFinite(sizeRaw) ? sizeRaw! : 0.25));
  // sv = vertical corner offset for vertical hexagons (replaces hardcoded h/4)
  const sv = isFixed
    ? Math.max(0, Math.min(h * 0.5, Number.isFinite(sizeRaw) ? sizeRaw! : 20))
    : h * Math.max(0, Math.min(1, Number.isFinite(sizeRaw) ? sizeRaw! : 0.25));

  let a: Point = { x: 0, y: 0 };
  let b: Point = { x: 0, y: 0 };

  if (((px < x) && (py < y)) || ((px < x) && (py > y + h)) ||
      ((px > x + w) && (py < y)) || ((px > x + w) && (py > y + h))) {
    orthogonal = false;
  }

  if (orthogonal) {
    if (vertical) {
      if (px === cx) {
        if (py <= y) {
          return { x: cx, y };
        } else if (py >= y + h) {
          return { x: cx, y: y + h };
        }
      } else if (px < x) {
        if (py === y + sv) {
          return { x, y: y + sv };
        } else if (py === y + h - sv) {
          return { x, y: y + h - sv };
        }
      } else if (px > x + w) {
        if (py === y + sv) {
          return { x: x + w, y: y + sv };
        } else if (py === y + h - sv) {
          return { x: x + w, y: y + h - sv };
        }
      } else if (px === x) {
        if (py < cy) {
          return { x, y: y + sv };
        } else if (py > cy) {
          return { x, y: y + h - sv };
        }
      } else if (px === x + w) {
        if (py < cy) {
          return { x: x + w, y: y + sv };
        } else if (py > cy) {
          return { x: x + w, y: y + h - sv };
        }
      }
      if (py === y) {
        return { x: cx, y };
      } else if (py === y + h) {
        return { x: cx, y: y + h };
      }

      if (px < cx) {
        if ((py > y + sv) && (py < y + h - sv)) {
          a = { x, y };
          b = { x, y: y + h };
        } else if (py < y + sv) {
          a = { x: x - Math.floor(0.5 * w), y: y + Math.floor(2 * sv) };
          b = { x: x + w, y: y - Math.floor(sv) };
        } else if (py > y + h - sv) {
          a = { x: x - Math.floor(0.5 * w), y: y + h - Math.floor(2 * sv) };
          b = { x: x + w, y: y + h + Math.floor(sv) };
        }
      } else if (px > cx) {
        if ((py > y + sv) && (py < y + h - sv)) {
          a = { x: x + w, y };
          b = { x: x + w, y: y + h };
        } else if (py < y + sv) {
          a = { x, y: y - Math.floor(sv) };
          b = { x: x + Math.floor(1.5 * w), y: y + Math.floor(2 * sv) };
        } else if (py > y + h - sv) {
          a = { x: x + Math.floor(1.5 * w), y: y + h - Math.floor(2 * sv) };
          b = { x, y: y + h + Math.floor(sv) };
        }
      }
    } else {
      if (py === cy) {
        if (px <= x) {
          return { x, y: y + h / 2 };
        } else if (px >= x + w) {
          return { x: x + w, y: y + h / 2 };
        }
      } else if (py < y) {
        if (px === x + s) {
          return { x: x + s, y };
        } else if (px === x + w - s) {
          return { x: x + w - s, y };
        }
      } else if (py > y + h) {
        if (px === x + s) {
          return { x: x + s, y: y + h };
        } else if (px === x + w - s) {
          return { x: x + w - s, y: y + h };
        }
      } else if (py === y) {
        if (px < cx) {
          return { x: x + s, y };
        } else if (px > cx) {
          return { x: x + w - s, y };
        }
      } else if (py === y + h) {
        if (px < cx) {
          return { x: x + s, y: y + h };
        } else if (py > cy) {
          return { x: x + w - s, y: y + h };
        }
      }
      if (px === x) {
        return { x, y: cy };
      } else if (px === x + w) {
        return { x: x + w, y: cy };
      }

      if (py < cy) {
        if ((px > x + s) && (px < x + w - s)) {
          a = { x, y };
          b = { x: x + w, y };
        } else if (px < x + s) {
          a = { x: x - Math.floor(s), y: y + h };
          b = { x: x + Math.floor(2 * s), y: y - Math.floor(0.5 * h) };
        } else if (px > x + w - s) {
          a = { x: x + w - Math.floor(2 * s), y: y - Math.floor(0.5 * h) };
          b = { x: x + w + Math.floor(s), y: y + h };
        }
      } else if (py > cy) {
        if ((px > x + s) && (px < x + w - s)) {
          a = { x, y: y + h };
          b = { x: x + w, y: y + h };
        } else if (px < x + s) {
          a = { x: x - Math.floor(s), y };
          b = { x: x + Math.floor(2 * s), y: y + Math.floor(1.5 * h) };
        } else if (px > x + w - s) {
          a = { x: x + w - Math.floor(2 * s), y: y + Math.floor(1.5 * h) };
          b = { x: x + w + Math.floor(s), y };
        }
      }
    }

    let tx = cx;
    let ty = cy;

    if (px >= x && px <= x + w) {
      tx = px;

      if (py < cy) {
        ty = y + h;
      } else {
        ty = y;
      }
    } else if (py >= y && py <= y + h) {
      ty = py;

      if (px < cx) {
        tx = x + w;
      } else {
        tx = x;
      }
    }

    result = intersection(tx, ty, next.x, next.y, a.x, a.y, b.x, b.y) ?? { x: cx, y: cy };
  } else {
    if (vertical) {
      const beta = Math.atan2(h / 2 - sv, w / 2);

      if (alpha === beta) {
        return { x: x + w, y: y + Math.floor(sv) };
      } else if (alpha === pi2) {
        return { x: x + Math.floor(0.5 * w), y };
      } else if (alpha === (pi - beta)) {
        return { x, y: y + Math.floor(sv) };
      } else if (alpha === -beta) {
        return { x: x + w, y: y + Math.floor(h - sv) };
      } else if (alpha === (-pi2)) {
        return { x: x + Math.floor(0.5 * w), y: y + h };
      } else if (alpha === (-pi + beta)) {
        return { x, y: y + Math.floor(h - sv) };
      }

      if ((alpha < beta) && (alpha > -beta)) {
        a = { x: x + w, y };
        b = { x: x + w, y: y + h };
      } else if ((alpha > beta) && (alpha < pi2)) {
        a = { x, y: y - Math.floor(sv) };
        b = { x: x + Math.floor(1.5 * w), y: y + Math.floor(2 * sv) };
      } else if ((alpha > pi2) && (alpha < (pi - beta))) {
        a = { x: x - Math.floor(0.5 * w), y: y + Math.floor(2 * sv) };
        b = { x: x + w, y: y - Math.floor(sv) };
      } else if (((alpha > (pi - beta)) && (alpha <= pi)) || ((alpha < (-pi + beta)) && (alpha >= -pi))) {
        a = { x, y };
        b = { x, y: y + h };
      } else if ((alpha < -beta) && (alpha > -pi2)) {
        a = { x: x + Math.floor(1.5 * w), y: y + h - Math.floor(2 * sv) };
        b = { x, y: y + h + Math.floor(sv) };
      } else if ((alpha < -pi2) && (alpha > (-pi + beta))) {
        a = { x: x - Math.floor(0.5 * w), y: y + h - Math.floor(2 * sv) };
        b = { x: x + w, y: y + h + Math.floor(sv) };
      }
    } else {
      const beta = Math.atan2(h / 2, w / 2 - s);

      if (alpha === beta) {
        return { x: x + Math.floor(w - s), y };
      } else if (alpha === (pi - beta)) {
        return { x: x + Math.floor(s), y };
      } else if ((alpha === pi) || (alpha === -pi)) {
        return { x, y: y + Math.floor(0.5 * h) };
      } else if (alpha === 0) {
        return { x: x + w, y: y + Math.floor(0.5 * h) };
      } else if (alpha === -beta) {
        return { x: x + Math.floor(w - s), y: y + h };
      } else if (alpha === (-pi + beta)) {
        return { x: x + Math.floor(s), y: y + h };
      }

      if ((alpha > 0) && (alpha < beta)) {
        a = { x: x + w - Math.floor(2 * s), y: y - Math.floor(0.5 * h) };
        b = { x: x + w + Math.floor(s), y: y + h };
      } else if ((alpha > beta) && (alpha < (pi - beta))) {
        a = { x, y };
        b = { x: x + w, y };
      } else if ((alpha > (pi - beta)) && (alpha < pi)) {
        a = { x: x - Math.floor(s), y: y + h };
        b = { x: x + Math.floor(2 * s), y: y - Math.floor(0.5 * h) };
      } else if ((alpha < 0) && (alpha > -beta)) {
        a = { x: x + w - Math.floor(2 * s), y: y + Math.floor(1.5 * h) };
        b = { x: x + w + Math.floor(s), y };
      } else if ((alpha < -beta) && (alpha > (-pi + beta))) {
        a = { x, y: y + h };
        b = { x: x + w, y: y + h };
      } else if ((alpha < (-pi + beta)) && (alpha > -pi)) {
        a = { x: x - Math.floor(s), y };
        b = { x: x + Math.floor(2 * s), y: y + Math.floor(1.5 * h) };
      }
    }

    result = intersection(cx, cy, next.x, next.y, a.x, a.y, b.x, b.y) ?? { x: cx, y: cy };
  }

  return result;
}
