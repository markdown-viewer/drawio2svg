// @ts-nocheck
import type { RenderContext, ShapeAttrs } from '../../../renderer.ts';
import { BaseShapeHandler } from '../../shape-registry.ts';

export class Aws3dOracleDbServerHandler extends BaseShapeHandler {
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
    d = (f * width) / 123;
    f = (f * height) / 142;
    e = this.getStyleValue(style, 'strokeColor2', '#292929');
    f = Math.min(d, f);
    builder.setStrokeWidth(f);
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
    builder.save();
    builder.save();
    builder.save();
    builder.setStrokeWidth(2 * extra1);
    builder.setStrokeColor(extra2 as string);
    builder.setLineJoin('round');
    builder.begin();
    builder.moveTo(0, 0.7331 * height);
    builder.lineTo(0, 0.3346 * height);
    builder.lineTo(0.126 * width, 0.1316 * height);
    builder.lineTo(0.374 * width, 0);
    builder.lineTo(0.626 * width, 0);
    builder.lineTo(0.874 * width, 0.1316 * height);
    builder.lineTo(width, 0.3346 * height);
    builder.lineTo(width, 0.7331 * height);
    builder.lineTo(0.5 * width, height);
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
    x = this.getStyleValue(style, 'fillColor2', '#ff0000');
    y = this.getStyleValue(style, 'fillColor3', '#ffffff');
    builder.restore();
    builder.setShadow(!1);
    builder.setFillColor('#000000' as string);
    builder.setAlpha('0.1');
    builder.begin();
    builder.moveTo(0.126 * width, 0.1316 * height);
    builder.lineTo(0.126 * width, 0.267 * height);
    builder.lineTo(0.378 * width, 0.4023 * height);
    builder.lineTo(0.5 * width, 0.6015 * height);
    builder.lineTo(0.5 * width, height);
    builder.lineTo(0, 0.7331 * height);
    builder.lineTo(0, 0.3346 * height);
    builder.close();
    builder.moveTo(0.874 * width, 0.267 * height);
    builder.lineTo(0.874 * width, 0.1316 * height);
    builder.lineTo(width, 0.3308 * height);
    builder.fill();
    builder.setAlpha('0.3');
    builder.begin();
    builder.moveTo(0.5 * width, height);
    builder.lineTo(0.5 * width, 0.6015 * height);
    builder.lineTo(0.622 * width, 0.4023 * height);
    builder.lineTo(0.874 * width, 0.267 * height);
    builder.lineTo(width, 0.3308 * height);
    builder.lineTo(width, 0.7331 * height);
    builder.close();
    builder.fill();
    builder.restore();
    builder.setShadow(!1);
    builder.setLineJoin('round');
    builder.setFillColor(x as string);
    builder.begin();
    builder.moveTo(0, 0.5586 * height);
    builder.lineTo(0.5 * width, 0.8248 * height);
    builder.lineTo(width, 0.5586 * height);
    builder.lineTo(width, 0.6782 * height);
    builder.lineTo(0.5 * width, 0.9453 * height);
    builder.lineTo(0, 0.6782 * height);
    builder.fill();
    builder.setStrokeWidth(0.5 * extra1);
    builder.setStrokeColor(y as string);
    builder.setFillColor(y as string);
    builder.begin();
    builder.moveTo(0, 0.5586 * height);
    builder.lineTo(0.5 * width, 0.8248 * height);
    builder.lineTo(width, 0.5586 * height);
    builder.moveTo(width, 0.6782 * height);
    builder.lineTo(0.5 * width, 0.9453 * height);
    builder.lineTo(0, 0.6782 * height);
    builder.stroke();
    builder.begin();
    builder.moveTo(0.0813 * width, 0.6918 * height);
    builder.arcTo(0.0569 * width, 0.0526 * height, 0, 0, 1, 0.065 * width, 0.6616 * height);
    builder.arcTo(0.065 * width, 0.0601 * height, 0, 0, 1, 0.065 * width, 0.6384 * height);
    builder.arcTo(0.0163 * width, 0.0151 * height, 0, 0, 1, 0.0797 * width, 0.6315 * height);
    builder.lineTo(0.122 * width, 0.6534 * height);
    builder.arcTo(0.065 * width, 0.0601 * height, 0, 0, 1, 0.1358 * width, 0.673 * height);
    builder.arcTo(0.065 * width, 0.0601 * height, 0, 0, 1, 0.139 * width, 0.7045 * height);
    builder.arcTo(0.0179 * width, 0.0165 * height, 0, 0, 1, 0.1187 * width, 0.7113 * height);
    builder.close();
    builder.moveTo(0.1163 * width, 0.6992 * height);
    builder.arcTo(0.0089 * width, 0.0082 * height, 0, 0, 0, 0.1285 * width, 0.6955 * height);
    builder.arcTo(0.0407 * width, 0.0376 * height, 0, 0, 0, 0.1293 * width, 0.6819 * height);
    builder.arcTo(0.0407 * width, 0.0376 * height, 0, 0, 0, 0.1179 * width, 0.6616 * height);
    builder.lineTo(0.087 * width, 0.6451 * height);
    builder.arcTo(0.0081 * width, 0.0075 * height, 0, 0, 0, 0.0764 * width, 0.6473 * height);
    builder.arcTo(0.0325 * width, 0.0376 * height, 0, 0, 0, 0.078 * width, 0.673 * height);
    builder.arcTo(0.0407 * width, 0.0376 * height, 0, 0, 0, 0.087 * width, 0.6834 * height);
    builder.close();
    builder.moveTo(0.1439 * width, 0.7256 * height);
    builder.lineTo(0.1439 * width, 0.6654 * height);
    builder.lineTo(0.1846 * width, 0.6872 * height);
    builder.arcTo(0.0407 * width, 0.0376 * height, 0, 0, 1, 0.1967 * width, 0.6992 * height);
    builder.arcTo(0.0407 * width, 0.0376 * height, 0, 0, 1, 0.2 * width, 0.7203 * height);
    builder.arcTo(0.0138 * width, 0.0165 * height, 0, 0, 1, 0.1813 * width, 0.7256 * height);
    builder.lineTo(0.1992 * width, 0.7534 * height);
    builder.lineTo(0.187 * width, 0.7481 * height);
    builder.lineTo(0.1577 * width, 0.7029 * height);
    builder.lineTo(0.1854 * width, 0.7165 * height);
    builder.arcTo(0.0041 * width, 0.0037 * height, 0, 0, 0, 0.1911 * width, 0.7135 * height);
    builder.arcTo(0.0163 * width, 0.0151 * height, 0, 0, 0, 0.1894 * width, 0.7037 * height);
    builder.arcTo(0.0325 * width, 0.0301 * height, 0, 0, 0, 0.1821 * width, 0.6962 * height);
    builder.lineTo(0.1528 * width, 0.6804 * height);
    builder.lineTo(0.1528 * width, 0.7301 * height);
    builder.close();
    builder.moveTo(0.2008 * width, 0.7556 * height);
    builder.lineTo(0.2293 * width, 0.7158 * height);
    builder.arcTo(0.0065 * width, 0.006 * height, 0, 0, 1, 0.2382 * width, 0.7143 * height);
    builder.arcTo(0.0407 * width, 0.0376 * height, 0, 0, 1, 0.2431 * width, 0.724 * height);
    builder.lineTo(0.2699 * width, 0.7902 * height);
    builder.lineTo(0.2602 * width, 0.7872 * height);
    builder.lineTo(0.252 * width, 0.7714 * height);
    builder.lineTo(0.2293 * width, 0.7602 * height);
    builder.lineTo(0.2244 * width, 0.7474 * height);
    builder.lineTo(0.248 * width, 0.7586 * height);
    builder.lineTo(0.235 * width, 0.7271 * height);
    builder.lineTo(0.2122 * width, 0.7617 * height);
    builder.close();
    builder.moveTo(0.3244 * width, 0.8105 * height);
    builder.lineTo(0.3171 * width, 0.8173 * height);
    builder.lineTo(0.2854 * width, 0.8 * height);
    builder.arcTo(0.0407 * width, 0.0376 * height, 0, 0, 1, 0.2724 * width, 0.785 * height);
    builder.arcTo(0.0569 * width, 0.0526 * height, 0, 0, 1, 0.265 * width, 0.7593 * height);
    builder.arcTo(0.0407 * width, 0.0376 * height, 0, 0, 1, 0.2683 * width, 0.7459 * height);
    builder.arcTo(0.0163 * width, 0.0151 * height, 0, 0, 1, 0.2829 * width, 0.7405 * height);
    builder.lineTo(0.3228 * width, 0.7609 * height);
    builder.lineTo(0.3179 * width, 0.7684 * height);
    builder.lineTo(0.2878 * width, 0.7526 * height);
    builder.arcTo(0.0081 * width, 0.0075 * height, 0, 0, 0, 0.2789 * width, 0.7541 * height);
    builder.arcTo(0.0244 * width, 0.0225 * height, 0, 0, 0, 0.2748 * width, 0.7684 * height);
    builder.arcTo(0.0407 * width, 0.0376 * height, 0, 0, 0, 0.2878 * width, 0.7909 * height);
    builder.close();
    builder.moveTo(0.3276 * width, 0.7639 * height);
    builder.lineTo(0.3366 * width, 0.7684 * height);
    builder.lineTo(0.3366 * width, 0.8173 * height);
    builder.lineTo(0.3805 * width, 0.8406 * height);
    builder.lineTo(0.3748 * width, 0.8473 * height);
    builder.lineTo(0.3317 * width, 0.8248 * height);
    builder.arcTo(0.0163 * width, 0.0151 * height, 0, 0, 1, 0.3276 * width, 0.8158 * height);
    builder.close();
    builder.moveTo(0.435 * width, 0.8692 * height);
    builder.lineTo(0.4325 * width, 0.8789 * height);
    builder.lineTo(0.3959 * width, 0.8594 * height);
    builder.arcTo(0.0407 * width, 0.0376 * height, 0, 0, 1, 0.3862 * width, 0.8466 * height);
    builder.arcTo(0.0528 * width, 0.0489 * height, 0, 0, 1, 0.3805 * width, 0.806 * height);
    builder.arcTo(0.0163 * width, 0.0151 * height, 0, 0, 1, 0.3951 * width, 0.8008 * height);
    builder.lineTo(0.435 * width, 0.821 * height);
    builder.lineTo(0.4285 * width, 0.827 * height);
    builder.lineTo(0.4008 * width, 0.8127 * height);
    builder.arcTo(0.0098 * width, 0.0091 * height, 0, 0, 0, 0.3878 * width, 0.8196 * height);
    builder.lineTo(0.4333 * width, 0.8443 * height);
    builder.lineTo(0.426 * width, 0.8512 * height);
    builder.lineTo(0.3878 * width, 0.8308 * height);
    builder.arcTo(0.0325 * width, 0.0301 * height, 0, 0, 0, 0.3976 * width, 0.8489 * height);
    builder.close();
    builder.moveTo(0.6171 * width, 0.7932 * height);
    builder.arcTo(0.0163 * width, 0.0151 * height, 0, 0, 1, 0.6366 * width, 0.7963 * height);
    builder.arcTo(0.0325 * width, 0.0301 * height, 0, 0, 1, 0.639 * width, 0.8188 * height);
    builder.arcTo(0.065 * width, 0.0601 * height, 0, 0, 1, 0.6211 * width, 0.8497 * height);
    builder.lineTo(0.5894 * width, 0.8677 * height);
    builder.arcTo(0.0203 * width, 0.0188 * height, 0, 0, 1, 0.565 * width, 0.8646 * height);
    builder.arcTo(0.0407 * width, 0.0376 * height, 0, 0, 1, 0.5659 * width, 0.8354 * height);
    builder.arcTo(0.0488 * width, 0.0451 * height, 0, 0, 1, 0.5805 * width, 0.8127 * height);
    builder.close();
    builder.moveTo(0.5886 * width, 0.8181 * height);
    builder.arcTo(0.0325 * width, 0.0301 * height, 0, 0, 0, 0.5748 * width, 0.8368 * height);
    builder.arcTo(0.0325 * width, 0.0301 * height, 0, 0, 0, 0.574 * width, 0.8527 * height);
    builder.arcTo(0.0098 * width, 0.0091 * height, 0, 0, 0, 0.587 * width, 0.8586 * height);
    builder.lineTo(0.6163 * width, 0.8428 * height);
    builder.arcTo(0.0407 * width, 0.0376 * height, 0, 0, 0, 0.6285 * width, 0.8248 * height);
    builder.arcTo(0.0244 * width, 0.0225 * height, 0, 0, 0, 0.6293 * width, 0.8105 * height);
    builder.arcTo(0.0098 * width, 0.0091 * height, 0, 0, 0, 0.6163 * width, 0.803 * height);
    builder.close();
    builder.moveTo(0.64 * width, 0.8398 * height);
    builder.lineTo(0.64 * width, 0.779 * height);
    builder.lineTo(0.6854 * width, 0.7563 * height);
    builder.arcTo(0.0106 * width, 0.0098 * height, 0, 0, 1, 0.7008 * width, 0.7632 * height);
    builder.arcTo(0.0407 * width, 0.0376 * height, 0, 0, 1, 0.6959 * width, 0.7865 * height);
    builder.arcTo(0.0407 * width, 0.0376 * height, 0, 0, 1, 0.6805 * width, 0.8 * height);
    builder.lineTo(0.6992 * width, 0.8097 * height);
    builder.lineTo(0.6854 * width, 0.8166 * height);
    builder.lineTo(0.6569 * width, 0.8015 * height);
    builder.lineTo(0.6805 * width, 0.7887 * height);
    builder.arcTo(0.0203 * width, 0.0188 * height, 0, 0, 0, 0.6894 * width, 0.7782 * height);
    builder.arcTo(0.0244 * width, 0.0225 * height, 0, 0, 0, 0.6894 * width, 0.7699 * height);
    builder.arcTo(0.0041 * width, 0.0037 * height, 0, 0, 0, 0.6837 * width, 0.7684 * height);
    builder.lineTo(0.6528 * width, 0.7842 * height);
    builder.lineTo(0.6528 * width, 0.8331 * height);
    builder.close();
    builder.moveTo(0.7 * width, 0.8082 * height);
    builder.lineTo(0.7301 * width, 0.7338 * height);
    builder.arcTo(0.0098 * width, 0.0091 * height, 0, 0, 1, 0.7358 * width, 0.7271 * height);
    builder.arcTo(0.0098 * width, 0.0091 * height, 0, 0, 1, 0.7415 * width, 0.7316 * height);
    builder.lineTo(0.7699 * width, 0.7707 * height);
    builder.lineTo(0.7602 * width, 0.7766 * height);
    builder.lineTo(0.7537 * width, 0.7692 * height);
    builder.lineTo(0.7276 * width, 0.782 * height);
    builder.lineTo(0.7228 * width, 0.7736 * height);
    builder.lineTo(0.748 * width, 0.7617 * height);
    builder.lineTo(0.7358 * width, 0.7421 * height);
    builder.lineTo(0.7114 * width, 0.803 * height);
    builder.close();
    builder.moveTo(0.8244 * width, 0.7316 * height);
    builder.lineTo(0.8171 * width, 0.7459 * height);
    builder.lineTo(0.7894 * width, 0.7609 * height);
    builder.arcTo(0.0244 * width, 0.0225 * height, 0, 0, 1, 0.7683 * width, 0.7593 * height);
    builder.arcTo(0.0407 * width, 0.0376 * height, 0, 0, 1, 0.7667 * width, 0.7338 * height);
    builder.arcTo(0.0488 * width, 0.0452 * height, 0, 0, 1, 0.7937 * width, 0.697 * height);
    builder.lineTo(0.822 * width, 0.6834 * height);
    builder.lineTo(0.8171 * width, 0.6962 * height);
    builder.lineTo(0.7902 * width, 0.7113 * height);
    builder.arcTo(0.0325 * width, 0.0301 * height, 0, 0, 0, 0.778 * width, 0.7256 * height);
    builder.arcTo(0.0407 * width, 0.0376 * height, 0, 0, 0, 0.7756 * width, 0.7444 * height);
    builder.arcTo(0.0077 * width, 0.0072 * height, 0, 0, 0, 0.787 * width, 0.7512 * height);
    builder.close();
    builder.moveTo(0.8366 * width, 0.6742 * height);
    builder.lineTo(0.8366 * width, 0.7248 * height);
    builder.lineTo(0.878 * width, 0.7043 * height);
    builder.lineTo(0.874 * width, 0.7158 * height);
    builder.lineTo(0.8333 * width, 0.7368 * height);
    builder.arcTo(0.0041 * width, 0.0037 * height, 0, 0, 1, 0.8268 * width, 0.7324 * height);
    builder.lineTo(0.8268 * width, 0.6804 * height);
    builder.close();
    builder.moveTo(0.9342 * width, 0.6233 * height);
    builder.lineTo(0.9293 * width, 0.6369 * height);
    builder.lineTo(0.9033 * width, 0.6503 * height);
    builder.arcTo(0.0325 * width, 0.0301 * height, 0, 0, 0, 0.8927 * width, 0.6601 * height);
    builder.arcTo(0.0406 * width, 0.0376 * height, 0, 0, 0, 0.887 * width, 0.6729 * height);
    builder.lineTo(0.9309 * width, 0.6503 * height);
    builder.lineTo(0.9268 * width, 0.6631 * height);
    builder.lineTo(0.887 * width, 0.6834 * height);
    builder.arcTo(0.0089 * width, 0.0082 * height, 0, 0, 0, 0.8992 * width, 0.691 * height);
    builder.lineTo(0.935 * width, 0.6722 * height);
    builder.lineTo(0.9285 * width, 0.6864 * height);
    builder.lineTo(0.9008 * width, 0.7007 * height);
    builder.arcTo(0.0163 * width, 0.0151 * height, 0, 0, 1, 0.8829 * width, 0.7015 * height);
    builder.arcTo(0.0407 * width, 0.0376 * height, 0, 0, 1, 0.8764 * width, 0.6827 * height);
    builder.arcTo(0.065 * width, 0.0601 * height, 0, 0, 1, 0.8959 * width, 0.6443 * height);
    builder.fill();
    builder.restore();
    builder.setShadow(!1);
    builder.setLineJoin('round');
    builder.begin();
    builder.moveTo(0.126 * width, 0.1316 * height);
    builder.lineTo(0.126 * width, 0.267 * height);
    builder.lineTo(0.378 * width, 0.4023 * height);
    builder.lineTo(0.5 * width, 0.6015 * height);
    builder.lineTo(0.622 * width, 0.4023 * height);
    builder.lineTo(0.874 * width, 0.267 * height);
    builder.lineTo(0.874 * width, 0.1316 * height);
    builder.moveTo(0, 0.3346 * height);
    builder.lineTo(0.126 * width, 0.267 * height);
    builder.moveTo(0.5 * width, 0.6015 * height);
    builder.lineTo(0.5 * width, height);
    builder.moveTo(width, 0.3346 * height);
    builder.lineTo(0.87 * width, 0.267 * height);
    builder.moveTo(0.378 * width, 0.4023 * height);
    builder.lineTo(0.622 * width, 0.4023 * height);
    builder.stroke();
    builder.setStrokeWidth(2 * extra1);
    builder.setStrokeColor(extra2 as string);
    builder.begin();
    builder.moveTo(0, 0.7331 * height);
    builder.lineTo(0, 0.3346 * height);
    builder.lineTo(0.126 * width, 0.1316 * height);
    builder.lineTo(0.374 * width, 0);
    builder.lineTo(0.626 * width, 0);
    builder.lineTo(0.874 * width, 0.1316 * height);
    builder.lineTo(width, 0.3346 * height);
    builder.lineTo(width, 0.7331 * height);
    builder.lineTo(0.5 * width, height);
    builder.close();
    builder.stroke();
  }
}
