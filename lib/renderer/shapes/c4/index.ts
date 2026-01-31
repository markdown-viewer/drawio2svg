import type { ShapeRegistry } from '../../shape-registry.ts';
import { C4PersonHandler } from './person.ts';
import { C4Person2Handler } from './person2.ts';
import { C4WebBrowserContainerHandler } from './web-browser-container.ts';
import { C4WebBrowserContainer2Handler } from './web-browser-container2.ts';

export const registerC4Handlers = (registry: ShapeRegistry): void => {
  registry.register('mxgraph.c4.person', C4PersonHandler);
  registry.register('mxgraph.c4.person2', C4Person2Handler);
  registry.register('mxgraph.c4.webBrowserContainer', C4WebBrowserContainerHandler);
  registry.register('mxgraph.c4.webBrowserContainer2', C4WebBrowserContainer2Handler);
};
