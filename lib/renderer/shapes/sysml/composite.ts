import type { RenderContext, ShapeAttrs } from '../../../renderer.ts';
import { RectangleShapeHandler } from '../../shape-registry.ts';
import { RectangleHandler } from '../core/rectangle.ts';
import { FolderHandler } from '../misc/folder.ts';

export class SysmlCompositeHandler extends RectangleShapeHandler {
  constructor(renderCtx: RenderContext) {
    super(renderCtx);
  }

  render(attrs: ShapeAttrs): void {
    const { builder, currentGroup, x, y, width, height, style, getStencilSvg, renderStencilShape } = this.renderCtx;
    if (!builder || !currentGroup) return;
    if (width <= 0 || height <= 0) return;

    const baseSymbol = this.getStyleValue(style, 'symbol0', 'rect');
    const baseDirection = this.getStyleValue(style, 'symbol0Direction', 'east');
    this.renderSymbol(
      baseSymbol,
      x,
      y,
      width,
      height,
      attrs,
      getStencilSvg,
      renderStencilShape,
      baseDirection
    );

    let counter = 1;
    while (true) {
      const symbol = this.getStyleValue(style, `symbol${counter}`, null);
      if (!symbol) break;

      const align = this.getStyleValue(style, `symbol${counter}Align`, 'left');
      const valign = this.getStyleValue(style, `symbol${counter}VerticalAlign`, 'top');
      const symbolWidth = this.getStyleNumber(style, `symbol${counter}Width`, 0);
      const symbolHeight = this.getStyleNumber(style, `symbol${counter}Height`, 0);
      const spacing = this.getStyleNumber(style, `symbol${counter}Spacing`, 0);
      const vspacing = this.getStyleNumber(style, `symbol${counter}VSpacing`, 0);
      const direction = this.getStyleValue(style, `symbol${counter}Direction`, 'east');

      if (symbolWidth <= 0 || symbolHeight <= 0) {
        counter += 1;
        continue;
      }

      let x2 = x;
      let y2 = y;

      if (align === 'center') {
        x2 += (width - symbolWidth) / 2;
      } else if (align === 'right') {
        x2 += width - symbolWidth - spacing;
      } else {
        x2 += spacing;
      }

      if (valign === 'middle') {
        y2 += (height - symbolHeight) / 2;
      } else if (valign === 'bottom') {
        y2 += height - symbolHeight - vspacing;
      } else {
        y2 += vspacing;
      }

      this.renderSymbol(
        symbol,
        x2,
        y2,
        symbolWidth,
        symbolHeight,
        attrs,
        getStencilSvg,
        renderStencilShape,
        direction
      );
      counter += 1;
    }
  }

  private renderSymbol(
    symbol: string,
    x: number,
    y: number,
    width: number,
    height: number,
    attrs: ShapeAttrs,
    getStencilSvg?: RenderContext['getStencilSvg'],
    renderStencilShape?: RenderContext['renderStencilShape'],
    direction: string = 'east'
  ): void {
    const normalized = String(symbol || '').trim();
    if (!normalized) return;

    if (normalized.startsWith('mxgraph.') && getStencilSvg && renderStencilShape) {
      const stencilStyle = {
        shape: normalized,
        fillColor: attrs.fillColor === 'none' ? '#ffffff' : attrs.fillColor,
        strokeColor: attrs.strokeColor === 'none' ? '#000000' : attrs.strokeColor,
        aspect: 'fixed',
      } as any;
      const svg = getStencilSvg(stencilStyle);
      if (svg) {
        renderStencilShape({ x, y, width, height, style: stencilStyle }, svg);
        return;
      }
    }

    if (normalized === 'folder') {
      new FolderHandler({ ...this.renderCtx, x, y, width, height }).render(attrs);
      return;
    }

    if (normalized === 'triangle') {
      const { builder, currentGroup, applyShapeAttrsToBuilder } = this.renderCtx;
      if (!builder || !currentGroup) return;
      builder.setCanvasRoot(currentGroup);
      builder.save();
      applyShapeAttrsToBuilder(builder, attrs);
      const cx = x + width / 2;
      const cy = y + height / 2;
      let rotation = 0;
      if (direction === 'north') rotation = -90;
      else if (direction === 'south') rotation = 90;
      else if (direction === 'west') rotation = 180;
      if (rotation !== 0) {
        builder.rotate(rotation, false, false, cx, cy);
      }
      builder.begin();
      builder.moveTo(x, y);
      builder.lineTo(x + width, y + height / 2);
      builder.lineTo(x, y + height);
      builder.close();
      builder.fillAndStroke();
      builder.restore();
      return;
    }

    if (normalized === 'ellipse' || normalized === 'circle') {
      const { builder, currentGroup, applyShapeAttrsToElement } = this.renderCtx;
      if (!builder || !currentGroup) return;
      const ellipse = builder.createEllipse(x + width / 2, y + height / 2, width / 2, height / 2);
      applyShapeAttrsToElement(ellipse, attrs);
      currentGroup.appendChild(ellipse);
      return;
    }

    new RectangleHandler({ ...this.renderCtx, x, y, width, height }).render(attrs);
  }
}