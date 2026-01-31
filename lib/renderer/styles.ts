import type { MxCell, MxStyle } from '../parser.ts';
import type { ShapeAttrs } from '../renderer.ts';
import type { SvgBuilder } from '../svg/index.ts';
import { normalizeColor, normalizeColorId, getGradientDirectionKey } from './color.ts';

/**
 * Resolve special color value 'swimlane' to actual parent swimlane color
 * In the platform, fillColor=swimlane means inherit from parent swimlane's color
 */
export function resolveSwimlaneFillColor(
  style: MxStyle,
  cell: MxCell | null,
  cellMap: Map<string, MxCell> | null
): string {
  const fillColor = (style.fillColor as string) || '#ffffff';

  // Check if this is the special 'swimlane' value
  if (fillColor.toLowerCase() === 'swimlane' && cell && cellMap) {
    // Look up parent swimlane's color
    let parentId = cell.parent;
    while (parentId) {
      const parentCell = cellMap.get(parentId);
      if (parentCell && parentCell.style) {
        const parentFillColor = parentCell.style.fillColor as string;
        // Found a parent with a real fill color (not 'swimlane')
        if (parentFillColor && parentFillColor.toLowerCase() !== 'swimlane') {
          return parentFillColor;
        }
        // Continue to grandparent if parent also uses 'swimlane'
        parentId = parentCell.parent;
      } else {
        break;
      }
    }
    // Default to white if no parent color found
    return '#ffffff';
  }

  return fillColor;
}

function resolveInheritedFillColor(
  style: MxStyle,
  cell: MxCell | null,
  cellMap: Map<string, MxCell> | null
): string {
  const fillColor = (style.fillColor as string) || '';
  if (fillColor.toLowerCase() !== 'inherit' || !cell || !cellMap) {
    return fillColor;
  }
  let parentId = cell.parent;
  while (parentId) {
    const parentCell = cellMap.get(parentId);
    if (parentCell && parentCell.style) {
      const parentFillColor = (parentCell.style.fillColor as string) || '';
      const token = parentFillColor.toLowerCase();
      if (token && token !== 'inherit' && token !== 'default' && token !== 'swimlane') {
        return parentFillColor;
      }
      parentId = parentCell.parent;
      continue;
    }
    break;
  }
  return '#ffffff';
}

function resolveDashPattern(
  dashPattern: string | undefined,
  dashed: boolean,
  strokeWidth: number
): string | undefined {
  const rawPattern = typeof dashPattern === 'string' ? dashPattern.trim() : '';
  const basePattern = rawPattern && rawPattern !== 'none'
    ? rawPattern
    : (dashed ? '3 3' : '');
  if (!basePattern) return undefined;
  const tokens = basePattern.split(/[ ,]+/).filter((token) => token.length > 0);
  if (tokens.length === 0) return undefined;
  const scaledTokens = tokens.map((token) => {
    const value = parseFloat(token);
    if (!Number.isFinite(value)) return token;
    const scaled = value * strokeWidth;
    return Number.isFinite(scaled) ? String(scaled) : token;
  });
  return scaledTokens.join(' ');
}

/**
 * Parse common style attributes for shape rendering
 */
