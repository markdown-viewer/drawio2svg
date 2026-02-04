// @ts-nocheck
import type { RenderContext, ShapeAttrs } from '../../../renderer.ts';
import { BaseShapeHandler } from '../../shape-registry.ts';

export class MockupContainersUserMaleHandler extends BaseShapeHandler {
  constructor(renderCtx: RenderContext) {
    super(renderCtx);
  }

  render(attrs: ShapeAttrs): void {
    const {
      builder,
      currentGroup,
      applyShapeAttrsToBuilder,
      x,
      y,
      width,
      height,
      style,
      getStencilShape,
      renderStencilShape,
    } = this.renderCtx;
    if (!builder || !currentGroup) return;
    if (width <= 0 || height <= 0) return;

    builder.setCanvasRoot(currentGroup);
    builder.save();
    applyShapeAttrsToBuilder(builder, attrs);

    const f = this.getStyleValue(style, 'fillColor', '#ffffff');
    const g = this.getStyleValue(style, 'strokeColor', '#666666');
    const h = this.getStyleValue(style, 'strokeColor2', '#008cff');

    builder.translate(x, y);
    this.renderBackground(
      builder,
      x,
      y,
      width,
      height,
      style,
      getStencilShape,
      renderStencilShape,
      f,
      g
    );
    builder.setShadow(!1);
    this.render_otherShapes(builder, x, y, width, height, h, g);
    builder.restore();
  }

  private renderBackground(
    builder: RenderContext['builder'],
    x: number,
    y: number,
    width: number,
    height: number,
    style: RenderContext['style'],
    getStencilShape?: RenderContext['getStencilShape'],
    renderStencilShape?: RenderContext['renderStencilShape'],
    extra1?: any,
    extra2?: any
  ): void {
    if (!builder) return;
    builder.setFillColor(extra1 as string);
    builder.setStrokeColor(extra2 as string);
    builder.begin();
    builder.moveTo(0, 0);
    builder.lineTo(width, 0);
    builder.lineTo(width, height);
    builder.lineTo(0, height);
    builder.close();
    builder.fillAndStroke();
  }

