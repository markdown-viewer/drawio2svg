// @ts-nocheck
import type { RenderContext, ShapeAttrs } from '../../../renderer.ts';
import { BaseShapeHandler } from '../../shape-registry.ts';

export class Aws3dOracleDataCenterHandler extends BaseShapeHandler {
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
      getStencilSvg,
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
      getStencilSvg,
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
      getStencilSvg,
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
    getStencilSvg?: RenderContext['getStencilSvg'],
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
    builder.moveTo(0, 0.7464 * height);
    builder.lineTo(0, 0.25 * height);
    builder.lineTo(0.5 * width, 0);
    builder.lineTo(width, 0.25 * height);
    builder.lineTo(width, 0.7464 * height);
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
    getStencilSvg?: RenderContext['getStencilSvg'],
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
    builder.moveTo(0, 0.7464 * height);
    builder.lineTo(0, 0.25 * height);
    builder.lineTo(0.5 * width, 0.5 * height);
    builder.lineTo(0.5 * width, height);
    builder.close();
    builder.fill();
    builder.setAlpha('0.3');
    builder.begin();
    builder.moveTo(0.5 * width, 0.5 * height);
    builder.lineTo(width, 0.25 * height);
    builder.lineTo(width, 0.7464 * height);
    builder.lineTo(0.5 * width, height);
    builder.close();
    builder.fill();
    builder.restore();
    builder.setShadow(!1);
    builder.setLineJoin('round');
    builder.setFillColor(x as string);
    builder.begin();
    builder.moveTo(0, 0.5866 * height);
    builder.lineTo(0.5 * width, 0.8359 * height);
    builder.lineTo(width, 0.5866 * height);
    builder.lineTo(width, 0.6986 * height);
    builder.lineTo(0.5 * width, 0.9486 * height);
    builder.lineTo(0, 0.6986 * height);
    builder.fill();
    builder.setStrokeWidth(0.5 * extra1);
    builder.setStrokeColor(y as string);
    builder.setFillColor(y as string);
    builder.begin();
    builder.moveTo(0, 0.5866 * height);
    builder.lineTo(0.5 * width, 0.8359 * height);
    builder.lineTo(width, 0.5866 * height);
    builder.moveTo(width, 0.6986 * height);
    builder.lineTo(0.5 * width, 0.9486 * height);
    builder.lineTo(0, 0.6986 * height);
    builder.stroke();
    builder.begin();
    builder.moveTo(0.0813 * width, 0.7113 * height);
    builder.arcTo(0.0569 * width, 0.0493 * height, 0, 0, 1, 0.065 * width, 0.6831 * height);
    builder.arcTo(0.065 * width, 0.0563 * height, 0, 0, 1, 0.065 * width, 0.6613 * height);
    builder.arcTo(0.0163 * width, 0.0141 * height, 0, 0, 1, 0.0797 * width, 0.6549 * height);
    builder.lineTo(0.122 * width, 0.6754 * height);
    builder.arcTo(0.065 * width, 0.0563 * height, 0, 0, 1, 0.1358 * width, 0.6937 * height);
    builder.arcTo(0.065 * width, 0.0563 * height, 0, 0, 1, 0.139 * width, 0.7232 * height);
    builder.arcTo(0.0179 * width, 0.0155 * height, 0, 0, 1, 0.1187 * width, 0.7296 * height);
    builder.close();
    builder.moveTo(0.1163 * width, 0.7183 * height);
    builder.arcTo(0.0089 * width, 0.0077 * height, 0, 0, 0, 0.1285 * width, 0.7148 * height);
    builder.arcTo(0.0407 * width, 0.0352 * height, 0, 0, 0, 0.1293 * width, 0.7021 * height);
    builder.arcTo(0.0407 * width, 0.0352 * height, 0, 0, 0, 0.1179 * width, 0.6831 * height);
    builder.lineTo(0.087 * width, 0.6676 * height);
    builder.arcTo(0.0081 * width, 0.007 * height, 0, 0, 0, 0.0764 * width, 0.6697 * height);
    builder.arcTo(0.0325 * width, 0.0352 * height, 0, 0, 0, 0.078 * width, 0.6937 * height);
    builder.arcTo(0.0407 * width, 0.0352 * height, 0, 0, 0, 0.087 * width, 0.7035 * height);
    builder.close();
    builder.moveTo(0.1439 * width, 0.743 * height);
    builder.lineTo(0.1439 * width, 0.6866 * height);
    builder.lineTo(0.1846 * width, 0.707 * height);
    builder.arcTo(0.0407 * width, 0.0352 * height, 0, 0, 1, 0.1967 * width, 0.7183 * height);
    builder.arcTo(0.0407 * width, 0.0352 * height, 0, 0, 1, 0.2 * width, 0.738 * height);
    builder.arcTo(0.0138 * width, 0.0155 * height, 0, 0, 1, 0.1813 * width, 0.743 * height);
    builder.lineTo(0.1992 * width, 0.769 * height);
    builder.lineTo(0.187 * width, 0.7641 * height);
    builder.lineTo(0.1577 * width, 0.7218 * height);
    builder.lineTo(0.1854 * width, 0.7345 * height);
    builder.arcTo(0.0041 * width, 0.0035 * height, 0, 0, 0, 0.1911 * width, 0.7317 * height);
    builder.arcTo(0.0163 * width, 0.0141 * height, 0, 0, 0, 0.1894 * width, 0.7225 * height);
    builder.arcTo(0.0325 * width, 0.0282 * height, 0, 0, 0, 0.1821 * width, 0.7155 * height);
    builder.lineTo(0.1528 * width, 0.7007 * height);
    builder.lineTo(0.1528 * width, 0.7472 * height);
    builder.close();
    builder.moveTo(0.2008 * width, 0.7711 * height);
    builder.lineTo(0.2293 * width, 0.7338 * height);
    builder.arcTo(0.0065 * width, 0.0056 * height, 0, 0, 1, 0.2382 * width, 0.7324 * height);
    builder.arcTo(0.0407 * width, 0.0352 * height, 0, 0, 1, 0.2431 * width, 0.7415 * height);
    builder.lineTo(0.2699 * width, 0.8035 * height);
    builder.lineTo(0.2602 * width, 0.8007 * height);
    builder.lineTo(0.252 * width, 0.7859 * height);
    builder.lineTo(0.2293 * width, 0.7754 * height);
    builder.lineTo(0.2244 * width, 0.7634 * height);
    builder.lineTo(0.248 * width, 0.7739 * height);
    builder.lineTo(0.235 * width, 0.7444 * height);
    builder.lineTo(0.2122 * width, 0.7768 * height);
    builder.close();
    builder.moveTo(0.3244 * width, 0.8225 * height);
    builder.lineTo(0.3171 * width, 0.8289 * height);
    builder.lineTo(0.2854 * width, 0.8127 * height);
    builder.arcTo(0.0407 * width, 0.0352 * height, 0, 0, 1, 0.2724 * width, 0.7986 * height);
    builder.arcTo(0.0569 * width, 0.0493 * height, 0, 0, 1, 0.265 * width, 0.7746 * height);
    builder.arcTo(0.0407 * width, 0.0352 * height, 0, 0, 1, 0.2683 * width, 0.762 * height);
    builder.arcTo(0.0163 * width, 0.0141 * height, 0, 0, 1, 0.2829 * width, 0.757 * height);
    builder.lineTo(0.3228 * width, 0.7761 * height);
    builder.lineTo(0.3179 * width, 0.7831 * height);
    builder.lineTo(0.2878 * width, 0.7683 * height);
    builder.arcTo(0.0081 * width, 0.007 * height, 0, 0, 0, 0.2789 * width, 0.7697 * height);
    builder.arcTo(0.0244 * width, 0.0211 * height, 0, 0, 0, 0.2748 * width, 0.7831 * height);
    builder.arcTo(0.0407 * width, 0.0352 * height, 0, 0, 0, 0.2878 * width, 0.8042 * height);
    builder.close();
    builder.moveTo(0.3276 * width, 0.7789 * height);
    builder.lineTo(0.3366 * width, 0.7831 * height);
    builder.lineTo(0.3366 * width, 0.8289 * height);
    builder.lineTo(0.3805 * width, 0.8507 * height);
    builder.lineTo(0.3748 * width, 0.857 * height);
    builder.lineTo(0.3317 * width, 0.8359 * height);
    builder.arcTo(0.0163 * width, 0.0141 * height, 0, 0, 1, 0.3276 * width, 0.8275 * height);
    builder.close();
    builder.moveTo(0.435 * width, 0.8775 * height);
    builder.lineTo(0.4325 * width, 0.8866 * height);
    builder.lineTo(0.3959 * width, 0.8683 * height);
    builder.arcTo(0.0407 * width, 0.0352 * height, 0, 0, 1, 0.3862 * width, 0.8563 * height);
    builder.arcTo(0.0528 * width, 0.0458 * height, 0, 0, 1, 0.3805 * width, 0.8183 * height);
    builder.arcTo(0.0163 * width, 0.0141 * height, 0, 0, 1, 0.3951 * width, 0.8134 * height);
    builder.lineTo(0.435 * width, 0.8324 * height);
    builder.lineTo(0.4285 * width, 0.838 * height);
    builder.lineTo(0.4008 * width, 0.8246 * height);
    builder.arcTo(0.0098 * width, 0.0085 * height, 0, 0, 0, 0.3878 * width, 0.831 * height);
    builder.lineTo(0.4333 * width, 0.8542 * height);
    builder.lineTo(0.426 * width, 0.8606 * height);
    builder.lineTo(0.3878 * width, 0.8415 * height);
    builder.arcTo(0.0325 * width, 0.0282 * height, 0, 0, 0, 0.3976 * width, 0.8585 * height);
    builder.close();
    builder.moveTo(0.6171 * width, 0.8063 * height);
    builder.arcTo(0.0163 * width, 0.0141 * height, 0, 0, 1, 0.6366 * width, 0.8092 * height);
    builder.arcTo(0.0325 * width, 0.0282 * height, 0, 0, 1, 0.639 * width, 0.8303 * height);
    builder.arcTo(0.065 * width, 0.0563 * height, 0, 0, 1, 0.6211 * width, 0.8592 * height);
    builder.lineTo(0.5894 * width, 0.8761 * height);
    builder.arcTo(0.0203 * width, 0.0176 * height, 0, 0, 1, 0.565 * width, 0.8732 * height);
    builder.arcTo(0.0407 * width, 0.0352 * height, 0, 0, 1, 0.5659 * width, 0.8458 * height);
    builder.arcTo(0.0488 * width, 0.0422 * height, 0, 0, 1, 0.5805 * width, 0.8246 * height);
    builder.close();
    builder.moveTo(0.5886 * width, 0.8296 * height);
    builder.arcTo(0.0325 * width, 0.0282 * height, 0, 0, 0, 0.5748 * width, 0.8472 * height);
    builder.arcTo(0.0325 * width, 0.0282 * height, 0, 0, 0, 0.574 * width, 0.862 * height);
    builder.arcTo(0.0098 * width, 0.0085 * height, 0, 0, 0, 0.587 * width, 0.8676 * height);
    builder.lineTo(0.6163 * width, 0.8528 * height);
    builder.arcTo(0.0407 * width, 0.0352 * height, 0, 0, 0, 0.6285 * width, 0.8359 * height);
    builder.arcTo(0.0244 * width, 0.0211 * height, 0, 0, 0, 0.6293 * width, 0.8225 * height);
    builder.arcTo(0.0098 * width, 0.0085 * height, 0, 0, 0, 0.6163 * width, 0.8155 * height);
    builder.close();
    builder.moveTo(0.64 * width, 0.85 * height);
    builder.lineTo(0.64 * width, 0.793 * height);
    builder.lineTo(0.6854 * width, 0.7718 * height);
    builder.arcTo(0.0106 * width, 0.0092 * height, 0, 0, 1, 0.7008 * width, 0.7782 * height);
    builder.arcTo(0.0407 * width, 0.0352 * height, 0, 0, 1, 0.6959 * width, 0.8 * height);
    builder.arcTo(0.0407 * width, 0.0352 * height, 0, 0, 1, 0.6805 * width, 0.8127 * height);
    builder.lineTo(0.6992 * width, 0.8218 * height);
    builder.lineTo(0.6854 * width, 0.8282 * height);
    builder.lineTo(0.6569 * width, 0.8141 * height);
    builder.lineTo(0.6805 * width, 0.8021 * height);
    builder.arcTo(0.0203 * width, 0.0176 * height, 0, 0, 0, 0.6894 * width, 0.7923 * height);
    builder.arcTo(0.0244 * width, 0.0211 * height, 0, 0, 0, 0.6894 * width, 0.7845 * height);
    builder.arcTo(0.0041 * width, 0.0035 * height, 0, 0, 0, 0.6837 * width, 0.7831 * height);
    builder.lineTo(0.6528 * width, 0.7979 * height);
    builder.lineTo(0.6528 * width, 0.8437 * height);
    builder.close();
    builder.moveTo(0.7 * width, 0.8204 * height);
    builder.lineTo(0.7301 * width, 0.7507 * height);
    builder.arcTo(0.0098 * width, 0.0085 * height, 0, 0, 1, 0.7358 * width, 0.7444 * height);
    builder.arcTo(0.0098 * width, 0.0085 * height, 0, 0, 1, 0.7415 * width, 0.7486 * height);
    builder.lineTo(0.7699 * width, 0.7852 * height);
    builder.lineTo(0.7602 * width, 0.7908 * height);
    builder.lineTo(0.7537 * width, 0.7838 * height);
    builder.lineTo(0.7276 * width, 0.7958 * height);
    builder.lineTo(0.7228 * width, 0.788 * height);
    builder.lineTo(0.748 * width, 0.7768 * height);
    builder.lineTo(0.7358 * width, 0.7585 * height);
    builder.lineTo(0.7114 * width, 0.8155 * height);
    builder.close();
    builder.moveTo(0.8244 * width, 0.7486 * height);
    builder.lineTo(0.8171 * width, 0.762 * height);
    builder.lineTo(0.7894 * width, 0.7761 * height);
    builder.arcTo(0.0244 * width, 0.0211 * height, 0, 0, 1, 0.7683 * width, 0.7746 * height);
    builder.arcTo(0.0407 * width, 0.0352 * height, 0, 0, 1, 0.7667 * width, 0.7507 * height);
    builder.arcTo(0.0488 * width, 0.0423 * height, 0, 0, 1, 0.7937 * width, 0.7162 * height);
    builder.lineTo(0.822 * width, 0.7035 * height);
    builder.lineTo(0.8171 * width, 0.7155 * height);
    builder.lineTo(0.7902 * width, 0.7296 * height);
    builder.arcTo(0.0325 * width, 0.0282 * height, 0, 0, 0, 0.778 * width, 0.743 * height);
    builder.arcTo(0.0407 * width, 0.0352 * height, 0, 0, 0, 0.7756 * width, 0.7606 * height);
    builder.arcTo(0.0077 * width, 0.0067 * height, 0, 0, 0, 0.787 * width, 0.767 * height);
    builder.close();
    builder.moveTo(0.8366 * width, 0.6949 * height);
    builder.lineTo(0.8366 * width, 0.7423 * height);
    builder.lineTo(0.878 * width, 0.7231 * height);
    builder.lineTo(0.874 * width, 0.7338 * height);
    builder.lineTo(0.8333 * width, 0.7535 * height);
    builder.arcTo(0.0041 * width, 0.0035 * height, 0, 0, 1, 0.8268 * width, 0.75 * height);
    builder.lineTo(0.8268 * width, 0.7007 * height);
    builder.close();
    builder.moveTo(0.9342 * width, 0.6472 * height);
    builder.lineTo(0.9293 * width, 0.6599 * height);
    builder.lineTo(0.9033 * width, 0.6725 * height);
    builder.arcTo(0.0325 * width, 0.0282 * height, 0, 0, 0, 0.8927 * width, 0.6817 * height);
    builder.arcTo(0.0406 * width, 0.0352 * height, 0, 0, 0, 0.887 * width, 0.6937 * height);
    builder.lineTo(0.9309 * width, 0.6725 * height);
    builder.lineTo(0.9268 * width, 0.6845 * height);
    builder.lineTo(0.887 * width, 0.7035 * height);
    builder.arcTo(0.0089 * width, 0.0077 * height, 0, 0, 0, 0.8992 * width, 0.7106 * height);
    builder.lineTo(0.935 * width, 0.693 * height);
    builder.lineTo(0.9285 * width, 0.7063 * height);
    builder.lineTo(0.9008 * width, 0.7197 * height);
    builder.arcTo(0.0163 * width, 0.0141 * height, 0, 0, 1, 0.8829 * width, 0.7204 * height);
    builder.arcTo(0.0407 * width, 0.0352 * height, 0, 0, 1, 0.8764 * width, 0.7028 * height);
    builder.arcTo(0.065 * width, 0.0563 * height, 0, 0, 1, 0.8959 * width, 0.6669 * height);
    builder.fill();
    builder.restore();
    builder.setShadow(!1);
    builder.setLineJoin('round');
    builder.begin();
    builder.moveTo(0, 0.7464 * height);
    builder.lineTo(0, 0.25 * height);
    builder.lineTo(0.5 * width, 0.5 * height);
    builder.lineTo(0.5 * width, height);
    builder.close();
    builder.stroke();
    builder.begin();
    builder.moveTo(0.5 * width, 0.5 * height);
    builder.lineTo(width, 0.25 * height);
    builder.lineTo(width, 0.7464 * height);
    builder.lineTo(0.5 * width, height);
    builder.close();
    builder.stroke();
    builder.setStrokeWidth(2 * extra1);
    builder.setStrokeColor(extra2 as string);
    builder.setLineJoin('round');
    builder.begin();
    builder.moveTo(0, 0.7464 * height);
    builder.lineTo(0, 0.25 * height);
    builder.lineTo(0.5 * width, 0);
    builder.lineTo(width, 0.25 * height);
    builder.lineTo(width, 0.7464 * height);
    builder.lineTo(0.5 * width, height);
    builder.close();
    builder.stroke();
    builder.restore();
    builder.setShadow(!1);
    builder.setStrokeWidth(3 * extra1);
    builder.setLineCap('round');
    builder.begin();
    builder.moveTo(0.0894 * width, 0.3838 * height);
    builder.lineTo(0.4187 * width, 0.5493 * height);
    builder.moveTo(0.0894 * width, 0.4331 * height);
    builder.lineTo(0.4187 * width, 0.5986 * height);
    builder.moveTo(0.0894 * width, 0.4824 * height);
    builder.lineTo(0.4187 * width, 0.6479 * height);
    builder.moveTo(0.5854 * width, 0.5492 * height);
    builder.lineTo(0.9146 * width, 0.3838 * height);
    builder.moveTo(0.5854 * width, 0.5986 * height);
    builder.lineTo(0.9146 * width, 0.4331 * height);
    builder.moveTo(0.5854 * width, 0.6479 * height);
    builder.lineTo(0.9146 * width, 0.4824 * height);
    builder.stroke();
  }
}
