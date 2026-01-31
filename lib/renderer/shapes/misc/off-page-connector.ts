import type { RenderContext, ShapeAttrs } from '../../../renderer.ts';
import { ActorShapeHandler, type LabelOverrides, type PaddingTopContext } from '../../shape-registry.ts';

export class OffPageConnectorHandler extends ActorShapeHandler {
  constructor(renderCtx: RenderContext) {
    super(renderCtx);
  }

  getLabelOverrides(): LabelOverrides | null {
    return {
      getPaddingTop: (ctx: PaddingTopContext): number | undefined => {
        if (ctx.valign === 'top') {
          return Math.round(ctx.labelY + ctx.fontSize / 2) - 1;
        } else if (ctx.valign === 'bottom') {
          return Math.round(ctx.labelY + ctx.labelH - ctx.fontSize / 2);
        }
        return undefined;
      }
    };
  }

  render(attrs: ShapeAttrs): void {
    const { builder, currentGroup, style, x, y, width, height, applyShapeAttrsToBuilder } = this.renderCtx;
    if (!builder || !currentGroup) return;

    const size = parseFloat(style.size as string);
    const notchRatio = Number.isFinite(size) ? size : 0.375;
    const notch = height * notchRatio;
    const arcSize = (parseFloat(style.arcSize as string) || 10) / 2;

    builder.setCanvasRoot(currentGroup);
    builder.save();
    applyShapeAttrsToBuilder(builder, attrs);
    builder.setMiterLimit(10);
    builder.begin();
    builder.addPoints(
      [
        { x, y },
        { x: x + width, y },
        { x: x + width, y: y + height - notch },
        { x: x + width / 2, y: y + height },
        { x, y: y + height - notch }
      ],
      attrs.rounded,
      arcSize,
      true
    );
    builder.fillAndStroke();
    builder.restore();
  }
}
