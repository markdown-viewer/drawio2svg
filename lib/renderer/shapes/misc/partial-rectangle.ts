import type { RenderContext, ShapeAttrs } from '../../../renderer.ts';
import { normalizeColor } from '../../color.ts';
import { RectangleShapeHandler } from '../../shape-registry.ts';

export class PartialRectangleHandler extends RectangleShapeHandler {
  constructor(renderCtx: RenderContext) {
    super(renderCtx);
  }

  render(attrs: ShapeAttrs): void {
    const {
      builder,
      currentGroup,
      style,
      cell,
      cellMap,
      x,
      y,
      width,
      height,
      applyShapeAttrsToBuilder
    } = this.renderCtx;
    if (!builder || !currentGroup) return;

    const showTop = style.top !== 0 && style.top !== '0' && style.top !== false;
    const showLeft = style.left !== 0 && style.left !== '0' && style.left !== false;
    const showRight = style.right !== 0 && style.right !== '0' && style.right !== false;
    const showBottom = style.bottom !== 0 && style.bottom !== '0' && style.bottom !== false;
    const outline = style.outline === '1' || style.outline === true;

    const pointerEventsDisabled = style.pointerEvents === '0' || style.pointerEvents === 0 || style.pointerEvents === false;

    const containerGroup = builder.createGroup();
    currentGroup.appendChild(containerGroup);

    const filled = attrs.fillColor !== 'none';
    const drawHidden = true;

    if (filled || !pointerEventsDisabled) {
      builder.setCanvasRoot(containerGroup);
      builder.save();
      builder.setFillColor(filled ? attrs.fillColor : 'none');
      builder.setStrokeColor(null);
      builder.rect(x, y, width, height);
      builder.fill();
      builder.restore();

      const rectFillEl = containerGroup.lastChild as Element | null;
      if (rectFillEl && !pointerEventsDisabled) {
        rectFillEl.setAttribute('pointer-events', 'all');
      }
    }

    if (drawHidden || filled || showTop || showRight || showBottom || showLeft || outline) {
      let effectiveStrokeColor = attrs.strokeColor;
      if (style.strokeColor === 'inherit') {
        let parentId = cell.parent;
        while (parentId) {
          const parentCell = cellMap.get(parentId);
          const parentStrokeRaw = parentCell?.style?.strokeColor as string | undefined;
          if (parentStrokeRaw && parentStrokeRaw !== 'inherit' && parentStrokeRaw !== 'default') {
            effectiveStrokeColor = normalizeColor(parentStrokeRaw);
            break;
          }
          parentId = parentCell?.parent;
        }
      }
      const borderAttrs = effectiveStrokeColor === attrs.strokeColor
        ? attrs
        : { ...attrs, strokeColor: effectiveStrokeColor };

      builder.setCanvasRoot(containerGroup);
      builder.save();
      applyShapeAttrsToBuilder(builder, borderAttrs);
      builder.setFillColor(null);
      builder.setLineCap('square');
      builder.begin();
      builder.moveTo(x, y);
      if (outline || showTop) {
        builder.lineTo(x + width, y);
      } else {
        builder.moveTo(x + width, y);
      }
      if (outline || showRight) {
        builder.lineTo(x + width, y + height);
      } else {
        builder.moveTo(x + width, y + height);
      }
      if (outline || showBottom) {
        builder.lineTo(x, y + height);
      } else {
        builder.moveTo(x, y + height);
      }
      if (outline || showLeft) {
        builder.lineTo(x, y);
      }
      builder.stroke();
      builder.restore();

      const borderPath = containerGroup.lastChild as Element | null;
      if (borderPath) {
        borderPath.setAttribute('pointer-events', pointerEventsDisabled ? 'none' : 'all');
      }
    }
  }
}
