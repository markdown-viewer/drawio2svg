import type { MxStyle } from '../parser.ts';
import type { SvgBuilder } from '../svg/index.ts';

export interface RectBounds {
  x: number;
  y: number;
  width: number;
  height: number;
}

export function applyArrow2Swap(rect: RectBounds): RectBounds {
  return rect;
}

export function computePaintBounds(rect: RectBounds, style: MxStyle): RectBounds {
  const direction = style.direction as string;
  if (direction === 'north' || direction === 'south') {
    const t = (rect.width - rect.height) / 2;
    return {
      x: rect.x + t,
      y: rect.y - t,
      width: rect.height,
      height: rect.width
    };
  }

  return rect;
}

export function createCellGroup(
  builder: SvgBuilder,
  dataCellId: string | undefined,
  styleShape: string | undefined,
  pushGroup: (g: Element) => void
): Element {
  const cellGroup = builder.createGroup();
  if (dataCellId) {
    cellGroup.setAttribute('data-cell-id', dataCellId);
  }
  if (styleShape) {
    cellGroup.setAttribute('data-shape', String(styleShape));
  }
  pushGroup(cellGroup);
  return cellGroup;
}

export function createGeometryGroup(
  builder: SvgBuilder,
  useCrispTranslate: boolean,
  pushGroup: (g: Element) => void
): Element | null {
  if (!useCrispTranslate) {
    return null;
  }
  const geometryGroup = builder.createGroup();
  geometryGroup.setAttribute('data-geometry', '1');
  geometryGroup.setAttribute('transform', 'translate(0.5,0.5)');
  pushGroup(geometryGroup);
  return geometryGroup;
}
