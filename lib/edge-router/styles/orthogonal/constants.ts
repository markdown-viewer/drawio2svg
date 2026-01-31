// ============================================================================
// OrthConnector constants and data structures
// ============================================================================

export const orthBuffer = 10;
export const orthPointsFallback = true;

export const dirVectors = [
  [-1, 0],
  [0, -1], [1, 0], [0, 1], [-1, 0], [0, -1], [1, 0]
];

export const wayPoints1 = [
  [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0],
  [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0]
];

export const routePatterns = [
  [[513, 2308, 2081, 2562], [513, 1090, 514, 2184, 2114, 2561],
    [513, 1090, 514, 2564, 2184, 2562],
    [513, 2308, 2561, 1090, 514, 2568, 2308]],
  [[514, 1057, 513, 2308, 2081, 2562], [514, 2184, 2114, 2561],
    [514, 2184, 2562, 1057, 513, 2564, 2184],
    [514, 1057, 513, 2568, 2308, 2561]],
  [[1090, 514, 1057, 513, 2308, 2081, 2562], [2114, 2561],
    [1090, 2562, 1057, 513, 2564, 2184],
    [1090, 514, 1057, 513, 2308, 2561, 2568]],
  [[2081, 2562], [1057, 513, 1090, 514, 2184, 2114, 2561],
    [1057, 513, 1090, 514, 2184, 2562, 2564],
    [1057, 2561, 1090, 514, 2568, 2308]]
];

export const inlineRoutePatterns: (number[] | null)[][] = [
  [null, [2114, 2568], null, null],
  [null, [514, 2081, 2114, 2568], null, null],
  [null, [2114, 2561], null, null],
  [[2081, 2562], [1057, 2114, 2568], [2184, 2562], null]
];

export const vertexSeperations: number[] = [];

export const limits = [
  [0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0]
];

export const LEFT_MASK = 32;
export const TOP_MASK = 64;
export const RIGHT_MASK = 128;
export const BOTTOM_MASK = 256;

export const LEFT = 1;
export const TOP = 2;
export const RIGHT = 4;
export const BOTTOM = 8;

export const SIDE_MASK = 480;
export const CENTER_MASK = 512;
export const SOURCE_MASK = 1024;
export const TARGET_MASK = 2048;
export const VERTEX_MASK = 3072;

// Direction masks
export const DIRECTION_MASK_NONE = 0;
export const DIRECTION_MASK_WEST = 1;
export const DIRECTION_MASK_NORTH = 2;
export const DIRECTION_MASK_SOUTH = 4;
export const DIRECTION_MASK_EAST = 8;
export const DIRECTION_MASK_ALL = 15;