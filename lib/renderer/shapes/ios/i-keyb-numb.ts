// @ts-nocheck
import type { RenderContext, ShapeAttrs } from '../../../renderer.ts';
import { BaseShapeHandler } from '../../shape-registry.ts';

export class IosIKeybNumbHandler extends BaseShapeHandler {
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
    this.renderBackground(builder, x, y, width, height, style, getStencilShape, renderStencilShape);
    builder.setShadow(!0);
    this.renderForeground(builder, x, y, width, height, style, getStencilShape, renderStencilShape);
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
    getStencilShape?: RenderContext['getStencilShape'],
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
    builder.text(0.0474 * width, 0.125 * height, 0, 0, '1', 'center', 'middle', 0, 0, 0);
    builder.roundrect(0.1092 * width, 0.03 * height, 0.0776 * width, 0.19 * height, rSizeX, rSizeY);
    builder.fill();
    builder.text(0.148 * width, 0.125 * height, 0, 0, '2', 'center', 'middle', 0, 0, 0);
    builder.roundrect(0.2098 * width, 0.03 * height, 0.0776 * width, 0.19 * height, rSizeX, rSizeY);
    builder.fill();
    builder.text(0.2486 * width, 0.125 * height, 0, 0, '3', 'center', 'middle', 0, 0, 0);
    builder.roundrect(0.3103 * width, 0.03 * height, 0.0776 * width, 0.19 * height, rSizeX, rSizeY);
    builder.fill();
    builder.text(0.3491 * width, 0.125 * height, 0, 0, '4', 'center', 'middle', 0, 0, 0);
    builder.roundrect(0.4109 * width, 0.03 * height, 0.0776 * width, 0.19 * height, rSizeX, rSizeY);
    builder.fill();
    builder.text(0.4497 * width, 0.125 * height, 0, 0, '5', 'center', 'middle', 0, 0, 0);
    builder.roundrect(0.5115 * width, 0.03 * height, 0.0776 * width, 0.19 * height, rSizeX, rSizeY);
    builder.fill();
    builder.text(0.5503 * width, 0.125 * height, 0, 0, '6', 'center', 'middle', 0, 0, 0);
    builder.roundrect(0.6121 * width, 0.03 * height, 0.0776 * width, 0.19 * height, rSizeX, rSizeY);
    builder.fill();
    builder.text(0.6509 * width, 0.125 * height, 0, 0, '7', 'center', 'middle', 0, 0, 0);
    builder.roundrect(0.7126 * width, 0.03 * height, 0.0776 * width, 0.19 * height, rSizeX, rSizeY);
    builder.fill();
    builder.text(0.7514 * width, 0.125 * height, 0, 0, '8', 'center', 'middle', 0, 0, 0);
    builder.roundrect(0.8132 * width, 0.03 * height, 0.0776 * width, 0.19 * height, rSizeX, rSizeY);
    builder.fill();
    builder.text(0.852 * width, 0.125 * height, 0, 0, '9', 'center', 'middle', 0, 0, 0);
    builder.roundrect(0.9138 * width, 0.03 * height, 0.0776 * width, 0.19 * height, rSizeX, rSizeY);
    builder.fill();
    builder.text(0.9526 * width, 0.125 * height, 0, 0, '0', 'center', 'middle', 0, 0, 0);
    builder.roundrect(0.0086 * width, 0.28 * height, 0.0776 * width, 0.19 * height, rSizeX, rSizeY);
    builder.fill();
    builder.text(0.0474 * width, 0.375 * height, 0, 0, '-', 'center', 'middle', 0, 0, 0);
    builder.roundrect(0.1092 * width, 0.28 * height, 0.0776 * width, 0.19 * height, rSizeX, rSizeY);
    builder.fill();
    builder.text(0.148 * width, 0.375 * height, 0, 0, '/', 'center', 'middle', 0, 0, 0);
    builder.roundrect(0.2098 * width, 0.28 * height, 0.0776 * width, 0.19 * height, rSizeX, rSizeY);
    builder.fill();
    builder.text(0.2486 * width, 0.375 * height, 0, 0, ':', 'center', 'middle', 0, 0, 0);
    builder.roundrect(0.3103 * width, 0.28 * height, 0.0776 * width, 0.19 * height, rSizeX, rSizeY);
    builder.fill();
    builder.text(0.3491 * width, 0.375 * height, 0, 0, ';', 'center', 'middle', 0, 0, 0);
    builder.roundrect(0.4109 * width, 0.28 * height, 0.0776 * width, 0.19 * height, rSizeX, rSizeY);
    builder.fill();
    builder.text(0.4497 * width, 0.375 * height, 0, 0, '(', 'center', 'middle', 0, 0, 0);
    builder.roundrect(0.5115 * width, 0.28 * height, 0.0776 * width, 0.19 * height, rSizeX, rSizeY);
    builder.fill();
    builder.text(0.5503 * width, 0.375 * height, 0, 0, ')', 'center', 'middle', 0, 0, 0);
    builder.roundrect(0.6121 * width, 0.28 * height, 0.0776 * width, 0.19 * height, rSizeX, rSizeY);
    builder.fill();
    builder.text(0.6509 * width, 0.375 * height, 0, 0, '$', 'center', 'middle', 0, 0, 0);
    builder.roundrect(0.7126 * width, 0.28 * height, 0.0776 * width, 0.19 * height, rSizeX, rSizeY);
    builder.fill();
    builder.text(0.7514 * width, 0.375 * height, 0, 0, '&', 'center', 'middle', 0, 0, 0);
    builder.roundrect(0.8132 * width, 0.28 * height, 0.0776 * width, 0.19 * height, rSizeX, rSizeY);
    builder.fill();
    builder.text(0.852 * width, 0.375 * height, 0, 0, '@', 'center', 'middle', 0, 0, 0);
    builder.roundrect(0.9138 * width, 0.28 * height, 0.0776 * width, 0.19 * height, rSizeX, rSizeY);
    builder.fill();
    builder.text(0.9526 * width, 0.375 * height, 0, 0, '"', 'center', 'middle', 0, 0, 0);
    builder.roundrect(0.1638 * width, 0.53 * height, 0.1178 * width, 0.19 * height, rSizeX, rSizeY);
    builder.fill();
    builder.text(0.2227 * width, 0.625 * height, 0, 0, '.', 'center', 'middle', 0, 0, 0);
    builder.roundrect(0.3046 * width, 0.53 * height, 0.1178 * width, 0.19 * height, rSizeX, rSizeY);
    builder.fill();
    builder.text(0.3635 * width, 0.625 * height, 0, 0, ',', 'center', 'middle', 0, 0, 0);
    builder.roundrect(0.4454 * width, 0.53 * height, 0.1178 * width, 0.19 * height, rSizeX, rSizeY);
    builder.fill();
    builder.text(0.5043 * width, 0.625 * height, 0, 0, '?', 'center', 'middle', 0, 0, 0);
    builder.roundrect(0.5862 * width, 0.53 * height, 0.1178 * width, 0.19 * height, rSizeX, rSizeY);
    builder.fill();
    builder.text(0.6451 * width, 0.625 * height, 0, 0, '!', 'center', 'middle', 0, 0, 0);
    builder.roundrect(0.727 * width, 0.53 * height, 0.1178 * width, 0.19 * height, rSizeX, rSizeY);
    builder.fill();
    builder.text(0.7859 * width, 0.625 * height, 0, 0, "'", 'center', 'middle', 0, 0, 0);
    builder.roundrect(0.2644 * width, 0.78 * height, 0.4799 * width, 0.19 * height, rSizeX, rSizeY);
    builder.fill();
    builder.setFontColor('#666666' as string);
    builder.text(0.5043 * width, 0.875 * height, 0, 0, 'space', 'center', 'middle', 0, 0, 0);
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
    builder.setFontColor('#ffffff' as string);
    builder.roundrect(0.0115 * width, 0.53 * height, 0.1207 * width, 0.19 * height, rSizeX, rSizeY);
    builder.fill();
    builder.roundrect(0.8736 * width, 0.53 * height, 0.115 * width, 0.19 * height, rSizeX, rSizeY);
    builder.fill();
    builder.roundrect(0.0115 * width, 0.78 * height, 0.2299 * width, 0.19 * height, rSizeX, rSizeY);
    builder.fill();
    builder.roundrect(0.7672 * width, 0.78 * height, 0.2213 * width, 0.19 * height, rSizeX, rSizeY);
    builder.fill();
    builder.text(0.0718 * width, 0.625 * height, 0, 0, '#+=', 'center', 'middle', 0, 0, 0);
    builder.text(0.1264 * width, 0.875 * height, 0, 0, 'ABC', 'center', 'middle', 0, 0, 0);
    builder.text(0.8779 * width, 0.875 * height, 0, 0, 'return', 'center', 'middle', 0, 0, 0);
    builder.setShadow(!1);
    builder.setLineJoin('round');
    builder.setStrokeColor('#ffffff' as string);
    builder.setFillColor('#ffffff' as string);
    builder.setStrokeWidth(1.5);
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
