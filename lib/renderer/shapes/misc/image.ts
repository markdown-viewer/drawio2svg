import type { RenderContext, ShapeAttrs } from '../../../renderer.ts';
import { normalizeColor } from '../../color.ts';
import { ImageShapeHandler } from '../../shape-registry.ts';

export class ImageHandler extends ImageShapeHandler {
  constructor(renderCtx: RenderContext) {
    super(renderCtx);
  }

  render(attrs: ShapeAttrs): void {
    const {
      builder,
      currentGroup,
      normalizeImageUrl,
      isPlaceholderImageUrl,
      createPlaceholderInlineSvg,
      applyShapeAttrsToBuilder,
      x,
      y,
      width,
      height,
      style,
    } = this.renderCtx;
    if (!builder || !currentGroup) return;

    const imageUrl = style.image as string;
    const isPlaceholder = !imageUrl || (isPlaceholderImageUrl?.(imageUrl) ?? false);
    if (isPlaceholder) {
      const inlineSvg = createPlaceholderInlineSvg?.(x, y, width, height);
      if (inlineSvg) {
        currentGroup.appendChild(inlineSvg);
      }
      return;
    }

    const normalizedUrl = normalizeImageUrl(imageUrl);
    builder.setCanvasRoot(currentGroup);
    builder.save();
    applyShapeAttrsToBuilder(builder, attrs);
    builder.image(x, y, width, height, normalizedUrl, false);
    builder.restore();

    const rawBorder = style.imageBorder as string | number | boolean | undefined;
    const borderEnabled = rawBorder !== undefined && rawBorder !== null
      && rawBorder !== ''
      && rawBorder !== 'none'
      && rawBorder !== '0'
      && rawBorder !== 0
      && rawBorder !== false;
    if (borderEnabled) {
      const borderValue = rawBorder === 'default' ? '#000000' : String(rawBorder);
      const borderColor = normalizeColor(borderValue);
      const borderAttrs: ShapeAttrs = {
        ...attrs,
        fillColor: 'none',
        strokeColor: borderColor,
      };
      builder.setCanvasRoot(currentGroup);
      builder.save();
      applyShapeAttrsToBuilder(builder, borderAttrs);
      builder.rect(x, y, width, height);
      builder.stroke();
      builder.restore();

      const borderEl = currentGroup.lastChild as Element | null;
      if (borderEl) {
        borderEl.setAttribute('pointer-events', 'all');
      }
    }
  }
}
