// @ts-nocheck
import type { RenderContext, ShapeAttrs } from '../../../renderer.ts';
import { BaseShapeHandler } from '../../shape-registry.ts';

export class MockupContainersUserFemaleHandler extends BaseShapeHandler {
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
    builder.moveTo(0.3148 * p3, 0.468 * p4);
    builder.curveTo(0.3045 * p3, 0.3195 * p4, 0.3176 * p3, 0.2383 * p4, 0.3302 * p3, 0.2069 * p4);
    builder.curveTo(0.3508 * p3, 0.1557 * p4, 0.44 * p3, 0.1156 * p4, 0.5026 * p3, 0.1156 * p4);
    builder.stroke();
    builder.begin();
    builder.moveTo(0.5029 * p3, 0.6728 * p4);
    builder.curveTo(0.4616 * p3, 0.6728 * p4, 0.4018 * p3, 0.6177 * p4, 0.3663 * p3, 0.5653 * p4);
    builder.stroke();
    builder.begin();
    builder.moveTo(0.3108 * p3, 0.4021 * p4);
    builder.curveTo(0.3108 * p3, 0.4021 * p4, 0.3091 * p3, 0.3765 * p4, 0.2891 * p3, 0.3933 * p4);
    builder.curveTo(0.2691 * p3, 0.4101 * p4, 0.2782 * p3, 0.4661 * p4, 0.2782 * p3, 0.4661 * p4);
    builder.quadTo(0.2862 * p3, 0.5067 * p4, 0.2922 * p3, 0.5166 * p4);
    builder.curveTo(0.2982 * p3, 0.5265 * p4, 0.2929 * p3, 0.5268 * p4, 0.3097 * p3, 0.5412 * p4);
    builder.stroke();
    builder.begin();
    builder.moveTo(0.4038 * p3, 0.6176 * p4);
    builder.curveTo(0.4038 * p3, 0.6176 * p4, 0.4324 * p3, 0.7778 * p4, 0.3375 * p3, 0.7963 * p4);
    builder.curveTo(0.3054 * p3, 0.8026 * p4, 0.1753 * p3, 0.8578 * p4, 0.15 * p3, 0.8826 * p4);
    builder.curveTo(0.1247 * p3, 0.9074 * p4, 0.1126 * p3, 0.9412 * p4, 0.1063 * p3, 0.9722 * p4);
    builder.curveTo(0.1 * p3, 1.0032 * p4, 0.1 * p3, p4, 0.1 * p3, p4);
    builder.stroke();
    builder.begin();
    builder.moveTo(0.6377 * p3, 0.3365 * p4);
    builder.curveTo(0.5927 * p3, 0.2634 * p4, 0.5206 * p3, 0.2634 * p4, 0.5206 * p3, 0.2634 * p4);
    builder.quadTo(0.3769 * p3, 0.2591 * p4, 0.3713 * p3, 0.2659 * p4);
    builder.curveTo(0.3657 * p3, 0.2727 * p4, 0.3405 * p3, 0.3674 * p4, 0.3405 * p3, 0.3946 * p4);
    builder.curveTo(0.3405 * p3, 0.4218 * p4, 0.3405 * p3, 0.4602 * p4, 0.3405 * p3, 0.4602 * p4);
    builder.quadTo(0.3546 * p3, 0.6401 * p4, 0.3546 * p3, 0.6626 * p4);
    builder.stroke();
    builder.begin();
    builder.moveTo(0.2931 * p3, 0.818 * p4);
    builder.curveTo(0.2931 * p3, 0.818 * p4, 0.3224 * p3, 0.9159 * p4, 0.3826 * p3, 0.9677 * p4);
    builder.curveTo(0.4446 * p3, 1.01 * p4, 0.5065 * p3, p4, 0.5065 * p3, p4);
    builder.stroke();
    builder.begin();
    builder.moveTo(0.2995 * p3, 0.9106 * p4);
    builder.lineTo(0.2995 * p3, p4);
    builder.stroke();
    builder.begin();
    builder.moveTo(0.2081 * p3, 0.907 * p4);
    builder.curveTo(0.2081 * p3, 0.907 * p4, 0.2131 * p3, 0.9194 * p4, 0.2232 * p3, 0.9565 * p4);
    builder.curveTo(0.2333 * p3, 0.9936 * p4, 0.24 * p3, p4, 0.24 * p3, p4);
    builder.stroke();
    builder.begin();
    builder.moveTo(0.6951 * p3, 0.4988 * p4);
    builder.curveTo(0.6951 * p3, 0.4662 * p4, 0.7042 * p3, 0.3453 * p4, 0.7 * p3, 0.32 * p4);
    builder.curveTo(0.6923 * p3, 0.273 * p4, 0.6926 * p3, 0.2175 * p4, 0.6727 * p3, 0.19 * p4);
    builder.curveTo(0.6504 * p3, 0.159 * p4, 0.5651 * p3, 0.1157 * p4, 0.5025 * p3, 0.1157 * p4);
    builder.stroke();
    builder.begin();
    builder.moveTo(0.5029 * p3, 0.6728 * p4);
    builder.curveTo(0.5546 * p3, 0.6728 * p4, 0.6107 * p3, 0.6316 * p4, 0.6461 * p3, 0.5602 * p4);
    builder.stroke();
    builder.begin();
    builder.moveTo(0.696 * p3, 0.4022 * p4);
    builder.curveTo(0.696 * p3, 0.4022 * p4, 0.6983 * p3, 0.3766 * p4, 0.7179 * p3, 0.4106 * p4);
    builder.curveTo(0.7375 * p3, 0.4278 * p4, 0.7273 * p3, 0.4836 * p4, 0.7273 * p3, 0.4836 * p4);
    builder.quadTo(0.7184 * p3, 0.5241 * p4, 0.7123 * p3, 0.5338 * p4);
    builder.curveTo(0.7062 * p3, 0.5436 * p4, 0.7114 * p3, 0.544 * p4, 0.6943 * p3, 0.558 * p4);
    builder.stroke();
    builder.begin();
    builder.moveTo(0.5995 * p3, 0.6278 * p4);
    builder.curveTo(0.5995 * p3, 0.6278 * p4, 0.5724 * p3, 0.7777 * p4, 0.6663 * p3, 0.7963 * p4);
    builder.curveTo(0.6984 * p3, 0.8026 * p4, 0.8386 * p3, 0.8578 * p4, 0.8638 * p3, 0.8826 * p4);
    builder.curveTo(0.8891 * p3, 0.9074 * p4, 0.9016 * p3, 0.9412 * p4, 0.9079 * p3, 0.9722 * p4);
    builder.curveTo(0.9142 * p3, 1.0032 * p4, 0.91 * p3, p4, 0.91 * p3, p4);
    builder.stroke();
    builder.begin();
    builder.moveTo(0.6545 * p3, 0.6802 * p4);
    builder.lineTo(0.6545 * p3, 0.3986 * p4);
    builder.stroke();
    builder.begin();
    builder.moveTo(0.7132 * p3, 0.8078 * p4);
    builder.curveTo(0.7132 * p3, 0.8078 * p4, 0.6839 * p3, 0.916 * p4, 0.6237 * p3, 0.9678 * p4);
    builder.curveTo(0.5617 * p3, 1.01 * p4, 0.4998 * p3, p4, 0.4998 * p3, p4);
    builder.stroke();
    builder.begin();
    builder.moveTo(0.7111 * p3, 0.9106 * p4);
    builder.lineTo(0.7111 * p3, p4);
    builder.stroke();
    builder.begin();
    builder.moveTo(0.8075 * p3, 0.907 * p4);
    builder.curveTo(0.8075 * p3, 0.907 * p4, 0.8025 * p3, 0.9194 * p4, 0.7924 * p3, 0.9565 * p4);
    builder.curveTo(0.7823 * p3, 0.9936 * p4, 0.775 * p3, p4, 0.775 * p3, p4);
    builder.stroke();
    builder.begin();
    builder.moveTo(0.3148 * p3, 0.5448 * p4);
    builder.curveTo(0.3148 * p3, 0.5448 * p4, 0.32 * p3, 0.6216 * p4, 0.3148 * p3, 0.6677 * p4);
    builder.quadTo(0.2891 * p3, 0.7343 * p4, 0.2891 * p3, 0.7343 * p4);
    builder.lineTo(0.3303 * p3, 0.7625 * p4);
    builder.lineTo(0.39 * p3, 0.7625 * p4);
    builder.stroke();
    builder.begin();
    builder.moveTo(0.6852 * p3, 0.5448 * p4);
    builder.curveTo(0.6852 * p3, 0.5448 * p4, 0.68 * p3, 0.6216 * p4, 0.6852 * p3, 0.6677 * p4);
    builder.quadTo(0.7109 * p3, 0.7343 * p4, 0.7109 * p3, 0.7343 * p4);
    builder.lineTo(0.6697 * p3, 0.7625 * p4);
    builder.lineTo(0.62 * p3, 0.7625 * p4);
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
