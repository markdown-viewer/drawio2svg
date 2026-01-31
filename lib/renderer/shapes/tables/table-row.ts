import type { RenderContext, ShapeAttrs } from '../../../renderer.ts';
import { SwimlaneShapeHandler } from '../../shape-registry.ts';
import { SwimlaneHandler } from '../swimlane/swimlane.ts';
import { renderTableRowShape } from './table.ts';

export class TableRowHandler extends SwimlaneShapeHandler {
  constructor(renderCtx: RenderContext) {
    super(renderCtx);
  }

  render(attrs: ShapeAttrs): void {
    const { cell, cellMap, style } = this.renderCtx;
    const parentCell = cell.parent ? cellMap.get(cell.parent) : undefined;
    const parentShape = parentCell?.style?.shape as string | undefined;

    const startSizeVal = parseFloat(style.startSize as string);
    const startSize = Number.isNaN(startSizeVal) ? 40 : startSizeVal;

    if (startSize === 0) {
      const strokeColor = style.strokeColor as string | undefined;
      if (parentShape === 'table' && strokeColor === 'inherit') {
        return;
      }
      renderTableRowShape(this.renderCtx, attrs);
      return;
    }

    new SwimlaneHandler(this.renderCtx).render(attrs);
  }
}
