// @ts-nocheck
import type { RenderContext, ShapeAttrs } from '../../../renderer.ts';
import { BaseShapeHandler } from '../../shape-registry.ts';

export class Aws3dDynamoDbHandler extends BaseShapeHandler {
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
    let f = parseFloat(this.getStyleValue(style, 'strokeWidth', '1'));

    builder.translate(d, e);
    d = (f * width) / 181.5;
    f = (f * height) / 210;
    e = this.getStyleValue(style, 'strokeColor2', '#292929');
    f = Math.min(d, f);
    this.renderBackground(
      builder,
      0,
      0,
      width,
      height,
      style,
      getStencilShape,
      renderStencilShape,
      f,
      e
    );
    builder.setShadow(!1);
    this.renderForeground(
      builder,
      0,
      0,
      width,
      height,
      style,
      getStencilShape,
      renderStencilShape,
      f,
      e
    );
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
    builder.setStrokeWidth(extra1);
    builder.save();
    builder.save();
    builder.setStrokeWidth(2 * extra1);
    builder.setStrokeColor(extra2 as string);
    builder.setLineJoin('round');
    builder.begin();
    builder.moveTo(0, 0.8333 * height);
    builder.lineTo(0, 0.1667 * height);
    builder.lineTo(0.3333 * width, 0.0014 * height);
    builder.lineTo(0.4986 * width, 0.1667 * height);
    builder.lineTo(0.6639 * width, 0);
    builder.lineTo(width, 0.169 * height);
    builder.lineTo(width, 0.8333 * height);
    builder.lineTo(0.6667 * width, height);
    builder.lineTo(0.5014 * width, 0.9162 * height);
    builder.lineTo(0.3333 * width, height);
    builder.close();
    builder.fillAndStroke();
  }

  private renderForeground(
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
    builder.restore();
    builder.setShadow(!1);
    builder.setFillColor('#000000' as string);
    x = this.getStyleValue(style, 'shadingCols', '0.1,0.3').toString().split(',');
    y = this.getStyleValue(style, 'flipH', '0');
    if ('0' == y) {
      builder.setAlpha(x[0]);
    } else {
      builder.setAlpha(x[1]);
    }
    builder.begin();
    builder.moveTo(0.168 * width, 0.3333 * height);
    builder.lineTo(0, 0.3333 * height);
    builder.lineTo(0.3333 * width, 0.5 * height);
    builder.lineTo(0.3333 * width, height);
    builder.lineTo(0, 0.8333 * height);
    builder.lineTo(0, 0.1714 * height);
    builder.close();
    builder.moveTo(0.4986 * width, 0.1667 * height);
    builder.lineTo(0.6667 * width, 0);
    builder.lineTo(width, 0.169 * height);
    builder.lineTo(0.832 * width, 0.3348 * height);
    builder.lineTo(width, 0.3333 * height);
    builder.lineTo(0.6667 * width, 0.5 * height);
    builder.lineTo(0.5014 * width, 0.5 * height);
    builder.lineTo(0.832 * width, 0.3348 * height);
    builder.fill();
    if ('0' == y) {
      builder.setAlpha(x[1]);
    } else {
      builder.setAlpha(x[0]);
    }
    builder.begin();
    builder.moveTo(0.3333 * width, 0.5 * height);
    builder.lineTo(0.4986 * width, 0.5 * height);
    builder.lineTo(0.4986 * width, 0.9162 * height);
    builder.lineTo(0.3333 * width, height);
    builder.close();
    builder.moveTo(0.6667 * width, height);
    builder.lineTo(0.6667 * width, 0.5 * height);
    builder.lineTo(width, 0.3333 * height);
    builder.lineTo(0.832 * width, 0.3348 * height);
    builder.lineTo(width, 0.169 * height);
    builder.lineTo(width, 0.831 * height);
    builder.close();
    builder.fill();
    builder.restore();
    builder.setShadow(!1);
    builder.setLineJoin('round');
    builder.begin();
    builder.moveTo(0.168 * width, 0.3333 * height);
    builder.lineTo(0, 0.3333 * height);
    builder.lineTo(0.3333 * width, 0.5 * height);
    builder.lineTo(0.3333 * width, height);
    builder.lineTo(0, 0.8333 * height);
    builder.lineTo(0, 0.1714 * height);
    builder.close();
    builder.moveTo(0.4986 * width, 0.1667 * height);
    builder.lineTo(0.6667 * width, 0);
    builder.lineTo(width, 0.169 * height);
    builder.lineTo(0.832 * width, 0.3348 * height);
    builder.lineTo(width, 0.3333 * height);
    builder.lineTo(0.6667 * width, 0.5 * height);
    builder.lineTo(0.5014 * width, 0.5 * height);
    builder.lineTo(0.832 * width, 0.3348 * height);
    builder.close();
    builder.moveTo(0.3333 * width, 0.5 * height);
    builder.lineTo(0.4986 * width, 0.5 * height);
    builder.lineTo(0.4986 * width, 0.9162 * height);
    builder.lineTo(0.3333 * width, height);
    builder.close();
    builder.moveTo(0.6667 * width, height);
    builder.lineTo(0.6667 * width, 0.5 * height);
    builder.lineTo(width, 0.3333 * height);
    builder.lineTo(width, 0.831 * height);
    builder.close();
    builder.moveTo(0.168 * width, 0.3333 * height);
    builder.lineTo(0.5 * width, 0.1667 * height);
    builder.moveTo(0.168 * width, 0.3333 * height);
    builder.lineTo(0.5014 * width, 0.5 * height);
    builder.stroke();
    x = this.getStyleValue(style, 'strokeColor', '#000000');
    builder.setFillColor(x as string);
    builder.begin();
    builder.moveTo(0.4876 * width, 0.2262 * height);
    builder.arcTo(0.303 * width, 0.2619 * height, 0, 0, 1, 0.5647 * width, 0.25 * height);
    builder.arcTo(0.4407 * width, 0.381 * height, 0, 0, 1, 0.6419 * width, 0.2905 * height);
    builder.arcTo(0.303 * width, 0.2619 * height, 0, 0, 1, 0.6799 * width, 0.32 * height);
    builder.arcTo(0.0132 * width, 0.0076 * height, 0, 0, 1, 0.6634 * width, 0.3314 * height);
    builder.arcTo(0.303 * width, 0.2619 * height, 0, 0, 1, 0.5978 * width, 0.3119 * height);
    builder.arcTo(0.4408 * width, 0.381 * height, 0, 0, 1, 0.508 * width, 0.2667 * height);
    builder.arcTo(0.303 * width, 0.2619 * height, 0, 0, 1, 0.4711 * width, 0.2343 * height);
    builder.arcTo(0.0132 * width, 0.0076 * height, 0, 0, 1, 0.4876 * width, 0.2262 * height);
    builder.close();
    builder.fill();
    builder.begin();
    builder.moveTo(0.5124 * width, 0.4143 * height);
    builder.arcTo(0.1102 * width, 0.0952 * height, 0, 0, 1, 0.4683 * width, 0.4095 * height);
    builder.arcTo(0.4408 * width, 0.381 * height, 0, 0, 1, 0.3829 * width, 0.3757 * height);
    builder.arcTo(0.4408 * width, 0.381 * height, 0, 0, 1, 0.3196 * width, 0.3371 * height);
    builder.arcTo(0.0661 * width, 0.0357 * height, 0, 0, 1, 0.3058 * width, 0.3081 * height);
    builder.lineTo(0.4612 * width, 0.2333 * height);
    builder.arcTo(0.0661 * width, 0.0476 * height, 0, 0, 0, 0.4744 * width, 0.2548 * height);
    builder.arcTo(0.3306 * width, 0.2857 * height, 0, 0, 0, 0.53 * width, 0.2905 * height);
    builder.arcTo(0.4408 * width, 0.381 * height, 0, 0, 0, 0.6198 * width, 0.3295 * height);
    builder.arcTo(0.1102 * width, 0.0952 * height, 0, 0, 0, 0.665 * width, 0.3367 * height);
    builder.close();
    builder.moveTo(0.5052 * width, 0.3714 * height);
    builder.arcTo(0.0275 * width, 0.019 * height, 0, 0, 1, 0.5135 * width, 0.3581 * height);
    builder.arcTo(0.0275 * width, 0.0238 * height, 0, 0, 1, 0.5344 * width, 0.3571 * height);
    builder.lineTo(0.5405 * width, 0.3471 * height);
    builder.arcTo(0.0275 * width, 0.0143 * height, 0, 0, 1, 0.5278 * width, 0.3381 * height);
    builder.arcTo(0.022 * width, 0.0119 * height, 0, 0, 1, 0.5372 * width, 0.3271 * height);
    builder.lineTo(0.5306 * width, 0.3186 * height);
    builder.arcTo(0.0331 * width, 0.0286 * height, 0, 0, 1, 0.5041 * width, 0.3143 * height);
    builder.arcTo(0.0275 * width, 0.0143 * height, 0, 0, 1, 0.4975 * width, 0.3029 * height);
    builder.lineTo(0.4777 * width, 0.2995 * height);
    builder.arcTo(0.0331 * width, 0.0286 * height, 0, 0, 1, 0.4628 * width, 0.3033 * height);
    builder.arcTo(0.0331 * width, 0.0286 * height, 0, 0, 1, 0.4408 * width, 0.2967 * height);
    builder.lineTo(0.4187 * width, 0.3 * height);
    builder.arcTo(0.011 * width, 0.0081 * height, 0, 0, 1, 0.4132 * width, 0.3124 * height);
    builder.arcTo(0.0386 * width, 0.0333 * height, 0, 0, 1, 0.395 * width, 0.3129 * height);
    builder.lineTo(0.3873 * width, 0.3224 * height);
    builder.arcTo(0.0165 * width, 0.0143 * height, 0, 0, 1, 0.3994 * width, 0.3333 * height);
    builder.arcTo(0.0138 * width, 0.0119 * height, 0, 0, 1, 0.3901 * width, 0.3433 * height);
    builder.lineTo(0.3994 * width, 0.3514 * height);
    builder.arcTo(0.0331 * width, 0.0286 * height, 0, 0, 1, 0.4215 * width, 0.3548 * height);
    builder.arcTo(0.0165 * width, 0.0119 * height, 0, 0, 1, 0.4298 * width, 0.3667 * height);
    builder.lineTo(0.449 * width, 0.3714 * height);
    builder.arcTo(0.0331 * width, 0.0286 * height, 0, 0, 1, 0.4711 * width, 0.3657 * height);
    builder.arcTo(0.0331 * width, 0.0286 * height, 0, 0, 1, 0.4887 * width, 0.3724 * height);
    builder.close();
    builder.moveTo(0.4986 * width, 0.351 * height);
    builder.arcTo(0.0441 * width, 0.0381 * height, 0, 0, 1, 0.4804 * width, 0.3552 * height);
    builder.arcTo(0.1102 * width, 0.0952 * height, 0, 0, 1, 0.443 * width, 0.349 * height);
    builder.lineTo(0.4413 * width, 0.3529 * height);
    builder.lineTo(0.4242 * width, 0.3371 * height);
    builder.arcTo(0.1102 * width, 0.0952 * height, 0, 0, 0, 0.4545 * width, 0.3462 * height);
    builder.arcTo(0.1102 * width, 0.0952 * height, 0, 0, 0, 0.4793 * width, 0.3476 * height);
    builder.arcTo(0.0441 * width, 0.0381 * height, 0, 0, 0, 0.4986 * width, 0.3448 * height);
    builder.close();
    builder.moveTo(0.503 * width, 0.3349 * height);
    builder.arcTo(0.1102 * width, 0.0952 * height, 0, 0, 0, 0.4766 * width, 0.3233 * height);
    builder.arcTo(0.0826 * width, 0.0714 * height, 0, 0, 0, 0.4529 * width, 0.32 * height);
    builder.arcTo(0.0551 * width, 0.0476 * height, 0, 0, 0, 0.4325 * width, 0.3238 * height);
    builder.lineTo(0.427 * width, 0.3195 * height);
    builder.arcTo(0.0826 * width, 0.0714 * height, 0, 0, 1, 0.4556 * width, 0.3157 * height);
    builder.arcTo(0.0826 * width, 0.0714 * height, 0, 0, 1, 0.4851 * width, 0.3232 * height);
    builder.lineTo(0.4876 * width, 0.3181 * height);
    builder.close();
    builder.fill();
    builder.setStrokeWidth(2 * extra1);
    builder.setStrokeColor(extra2 as string);
    builder.setLineJoin('round');
    builder.begin();
    builder.moveTo(0, 0.8333 * height);
    builder.lineTo(0, 0.1667 * height);
    builder.lineTo(0.3333 * width, 0.0014 * height);
    builder.lineTo(0.4986 * width, 0.1667 * height);
    builder.lineTo(0.6639 * width, 0);
    builder.lineTo(width, 0.169 * height);
    builder.lineTo(width, 0.8333 * height);
    builder.lineTo(0.6667 * width, height);
    builder.lineTo(0.5014 * width, 0.9162 * height);
    builder.lineTo(0.3333 * width, height);
    builder.close();
    builder.stroke();
  }
}
