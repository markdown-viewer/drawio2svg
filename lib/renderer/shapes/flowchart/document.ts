import type { RenderContext, ShapeAttrs } from '../../../renderer.ts';
import type { MxStyle } from '../../../parser.ts';
import { ActorShapeHandler, type LabelOverrides } from '../../shape-registry.ts';

export class DocumentHandler extends ActorShapeHandler {
  constructor(renderCtx: RenderContext) {
    super(renderCtx);
  }

  getLabelOverrides(): LabelOverrides | null {
    return {
      getLabelBounds: (style: MxStyle, x: number, y: number, width: number, height: number) => {
        // Document: text is above the wave at bottom (wave is about 30% of height)
        const size = Math.max(0, Math.min(1, parseFloat(style.size as string) || 0.3));
        const waveHeight = height * size;
        return {
          x,
          y,
          width,
          height: height - waveHeight
        };
      }
    };
  }

  render(attrs: ShapeAttrs): void {
    const { builder, currentGroup, style, x, y, width, height, applyShapeAttrsToBuilder } = this.renderCtx;
    if (!builder || !currentGroup) return;

    const size = Math.max(0, Math.min(1, parseFloat(style.size as string) || 0.3));
    const dy = height * size;
    const fy = 1.4;

    builder.setCanvasRoot(currentGroup);
    builder.save();
    applyShapeAttrsToBuilder(builder, attrs);
    builder.begin();
    builder.addPoints(
      [
        { x, y },
        { x: x + width, y },
        { x: x + width, y: y + height - dy / 2 }
      ],
      false,
      0,
      false
    );
    builder.quadTo(x + (width * 3) / 4, y + height - dy * fy, x + width / 2, y + height - dy / 2);
    builder.quadTo(x + width / 4, y + height - dy * (1 - fy), x, y + height - dy / 2);
    builder.lineTo(x, y + dy / 2);
    builder.close();
    builder.fillAndStroke();
    builder.restore();
  }
}
