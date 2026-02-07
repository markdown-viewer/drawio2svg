// @ts-nocheck
import type { RenderContext, ShapeAttrs } from '../../../renderer.ts';
import { BaseShapeHandler } from '../../shape-registry.ts';

const EMOJI_COMPONENTS: Record<string, string> = {
  medium_light_skin_tone: '🏼',
  light_skin_tone: '🏻',
  medium_skin_tone: '🏽',
  medium_dark_skin_tone: '🏾',
  dark_skin_tone: '🏿',
  red_hair: '‍🦰',
  curly_hair: '‍🦱',
  white_hair: '‍🦳',
  bald: '‍🦲',
};

const EMOJIS: Record<string, string> = {};

export class EmojiHandler extends BaseShapeHandler {
  constructor(renderCtx: RenderContext) {
    super(renderCtx);
  }

  render(attrs: ShapeAttrs): void {
    const { builder, currentGroup, applyShapeAttrsToBuilder, x, y, width, height, style } =
      this.renderCtx;
    if (!builder || !currentGroup) return;
    if (width <= 0 || height <= 0) return;

    builder.setCanvasRoot(currentGroup);
    builder.save();
    applyShapeAttrsToBuilder(builder, attrs);

    let f;
    let g;
    f = this.getStyleValue(style, 'emoji', '');
    f = this.render_getUnicodeText(f) || '';
    builder.rect(x, y, width, height);
    builder.fillAndStroke();
    g = this.getStyleNumber(style, 'fontSize', 12);
    builder.setFontSize(Math.min(width, height));
    builder.text(x, y - 0.12 * height, width, height, f);
    builder.setFontSize(g);
    builder.restore();
  }

  private render_getUnicodeText(p1: any): any {
    let d;
    d = '';
    if ('' != p1 && ((d = EMOJIS[p1]), null == d)) {
      for (const e of Object.keys(EMOJI_COMPONENTS)) {
        if (p1.length > e.length && p1.indexOf(e) == p1.length - e.length) {
          p1 = p1.substring(0, p1.length - e.length - 1);
          d = this.render_getUnicodeText(p1);
          null != d &&
            (d =
              0 < e.indexOf('tone') && 2 < d.length
                ? d.substring(0, 2) + EMOJI_COMPONENTS[e] + d.substring(2)
                : d + EMOJI_COMPONENTS[e]);
          break;
        }
      }
    }
    return d;
  }
}