  private render_otherShapes(
    builder: RenderContext['builder'],
    p1: any,
    p2: any,
    p3: any,
    p4: any,
    p5: any,
    p6: any
  ): void {
    if (!builder) return;
    builder.setStrokeColor(p5 as string);
    builder.setLineCap('round');
    builder.setLineJoin('round');
    builder.begin();
    builder.moveTo(0.5 * p3, 0.6721 * p4);
    builder.curveTo(0.3891 * p3, 0.6721 * p4, 0.31 * p3, 0.5648 * p4, 0.31 * p3, 0.3962 * p4);
    builder.curveTo(0.31 * p3, 0.3656 * p4, 0.3012 * p3, 0.3473 * p4, 0.3051 * p3, 0.3227 * p4);
    builder.curveTo(0.3126 * p3, 0.2762 * p4, 0.3124 * p3, 0.2212 * p4, 0.332 * p3, 0.1939 * p4);
    builder.curveTo(0.354 * p3, 0.1633 * p4, 0.4382 * p3, 0.12 * p4, 0.5 * p3, 0.12 * p4);
    builder.stroke();
    builder.begin();
    builder.moveTo(0.3046 * p3, 0.3716 * p4);
    builder.curveTo(0.3046 * p3, 0.3716 * p4, 0.3046 * p3, 0.341 * p4, 0.2826 * p3, 0.3594 * p4);
    builder.curveTo(0.2606 * p3, 0.3778 * p4, 0.2661 * p3, 0.4452 * p4, 0.266 * p3, 0.4452 * p4);
    builder.quadTo(0.2715 * p3, 0.4942 * p4, 0.277 * p3, 0.5065 * p4);
    builder.curveTo(0.2825 * p3, 0.5187 * p4, 0.277 * p3, 0.5187 * p4, 0.2935 * p3, 0.5371 * p4);
    builder.curveTo(0.31 * p3, 0.5554 * p4, 0.3375 * p3, 0.5615 * p4, 0.3375 * p3, 0.5616 * p4);
    builder.stroke();
    builder.begin();
    builder.moveTo(0.3829 * p3, 0.6213 * p4);
    builder.curveTo(0.3829 * p3, 0.6213 * p4, 0.405 * p3, 0.7704 * p4, 0.2921 * p3, 0.7888 * p4);
    builder.curveTo(0.2536 * p3, 0.795 * p4, 0.1328 * p3, 0.85 * p4, 0.1052 * p3, 0.8745 * p4);
    builder.curveTo(0.0776 * p3, 0.899 * p4, 0.0641 * p3, 0.9316 * p4, 0.0571 * p3, 0.9622 * p4);
    builder.quadTo(0.05 * p3, p4, 0.05 * p3, p4);
    builder.stroke();
    builder.begin();
    builder.moveTo(0.3427 * p3, 0.4185 * p4);
    builder.curveTo(0.3427 * p3, 0.4185 * p4, 0.3427 * p3, 0.3839 * p4, 0.3427 * p3, 0.3593 * p4);
    builder.curveTo(0.3427 * p3, 0.3348 * p4, 0.3663 * p3, 0.3103 * p4, 0.3718 * p3, 0.3041 * p4);
    builder.curveTo(0.3773 * p3, 0.298 * p4, 0.3822 * p3, 0.2673 * p4, 0.3877 * p3, 0.2551 * p4);
    builder.curveTo(0.3932 * p3, 0.2429 * p4, 0.4095 * p3, 0.2429 * p4, 0.4259 * p3, 0.2367 * p4);
    builder.curveTo(0.4424 * p3, 0.2306 * p4, 0.4984 * p3, 0.2357 * p4, 0.4984 * p3, 0.2357 * p4);
    builder.stroke();
    builder.begin();
    builder.moveTo(0.365 * p3, 0.7427 * p4);
    builder.curveTo(0.365 * p3, 0.7427 * p4, 0.3772 * p3, 0.8076 * p4, 0.4286 * p3, 0.8224 * p4);
    builder.curveTo(0.4816 * p3, 0.8377 * p4, 0.5028 * p3, 0.8347 * p4, 0.5028 * p3, 0.8347 * p4);
    builder.stroke();
    builder.begin();
    builder.moveTo(0.3322 * p3, 0.7764 * p4);
    builder.curveTo(0.3322 * p3, 0.7764 * p4, 0.3556 * p3, 0.8386 * p4, 0.4038 * p3, 0.8684 * p4);
    builder.curveTo(0.4533 * p3, 0.8991 * p4, 0.5029 * p3, 0.8929 * p4, 0.5029 * p3, 0.8929 * p4);
    builder.stroke();
    builder.begin();
    builder.moveTo(0.2717 * p3, 0.9 * p4);
    builder.lineTo(0.2717 * p3, p4);
    builder.stroke();
    builder.begin();
    builder.moveTo(0.1671 * p3, 0.8991 * p4);
    builder.curveTo(0.1671 * p3, 0.8991 * p4, 0.1726 * p3, 0.9114 * p4, 0.1836 * p3, 0.9481 * p4);
    builder.curveTo(0.1946 * p3, 0.9849 * p4, 0.2 * p3, p4, 0.2 * p3, p4);
    builder.stroke();
    builder.begin();
    builder.moveTo(0.5 * p3, 0.6721 * p4);
    builder.curveTo(0.6109 * p3, 0.6721 * p4, 0.69 * p3, 0.5648 * p4, 0.69 * p3, 0.3962 * p4);
    builder.curveTo(0.69 * p3, 0.3656 * p4, 0.6988 * p3, 0.3473 * p4, 0.6949 * p3, 0.3227 * p4);
    builder.curveTo(0.6847 * p3, 0.2762 * p4, 0.6876 * p3, 0.2212 * p4, 0.668 * p3, 0.1939 * p4);
    builder.curveTo(0.646 * p3, 0.1633 * p4, 0.5618 * p3, 0.12 * p4, 0.5 * p3, 0.12 * p4);
    builder.stroke();
    builder.begin();
    builder.moveTo(0.6954 * p3, 0.3716 * p4);
    builder.curveTo(0.6954 * p3, 0.3716 * p4, 0.6954 * p3, 0.341 * p4, 0.7174 * p3, 0.3594 * p4);
    builder.curveTo(0.7394 * p3, 0.3778 * p4, 0.7339 * p3, 0.4452 * p4, 0.734 * p3, 0.4452 * p4);
    builder.quadTo(0.7285 * p3, 0.4942 * p4, 0.723 * p3, 0.5065 * p4);
    builder.curveTo(0.7175 * p3, 0.5187 * p4, 0.723 * p3, 0.5187 * p4, 0.7065 * p3, 0.5371 * p4);
    builder.curveTo(0.69 * p3, 0.5554 * p4, 0.6625 * p3, 0.5615 * p4, 0.6625 * p3, 0.5616 * p4);
    builder.stroke();
    builder.begin();
    builder.moveTo(0.6171 * p3, 0.6213 * p4);
    builder.curveTo(0.6171 * p3, 0.6213 * p4, 0.595 * p3, 0.7704 * p4, 0.7079 * p3, 0.7888 * p4);
    builder.curveTo(0.7464 * p3, 0.795 * p4, 0.8672 * p3, 0.85 * p4, 0.8948 * p3, 0.8745 * p4);
    builder.curveTo(0.9224 * p3, 0.899 * p4, 0.9359 * p3, 0.9316 * p4, 0.9429 * p3, 0.9622 * p4);
    builder.quadTo(0.95 * p3, p4, 0.95 * p3, p4);
    builder.stroke();
    builder.begin();
    builder.moveTo(0.6573 * p3, 0.4185 * p4);
    builder.curveTo(0.6573 * p3, 0.4185 * p4, 0.6573 * p3, 0.3839 * p4, 0.6573 * p3, 0.3593 * p4);
    builder.curveTo(0.6573 * p3, 0.3348 * p4, 0.6337 * p3, 0.3103 * p4, 0.6282 * p3, 0.3041 * p4);
    builder.curveTo(0.6227 * p3, 0.298 * p4, 0.6178 * p3, 0.2673 * p4, 0.6123 * p3, 0.2551 * p4);
    builder.curveTo(0.6068 * p3, 0.2429 * p4, 0.5905 * p3, 0.2429 * p4, 0.5741 * p3, 0.2367 * p4);
    builder.curveTo(0.5576 * p3, 0.2306 * p4, 0.5016 * p3, 0.2357 * p4, 0.5016 * p3, 0.2357 * p4);
    builder.stroke();
    builder.begin();
    builder.moveTo(0.635 * p3, 0.7427 * p4);
    builder.curveTo(0.635 * p3, 0.7427 * p4, 0.6228 * p3, 0.8076 * p4, 0.5714 * p3, 0.8224 * p4);
    builder.curveTo(0.5184 * p3, 0.8377 * p4, 0.4972 * p3, 0.8347 * p4, 0.4972 * p3, 0.8347 * p4);
    builder.stroke();
    builder.begin();
    builder.moveTo(0.6678 * p3, 0.7764 * p4);
    builder.curveTo(0.6678 * p3, 0.7764 * p4, 0.6444 * p3, 0.8386 * p4, 0.5962 * p3, 0.8684 * p4);
    builder.curveTo(0.5467 * p3, 0.8991 * p4, 0.4971 * p3, 0.8929 * p4, 0.4971 * p3, 0.8929 * p4);
    builder.stroke();
    builder.begin();
    builder.moveTo(0.7283 * p3, 0.9 * p4);
    builder.lineTo(0.7283 * p3, p4);
    builder.stroke();
    builder.begin();
    builder.moveTo(0.8329 * p3, 0.8991 * p4);
    builder.curveTo(0.8329 * p3, 0.8991 * p4, 0.8274 * p3, 0.9114 * p4, 0.8164 * p3, 0.9481 * p4);
    builder.curveTo(0.8054 * p3, 0.9849 * p4, 0.8 * p3, p4, 0.8 * p3, p4);
    builder.stroke();
    builder.setStrokeColor(p6 as string);
    builder.begin();
    builder.moveTo(0, 0);
    builder.lineTo(p3, 0);
    builder.lineTo(p3, p4);
    builder.lineTo(0, p4);
    builder.close();
    builder.stroke();
  }
}
