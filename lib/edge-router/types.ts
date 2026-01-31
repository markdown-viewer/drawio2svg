export interface Point {
  x: number;
  y: number;
}

export interface CellState {
  x: number;
  y: number;
  width: number;
  height: number;
  shape?: string; // Shape type for perimeter calculation (e.g., 'rhombus', 'ellipse', etc.)
  geometryRelative?: boolean; // Whether cell geometry is relative
  geometryRelativeX?: number; // Relative geometry x (used for port side inference)
  rotation?: number; // Rotation in degrees
  portConstraint?: string; // Port constraint string (e.g., 'eastwest')
  portConstraintMask?: number; // Precomputed port constraint mask
  perimeter?: string; // Perimeter name (e.g., 'backbonePerimeter')
  direction?: string; // Direction (e.g., 'north', 'south')
  strokeWidth?: number; // Stroke width for perimeter adjustments
  backboneSize?: number; // Backbone size for backbonePerimeter
  perimeterSpacing?: number; // Extra spacing for perimeter
}