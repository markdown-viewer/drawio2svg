// @ts-nocheck
import type { RenderContext, ShapeAttrs } from '../../../renderer.ts';
import { BaseShapeHandler } from '../../shape-registry.ts';

export class MockupFormsSignInHandler extends BaseShapeHandler {
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

    builder.translate(x, y);
    this.renderBackground(builder, 0, 0, width, height, style, getStencilShape, renderStencilShape);
    builder.setShadow(!1);
    this.renderForeground(builder, 0, 0, width, height, style, getStencilShape, renderStencilShape);
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
    renderStencilShape?: RenderContext['renderStencilShape']
  ): void {
    if (!builder) return;
    builder.rect(0, 0, width, height);
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
    renderStencilShape?: RenderContext['renderStencilShape']
  ): void {
    if (!builder) return;
    let b;
    let c;
    let f;
    let g;
    let h;
    let k;
    let l;
    b = this.getStyleValue(
      style,
      'mainText',
      'Sign In,User Name:,johndoe,Password:,********,Forgot Password?,New User,SIGN IN,SIGN UP'
    )
      .toString()
      .split(',');
    c = this.getStyleValue(style, 'textColor', '#666666');
    f = this.getStyleValue(style, 'textColor2', '#ffffff');
    g = this.getStyleValue(style, 'textSize', '12');
    h = this.getStyleValue(style, 'textSize2', '15');
    k = this.getStyleValue(style, 'strokeColor2', '#ddeeff');
    l = this.getStyleValue(style, 'fillColor2', '#66bbff');
    builder.setFillColor(l as string);
    builder.roundrect(0.09 * width, 0.52 * height, 0.36 * width, 0.09 * height, 5, 5);
    builder.fill();
    builder.roundrect(0.09 * width, 0.84 * height, 0.36 * width, 0.09 * height, 5, 5);
    builder.fill();
    builder.rect(0.05 * width, 0.22 * height, 0.75 * width, 0.08 * height);
    builder.stroke();
    builder.rect(0.05 * width, 0.4 * height, 0.75 * width, 0.08 * height);
    builder.stroke();
    builder.setStrokeColor(k as string);
    builder.setStrokeWidth(2);
    builder.begin();
    builder.moveTo(0.05 * width, 0.12 * height);
    builder.lineTo(0.95 * width, 0.12 * height);
    builder.moveTo(0.05 * width, 0.72 * height);
    builder.lineTo(0.95 * width, 0.72 * height);
    builder.stroke();
    builder.setFontColor(c as string);
    builder.setFontSize(Number.parseFloat(String(g)) || 0);
    builder.text(0.05 * width, 0.1 * height, 0, 0, b[0], 'left', 'bottom', 0, 0, 0);
    builder.text(0.05 * width, 0.2 * height, 0, 0, b[1], 'left', 'bottom', 0, 0, 0);
    builder.text(0.075 * width, 0.26 * height, 0, 0, b[2], 'left', 'middle', 0, 0, 0);
    builder.text(0.05 * width, 0.38 * height, 0, 0, b[3], 'left', 'bottom', 0, 0, 0);
    builder.text(0.075 * width, 0.44 * height, 0, 0, b[4], 'left', 'middle', 0, 0, 0);
    builder.text(0.05 * width, 0.8 * height, 0, 0, b[6], 'left', 'middle', 0, 0, 0);
    builder.setStrokeWidth(1);
    builder.setFontColor('#9999ff' as string);
    builder.setStrokeColor('#9999ff' as string);
    c = this.measureTextSize(b[5], g, 'Arial,Helvetica,sans-serif', 0).width;
    builder.text(0.05 * width, 0.7 * height, 0, 0, b[5], 'left', 'bottom', 0, 0, 0);
    builder.begin();
    builder.moveTo(0.05 * width, 0.7 * height);
    builder.lineTo(0.05 * width + c, 0.7 * height);
    builder.stroke();
    builder.setFontColor(f as string);
    builder.setFontStyle(1);
    builder.setFontSize(Number.parseFloat(String(h)) || 0);
    builder.text(0.27 * width, 0.565 * height, 0, 0, b[7], 'center', 'middle', 0, 0, 0);
    builder.text(0.27 * width, 0.885 * height, 0, 0, b[8], 'center', 'middle', 0, 0, 0);
  }

  private measureTextSize(
    text: any,
    fontSize: number,
    fontFamily: string,
    fontStyle?: string
  ): { width: number; height: number } {
    try {
      const provider = this.renderCtx?.getTextMeasureProvider?.();
      if (!provider || !provider.measureText) return { width: 0, height: 0 };
      const raw = text == null ? '' : String(text);
      let fontWeight = 'normal';
      let fontStyleNormalized = 'normal';
      if (fontStyle && (fontStyle & 1) === 1) fontWeight = 'bold';
      if (fontStyle && (fontStyle & 2) === 2) fontStyleNormalized = 'italic';
      const result = provider.measureText(
        raw,
        fontSize,
        fontFamily,
        fontWeight,
        fontStyleNormalized,
        false
      );
      return { width: Math.round(result.width), height: Math.round(result.height) };
    } catch {
      return { width: 0, height: 0 };
    }
  }
}
