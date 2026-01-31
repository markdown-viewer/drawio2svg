import type { ShapeRegistry } from '../../shape-registry.ts';
import { TableHandler } from './table.ts';
import { TableRowHandler } from './table-row.ts';

export function registerTableHandlers(registry: ShapeRegistry): void {
  registry.register('table', TableHandler);
  registry.register('tableRow', TableRowHandler);
}
