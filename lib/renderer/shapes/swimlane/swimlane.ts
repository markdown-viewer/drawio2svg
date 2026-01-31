import type { RenderContext, ShapeAttrs } from '../../../renderer.ts';
import { SwimlaneShapeHandler, type LabelOverrides } from '../../shape-registry.ts';
import { normalizeColor } from '../../color.ts';

// the platform's default-style2 theme sets swimlane startSize to 23
// See: Editor.defaultThemes['default-style2'] in the platform source
export const SWIMLANE_DEFAULT_START_SIZE = 23;

export class SwimlaneHandler extends SwimlaneShapeHandler {
  constructor(renderCtx: RenderContext) {
    super(renderCtx);
  }

  render(attrs: ShapeAttrs): void {
    const { builder, currentGroup, cell, cellMap } = this.renderCtx;
    if (!builder || !currentGroup) return;

    renderSwimlaneShape(this.renderCtx, attrs);
    void cell;
    void cellMap;
  }

  getLabelOverrides(): LabelOverrides | null {
    return {
      // the platform's default-style2 theme specifies startSize=23 for swimlane
      defaultStartSize: SWIMLANE_DEFAULT_START_SIZE,
    };
  }
}

function renderSwimlaneShape(renderCtx: RenderContext, attrs: ShapeAttrs): void {
  const { builder, currentGroup, applyShapeAttrsToBuilder, x, y, width, height, style } = renderCtx;
  if (!builder || !currentGroup) return;

  const { fillColor, strokeColor, rounded } = attrs;
  const laneFillRaw = (style.swimlaneFillColor as string) || 'none';
  const resolvedLaneFill = laneFillRaw === 'default' ? '#ffffff' : laneFillRaw;
  const laneFillColor = resolvedLaneFill === 'none' ? 'none' : normalizeColor(resolvedLaneFill);
  const fillAlpha = attrs.fillOpacity < 100 ? attrs.fillOpacity / 100 : 1;

  // Matches mxSwimlane.paintSwimlane from the platform
  // Default startSize in expected fixtures is 23 when not specified
  const startSizeVal = parseFloat(style.startSize as string);
  const startSize = Number.isNaN(startSizeVal) ? 23 : startSizeVal;
  const horizontal = style.horizontal !== 0 && style.horizontal !== '0' && style.horizontal !== false;

  // Style flags matching mxSwimlane
  const swimlaneLine = style.swimlaneLine !== 0 && style.swimlaneLine !== '0' && style.swimlaneLine !== false;
  const swimlaneHead = style.swimlaneHead !== 0 && style.swimlaneHead !== '0' && style.swimlaneHead !== false;
  const swimlaneBody = style.swimlaneBody !== 0 && style.swimlaneBody !== '0' && style.swimlaneBody !== false;

  const absoluteArcSize = style.absoluteArcSize === '1' || style.absoluteArcSize === true;
  const arcSizeValue = parseFloat(style.arcSize as string);
  const arcSize = Number.isFinite(arcSizeValue) ? arcSizeValue : 10;
  const arcFactor = arcSize / 100;
  const cornerRadius = rounded
    ? (absoluteArcSize
      ? Math.min(width / 2, height / 2, arcSize / 2)
      : Math.min(width * arcFactor, height * arcFactor))
    : 0;

  builder.setCanvasRoot(currentGroup);

  if (horizontal) {
    // Header (title area) - always rendered
    builder.save();
    applyShapeAttrsToBuilder(builder, attrs);
    builder.setFillAlpha(fillColor !== 'none' ? fillAlpha : 1);
    builder.setFillColor(fillColor === 'none' ? null : fillColor);
    builder.setStrokeColor(swimlaneHead ? strokeColor : null);
    builder.begin();
    if (cornerRadius > 0) {
      builder.moveTo(x + width, y + startSize);
      builder.lineTo(x + width, y + cornerRadius);
      builder.quadTo(x + width, y, x + width - cornerRadius, y);
      builder.lineTo(x + cornerRadius, y);
      builder.quadTo(x, y, x, y + cornerRadius);
      builder.lineTo(x, y + startSize);
    } else {
      builder.addPoints(
        [
          { x, y: y + startSize },
          { x, y },
          { x: x + width, y },
          { x: x + width, y: y + startSize }
        ],
        false,
        0,
        false
      );
    }
    if (swimlaneHead) {
      builder.fillAndStroke();
    } else {
      builder.fill();
    }
    builder.restore();

    // Body (content area)
    if (startSize < height) {
      const shouldRender = swimlaneBody
        ? (laneFillColor !== 'none' || strokeColor !== 'none')
        : laneFillColor !== 'none';

      if (shouldRender) {
        builder.save();
        applyShapeAttrsToBuilder(builder, attrs);
        builder.setFillColor(laneFillColor === 'none' ? null : laneFillColor);
        builder.setStrokeColor(swimlaneBody ? strokeColor : null);
        builder.setFillAlpha(laneFillColor !== 'none' ? fillAlpha : 1);
        builder.begin();
        if (cornerRadius > 0) {
          builder.moveTo(x, y + startSize);
          builder.lineTo(x, y + height - cornerRadius);
          builder.quadTo(x, y + height, x + cornerRadius, y + height);
          builder.lineTo(x + width - cornerRadius, y + height);
          builder.quadTo(x + width, y + height, x + width, y + height - cornerRadius);
          builder.lineTo(x + width, y + startSize);
        } else {
          builder.addPoints(
            [
              { x, y: y + startSize },
              { x, y: y + height },
              { x: x + width, y: y + height },
              { x: x + width, y: y + startSize }
            ],
            false,
            0,
            false
          );
        }

        if (swimlaneBody) {
          if (laneFillColor === 'none') {
            builder.setFillColor(null);
            builder.stroke();
          } else {
            builder.fillAndStroke();
          }
        } else if (laneFillColor !== 'none') {
          builder.fill();
        }
        builder.restore();
      }
    }

    // Divider line - render when stroke is visible or header size is meaningful
    if (startSize > 0 && swimlaneLine && (strokeColor !== 'none' || startSize > 1)) {
      builder.save();
      applyShapeAttrsToBuilder(builder, attrs);
      builder.setFillColor(null);
      builder.setStrokeColor(strokeColor);
      builder.begin();
      builder.addPoints(
        [
          { x, y: y + startSize },
          { x: x + width, y: y + startSize }
        ],
        false,
        0,
        false
      );
      builder.stroke();
      builder.restore();

      const dividerEl = currentGroup.lastChild as Element | null;
      if (dividerEl) {
        dividerEl.setAttribute('pointer-events', 'none');
      }
    }
  } else {
    // Vertical orientation
    builder.save();
    applyShapeAttrsToBuilder(builder, attrs);
    builder.setFillAlpha(fillColor !== 'none' ? fillAlpha : 1);
    builder.setFillColor(fillColor === 'none' ? null : fillColor);
    builder.setStrokeColor(swimlaneHead ? strokeColor : null);
    builder.begin();
    if (cornerRadius > 0) {
      builder.moveTo(x + startSize, y);
      builder.lineTo(x + cornerRadius, y);
      builder.quadTo(x, y, x, y + cornerRadius);
      builder.lineTo(x, y + height - cornerRadius);
      builder.quadTo(x, y + height, x + cornerRadius, y + height);
      builder.lineTo(x + startSize, y + height);
    } else {
      builder.addPoints(
        [
          { x: x + startSize, y },
          { x, y },
          { x, y: y + height },
          { x: x + startSize, y: y + height }
        ],
        false,
        0,
        false
      );
    }
    if (swimlaneHead) {
      builder.fillAndStroke();
    } else {
      builder.fill();
    }
    builder.restore();

    if (startSize < width) {
      const shouldRender = swimlaneBody
        ? (laneFillColor !== 'none' || strokeColor !== 'none')
        : laneFillColor !== 'none';

      if (shouldRender) {
        builder.save();
        applyShapeAttrsToBuilder(builder, attrs);
        builder.setFillColor(laneFillColor === 'none' ? null : laneFillColor);
        builder.setStrokeColor(swimlaneBody ? strokeColor : null);
        builder.begin();
        if (cornerRadius > 0) {
          builder.moveTo(x + startSize, y);
          builder.lineTo(x + width - cornerRadius, y);
          builder.quadTo(x + width, y, x + width, y + cornerRadius);
          builder.lineTo(x + width, y + height - cornerRadius);
          builder.quadTo(x + width, y + height, x + width - cornerRadius, y + height);
          builder.lineTo(x + startSize, y + height);
        } else {
          builder.addPoints(
            [
              { x: x + startSize, y },
              { x: x + width, y },
              { x: x + width, y: y + height },
              { x: x + startSize, y: y + height }
            ],
            false,
            0,
            false
          );
        }

        if (swimlaneBody) {
          if (laneFillColor === 'none') {
            builder.setFillColor(null);
            builder.stroke();
          } else {
            builder.fillAndStroke();
          }
        } else if (laneFillColor !== 'none') {
          builder.fill();
        }
        builder.restore();
      }
    }

    if (startSize > 0 && swimlaneLine && (strokeColor !== 'none' || startSize > 1)) {
      builder.save();
      applyShapeAttrsToBuilder(builder, attrs);
      builder.setFillColor(null);
      builder.setStrokeColor(strokeColor);
      builder.begin();
      builder.addPoints(
        [
          { x: x + startSize, y },
          { x: x + startSize, y: y + height }
        ],
        false,
        0,
        false
      );
      builder.stroke();
      builder.restore();

      const dividerEl = currentGroup.lastChild as Element | null;
      if (dividerEl) {
        dividerEl.setAttribute('pointer-events', 'none');
      }
    }
  }
}
