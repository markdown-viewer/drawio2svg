import type { MxCell } from '../../../parser.ts';
import type { RenderContext, ShapeAttrs } from '../../../renderer.ts';
import { SwimlaneShapeHandler } from '../../shape-registry.ts';
import { SwimlaneHandler } from '../swimlane/swimlane.ts';

export class TableHandler extends SwimlaneShapeHandler {
  constructor(renderCtx: RenderContext) {
    super(renderCtx);
  }

  render(attrs: ShapeAttrs): void {
    renderTableShape(this.renderCtx, attrs);
  }
}

function renderTableShape(renderCtx: RenderContext, attrs: ShapeAttrs): void {
  const { builder, currentGroup, cell, cellMap, x, y, width, height, style } = renderCtx;
  if (!builder || !currentGroup) return;

  const { strokeColor } = attrs;

  // Matches TableShape.paintVertexShape from the platform
  const startSizeVal = parseFloat(style.startSize as string);
  const startSize = Number.isNaN(startSizeVal) ? 0 : startSizeVal;

  if (startSize > 0) {
    // Table with header - render as swimlane
    new SwimlaneHandler(renderCtx).render(attrs);
  } else {
    // Table without header - just outline path (no hidden rect)
    // Matches the platform: path with stroke-linecap="square" and pointer-events="none"
    const g = builder.createGroup();
    builder.setCanvasRoot(g);
    builder.save();
    builder.setFillColor(null);
    builder.setStrokeColor(strokeColor);
    builder.setStrokeWidth(1);
    builder.setLineCap('square');
    builder.begin();
    builder.addPoints(
      [
        { x, y },
        { x: x + width, y },
        { x: x + width, y: y + height },
        { x, y: y + height },
        { x, y }
      ],
      false,
      0,
      false
    );
    builder.stroke();
    builder.restore();

    const outlineEl = g.lastChild as Element | null;
    if (outlineEl) {
      outlineEl.setAttribute('pointer-events', 'none');
    }
    currentGroup.appendChild(g);
  }

  renderTableLines(renderCtx, cell, cellMap, strokeColor);
}

function renderTableRowShape(renderCtx: RenderContext, attrs: ShapeAttrs): void {
  const { builder, currentGroup, x, y, width, height } = renderCtx;
  if (!builder || !currentGroup) return;

  const { strokeColor } = attrs;
  const g = builder.createGroup();

  builder.setCanvasRoot(g);
  builder.save();
  builder.setFillColor(null);
  builder.setStrokeColor(strokeColor);
  builder.setStrokeWidth(1);
  builder.setLineCap('square');
  builder.begin();
  builder.addPoints(
    [
      { x, y },
      { x: x + width, y },
      { x: x + width, y: y + height },
      { x, y: y + height },
      { x, y }
    ],
    false,
    0,
    false
  );
  builder.stroke();
  builder.restore();

  const rowEl = g.lastChild as Element | null;
  if (rowEl) {
    rowEl.setAttribute('pointer-events', 'none');
  }

  currentGroup.appendChild(g);
}

function getSwimlaneDirection(style: Record<string, any>): string {
  const direction = style.direction || 'east';
  const flipH = style.flipH === 1 || style.flipH === '1' || style.flipH === true;
  const flipV = style.flipV === 1 || style.flipV === '1' || style.flipV === true;
  const horizontal = style.horizontal !== 0 && style.horizontal !== '0' && style.horizontal !== false;
  let n = horizontal ? 0 : 3;

  if (direction === 'north') {
    n--;
  } else if (direction === 'west') {
    n += 2;
  } else if (direction === 'south') {
    n += 1;
  }

  const b = ((n % 2) + 2) % 2;
  if (flipH && b === 1) {
    n += 2;
  }
  if (flipV && b === 0) {
    n += 2;
  }

  const directions = ['north', 'east', 'south', 'west'];
  return directions[((n % 4) + 4) % 4];
}

function getActualStartSizeXY(style: Record<string, any>): { x: number; y: number } {
  const startSizeVal = parseFloat(style.startSize as string);
  if (Number.isNaN(startSizeVal)) return { x: 0, y: 0 };
  const direction = getSwimlaneDirection(style);
  if (direction === 'north') {
    return { x: 0, y: startSizeVal };
  }
  if (direction === 'west') {
    return { x: startSizeVal, y: 0 };
  }
  return { x: 0, y: 0 };
}

