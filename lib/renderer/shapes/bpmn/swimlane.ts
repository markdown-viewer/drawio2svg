import type { RenderContext, ShapeAttrs } from '../../../renderer.ts';
import { SwimlaneShapeHandler, type LabelOverrides } from '../../shape-registry.ts';
import { SwimlaneHandler } from '../swimlane/swimlane.ts';

// Default start size value
// BPMN swimlane doesn't have a theme override, so it uses this value
export const MX_DEFAULT_START_SIZE = 40;

/**
 * BPMN Swimlane - extends standard swimlane with optional "collection" marker
 * Original mxGraph code calls mxSwimlane.prototype.paintVertexShape then adds collection lines
 */
export class BpmnSwimlaneHandler extends SwimlaneShapeHandler {
  constructor(renderCtx: RenderContext) {
    super(renderCtx);
  }

  render(attrs: ShapeAttrs): void {
    const { builder, currentGroup, x, y, width, height, style } = this.renderCtx;
    if (!builder || !currentGroup) return;
    if (width <= 0 || height <= 0) return;

    // Delegate to standard swimlane handler for the base shape
    // BPMN swimlane uses default start size (40) when not specified
    const originalStartSize = style.startSize;
    const hasStartSize = originalStartSize !== undefined && originalStartSize !== null && originalStartSize !== '';
    if (!hasStartSize) {
      style.startSize = 40;
    }
    new SwimlaneHandler(this.renderCtx).render(attrs);
    if (!hasStartSize) {
      delete style.startSize;
    }

    // Add collection marker if enabled (three vertical lines at bottom)
    const isCollection = this.getStyleValue(style, 'isCollection', false);
    if (isCollection) {
      builder.setCanvasRoot(currentGroup);
      builder.save();
      builder.setShadow(false);
      builder.setStrokeColor(attrs.strokeColor === 'none' ? null : attrs.strokeColor);
      builder.setFillColor(null);
      
      // Collection marker: 3 vertical lines centered at bottom
      builder.translate(x + width * 0.5 - 6, y + height - 12);
      builder.begin();
      builder.moveTo(2.4, 0);
      builder.lineTo(2.4, 12);
      builder.moveTo(6, 0);
      builder.lineTo(6, 12);
      builder.moveTo(9.6, 0);
      builder.lineTo(9.6, 12);
      builder.stroke();
      builder.translate(-(x + width * 0.5 - 6), -(y + height - 12));
      
      builder.restore();
    }
  }

  getLabelOverrides(): LabelOverrides | null {
    return {
      // BPMN swimlane uses default start size (40)
      // It doesn't have a theme override like regular swimlane does
      defaultStartSize: MX_DEFAULT_START_SIZE,
    };
  }
}
