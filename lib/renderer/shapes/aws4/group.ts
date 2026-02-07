// @ts-nocheck
import type { RenderContext, ShapeAttrs } from '../../../renderer.ts';
import { BaseShapeHandler } from '../../shape-registry.ts';

export class Aws4GroupHandler extends BaseShapeHandler {
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
    let d = x;
    let e = y;
    let b = width;
    let c = height;

    builder.translate(d, e);
    e = this.getStyleValue(style, 'grStroke', '1');
    d = 25;
    if (null != style && '0' == this.getStyleValue(style, 'pointerEvents', '1')) {
      builder.pointerEvents = !1;
    }
    builder.begin();
    builder.moveTo(0, 0);
    builder.lineTo(b, 0);
    builder.lineTo(b, c);
    builder.lineTo(0, c);
    builder.close();
    if ('1' == e || this.getStyleNumber(style, 'outline', 0)) {
      builder.fillAndStroke();
    } else {
      builder.fill();
    }
    builder.pointerEvents = !0;
    builder.setShadow(!1);
    b = this.getStyleValue(style, 'grIcon', '');
    b = b;
    if (null != b) {
      c = this.getStyleValue(style, 'strokeColor', '#000000');
      d = this.getStyleValue(style, 'grIconSize', d);
      builder.setFillAlpha(this.getStyleNumber(style, 'strokeOpacity', 100) / 100);
      builder.setFillColor(c as string);
      builder.setStrokeColor('none' as string);
      this.renderStencilByName(
        b,
        0,
        0,
        d,
        d,
        undefined,
        style,
        getStencilShape,
        renderStencilShape
      );
    }
    builder.restore();
  }

  // renderStencilByName is inherited from BaseShapeHandler
}
