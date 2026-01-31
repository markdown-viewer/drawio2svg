import type { RenderContext, ShapeAttrs } from '../../../renderer.ts';
import type { MxStyle } from '../../../parser.ts';
import { RectangleShapeHandler, type LabelOverrides } from '../../shape-registry.ts';

export class CubeHandler extends RectangleShapeHandler {
  constructor(renderCtx: RenderContext) {
    super(renderCtx);
  }

  private getCubeSize(style: MxStyle, width: number, height: number): { sizeX: number; sizeY: number } {
    const sizeValue = parseFloat(style.size as string);
    if (Number.isFinite(sizeValue)) {
      return {
        sizeX: Math.max(0, Math.min(sizeValue, width)),
        sizeY: Math.max(0, Math.min(sizeValue, height))
      };
    }

    return {
      sizeX: Math.min(20, width / 3),
      sizeY: Math.min(20, height / 3)
    };
  }

  getLabelOverrides(): LabelOverrides | null {
    return {
      getLabelBounds: (style: MxStyle, x: number, y: number, width: number, height: number) => {
        const { sizeX, sizeY } = this.getCubeSize(style, width, height);
        return {
          x: x + sizeX,
          y: y + sizeY,
          width: width - sizeX,
          height: height - sizeY
        };
      }
    };
  }

  render(attrs: ShapeAttrs): void {
    const { builder, currentGroup, applyShapeAttrsToElement, x, y, width, height, style } = this.renderCtx;
    if (!builder || !currentGroup) return;

    const { sizeX, sizeY } = this.getCubeSize(style, width, height);

    const left = x;
    const top = y;
    const right = x + width;
    const bottom = y + height;

    const hasGradient = typeof style.gradientColor === 'string' && style.gradientColor !== 'none';
    const useShading = hasGradient
      || style.backgroundOutline === '1'
      || style.darkOpacity !== undefined
      || style.darkOpacity2 !== undefined;

    const group = builder.createGroup();
    group.setAttribute('data-transform', 'group');
    currentGroup.appendChild(group);

    if (useShading) {
      const basePath = `M ${left} ${top} L ${left + sizeX} ${top} L ${right} ${top + sizeY} L ${right} ${bottom} L ${right - sizeX} ${bottom} L ${left} ${bottom - sizeY} Z`;
      const topShadePath = `M ${left} ${top} L ${left + sizeX} ${top} L ${right} ${top + sizeY} L ${right - sizeX} ${top + sizeY} Z`;
      const sideShadePath = `M ${left} ${top} L ${right - sizeX} ${top + sizeY} L ${right - sizeX} ${bottom} L ${left} ${bottom - sizeY} Z`;
      const outlinePath = `M ${right - sizeX} ${bottom} L ${right - sizeX} ${top + sizeY} L ${left} ${top} M ${right - sizeX} ${top + sizeY} L ${right} ${top + sizeY}`;

      const base = builder.createPath(basePath);
      applyShapeAttrsToElement(base, attrs);
      base.setAttribute('stroke', 'none');
      base.setAttribute('pointer-events', 'all');
      group.appendChild(base);

      const darkOpacityValue = parseFloat(style.darkOpacity as string);
      const darkOpacity = Number.isFinite(darkOpacityValue) ? darkOpacityValue : 0.05;
      const darkOpacity2Value = parseFloat(style.darkOpacity2 as string);
      const darkOpacity2 = Number.isFinite(darkOpacity2Value) ? darkOpacity2Value : 0.1;

      const topShade = builder.createPath(topShadePath);
      topShade.setAttribute('fill', '#000000');
      topShade.setAttribute('fill-opacity', String(darkOpacity));
      topShade.setAttribute('stroke', 'none');
      topShade.setAttribute('pointer-events', 'all');
      group.appendChild(topShade);

      const sideShade = builder.createPath(sideShadePath);
      sideShade.setAttribute('fill', '#000000');
      sideShade.setAttribute('fill-opacity', String(darkOpacity2));
      sideShade.setAttribute('stroke', 'none');
      sideShade.setAttribute('pointer-events', 'all');
      group.appendChild(sideShade);

      const outline = builder.createPath(outlinePath);
      outline.setAttribute('fill', 'none');
      outline.setAttribute('stroke', 'none');
      outline.setAttribute('pointer-events', 'all');
      group.appendChild(outline);
    } else {
      const basePath = `M ${left} ${top} L ${right - sizeX} ${top} L ${right} ${top + sizeY} L ${right} ${bottom} L ${left + sizeX} ${bottom} L ${left} ${bottom - sizeY} Z`;
      const outlinePath = `M ${left + sizeX} ${bottom} L ${left + sizeX} ${top + sizeY} L ${left} ${top} M ${left + sizeX} ${top + sizeY} L ${right} ${top + sizeY}`;

      const base = builder.createPath(basePath);
      applyShapeAttrsToElement(base, attrs);
      base.setAttribute('pointer-events', 'all');
      group.appendChild(base);

      const outline = builder.createPath(outlinePath);
      applyShapeAttrsToElement(outline, attrs);
      outline.setAttribute('fill', 'none');
      outline.setAttribute('pointer-events', 'all');
      group.appendChild(outline);
    }
  }
}
