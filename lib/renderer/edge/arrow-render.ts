import type { Point } from '../../edge-router.ts';

export interface ArrowPathResult {
  element?: Element | null;
  lineOffset: number;
}

export interface EdgeArrowRenderParams {
  startPoint: Point;
  endPoint: Point;
  startAngle: number;
  endAngle: number;
  startArrow: string | undefined;
  endArrow: string | undefined;
  startSize: number;
  endSize: number;
  startFill: boolean;
  endFill: boolean;
  strokeColor: string;
  strokeWidth: number;
  isCommLinkEdge: boolean;
  createArrowPath: (
    x: number,
    y: number,
    angle: number,
    arrow: string,
    size: number,
    fill: boolean,
    strokeColor: string,
    strokeWidth: number
  ) => ArrowPathResult | null;
}

export interface EdgeArrowRenderResult {
  arrowElements: Element[];
  lineStart: Point;
  lineEnd: Point;
}

export function applyEdgeArrows(params: EdgeArrowRenderParams): EdgeArrowRenderResult {
  const {
    startPoint,
    endPoint,
    startAngle,
    endAngle,
    startArrow,
    endArrow,
    startSize,
    endSize,
    startFill,
    endFill,
    strokeColor,
    strokeWidth,
    isCommLinkEdge,
    createArrowPath,
  } = params;

  const arrowElements: Element[] = [];
  let lineStartX = startPoint.x;
  let lineStartY = startPoint.y;
  let lineEndX = endPoint.x;
  let lineEndY = endPoint.y;

  if (!isCommLinkEdge) {
    if (startArrow && startArrow !== 'none') {
      const arrow = createArrowPath(
        startPoint.x,
        startPoint.y,
        startAngle + Math.PI,
        startArrow,
        startSize,
        startFill,
        strokeColor,
        strokeWidth
      );
      if (arrow) {
        if (arrow.element) arrowElements.push(arrow.element);
        lineStartX = startPoint.x + arrow.lineOffset * Math.cos(startAngle);
        lineStartY = startPoint.y + arrow.lineOffset * Math.sin(startAngle);
      }
    }

    if (endArrow && endArrow !== 'none') {
      const arrow = createArrowPath(
        endPoint.x,
        endPoint.y,
        endAngle,
        endArrow,
        endSize,
        endFill,
        strokeColor,
        strokeWidth
      );
      if (arrow) {
        if (arrow.element) arrowElements.push(arrow.element);
        lineEndX = endPoint.x - arrow.lineOffset * Math.cos(endAngle);
        lineEndY = endPoint.y - arrow.lineOffset * Math.sin(endAngle);
      }
    }
  }

  return {
    arrowElements,
    lineStart: { x: lineStartX, y: lineStartY },
    lineEnd: { x: lineEndX, y: lineEndY },
  };
}
