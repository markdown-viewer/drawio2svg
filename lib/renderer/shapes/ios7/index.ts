import type { ShapeRegistry } from '../../shape-registry.ts';
import { Ios7ContactsBarHandler } from './contacts-bar.ts';
import { Ios7CurrentLocationHandler } from './current-location.ts';
import { Ios7OptionsHandler } from './options.ts';
import { Ios7RightHandler } from './right.ts';
import { Ios7PickerHandler } from './picker.ts';
import { Ios7SelectHandler } from './select.ts';

export function registerIos7Handlers(registry: ShapeRegistry): void {
  registry.register('mxgraph.ios7.misc.current_location', Ios7CurrentLocationHandler);
  registry.register('mxgraph.ios7.misc.contacts_bar', Ios7ContactsBarHandler);
  registry.register('mxgraph.ios7.misc.options', Ios7OptionsHandler);
  registry.register('mxgraph.ios7.misc.picker', Ios7PickerHandler);
  registry.register('mxgraph.ios7.misc.right', Ios7RightHandler);
  registry.register('mxgraph.ios7.misc.select', Ios7SelectHandler);
}
