import type { RenderContext, ShapeAttrs } from '../../../renderer.ts';
import { RectangleShapeHandler } from '../../shape-registry.ts';
import type { LabelOverrides } from '../../shape-registry.ts';

export class FolderHandler extends RectangleShapeHandler {
  constructor(renderCtx: RenderContext) {
    super(renderCtx);
  }

  getLabelOverrides(): LabelOverrides | null {
    return {
      getLabelBounds: (style, x, y, width, height) => {
        const dx = Math.max(0, Math.min(width, parseFloat(style.tabWidth as string) || 60));
        const dy = Math.max(0, Math.min(height, parseFloat(style.tabHeight as string) || 20));
        const tp = (style.tabPosition as string) || 'right';
        const absArcSize = style.absoluteArcSize === '1' || style.absoluteArcSize === true;
        let arcSize = parseFloat(style.arcSize as string);
        if (!Number.isFinite(arcSize)) {
          arcSize = 0.1;
        }

        if (!absArcSize) {
          arcSize = Math.min(width, height) * arcSize;
        }

        arcSize = Math.min(arcSize, width * 0.5, (height - dy) * 0.5);
        let tabWidth = Math.max(dx, arcSize);
        tabWidth = Math.min(width - arcSize, tabWidth);
        const tabX = tp === 'left' ? x : x + width - tabWidth;

        const labelInHeader = style.labelInHeader === '1' || style.labelInHeader === true;
        if (!labelInHeader) {
          return {
            x,
            y: y + dy,
            width,
            height: Math.max(0, height - dy)
          };
        }

        return {
          x: tabX,
          y,
          width: tabWidth,
          height: dy
        };
      }
    };
  }

  render(attrs: ShapeAttrs): void {
    const { builder, currentGroup, style, x, y, width, height, applyShapeAttrsToBuilder } = this.renderCtx;
    if (!builder || !currentGroup) return;

    const dx = Math.max(0, Math.min(width, parseFloat(style.tabWidth as string) || 60));
    const dy = Math.max(0, Math.min(height, parseFloat(style.tabHeight as string) || 20));
    const tp = (style.tabPosition as string) || 'right';
    const absArcSize = style.absoluteArcSize === '1' || style.absoluteArcSize === true;
    let arcSize = parseFloat(style.arcSize as string);
    if (!Number.isFinite(arcSize)) {
      arcSize = 0.1;
    }

    if (!absArcSize) {
      arcSize = Math.min(width, height) * arcSize;
    }

    arcSize = Math.min(arcSize, width * 0.5, (height - dy) * 0.5);
    let tabWidth = Math.max(dx, arcSize);
    tabWidth = Math.min(width - arcSize, tabWidth);

    if (!attrs.rounded) {
      arcSize = 0;
    }

    builder.setCanvasRoot(currentGroup);
    builder.save();
    applyShapeAttrsToBuilder(builder, attrs);
    builder.begin();

    if (tp === 'left') {
      builder.addPoints(
        [
          { x: x + Math.max(arcSize, 0), y: y + dy },
          { x: x + Math.max(arcSize, 0), y },
          { x: x + tabWidth, y },
          { x: x + tabWidth, y: y + dy }
        ],
        false,
        0,
        false
      );
    } else {
      builder.addPoints(
        [
          { x: x + width - tabWidth, y: y + dy },
          { x: x + width - tabWidth, y },
          { x: x + width - Math.max(arcSize, 0), y },
          { x: x + width - Math.max(arcSize, 0), y: y + dy }
        ],
        false,
        0,
        false
      );
    }

    if (arcSize > 0) {
      builder.moveTo(x, y + arcSize + dy);
      builder.arcTo(arcSize, arcSize, 0, 0, 1, x + arcSize, y + dy);
      builder.lineTo(x + width - arcSize, y + dy);
      builder.arcTo(arcSize, arcSize, 0, 0, 1, x + width, y + arcSize + dy);
      builder.lineTo(x + width, y + height - arcSize);
      builder.arcTo(arcSize, arcSize, 0, 0, 1, x + width - arcSize, y + height);
      builder.lineTo(x + arcSize, y + height);
      builder.arcTo(arcSize, arcSize, 0, 0, 1, x, y + height - arcSize);
    } else {
      builder.addPoints(
        [
          { x, y: y + dy },
          { x: x + width, y: y + dy },
          { x: x + width, y: y + height },
          { x, y: y + height }
        ],
        false,
        0,
        false
      );
    }

    builder.close();
    builder.fillAndStroke();

    builder.setShadow(false);
    if ((style.folderSymbol as string) === 'triangle') {
      builder.setFillColor(null);
      builder.begin();
      builder.addPoints(
        [
          { x: x + width - 30, y: y + dy + 20 },
          { x: x + width - 20, y: y + dy + 10 },
          { x: x + width - 10, y: y + dy + 20 }
        ],
        false,
        0,
        true
      );
      builder.stroke();
    }

    builder.restore();
  }
}
