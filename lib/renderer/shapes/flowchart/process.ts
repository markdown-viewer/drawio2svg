import type { RenderContext, ShapeAttrs } from '../../../renderer.ts';
import type { MxStyle } from '../../../parser.ts';
import { RectangleShapeHandler, type LabelOverrides } from '../../shape-registry.ts';

export class ProcessHandler extends RectangleShapeHandler {
  constructor(renderCtx: RenderContext) {
    super(renderCtx);
  }

  getLabelOverrides(): LabelOverrides | null {
    return {
      getInset: (style: MxStyle, width: number, height: number) => {
        const fixedSize = (style.fixedSize as string) === '1';
        const sizeParam = parseFloat(style.size as string) || 0.1;

        let inset: number;
        if (fixedSize) {
          inset = Math.max(0, Math.min(width, sizeParam));
        } else {
          inset = width * Math.max(0, Math.min(1, sizeParam));
        }

        const rounded = style.rounded === '1' || style.rounded === true;
        if (rounded) {
          const arcSize = parseFloat(style.arcSize as string) || 10;
          const f = arcSize / 100;
          inset = Math.max(inset, Math.min(width * f, height * f));
        }

        inset = Math.round(inset);
        return { left: inset, right: inset };
      }
    };
  }

  render(attrs: ShapeAttrs): void {
    const { builder, currentGroup, style, x, y, width, height, applyShapeAttrsToBuilder } = this.renderCtx;
    if (!builder || !currentGroup) return;

    const { strokeWidth, strokeColor, rounded } = attrs;

    const fixedSize = (style.fixedSize as string) === '1';
    const sizeParam = parseFloat(style.size as string) || 0.1;

    let inset: number;
    if (fixedSize) {
      inset = Math.max(0, Math.min(width, sizeParam));
    } else {
      inset = width * Math.max(0, Math.min(1, sizeParam));
    }

    if (rounded) {
      const arcSize = parseFloat(style.arcSize as string) || 10;
      const f = arcSize / 100;
      inset = Math.max(inset, Math.min(width * f, height * f));
    }

    inset = Math.round(inset);

    builder.setCanvasRoot(currentGroup);
    builder.save();
    applyShapeAttrsToBuilder(builder, attrs);
    if (rounded) {
      const arcSize = (parseFloat(style.arcSize as string) || 15) / 100;
      const r = Math.min(width * arcSize, height * arcSize);
      builder.roundrect(x, y, width, height, r, r);
    } else {
      builder.rect(x, y, width, height);
    }
    builder.fillAndStroke();

    if (strokeColor !== 'none' && strokeWidth > 0) {
      builder.setFillColor(null);
      builder.setFillAlpha(1);
      builder.begin();
      builder.addPoints(
        [
          { x: x + inset, y },
          { x: x + inset, y: y + height }
        ],
        false,
        0,
        false
      );
      builder.addPoints(
        [
          { x: x + width - inset, y },
          { x: x + width - inset, y: y + height }
        ],
        false,
        0,
        false
      );
      builder.stroke();
    }

    builder.restore();
  }
}