export function parseShapeAttrs(
  style: MxStyle,
  cell?: MxCell | null,
  cellMap?: Map<string, MxCell> | null
): ShapeAttrs {
  const fillStyle = typeof style.fillStyle === 'string' ? style.fillStyle.trim() : undefined;
  const rawFillColor = style.fillColor as string | undefined;
  const rawStrokeColor = style.strokeColor as string | undefined;
  const fillColorToken = typeof rawFillColor === 'string' ? rawFillColor.trim().toLowerCase() : '';
  const inheritedFill = resolveInheritedFillColor(style, cell || null, cellMap || null);
  const resolvedRawFillColor = fillColorToken === 'strokecolor'
    ? (rawStrokeColor || '#000000')
    : (fillColorToken === 'inherit' ? inheritedFill : rawFillColor);
  const isDefaultFill = rawFillColor === 'default' || fillColorToken === 'inherit';
  const normalizedFillColor = isDefaultFill ? undefined : resolvedRawFillColor;
  const normalizedStrokeColor = rawStrokeColor === 'default' || rawStrokeColor === 'inherit'
    ? undefined
    : rawStrokeColor;
  const isGroup = style.group === '1' || style.group === true;
  const isTextShape = style.text === true || style.text === '1' || style.shape === 'text';
  const effectiveFillColor = normalizedFillColor
    ?? (isGroup || isTextShape ? (isDefaultFill && isGroup ? '#ffffff' : 'none') : '#ffffff');
  const isHtmlTextShape = isTextShape && (style.html === '1' || style.html === true);
  const resolvedFillColor = resolveSwimlaneFillColor(
    { ...style, fillColor: effectiveFillColor },
    cell || null,
    cellMap || null
  );
  const fillColor = normalizeColor(resolvedFillColor);
  const strokeColor = normalizeColor(normalizedStrokeColor || '#000000');
  const parsedStrokeWidth = parseFloat(style.strokeWidth as string);
  const strokeWidth = Number.isFinite(parsedStrokeWidth)
    ? (parsedStrokeWidth === 0 ? 0.1 : parsedStrokeWidth)
    : 1;
  const rawOpacity = parseFloat(style.opacity as string);
  const opacity = Number.isFinite(rawOpacity) ? rawOpacity : 100;
  const rawFillOpacity = parseFloat(style.fillOpacity as string);
  const fillOpacity = Number.isFinite(rawFillOpacity) ? rawFillOpacity : opacity;
  const rawStrokeOpacity = parseFloat(style.strokeOpacity as string);
  const strokeOpacity = Number.isFinite(rawStrokeOpacity) ? rawStrokeOpacity : opacity;
  const labelBackgroundColor = style.labelBackgroundColor as string | undefined;
  const rounded = style.rounded === '1' || style.rounded === true;
  const dashed = style.dashed === '1' || style.dashed === true;
  const dashPattern = style.dashPattern as string | undefined;
  const lineJoin = style.lineJoin as string | undefined;
  const lineCap = style.lineCap as string | undefined;

  const gradientColor = style.gradientColor as string | undefined;
  const gradientDirection = style.gradientDirection as string | undefined;
  let gradientId: string | undefined;
  let gradientStartColor: string | undefined;
  let gradientEndColor: string | undefined;
  let gradientDirectionKey: string | undefined;

  const gradientToken = typeof gradientColor === 'string' ? gradientColor.trim().toLowerCase() : '';
  const canUseGradient = gradientColor
    && gradientToken !== 'none'
    && gradientToken !== 'inherit'
    && gradientToken !== 'default'
    && resolvedFillColor !== 'none';

  if (canUseGradient) {
    const startId = normalizeColorId(resolvedFillColor);
    const endId = normalizeColorId(gradientColor as string);
    gradientDirectionKey = getGradientDirectionKey(gradientDirection);
    gradientId = `mx-gradient-${startId}-1-${endId}-1-${gradientDirectionKey}-0`;
    gradientStartColor = normalizeColor(resolvedFillColor);
    gradientEndColor = normalizeColor(gradientColor as string);
  }
  const hasExplicitFill = normalizedFillColor !== undefined && normalizedFillColor !== null;
  const hasExplicitStroke = normalizedStrokeColor !== undefined && normalizedStrokeColor !== null;
  const rawValue = typeof cell?.value === 'string' ? cell?.value : '';
  const textValue = rawValue
    .replace(/<[^>]*>/g, '')
    .replace(/&nbsp;|&#160;/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  const hasTextValue = textValue.length > 0;
  const suppressTextBackground = isTextShape
    && labelBackgroundColor
    && labelBackgroundColor.toLowerCase() === 'none'
    && !hasTextValue;
  const allowTextFill = isTextShape
    ? !suppressTextBackground && hasExplicitFill && normalizedFillColor !== 'none' && (isHtmlTextShape || hasTextValue || fillOpacity < 100 || opacity < 100)
    : hasExplicitFill;
  const allowTextStroke = isTextShape ? (!suppressTextBackground && hasExplicitStroke && (isHtmlTextShape || hasTextValue)) : hasExplicitStroke;
  // Text shapes use fill only when explicitly provided or translucent background
  const isCrossHatch = fillStyle === 'cross-hatch' && resolvedFillColor !== 'none';
  let patternId: string | undefined;
  let patternStrokeColor: string | undefined;
  if (isCrossHatch) {
    const colorId = normalizeColorId(resolvedFillColor || '');
    patternId = `mx-pattern-cross-hatch-1-${colorId}-0`;
    patternStrokeColor = resolvedFillColor || undefined;
  }
  const resolvedFill = (isTextShape && !allowTextFill)
    ? 'none'
    : (patternId ? `url(#${patternId})` : (gradientId ? `url(#${gradientId})` : fillColor));
  const resolvedStroke = isTextShape && !allowTextStroke ? 'none' : strokeColor;

  return {
    strokeWidth,
    rounded,
    fillStyle,
    // Raw values for DOM building
    fillColor: resolvedFill,
    strokeColor: resolvedStroke,
    opacity,
    fillOpacity,
    strokeOpacity,
    dashed,
    dashPattern,
    lineJoin,
    lineCap,
    gradientId,
    gradientStartColor,
    gradientEndColor,
    gradientDirection: gradientDirectionKey,
    patternId,
    patternStrokeColor,
  };
}

/**
 * Apply common shape attributes to a DOM element
 */
export function applyShapeAttrsToElement(
  el: Element,
  attrs: ShapeAttrs,
  ensureLinearGradient: (
    id: string,
    startColor: string,
    endColor: string,
    directionKey: string
  ) => void,
  ensurePattern?: (id: string, strokeColor: string) => void
): void {
  const {
    fillColor,
    strokeColor,
    strokeWidth,
    opacity,
    fillOpacity,
    strokeOpacity,
    dashed,
    dashPattern,
    lineJoin,
    lineCap,
    gradientId,
    gradientStartColor,
    gradientEndColor,
    gradientDirection,
    patternId,
    patternStrokeColor
  } = attrs;

  if (gradientId && gradientStartColor && gradientEndColor && gradientDirection) {
    ensureLinearGradient(gradientId, gradientStartColor, gradientEndColor, gradientDirection);
  }
  if (patternId && patternStrokeColor && ensurePattern) {
    ensurePattern(patternId, patternStrokeColor);
  }

  if (fillColor === 'none') {
    el.setAttribute('fill', 'none');
  } else {
    el.setAttribute('fill', fillColor);
  }

  if (strokeColor === 'none') {
    el.setAttribute('stroke', 'none');
  } else {
    el.setAttribute('stroke', strokeColor);
  }

  el.setAttribute('stroke-width', String(strokeWidth));

  if (fillOpacity < 100 && fillColor !== 'none') {
    el.setAttribute('fill-opacity', String(fillOpacity / 100));
  }

  if (strokeOpacity < 100 && strokeColor !== 'none') {
    el.setAttribute('stroke-opacity', String(strokeOpacity / 100));
  }

  if (opacity < 100 && fillOpacity >= 100 && strokeOpacity >= 100) {
    el.setAttribute('opacity', String(opacity / 100));
  }

  const resolvedDashPattern = resolveDashPattern(dashPattern, dashed, strokeWidth);
  if (resolvedDashPattern && strokeColor !== 'none') {
    el.setAttribute('stroke-dasharray', resolvedDashPattern);
  }

  if (lineJoin) {
    el.setAttribute('stroke-linejoin', lineJoin);
  }

  if (lineCap) {
    el.setAttribute('stroke-linecap', lineCap);
  }

}

/**
 * Apply common shape attributes to SvgBuilder canvas state
 */
export function applyShapeAttrsToBuilder(
  builder: SvgBuilder,
  attrs: ShapeAttrs,
  ensureLinearGradient: (
    id: string,
    startColor: string,
    endColor: string,
    directionKey: string
  ) => void,
  ensurePattern?: (id: string, strokeColor: string) => void
): void {
  const {
    fillColor,
    strokeColor,
    strokeWidth,
    opacity,
    fillOpacity,
    strokeOpacity,
    dashed,
    dashPattern,
    lineJoin,
    lineCap,
    gradientId,
    gradientStartColor,
    gradientEndColor,
    gradientDirection,
    patternId,
    patternStrokeColor
  } = attrs;

  if (gradientId && gradientStartColor && gradientEndColor && gradientDirection) {
    ensureLinearGradient(gradientId, gradientStartColor, gradientEndColor, gradientDirection);
  }
  if (patternId && patternStrokeColor && ensurePattern) {
    ensurePattern(patternId, patternStrokeColor);
  }

  builder.setFillStyle(null);

  if (fillColor === 'none') {
    builder.setFillColor(null);
  } else {
    builder.setFillColor(fillColor);
  }

  if (strokeColor === 'none') {
    builder.setStrokeColor(null);
  } else {
    builder.setStrokeColor(strokeColor);
  }

  builder.setStrokeWidth(strokeWidth);

  if (fillOpacity < 100 && fillColor !== 'none') {
    builder.setFillAlpha(fillOpacity / 100);
  } else {
    builder.setFillAlpha(1);
  }

  if (strokeOpacity < 100 && strokeColor !== 'none') {
    builder.setStrokeAlpha(strokeOpacity / 100);
  } else {
    builder.setStrokeAlpha(1);
  }

  if (opacity < 100 && fillOpacity >= 100 && strokeOpacity >= 100) {
    builder.setAlpha(opacity / 100);
  } else {
    builder.setAlpha(1);
  }

  const resolvedDashPattern = resolveDashPattern(dashPattern, dashed, strokeWidth);
  if (resolvedDashPattern) {
    builder.setDashed(true);
    builder.setDashPattern(resolvedDashPattern);
  } else {
    builder.setDashed(false);
    builder.setDashPattern('3 3');
  }

  builder.setLineJoin(lineJoin || 'miter');
  builder.setLineCap(lineCap || 'flat');
  builder.setShadow(false);
}