function renderTableLines(
  renderCtx: RenderContext,
  tableCell: MxCell,
  cellMap: Map<string, MxCell>,
  strokeColor: string
): void {
  const { builder, currentGroup, x, y, style } = renderCtx;
  if (!builder || !currentGroup) return;

  // Check if row/column lines are enabled (matches paintTableForeground)
  const rowLines = style.rowLines !== 0 && style.rowLines !== '0' && style.rowLines !== false;
  const columnLines = style.columnLines !== 0 && style.columnLines !== '0' && style.columnLines !== false;

  if (!rowLines && !columnLines) {
    return;
  }

  // Get table start size (matches getActualStartSize logic)
  const tableActualStart = getActualStartSizeXY(style);

  // Find table rows (matches model.getChildCells(cell, true))
  const rows: MxCell[] = [];
  for (const [id, cell] of cellMap) {
    if (cell.parent === tableCell.id && cell.geometry && cell.vertex) {
      rows.push(cell);
    }
    void id;
  }

  if (rows.length === 0) {
    return;
  }

  // Build row cells data (sorted) for the platform-compatible traversal
  const rowCellsData: MxCell[][] = [];

  for (const row of rows) {
    const rowCells: MxCell[] = [];
    for (const [id, cell] of cellMap) {
      if (cell.parent === row.id && cell.geometry) {
        rowCells.push(cell);
      }
      void id;
    }
    rowCellsData.push(rowCells);
  }

  interface Point { x: number; y: number; }
  interface TableIter {
    cell: MxCell;
    rowspan: number;
    colspan: number;
    row: number;
    col: number;
    point: Point;
    actual: TableIter;
  }

  const hl: (Point | null)[][] = [];
  const vl: (Point | null)[][] = [];

  const getStyleValue = (styleObj: Record<string, any>, key: string, defaultValue: any) => {
    const value = styleObj[key];
    return value === undefined ? defaultValue : value;
  };

  const getBoolValue = (styleObj: Record<string, any>, key: string, defaultValue: boolean) => {
    const value = getStyleValue(styleObj, key, defaultValue);
    if (value === true || value === 1 || value === '1') return true;
    if (value === false || value === 0 || value === '0') return false;
    return defaultValue;
  };

  const getStringValue = (styleObj: Record<string, any>, key: string, defaultValue: string) => {
    const value = getStyleValue(styleObj, key, defaultValue);
    return value == null ? defaultValue : String(value);
  };

  const isHeadVisible = (rowStyle: Record<string, any>) => {
    const swimlaneHead = getBoolValue(rowStyle, 'swimlaneHead', true);
    const rowStroke = getStringValue(rowStyle, 'strokeColor', 'none');
    return swimlaneHead && rowStroke !== 'none';
  };

  const getRowStart = (rowStyle: Record<string, any>) => getActualStartSizeXY(rowStyle);

  // the platform-compatible visitTableCells
  const visitTableCells = (visitor: (iter: TableIter, colCount: number, rowCount: number, x0: number, y0: number) => void) => {
    let lastRow: TableIter[] | null = null;
    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      const rowStyle = row.style || {};
      const rowStart = getRowStart(rowStyle);
      const cols = rowCellsData[i];
      let lastCol: TableIter | null = null;
      const rowIters: TableIter[] = [];

      for (let j = 0; j < cols.length; j++) {
        const cell = cols[j];
        const geo = cell.geometry!;
        const bounds = geo.alternateBounds || geo;
        const iter: TableIter = {
          cell,
          rowspan: 1,
          colspan: 1,
          row: i,
          col: j,
          point: { x: 0, y: 0 },
          actual: null as unknown as TableIter
        };

        iter.point = {
          x: bounds.width + (lastCol != null ? lastCol.point.x : tableActualStart.x + rowStart.x),
          y: bounds.height + (lastRow != null && lastRow[0] != null ? lastRow[0].point.y : tableActualStart.y + rowStart.y)
        };
        iter.actual = iter;

        if (lastRow != null && lastRow[j] != null && lastRow[j].rowspan > 1) {
          iter.rowspan = lastRow[j].rowspan - 1;
          iter.colspan = lastRow[j].colspan;
          iter.actual = lastRow[j].actual;
        } else if (lastCol != null && lastCol.colspan > 1) {
          iter.rowspan = lastCol.rowspan;
          iter.colspan = lastCol.colspan - 1;
          iter.actual = lastCol.actual;
        } else {
          const cellStyle = cell.style || {};
          const rowspanVal = parseInt(cellStyle.rowspan as string);
          const colspanVal = parseInt(cellStyle.colspan as string);
          iter.rowspan = Number.isNaN(rowspanVal) ? 1 : rowspanVal;
          iter.colspan = Number.isNaN(colspanVal) ? 1 : colspanVal;
        }

        const head = isHeadVisible(rowStyle);
        const x0 = tableActualStart.x + (head ? rowStart.x : 0);
        const y0 = tableActualStart.y + (head ? rowStart.y : 0);
        visitor(iter, cols.length, rows.length, x0, y0);

        rowIters.push(iter);
        lastCol = iter;
      }

      lastRow = rowIters;
    }
  };

  if (rowLines || columnLines) {
    visitTableCells((iter, colCount, rowCount, x0, y0) => {
      if (rowLines && iter.row < rowCount - 1) {
        if (!hl[iter.row]) {
          hl[iter.row] = [{ x: x + x0, y: y + iter.point.y }];
        }

        if (iter.rowspan > 1) {
          hl[iter.row].push(null);
        }

        hl[iter.row].push({ x: x + iter.point.x, y: y + iter.point.y });
      }

      if (columnLines && iter.col < colCount - 1) {
        if (!vl[iter.col]) {
          vl[iter.col] = [{ x: x + iter.point.x, y: y + y0 }];
        }

        if (iter.colspan > 1) {
          vl[iter.col].push(null);
        }

        vl[iter.col].push({ x: x + iter.point.x, y: y + iter.point.y });
      }
    });
  }

  builder.save();
  builder.setCanvasRoot(currentGroup);
  builder.setFillColor(null);
  builder.setStrokeColor(strokeColor);
  builder.setStrokeWidth(1);
  builder.setLineCap('square');

  const addLine = (points: (Point | null)[]) => {
    if (points.length < 2) return;
    builder.begin();
    let started = false;
    let lastPoint: Point | null = null;
    for (let i = 0; i < points.length; i++) {
      const p = points[i];
      if (!p) {
        // null means next point should be a "move" not a "line"
        started = false;
        lastPoint = null;
        continue;
      }
      if (lastPoint && lastPoint.x === p.x && lastPoint.y === p.y) {
        continue;
      }
      if (!started) {
        builder.addPoints([p], false, 0, false);
        started = true;
      } else {
        builder.lineTo(p.x, p.y);
      }
      lastPoint = p;
    }
    builder.stroke();
  };

  for (const line of hl) {
    if (line) addLine(line);
  }
  for (const line of vl) {
    if (line) addLine(line);
  }

  builder.restore();
}

export { renderTableRowShape };
