// @ts-nocheck
import type { RenderContext, ShapeAttrs } from '../../../renderer.ts';
import { BaseShapeHandler } from '../../shape-registry.ts';

export class IosICallDialogHandler extends BaseShapeHandler {
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

    builder.translate(x, y);
    this.renderBackground(
      builder,
      x,
      y,
      width,
      height,
      style,
      getStencilSvg,
      renderStencilShape,
      5
    );
    builder.setShadow(!1);
    this.renderForeground(
      builder,
      x,
      y,
      width,
      height,
      style,
      getStencilSvg,
      renderStencilShape,
      5
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
    extra1?: any
  ): void {
    if (!builder) return;
    builder.setAlpha(0.8);
    builder.setStrokeColor('#888888' as string);
    builder.setStrokeWidth(1.5);
    builder.setFillColor('#000000' as string);
    builder.roundrect(0, 0, width, height, extra1, extra1);
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
    extra1?: any
  ): void {
    if (!builder) return;
    builder.begin();
    builder.moveTo(0.33 * width, 0);
    builder.lineTo(0.33 * width, height);
    builder.moveTo(0.67 * width, 0);
    builder.lineTo(0.67 * width, height);
    builder.moveTo(0, 0.5 * height);
    builder.lineTo(width, 0.5 * height);
    builder.stroke();
    builder.setStrokeColor('#000000' as string);
    builder.setFillColor('#ffffff' as string);
    builder.setStrokeWidth(0.5);
    builder.roundrect(
      0.1433 * width,
      0.104 * height,
      0.0417 * width,
      0.148 * height,
      0.02 * width,
      0.024 * height
    );
    builder.fill();
    builder.begin();
    builder.moveTo(0.14 * width, 0.188 * height);
    builder.lineTo(0.14 * width, 0.228 * height);
    builder.arcTo(0.025 * width, 0.03 * height, 0, 0, 0, 0.19 * width, 0.228 * height);
    builder.lineTo(0.19 * width, 0.188 * height);
    builder.lineTo(0.2 * width, 0.188 * height);
    builder.lineTo(0.2 * width, 0.228 * height);
    builder.arcTo(0.0367 * width, 0.044 * height, 0, 0, 1, 0.17 * width, 0.27 * height);
    builder.lineTo(0.17 * width, 0.296 * height);
    builder.lineTo(0.195 * width, 0.296 * height);
    builder.lineTo(0.195 * width, 0.308 * height);
    builder.lineTo(0.1367 * width, 0.308 * height);
    builder.lineTo(0.1367 * width, 0.296 * height);
    builder.lineTo(0.16 * width, 0.296 * height);
    builder.lineTo(0.16 * width, 0.27 * height);
    builder.arcTo(0.0367 * width, 0.044 * height, 0, 0, 1, 0.13 * width, 0.228 * height);
    builder.lineTo(0.13 * width, 0.188 * height);
    builder.close();
    builder.fillAndStroke();
    builder.begin();
    builder.moveTo(0.1033 * width, 0.108 * height);
    builder.lineTo(0.24 * width, 0.286 * height);
    builder.lineTo(0.2317 * width, 0.298 * height);
    builder.lineTo(0.095 * width, 0.12 * height);
    builder.close();
    builder.fillAndStroke();
    builder.rect(0.44 * width, 0.128 * height, 0.033 * width, 0.04 * height);
    builder.fill();
    builder.rect(0.485 * width, 0.128 * height, 0.033 * width, 0.04 * height);
    builder.fill();
    builder.rect(0.53 * width, 0.128 * height, 0.033 * width, 0.04 * height);
    builder.fill();
    builder.rect(0.44 * width, 0.186 * height, 0.033 * width, 0.04 * height);
    builder.fill();
    builder.rect(0.485 * width, 0.186 * height, 0.033 * width, 0.04 * height);
    builder.fill();
    builder.rect(0.53 * width, 0.186 * height, 0.033 * width, 0.04 * height);
    builder.fill();
    builder.rect(0.44 * width, 0.244 * height, 0.033 * width, 0.04 * height);
    builder.fill();
    builder.rect(0.485 * width, 0.244 * height, 0.033 * width, 0.04 * height);
    builder.fill();
    builder.rect(0.53 * width, 0.244 * height, 0.033 * width, 0.04 * height);
    builder.fill();
    builder.begin();
    builder.moveTo(0.7567 * width, 0.18 * height);
    builder.lineTo(0.785 * width, 0.18 * height);
    builder.lineTo(0.825 * width, 0.128 * height);
    builder.lineTo(0.825 * width, 0.28 * height);
    builder.lineTo(0.79 * width, 0.234 * height);
    builder.lineTo(0.7567 * width, 0.234 * height);
    builder.close();
    builder.fill();
    builder.setStrokeWidth(1.5);
    builder.setStrokeColor('#ffffff' as string);
    builder.begin();
    builder.moveTo(0.8383 * width, 0.16 * height);
    builder.arcTo(0.0533 * width, 0.064 * height, 0, 0, 1, 0.8383 * width, 0.252 * height);
    builder.moveTo(0.8583 * width, 0.134 * height);
    builder.arcTo(0.0817 * width, 0.098 * height, 0, 0, 1, 0.8583 * width, 0.276 * height);
    builder.moveTo(0.8767 * width, 0.11 * height);
    builder.arcTo(0.1133 * width, 0.136 * height, 0, 0, 1, 0.8767 * width, 0.304 * height);
    builder.stroke();
    builder.begin();
    builder.moveTo(0.1467 * width, 0.62 * height);
    builder.lineTo(0.1833 * width, 0.62 * height);
    builder.lineTo(0.1833 * width, 0.676 * height);
    builder.lineTo(0.2267 * width, 0.676 * height);
    builder.lineTo(0.2267 * width, 0.724 * height);
    builder.lineTo(0.1833 * width, 0.724 * height);
    builder.lineTo(0.1833 * width, 0.78 * height);
    builder.lineTo(0.1467 * width, 0.78 * height);
    builder.lineTo(0.1467 * width, 0.724 * height);
    builder.lineTo(0.105 * width, 0.724 * height);
    builder.lineTo(0.105 * width, 0.676 * height);
    builder.lineTo(0.1467 * width, 0.676 * height);
    builder.close();
    builder.fill();
    builder.rect(0.4517 * width, 0.624 * height, 0.0333 * width, 0.152 * height);
    builder.fill();
    builder.rect(0.5183 * width, 0.624 * height, 0.0333 * width, 0.152 * height);
    builder.fill();
    builder.begin();
    builder.moveTo(0.76 * width, 0.752 * height);
    builder.arcTo(0.1 * width, 0.12 * height, 0, 0, 1, 0.8033 * width, 0.728 * height);
    builder.arcTo(0.0167 * width, 0.02 * height, 0, 0, 0, 0.8167 * width, 0.712 * height);
    builder.lineTo(0.8175 * width, 0.7 * height);
    builder.arcTo(0.0267 * width, 0.06 * height, 0, 0, 1, 0.8067 * width, 0.644 * height);
    builder.arcTo(0.0287 * width, 0.0344 * height, 0, 0, 1, 0.8633 * width, 0.644 * height);
    builder.arcTo(0.0267 * width, 0.06 * height, 0, 0, 1, 0.855 * width, 0.7 * height);
    builder.arcTo(0.05 * width, 0.724 * height, 0, 0, 1, 0.8633 * width, 0.724 * height);
    builder.arcTo(0.1667 * width, 0.75 * height, 0, 0, 1, 0.9083 * width, 0.75 * height);
    builder.lineTo(0.9083 * width, 0.78 * height);
    builder.lineTo(0.76 * width, 0.78 * height);
    builder.close();
    builder.fill();
    builder.setFontColor('#ffffff' as string);
    builder.setFontSize(Number.parseFloat(String(8.5)) || 0);
    builder.text(0.1667 * width, 0.35 * height, 0, 0, 'mute', 'center', 'middle', 0, 0, 0);
    builder.text(0.5 * width, 0.35 * height, 0, 0, 'keypad', 'center', 'middle', 0, 0, 0);
    builder.text(0.8333 * width, 0.35 * height, 0, 0, 'speaker', 'center', 'middle', 0, 0, 0);
    builder.text(0.1667 * width, 0.85 * height, 0, 0, 'add', 'center', 'middle', 0, 0, 0);
    builder.text(0.5 * width, 0.85 * height, 0, 0, 'pause', 'center', 'middle', 0, 0, 0);
    builder.text(0.8333 * width, 0.85 * height, 0, 0, 'contacts', 'center', 'middle', 0, 0, 0);
    builder.setGradient('#808080', '#ffffff', 0, 0, width, 0.308 * height, 'north', 1, 1);
    builder.setAlpha(0.4);
    builder.begin();
    builder.moveTo(0, 0.308 * height);
    builder.lineTo(0, extra1);
    builder.arcTo(extra1, extra1, 0, 0, 1, extra1, 0);
    builder.lineTo(width - extra1, 0);
    builder.arcTo(extra1, extra1, 0, 0, 1, width, extra1);
    builder.lineTo(width, 0.308 * height);
    builder.arcTo(1.5 * width, 1.8 * height, 0, 0, 1, 0, 0.308 * height);
    builder.close();
    builder.fill();
  }
}
