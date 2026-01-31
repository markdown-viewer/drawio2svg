// @ts-nocheck
import type { RenderContext, ShapeAttrs } from '../../../renderer.ts';
import { BaseShapeHandler } from '../../shape-registry.ts';

export class Aws3dElasticLoadBalancingHandler extends BaseShapeHandler {
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
    let d = x;
    let e = y;

    let f;
    let g;
    let h;
    builder.translate(d, e);
    f = parseFloat(this.getStyleValue(style, 'strokeWidth', '1'));
    g = (f * width) / 92;
    f = (f * height) / 88.17;
    d = this.getStyleValue(style, 'strokeColor', '#000000');
    h = parseFloat(this.getStyleValue(style, 'shadow', '0'));
    e = this.getStyleValue(style, 'strokeColor2', '#292929');
    f = Math.min(g, f);
    builder.setShadow(!1);
    builder.setStrokeWidth(f);
    builder.save();
    builder.save();
    builder.save();
    builder.save();
    builder.setStrokeWidth(2 * f);
    builder.setStrokeColor(e as string);
    builder.setLineJoin('round');
    if (1 == h) {
      builder.setShadow(!0);
    }
    builder.begin();
    builder.moveTo(0, 0.7996 * height);
    builder.lineTo(0, 0.1985 * height);
    builder.lineTo(0.3315 * width, 0);
    builder.lineTo(0.6685 * width, 0);
    builder.lineTo(width, 0.1985 * height);
    builder.lineTo(width, 0.7996 * height);
    builder.lineTo(0.6685 * width, height);
    builder.lineTo(0.3315 * width, height);
    builder.close();
    builder.fillAndStroke();
    builder.restore();
    builder.setFillColor('#000000' as string);
    g = this.getStyleValue(style, 'shadingCols', '0.1,0.3').toString().split(',');
    h = this.getStyleValue(style, 'flipH', '0');
    if ('0' == h) {
      builder.setAlpha(g[0]);
    } else {
      builder.setAlpha(g[1]);
    }
    builder.begin();
    builder.moveTo(0, 0.4026 * height);
    builder.lineTo(0.3315 * width, 0.6011 * height);
    builder.lineTo(0.6685 * width, 0.6011 * height);
    builder.lineTo(0.6685 * width, height);
    builder.lineTo(0.3315 * width, height);
    builder.lineTo(0, 0.7996 * height);
    builder.close();
    builder.fill();
    if ('0' == h) {
      builder.setAlpha(g[1]);
    } else {
      builder.setAlpha(g[0]);
    }
    builder.begin();
    builder.moveTo(0.6685 * width, 0.6011 * height);
    builder.lineTo(width, 0.4026 * height);
    builder.lineTo(width, 0.7996 * height);
    builder.lineTo(0.6685 * width, height);
    builder.close();
    builder.fill();
    builder.restore();
    builder.setLineJoin('round');
    builder.begin();
    builder.moveTo(0, 0.4026 * height);
    builder.lineTo(0.3315 * width, 0.6011 * height);
    builder.lineTo(0.6685 * width, 0.6011 * height);
    builder.lineTo(0.6685 * width, height);
    builder.lineTo(0.3315 * width, height);
    builder.lineTo(0, 0.7996 * height);
    builder.close();
    builder.stroke();
    builder.begin();
    builder.moveTo(0.6685 * width, 0.6011 * height);
    builder.lineTo(width, 0.4026 * height);
    builder.lineTo(width, 0.7996 * height);
    builder.lineTo(0.6685 * width, height);
    builder.close();
    builder.moveTo(0.3315 * width, 0.6011 * height);
    builder.lineTo(0.3315 * width, height);
    builder.stroke();
    builder.restore();
    builder.setFillColor(d as string);
    builder.begin();
    builder.moveTo(0.337 * width, 0.1395 * height);
    builder.arcTo(0.3043 * width, 0.1928 * height, 0, 0, 1, 0.5 * width, 0.1191 * height);
    builder.arcTo(0.3043 * width, 0.1928 * height, 0, 0, 1, 0.6739 * width, 0.1645 * height);
    builder.arcTo(0.3261 * width, 0.2155 * height, 0, 0, 1, 0.8152 * width, 0.3176 * height);
    builder.arcTo(0.3261 * width, 0.1701 * height, 0, 0, 1, 0.75 * width, 0.4367 * height);
    builder.arcTo(0.3261 * width, 0.3403 * height, 0, 0, 1, 0.6033 * width, 0.4854 * height);
    builder.arcTo(0.3261 * width, 0.2268 * height, 0, 0, 1, 0.4348 * width, 0.4741 * height);
    builder.arcTo(0.3261 * width, 0.2268 * height, 0, 0, 1, 0.2848 * width, 0.4094 * height);
    builder.arcTo(0.3261 * width, 0.2268 * height, 0, 0, 1, 0.2065 * width, 0.3062 * height);
    builder.arcTo(0.3261 * width, 0.1701 * height, 0, 0, 1, 0.2446 * width, 0.1928 * height);
    builder.arcTo(0.2717 * width, 0.1701 * height, 0, 0, 1, 0.337 * width, 0.1395 * height);
    builder.fill();
    builder.restore();
    builder.begin();
    builder.moveTo(0.2826 * width, 0.372 * height);
    builder.lineTo(0.362 * width, 0.3232 * height);
    builder.lineTo(0.4054 * width, 0.3482 * height);
    builder.lineTo(0.4457 * width, 0.2654 * height);
    builder.lineTo(0.4185 * width, 0.2643 * height);
    builder.lineTo(0.4728 * width, 0.2132 * height);
    builder.lineTo(0.4348 * width, 0.1928 * height);
    builder.lineTo(0.5141 * width, 0.144 * height);
    builder.lineTo(0.5837 * width, 0.1883 * height);
    builder.lineTo(0.5043 * width, 0.2348 * height);
    builder.lineTo(0.4848 * width, 0.2223 * height);
    builder.lineTo(0.4967 * width, 0.2688 * height);
    builder.lineTo(0.463 * width, 0.2665 * height);
    builder.lineTo(0.4304 * width, 0.3346 * height);
    builder.lineTo(0.4946 * width, 0.2949 * height);
    builder.lineTo(0.4761 * width, 0.2858 * height);
    builder.lineTo(0.5511 * width, 0.2631 * height);
    builder.lineTo(0.5261 * width, 0.2472 * height);
    builder.lineTo(0.6043 * width, 0.1996 * height);
    builder.lineTo(0.6761 * width, 0.2404 * height);
    builder.lineTo(0.5978 * width, 0.2892 * height);
    builder.lineTo(0.5652 * width, 0.2699 * height);
    builder.lineTo(0.5293 * width, 0.3198 * height);
    builder.lineTo(0.5087 * width, 0.3051 * height);
    builder.lineTo(0.4543 * width, 0.3391 * height);
    builder.lineTo(0.563 * width, 0.3221 * height);
    builder.lineTo(0.5598 * width, 0.3017 * height);
    builder.lineTo(0.6326 * width, 0.3096 * height);
    builder.lineTo(0.6163 * width, 0.2994 * height);
    builder.lineTo(0.6957 * width, 0.2529 * height);
    builder.lineTo(0.7674 * width, 0.2938 * height);
    builder.lineTo(0.687 * width, 0.3425 * height);
    builder.lineTo(0.6489 * width, 0.321 * height);
    builder.lineTo(0.5707 * width, 0.3539 * height);
    builder.lineTo(0.5674 * width, 0.3369 * height);
    builder.lineTo(0.4293 * width, 0.3618 * height);
    builder.lineTo(0.4641 * width, 0.3834 * height);
    builder.lineTo(0.3859 * width, 0.4299 * height);
    builder.close();
    builder.fill();
    builder.setStrokeWidth(2 * f);
    builder.setStrokeColor(e as string);
    builder.setLineJoin('round');
    builder.begin();
    builder.moveTo(0, 0.7996 * height);
    builder.lineTo(0, 0.1985 * height);
    builder.lineTo(0.3315 * width, 0);
    builder.lineTo(0.6685 * width, 0);
    builder.lineTo(width, 0.1985 * height);
    builder.lineTo(width, 0.7996 * height);
    builder.lineTo(0.6685 * width, height);
    builder.lineTo(0.3315 * width, height);
    builder.close();
    builder.stroke();
    builder.restore();
  }
}
