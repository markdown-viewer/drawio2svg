// @ts-nocheck
import type { RenderContext, ShapeAttrs } from '../../../renderer.ts';
import { BaseShapeHandler } from '../../shape-registry.ts';

export class IosIKeybLettHandler extends BaseShapeHandler {
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
    this.renderBackground(builder, x, y, width, height, style, getStencilSvg, renderStencilShape);
    builder.setShadow(!0);
    this.renderForeground(builder, x, y, width, height, style, getStencilSvg, renderStencilShape);
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
    renderStencilShape?: RenderContext['renderStencilShape']
  ): void {
    if (!builder) return;
    builder.setGradient('#8A97A7', '#425163', 0, 0, width, height, 'south', 1, 1);
    builder.rect(0, 0, width, height);
    builder.fill();
  }

  private renderForeground(
    builder: RenderContext['builder'],
    x: number,
    y: number,
    width: number,
    height: number,
    style: RenderContext['style'],
    getStencilSvg?: RenderContext['getStencilSvg'],
    renderStencilShape?: RenderContext['renderStencilShape']
  ): void {
    if (!builder) return;
    let rSizeX;
    let rSizeY;
    builder.setGradient(
      '#EEF3F9',
      '#DBE2E9',
      0.0086 * width,
      0.03 * height,
      0.0776 * width,
      0.19 * height,
      'south',
      1,
      1
    );
    rSizeX = 0.0144 * width;
    rSizeY = 0.025 * height;
    builder.setFontSize(Number.parseFloat(String(10.5)) || 0);
    builder.setFontColor('#000000' as string);
    builder.roundrect(0.0086 * width, 0.03 * height, 0.0776 * width, 0.19 * height, rSizeX, rSizeY);
    builder.fill();
    builder.text(0.0474 * width, 0.125 * height, 0, 0, 'Q', 'center', 'middle', 0, 0, 0);
    builder.roundrect(0.1092 * width, 0.03 * height, 0.0776 * width, 0.19 * height, rSizeX, rSizeY);
    builder.fill();
    builder.text(0.148 * width, 0.125 * height, 0, 0, 'W', 'center', 'middle', 0, 0, 0);
    builder.roundrect(0.2098 * width, 0.03 * height, 0.0776 * width, 0.19 * height, rSizeX, rSizeY);
    builder.fill();
    builder.text(0.2486 * width, 0.125 * height, 0, 0, 'E', 'center', 'middle', 0, 0, 0);
    builder.roundrect(0.3103 * width, 0.03 * height, 0.0776 * width, 0.19 * height, rSizeX, rSizeY);
    builder.fill();
    builder.text(0.3491 * width, 0.125 * height, 0, 0, 'R', 'center', 'middle', 0, 0, 0);
    builder.roundrect(0.4109 * width, 0.03 * height, 0.0776 * width, 0.19 * height, rSizeX, rSizeY);
    builder.fill();
    builder.text(0.4497 * width, 0.125 * height, 0, 0, 'T', 'center', 'middle', 0, 0, 0);
    builder.roundrect(0.5115 * width, 0.03 * height, 0.0776 * width, 0.19 * height, rSizeX, rSizeY);
    builder.fill();
    builder.text(0.5503 * width, 0.125 * height, 0, 0, 'Y', 'center', 'middle', 0, 0, 0);
    builder.roundrect(0.6121 * width, 0.03 * height, 0.0776 * width, 0.19 * height, rSizeX, rSizeY);
    builder.fill();
    builder.text(0.6509 * width, 0.125 * height, 0, 0, 'U', 'center', 'middle', 0, 0, 0);
    builder.roundrect(0.7126 * width, 0.03 * height, 0.0776 * width, 0.19 * height, rSizeX, rSizeY);
    builder.fill();
    builder.text(0.7514 * width, 0.125 * height, 0, 0, 'I', 'center', 'middle', 0, 0, 0);
    builder.roundrect(0.8132 * width, 0.03 * height, 0.0776 * width, 0.19 * height, rSizeX, rSizeY);
    builder.fill();
    builder.text(0.852 * width, 0.125 * height, 0, 0, 'O', 'center', 'middle', 0, 0, 0);
    builder.roundrect(0.9138 * width, 0.03 * height, 0.0776 * width, 0.19 * height, rSizeX, rSizeY);
    builder.fill();
    builder.text(0.9526 * width, 0.125 * height, 0, 0, 'P', 'center', 'middle', 0, 0, 0);
    builder.roundrect(0.0632 * width, 0.28 * height, 0.0776 * width, 0.19 * height, rSizeX, rSizeY);
    builder.fill();
    builder.text(0.102 * width, 0.375 * height, 0, 0, 'A', 'center', 'middle', 0, 0, 0);
    builder.roundrect(0.1638 * width, 0.28 * height, 0.0776 * width, 0.19 * height, rSizeX, rSizeY);
    builder.fill();
    builder.text(0.2026 * width, 0.375 * height, 0, 0, 'S', 'center', 'middle', 0, 0, 0);
    builder.roundrect(0.2644 * width, 0.28 * height, 0.0776 * width, 0.19 * height, rSizeX, rSizeY);
    builder.fill();
    builder.text(0.3032 * width, 0.375 * height, 0, 0, 'D', 'center', 'middle', 0, 0, 0);
    builder.roundrect(0.3649 * width, 0.28 * height, 0.0776 * width, 0.19 * height, rSizeX, rSizeY);
    builder.fill();
    builder.text(0.4037 * width, 0.375 * height, 0, 0, 'F', 'center', 'middle', 0, 0, 0);
    builder.roundrect(0.4655 * width, 0.28 * height, 0.0776 * width, 0.19 * height, rSizeX, rSizeY);
    builder.fill();
    builder.text(0.5043 * width, 0.375 * height, 0, 0, 'G', 'center', 'middle', 0, 0, 0);
    builder.roundrect(0.5661 * width, 0.28 * height, 0.0776 * width, 0.19 * height, rSizeX, rSizeY);
    builder.fill();
    builder.text(0.6049 * width, 0.375 * height, 0, 0, 'H', 'center', 'middle', 0, 0, 0);
    builder.roundrect(0.6667 * width, 0.28 * height, 0.0776 * width, 0.19 * height, rSizeX, rSizeY);
    builder.fill();
    builder.text(0.7055 * width, 0.375 * height, 0, 0, 'J', 'center', 'middle', 0, 0, 0);
    builder.roundrect(0.7672 * width, 0.28 * height, 0.0776 * width, 0.19 * height, rSizeX, rSizeY);
    builder.fill();
    builder.text(0.806 * width, 0.375 * height, 0, 0, 'K', 'center', 'middle', 0, 0, 0);
    builder.roundrect(0.8678 * width, 0.28 * height, 0.0776 * width, 0.19 * height, rSizeX, rSizeY);
    builder.fill();
    builder.text(0.9066 * width, 0.375 * height, 0, 0, 'L', 'center', 'middle', 0, 0, 0);
    builder.roundrect(0.1638 * width, 0.53 * height, 0.0776 * width, 0.19 * height, rSizeX, rSizeY);
    builder.fill();
    builder.text(0.2026 * width, 0.625 * height, 0, 0, 'Z', 'center', 'middle', 0, 0, 0);
    builder.roundrect(0.2644 * width, 0.53 * height, 0.0776 * width, 0.19 * height, rSizeX, rSizeY);
    builder.fill();
    builder.text(0.3032 * width, 0.625 * height, 0, 0, 'X', 'center', 'middle', 0, 0, 0);
    builder.roundrect(0.3649 * width, 0.53 * height, 0.0776 * width, 0.19 * height, rSizeX, rSizeY);
    builder.fill();
    builder.text(0.4037 * width, 0.625 * height, 0, 0, 'C', 'center', 'middle', 0, 0, 0);
    builder.roundrect(0.4655 * width, 0.53 * height, 0.0776 * width, 0.19 * height, rSizeX, rSizeY);
    builder.fill();
    builder.text(0.5043 * width, 0.625 * height, 0, 0, 'V', 'center', 'middle', 0, 0, 0);
    builder.roundrect(0.5661 * width, 0.53 * height, 0.0776 * width, 0.19 * height, rSizeX, rSizeY);
    builder.fill();
    builder.text(0.6049 * width, 0.625 * height, 0, 0, 'B', 'center', 'middle', 0, 0, 0);
    builder.roundrect(0.6667 * width, 0.53 * height, 0.0776 * width, 0.19 * height, rSizeX, rSizeY);
    builder.fill();
    builder.text(0.7055 * width, 0.625 * height, 0, 0, 'N', 'center', 'middle', 0, 0, 0);
    builder.roundrect(0.7672 * width, 0.53 * height, 0.0776 * width, 0.19 * height, rSizeX, rSizeY);
    builder.fill();
    builder.text(0.806 * width, 0.625 * height, 0, 0, 'M', 'center', 'middle', 0, 0, 0);
    builder.roundrect(0.2644 * width, 0.78 * height, 0.4799 * width, 0.19 * height, rSizeX, rSizeY);
    builder.fill();
    builder.setFontColor('#666666' as string);
    builder.text(0.5043 * width, 0.875 * height, 0, 0, 'space', 'center', 'middle', 0, 0, 0);
    builder.setFontColor('#ffffff' as string);
    builder.setGradient(
      '#8B98A8',
      '#677488',
      0.0115 * width,
      0.53 * height,
      0.1207 * width,
      0.19 * height,
      'south',
      1,
      1
    );
    builder.roundrect(0.0115 * width, 0.53 * height, 0.1207 * width, 0.19 * height, rSizeX, rSizeY);
    builder.fill();
    builder.setGradient(
      '#8B98A8',
      '#677488',
      0.8736 * width,
      0.53 * height,
      0.115 * width,
      0.19 * height,
      'south',
      1,
      1
    );
    builder.roundrect(0.8736 * width, 0.53 * height, 0.115 * width, 0.19 * height, rSizeX, rSizeY);
    builder.fill();
    builder.setGradient(
      '#8B98A8',
      '#677488',
      0.0115 * width,
      0.78 * height,
      0.2299 * width,
      0.19 * height,
      'south',
      1,
      1
    );
    builder.roundrect(0.0115 * width, 0.78 * height, 0.2299 * width, 0.19 * height, rSizeX, rSizeY);
    builder.fill();
    builder.setGradient(
      '#8B98A8',
      '#677488',
      0.7672 * width,
      0.78 * height,
      0.2213 * width,
      0.19 * height,
      'south',
      1,
      1
    );
    builder.roundrect(0.7672 * width, 0.78 * height, 0.2213 * width, 0.19 * height, rSizeX, rSizeY);
    builder.fill();
    builder.text(0.1264 * width, 0.875 * height, 0, 0, '.?123', 'center', 'middle', 0, 0, 0);
    builder.text(0.8779 * width, 0.875 * height, 0, 0, 'return', 'center', 'middle', 0, 0, 0);
    builder.setShadow(!1);
    builder.setLineJoin('round');
    builder.setStrokeColor('#ffffff' as string);
    builder.setFillColor('#ffffff' as string);
    builder.setStrokeWidth(1.5);
    builder.begin();
    builder.moveTo(0.0402 * width, 0.635 * height);
    builder.lineTo(0.0718 * width, 0.58 * height);
    builder.lineTo(0.1034 * width, 0.635 * height);
    builder.lineTo(0.0862 * width, 0.635 * height);
    builder.lineTo(0.0862 * width, 0.67 * height);
    builder.lineTo(0.0575 * width, 0.67 * height);
    builder.lineTo(0.0575 * width, 0.635 * height);
    builder.close();
    builder.stroke();
    builder.begin();
    builder.moveTo(0.9109 * width, 0.585 * height);
    builder.lineTo(0.9655 * width, 0.585 * height);
    builder.lineTo(0.9655 * width, 0.665 * height);
    builder.lineTo(0.9109 * width, 0.665 * height);
    builder.lineTo(0.8879 * width, 0.625 * height);
    builder.close();
    builder.fillAndStroke();
    builder.setStrokeColor('#677488' as string);
    builder.begin();
    builder.moveTo(0.9224 * width, 0.605 * height);
    builder.lineTo(0.9454 * width, 0.645 * height);
    builder.moveTo(0.9224 * width, 0.645 * height);
    builder.lineTo(0.9454 * width, 0.605 * height);
    builder.stroke();
  }
}
