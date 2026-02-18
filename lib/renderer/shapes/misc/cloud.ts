import type { RenderContext, ShapeAttrs } from '../../../renderer.ts';
import { ActorShapeHandler, type PerimeterFn } from '../../shape-registry.ts';
import { getEllipsePerimeterPoint } from '../../../edge-router/perimeter/ellipse.ts';

export class CloudHandler extends ActorShapeHandler {
  constructor(renderCtx: RenderContext) {
    super(renderCtx);
  }

  getPerimeter(): PerimeterFn {
    return getEllipsePerimeterPoint;
  }

  render(attrs: ShapeAttrs): void {
    const { builder, currentGroup, style, x, y, width, height, applyShapeAttrsToBuilder } = this.renderCtx;
    if (!builder || !currentGroup) return;

    builder.setCanvasRoot(currentGroup);
    builder.save();
    applyShapeAttrsToBuilder(builder, attrs);

    // size controls cloud arc scale:
    //   absent or >= 1  → exact original hardcoded cloud (backward-compatible)
    //   0 < size < 1    → procedural cloud: shallower arcs + more bumps = thinner border
    const sizeVal = parseFloat(style.size as string);
    if (isNaN(sizeVal) || sizeVal >= 1) {
      // ---- Original cloud path (6 cubic beziers, unchanged) ----
      builder.begin();
      builder.moveTo(x + 0.25 * width, y + 0.25 * height);
      builder.curveTo(x + 0.05 * width, y + 0.25 * height, x, y + 0.5 * height, x + 0.16 * width, y + 0.55 * height);
      builder.curveTo(x, y + 0.66 * height, x + 0.18 * width, y + 0.9 * height, x + 0.31 * width, y + 0.8 * height);
      builder.curveTo(x + 0.4 * width, y + height, x + 0.7 * width, y + height, x + 0.8 * width, y + 0.8 * height);
      builder.curveTo(x + width, y + 0.8 * height, x + width, y + 0.6 * height, x + 0.875 * width, y + 0.5 * height);
      builder.curveTo(x + width, y + 0.3 * height, x + 0.8 * width, y + 0.1 * height, x + 0.625 * width, y + 0.2 * height);
      builder.curveTo(x + 0.5 * width, y + 0.05 * height, x + 0.3 * width, y + 0.05 * height, x + 0.25 * width, y + 0.25 * height);
      builder.close();
      builder.fillAndStroke();
    } else {
      // ---- Procedural cloud with tuneable arc depth / count ----
      // Base path is a rounded rectangle (not ellipse) so the overall
      // shape stays close to rectangular, with cloud bumps along edges.
      const s = Math.max(0.1, Math.min(0.99, sizeVal));

      // Valley depth as fraction of smaller dimension — smaller s → thinner border
      const depth = 0.08 * s * Math.min(width, height);
      // Bump count: inversely proportional to s — smaller s → more bumps
      const numBumps = Math.max(8, Math.round(12 / s));
      // Corner radius for the rounded-rect base path
      const cornerR = Math.min(width, height) * 0.15;

      // Sample a point on the rounded rectangle perimeter at parameter t ∈ [0, 1).
      // The perimeter starts at top-left corner's arc midpoint and goes clockwise.
      const perim = 2 * (width + height - 4 * cornerR) + 2 * Math.PI * cornerR;
      const topLen = width - 2 * cornerR;
      const rightLen = height - 2 * cornerR;
      const bottomLen = topLen;
      const leftLen = rightLen;
      const arcLen = (Math.PI / 2) * cornerR;
      // Segments: top-left arc, top edge, top-right arc, right edge,
      //           bottom-right arc, bottom edge, bottom-left arc, left edge
      const segLens = [arcLen, topLen, arcLen, rightLen, arcLen, bottomLen, arcLen, leftLen];
      const cumLens: number[] = [];
      let acc = 0;
      for (const sl of segLens) { acc += sl; cumLens.push(acc); }

      function ptOnRect(t: number): { px: number; py: number; nx: number; ny: number } {
        const d = ((t % 1) + 1) % 1 * perim;
        let seg = 0;
        let prevCum = 0;
        for (seg = 0; seg < segLens.length; seg++) {
          if (d < cumLens[seg]) break;
          prevCum = cumLens[seg];
        }
        const local = d - prevCum;
        const frac = segLens[seg] > 0 ? local / segLens[seg] : 0;
        // Corner centres
        const tlx = x + cornerR, tly = y + cornerR;
        const trx = x + width - cornerR, try_ = y + cornerR;
        const brx = x + width - cornerR, bry = y + height - cornerR;
        const blx = x + cornerR, bly = y + height - cornerR;

        switch (seg) {
          case 0: { // top-left arc (from 180° → 270° i.e. left→top)
            const a = Math.PI + frac * (Math.PI / 2);
            return { px: tlx + cornerR * Math.cos(a), py: tly + cornerR * Math.sin(a), nx: Math.cos(a), ny: Math.sin(a) };
          }
          case 1: // top edge (left → right)
            return { px: tlx + frac * topLen, py: y, nx: 0, ny: -1 };
          case 2: { // top-right arc (270° → 360°)
            const a = -Math.PI / 2 + frac * (Math.PI / 2);
            return { px: trx + cornerR * Math.cos(a), py: try_ + cornerR * Math.sin(a), nx: Math.cos(a), ny: Math.sin(a) };
          }
          case 3: // right edge (top → bottom)
            return { px: x + width, py: try_ + frac * rightLen, nx: 1, ny: 0 };
          case 4: { // bottom-right arc (0° → 90°)
            const a = frac * (Math.PI / 2);
            return { px: brx + cornerR * Math.cos(a), py: bry + cornerR * Math.sin(a), nx: Math.cos(a), ny: Math.sin(a) };
          }
          case 5: // bottom edge (right → left)
            return { px: brx - frac * bottomLen, py: y + height, nx: 0, ny: 1 };
          case 6: { // bottom-left arc (90° → 180°)
            const a = Math.PI / 2 + frac * (Math.PI / 2);
            return { px: blx + cornerR * Math.cos(a), py: bly + cornerR * Math.sin(a), nx: Math.cos(a), ny: Math.sin(a) };
          }
          default: // left edge (bottom → top)
            return { px: x, py: bly - frac * leftLen, nx: -1, ny: 0 };
        }
      }

      const step = 1 / numBumps;
      // Phase: start at top-center of the perimeter
      const topCenterT = (arcLen + topLen / 2) / perim;
      const startT = topCenterT - step / 2;

      builder.begin();
      const p0 = ptOnRect(startT);
      builder.moveTo(p0.px - p0.nx * depth, p0.py - p0.ny * depth);

      for (let i = 0; i < numBumps; i++) {
        const t1 = startT + i * step;
        const t2 = startT + (i + 1) * step;
        // Control points overshoot outward to create the bump peak
        const cp1t = t1 + step * 0.33;
        const cp2t = t1 + step * 0.67;
        const cp1 = ptOnRect(cp1t);
        const cp2 = ptOnRect(cp2t);
        const end = ptOnRect(t2);
        // Valley points sit inward; control points sit on/beyond the base path
        builder.curveTo(
          cp1.px + cp1.nx * depth * 0.4,
          cp1.py + cp1.ny * depth * 0.4,
          cp2.px + cp2.nx * depth * 0.4,
          cp2.py + cp2.ny * depth * 0.4,
          end.px - end.nx * depth,
          end.py - end.ny * depth,
        );
      }
      builder.close();
      builder.fillAndStroke();
    }

    builder.restore();
  }
}
