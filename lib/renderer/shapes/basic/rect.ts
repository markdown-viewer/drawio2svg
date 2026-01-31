import type { RenderContext, ShapeAttrs } from '../../../renderer.ts';
import { RectangleShapeHandler } from '../../shape-registry.ts';
import { RectangleHandler } from '../core/rectangle.ts';

export class BasicRectHandler extends RectangleShapeHandler {
  constructor(renderCtx: RenderContext) {
    super(renderCtx);
  }

  render(attrs: ShapeAttrs): void {
    const { builder, currentGroup, style, x, y, width, height, applyShapeAttrsToElement } = this.renderCtx;
    if (!builder || !currentGroup) return;

    const rectStyle = String(style.rectStyle ?? '').toLowerCase();
    if (rectStyle !== 'rounded') {
      new RectangleHandler(this.renderCtx).render(attrs);
      return;
    }

    const sizeValue = parseFloat(style.size as string);
    const size = Number.isFinite(sizeValue) ? sizeValue : 10;
    const radius = Math.max(0, Math.min(size, Math.min(width, height) / 2));
    if (radius <= 0) {
      new RectangleHandler(this.renderCtx).render(attrs);
      return;
    }

    const topLeftSquare = String(style.topLeftStyle ?? '').toLowerCase() === 'square';
    const topRightSquare = String(style.topRightStyle ?? '').toLowerCase() === 'square';
    const bottomRightSquare = String(style.bottomRightStyle ?? '').toLowerCase() === 'square';
    const bottomLeftSquare = String(style.bottomLeftStyle ?? '').toLowerCase() === 'square';

    const rTL = topLeftSquare ? 0 : radius;
    const rTR = topRightSquare ? 0 : radius;
    const rBR = bottomRightSquare ? 0 : radius;
    const rBL = bottomLeftSquare ? 0 : radius;

    const round2 = (value: number): number => Number(value.toFixed(2));
    const k = 0.5522847498;

    const x0 = round2(x);
    const y0 = round2(y);
    const x1 = round2(x + width);
    const y1 = round2(y + height);

    const cTL = round2(rTL * k);
    const cTR = round2(rTR * k);
    const cBR = round2(rBR * k);
    const cBL = round2(rBL * k);

    const parts: string[] = [];

    parts.push(`M ${x0} ${round2(y0 + rTL)}`);
    if (rTL > 0) {
      parts.push(
        `C ${x0} ${round2(y0 + rTL - cTL)} ${round2(x0 + rTL - cTL)} ${y0} ${round2(x0 + rTL)} ${y0}`
      );
    } else {
      parts.push(`L ${x0} ${y0}`);
    }

    parts.push(`L ${round2(x1 - rTR)} ${y0}`);
    if (rTR > 0) {
      parts.push(
        `C ${round2(x1 - rTR + cTR)} ${y0} ${x1} ${round2(y0 + rTR - cTR)} ${x1} ${round2(y0 + rTR)}`
      );
    } else {
      parts.push(`L ${x1} ${y0}`);
    }

    parts.push(`L ${x1} ${round2(y1 - rBR)}`);
    if (rBR > 0) {
      parts.push(
        `C ${x1} ${round2(y1 - rBR + cBR)} ${round2(x1 - rBR + cBR)} ${y1} ${round2(x1 - rBR)} ${y1}`
      );
    } else {
      parts.push(`L ${x1} ${y1}`);
    }

    parts.push(`L ${round2(x0 + rBL)} ${y1}`);
    if (rBL > 0) {
      parts.push(
        `C ${round2(x0 + rBL - cBL)} ${y1} ${x0} ${round2(y1 - rBL + cBL)} ${x0} ${round2(y1 - rBL)}`
      );
    } else {
      parts.push(`L ${x0} ${y1}`);
    }

    parts.push('Z');
    const d = parts.join(' ');

    const fillPath = builder.createPath(d);
    applyShapeAttrsToElement(fillPath, attrs);
    fillPath.setAttribute('stroke', 'none');
    currentGroup.appendChild(fillPath);

    const transparentPath = builder.createPath(d);
    transparentPath.setAttribute('fill', 'transparent');
    transparentPath.setAttribute('stroke', 'none');
    currentGroup.appendChild(transparentPath);

    const strokePath = builder.createPath(d);
    applyShapeAttrsToElement(strokePath, attrs);
    strokePath.setAttribute('fill', 'none');
    currentGroup.appendChild(strokePath);
  }
}
