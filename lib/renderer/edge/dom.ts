import type { Point } from '../../edge-router.ts';
import type { SvgBuilder } from '../../svg/index.ts';
import { buildCommLinkPath } from './comm-link.ts';

export interface EdgeDomContext {
  builder: SvgBuilder | null;
  shouldApplyCrispTranslate: (strokeWidth: number, strokeColor?: string, isTextShape?: boolean, isLineShape?: boolean) => boolean;
  pushGroup: (group: Element) => void;
  popGroup: () => void;
  getCurrentGroup: () => Element | null;
}

export interface EdgeDomParams {
  isCommLinkEdge: boolean;
  strokeColor: string;
  strokeWidth: number;
  dashed: boolean;
  dashPattern?: string;
  fillColor: string;
  hasShadow: boolean;
  pathD: string;
  startPoint: Point;
  endPoint: Point;
  arrowElements: Element[];
}

export interface EdgeDomResult {
  boundPointsOverride: Point[] | null;
}

export function renderEdgeDom(ctx: EdgeDomContext, params: EdgeDomParams): EdgeDomResult {
  const {
    isCommLinkEdge,
    strokeColor,
    strokeWidth,
    dashed,
    dashPattern,
    fillColor,
    hasShadow,
    pathD,
    startPoint,
    endPoint,
    arrowElements,
  } = params;

  if (!ctx.builder) {
    return { boundPointsOverride: null };
  }

  const currentGroup = ctx.getCurrentGroup();
  if (!currentGroup) {
    return { boundPointsOverride: null };
  }

  const useCrispTranslate = !isCommLinkEdge && ctx.shouldApplyCrispTranslate(strokeWidth, strokeColor, false, false);
  const shadowStyle = 'filter: drop-shadow(rgba(0, 0, 0, 0.25) 2px 3px 2px);';
  let shadowGroupPushed = false;
  if (hasShadow && !useCrispTranslate) {
    const shadowGroup = ctx.builder.createGroup();
    shadowGroup.setAttribute('style', shadowStyle);
    currentGroup.appendChild(shadowGroup);
    ctx.pushGroup(shadowGroup);
    shadowGroupPushed = true;
  }
  if (useCrispTranslate) {
    const geometryGroup = ctx.builder.createGroup();
    geometryGroup.setAttribute('transform', 'translate(0.5,0.5)');
    if (hasShadow) {
      geometryGroup.setAttribute('style', shadowStyle);
    }
    ctx.pushGroup(geometryGroup);
  }

  let boundPointsOverride: Point[] | null = null;

  if (isCommLinkEdge) {
    const { path: commPath, boundPoints } = buildCommLinkPath(startPoint, endPoint);

    const pathEl = ctx.builder.createPath(commPath);
    pathEl.setAttribute('fill', fillColor === 'none' ? 'none' : fillColor);
    pathEl.setAttribute('stroke', strokeColor === 'none' ? 'none' : strokeColor);
    pathEl.setAttribute('stroke-width', String(strokeWidth));
    const resolvedDashPattern = strokeColor !== 'none'
      ? (dashPattern || (dashed ? '3 3' : ''))
      : '';
    if (resolvedDashPattern) pathEl.setAttribute('stroke-dasharray', resolvedDashPattern);
    pathEl.setAttribute('stroke-miterlimit', '10');
    pathEl.setAttribute('pointer-events', 'all');
    ctx.getCurrentGroup()?.appendChild(pathEl);

    boundPointsOverride = boundPoints;
  } else {
    const pathEl = ctx.builder.createPath(pathD);
    pathEl.setAttribute('fill', 'none');
    pathEl.setAttribute('stroke', strokeColor === 'none' ? 'none' : strokeColor);
    pathEl.setAttribute('stroke-width', String(strokeWidth));
    const resolvedDashPattern = strokeColor !== 'none'
      ? (dashPattern || (dashed ? '3 3' : ''))
      : '';
    if (resolvedDashPattern) pathEl.setAttribute('stroke-dasharray', resolvedDashPattern);
    pathEl.setAttribute('stroke-miterlimit', '10');
    pathEl.setAttribute('pointer-events', 'stroke');
    ctx.getCurrentGroup()?.appendChild(pathEl);

    for (const arrowEl of arrowElements) {
      ctx.getCurrentGroup()?.appendChild(arrowEl);
    }
  }

  if (useCrispTranslate) {
    ctx.popGroup();
  }
  if (shadowGroupPushed) {
    ctx.popGroup();
  }

  return { boundPointsOverride };
}
