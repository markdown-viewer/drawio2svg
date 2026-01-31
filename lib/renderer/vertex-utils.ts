import type { MxGeometry, MxStyle } from '../parser.ts';
import type { SvgBuilder } from '../svg/index.ts';

export interface LinkWrapperContext {
  builder: SvgBuilder | null;
  currentGroup: Element | null;
  pushGroup: (g: Element) => void;
  popGroup: () => void;
}

export function isLineShape(style: MxStyle): boolean {
  return style.line === true || style.line === '1' || style.shape === 'line';
}

export function getLineStrokeWidth(
  lineShape: boolean,
  style: MxStyle,
  defaultStrokeWidth: number
): number {
  return lineShape && style.strokeWidth === undefined ? 4 : defaultStrokeWidth;
}

export function shouldSkipPlaceholderShape(
  geo: MxGeometry,
  hasValue: boolean,
  edgeChildLabel: boolean
): boolean {
  return (geo.width === 0 || geo.height === 0) && !hasValue && !edgeChildLabel;
}

export function isOverflowTextCell(style: MxStyle): boolean {
  return (style.text === true || style.text === '1') &&
    style.overflow === 'hidden' &&
    style.html !== '1' && style.html !== true &&
    style.whiteSpace !== 'wrap';
}

export function createLinkWrapper(
  ctx: LinkWrapperContext,
  link?: string
): { linkWrapper: Element | null; popLinkWrapper: () => void } {
  if (!ctx.builder || !ctx.currentGroup || !link) {
    return { linkWrapper: null, popLinkWrapper: () => undefined };
  }

  if (/^data:page\/id,/i.test(link)) {
    return { linkWrapper: null, popLinkWrapper: () => undefined };
  }

  const linkWrapper = ctx.builder.createElement('a');
  linkWrapper.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', link);
  ctx.currentGroup.appendChild(linkWrapper);
  ctx.pushGroup(linkWrapper);

  const popLinkWrapper = (): void => {
    ctx.popGroup();
  };

  return { linkWrapper, popLinkWrapper };
}
