import type { RenderContext, ShapeAttrs } from '../renderer.ts';
import type { CellState, Point } from '../edge-router/types.ts';
import type { MxStyle } from '../parser.ts';

// Perimeter function type
export type PerimeterFn = (bounds: CellState, next: Point, orthogonal: boolean, direction?: string) => Point;

// Context for computing paddingTop adjustment
export interface PaddingTopContext {
  valign: string;
  labelPosition?: string;
  fontSize: number;
  labelY: number;
  labelH: number;
}

// Label layout overrides for special shapes
export interface LabelOverrides {
  // Inset from shape edges for label bounds
  inset?: { left?: number; right?: number; top?: number; bottom?: number };
  // Calculate dynamic inset based on style and dimensions
  getInset?: (style: MxStyle, width: number, height: number) => { left?: number; right?: number; top?: number; bottom?: number };
  // Custom label bounds calculation for boundedLbl shapes
  getLabelBounds?: (style: MxStyle, x: number, y: number, width: number, height: number) => { x: number; y: number; width: number; height: number };
  // Always use getLabelBounds regardless of boundedLbl flag
  alwaysUseLabelBounds?: boolean;
  // Calculate paddingTop override (returns new value or undefined to skip)
  getPaddingTop?: (ctx: PaddingTopContext) => number | undefined;
  // Default startSize for swimlane-like shapes when not specified in style
  // Default value is 40, but default-style2 theme sets swimlane to 23
  defaultStartSize?: number;
}

export interface ShapeHandler {
  render: (attrs: ShapeAttrs) => void;
  // Optional: return perimeter function for this shape
  getPerimeter?: () => PerimeterFn | null;
  // Optional: return label layout overrides for this shape
  getLabelOverrides?: () => LabelOverrides | null;
  // Optional: whether this shape supports glass effect (default: false)
  // In the platform, only mxRectangleShape descendants and mxSwimlane support glass via paintForeground
  supportsGlass?: () => boolean;
  // Optional: whether this shape supports rounded corners (default: false)
  // In the platform, mxShape.isRoundable() returns false, specific shapes override to return true
  isRoundable?: () => boolean;
}

export type ShapeHandlerCtor = new (renderCtx: RenderContext) => ShapeHandler;

// System-level default values for global style properties
// These are the the platform platform defaults that take precedence over shape-internal defaults
const SYSTEM_DEFAULTS: Record<string, any> = {
  strokeColor: '#000000',
  fillColor: '#ffffff',
  strokeWidth: 1,
  fontFamily: 'Arial, Helvetica, sans-serif',
  fontSize: 11,
  opacity: 100,
};

export function setSystemDefaultFontFamily(fontFamily: string): void {
  if (!fontFamily || !fontFamily.trim()) {
    return;
  }
  SYSTEM_DEFAULTS.fontFamily = fontFamily;
}

export abstract class BaseShapeHandler implements ShapeHandler {
  protected renderCtx: RenderContext;

  constructor(renderCtx: RenderContext) {
    this.renderCtx = renderCtx;
  }

  // Helper to get style value with layered default lookup:
  // 1. Check style object for explicit value
  // 2. Use system default for global properties (strokeColor, fillColor, etc.)
  // 3. Fall back to shape-provided default
  protected getStyleValue(style: MxStyle, key: string, shapeDefault: any): any {
    // If style has explicit value, use it
    if (style[key] !== undefined) {
      return style[key];
    }
    // For global style properties, use system default instead of shape default
    if (key in SYSTEM_DEFAULTS) {
      return SYSTEM_DEFAULTS[key];
    }
    // Otherwise use shape-provided default
    return shapeDefault;
  }

  // Helper to get numeric style value with layered default lookup
  protected getStyleNumber(style: MxStyle, key: string, shapeDefault: number): number {
    // If style has explicit value, use it
    if (style[key] !== undefined) {
      const value = style[key];
      const num = typeof value === 'number' ? value : parseFloat(String(value));
      return isNaN(num) ? shapeDefault : num;
    }
    // For global style properties, use system default
    if (key in SYSTEM_DEFAULTS) {
      return SYSTEM_DEFAULTS[key];
    }
    // Otherwise use shape-provided default
    return shapeDefault;
  }

  // Default render for unknown shapes (fallback behavior)
  render(_attrs: ShapeAttrs): void {
    // Default placeholder rendering lives here.
  }

  // Default: no custom perimeter (use rectangle)
  getPerimeter(): PerimeterFn | null {
    return null;
  }

  // Default: no label overrides
  getLabelOverrides(): LabelOverrides | null {
    return null;
  }

  // Default: no glass effect support (mxShape base behavior)
  // Only mxRectangleShape descendants and mxSwimlane override paintForeground to call paintGlassEffect
  supportsGlass(): boolean {
    return false;
  }

  // Default: no rounded corners support (mxShape.isRoundable returns false)
  // Specific shapes like mxRectangleShape, mxRhombus, mxTriangle override to return true
  isRoundable(): boolean {
    return false;
  }
}

// ============================================================================
// Shape Handler Base Classes matching the platform's inheritance hierarchy
// ============================================================================
// the platform shape hierarchy (mxClient.js):
//   mxShape (base) -> BaseShapeHandler
//     - supportsGlass: false
//     - isRoundable: false
//
//   mxShape
//     ├── mxRectangleShape -> RectangleShapeHandler
//     │   - supportsGlass: true (paintForeground calls paintGlassEffect)
//     │   - isRoundable: true
//     │   ├── mxLabel -> (inherits RectangleShapeHandler)
//     │   └── mxImageShape -> ImageShapeHandler
//     │       - supportsGlass: true (inherited)
//     │       - isRoundable: false (explicitly overridden)
//     │
//     ├── mxActor -> ActorShapeHandler
//     │   - supportsGlass: false
//     │   - isRoundable: false
//     │   - Uses redrawPath pattern
//     │   ├── mxCloud -> (inherits ActorShapeHandler)
//     │   ├── mxHexagon -> HexagonShapeHandler (inherits ActorShapeHandler)
//     │   │   - isRoundable: false (inherits)
//     │   └── mxTriangle -> TriangleShapeHandler
//     │       - isRoundable: true (overridden)
//     │
//     ├── mxEllipse -> EllipseShapeHandler
//     │   - supportsGlass: false
//     │   - isRoundable: false
//     │
//     ├── mxDoubleEllipse -> DoubleEllipseShapeHandler
//     │   - supportsGlass: false
//     │   - isRoundable: false
//     │   - Has custom getLabelBounds
//     │
//     ├── mxRhombus -> RhombusShapeHandler
//     │   - supportsGlass: false
//     │   - isRoundable: true
//     │
//     ├── mxCylinder -> CylinderShapeHandler
//     │   - supportsGlass: false
//     │   - isRoundable: false
//     │   - Uses redrawPath pattern
//     │
//     ├── mxArrow -> ArrowShapeHandler (edge shape)
//     │   - supportsGlass: false
//     │   - isRoundable: false
//     │
//     ├── mxArrowConnector -> ArrowConnectorShapeHandler (edge shape)
//     │   - supportsGlass: false
//     │   - isRoundable: true
//     │
//     ├── mxPolyline -> PolylineShapeHandler (edge shape)
//     │   - supportsGlass: false
//     │   - isRoundable: false
//     │   └── mxConnector -> ConnectorShapeHandler
//     │
//     ├── mxLine -> LineShapeHandler
//     │   - supportsGlass: false
//     │   - isRoundable: false
//     │
//     ├── mxSwimlane -> SwimlaneShapeHandler
//     │   - supportsGlass: true (special handling in paintVertexShape)
//     │   - isRoundable: true
//     │
//     └── mxStencil -> handled by stencil system
// ============================================================================

/**
 * Base class for shapes that extend mxRectangleShape in the platform.
 * - supportsGlass: true (paintForeground calls paintGlassEffect)
 * - isRoundable: true
 */
export abstract class RectangleShapeHandler extends BaseShapeHandler {
  supportsGlass(): boolean {
    return true;
  }

  isRoundable(): boolean {
    return true;
  }
}

/**
 * Base class for shapes that extend mxImageShape in the platform.
 * mxImageShape extends mxRectangleShape but explicitly sets isRoundable to false.
 * - supportsGlass: true (inherited from mxRectangleShape)
 * - isRoundable: false (explicitly overridden)
 */
export abstract class ImageShapeHandler extends RectangleShapeHandler {
  isRoundable(): boolean {
    return false;
  }
}

/**
 * Base class for shapes that extend mxActor in the platform.
 * Uses redrawPath pattern for shape definition.
 * - supportsGlass: false
 * - isRoundable: false
 */
export abstract class ActorShapeHandler extends BaseShapeHandler {
  // Inherits supportsGlass(): false from BaseShapeHandler
  // Inherits isRoundable(): false from BaseShapeHandler
}

/**
 * Base class for shapes that extend mxTriangle in the platform.
 * mxTriangle extends mxActor but overrides isRoundable to return true.
 * - supportsGlass: false (inherited from mxActor)
 * - isRoundable: true (overridden)
 */
export abstract class TriangleShapeHandler extends ActorShapeHandler {
  isRoundable(): boolean {
    return true;
  }
}

/**
 * Base class for shapes that extend mxHexagon in the platform.
 * mxHexagon extends mxActor.
 * - supportsGlass: false (inherited from mxActor)
 * - isRoundable: false (inherited from mxActor)
 */
export abstract class HexagonShapeHandler extends ActorShapeHandler {
  // Inherits supportsGlass(): false from ActorShapeHandler
  // Inherits isRoundable(): false from ActorShapeHandler
}

/**
 * Base class for shapes that extend mxEllipse in the platform.
 * - supportsGlass: false
 * - isRoundable: false
 */
export abstract class EllipseShapeHandler extends BaseShapeHandler {
  // Inherits supportsGlass(): false from BaseShapeHandler
  // Inherits isRoundable(): false from BaseShapeHandler
}

/**
 * Base class for shapes that extend mxDoubleEllipse in the platform.
 * Has custom getLabelBounds implementation.
 * - supportsGlass: false
 * - isRoundable: false
 */
export abstract class DoubleEllipseShapeHandler extends BaseShapeHandler {
  // Inherits supportsGlass(): false from BaseShapeHandler
  // Inherits isRoundable(): false from BaseShapeHandler
}

/**
 * Base class for shapes that extend mxRhombus in the platform.
 * - supportsGlass: false
 * - isRoundable: true
 */
export abstract class RhombusShapeHandler extends BaseShapeHandler {
  isRoundable(): boolean {
    return true;
  }
}

/**
 * Base class for shapes that extend mxCylinder in the platform.
 * Uses redrawPath pattern for shape definition.
 * - supportsGlass: false
 * - isRoundable: false
 */
export abstract class CylinderShapeHandler extends BaseShapeHandler {
  // Inherits supportsGlass(): false from BaseShapeHandler
  // Inherits isRoundable(): false from BaseShapeHandler
}

/**
 * Base class for shapes that extend mxArrow in the platform.
 * Edge shape using paintEdgeShape.
 * - supportsGlass: false
 * - isRoundable: false
 */
export abstract class ArrowShapeHandler extends BaseShapeHandler {
  // Inherits supportsGlass(): false from BaseShapeHandler
  // Inherits isRoundable(): false from BaseShapeHandler
}

/**
 * Base class for shapes that extend mxArrowConnector in the platform.
 * Edge shape using paintEdgeShape.
 * - supportsGlass: false
 * - isRoundable: true
 */
export abstract class ArrowConnectorShapeHandler extends BaseShapeHandler {
  isRoundable(): boolean {
    return true;
  }
}

/**
 * Base class for shapes that extend mxPolyline in the platform.
 * Edge shape using paintEdgeShape.
 * - supportsGlass: false
 * - isRoundable: false
 */
export abstract class PolylineShapeHandler extends BaseShapeHandler {
  // Inherits supportsGlass(): false from BaseShapeHandler
  // Inherits isRoundable(): false from BaseShapeHandler
}

/**
 * Base class for shapes that extend mxConnector in the platform.
 * mxConnector extends mxPolyline.
 * - supportsGlass: false
 * - isRoundable: false
 */
export abstract class ConnectorShapeHandler extends PolylineShapeHandler {
  // Inherits supportsGlass(): false from PolylineShapeHandler
  // Inherits isRoundable(): false from PolylineShapeHandler
}

/**
 * Base class for shapes that extend mxLine in the platform.
 * Simple line shape.
 * - supportsGlass: false
 * - isRoundable: false
 */
export abstract class LineShapeHandler extends BaseShapeHandler {
  // Inherits supportsGlass(): false from BaseShapeHandler
  // Inherits isRoundable(): false from BaseShapeHandler
}

/**
 * Base class for shapes that extend mxSwimlane in the platform.
 * Has special glass support in paintVertexShape.
 * - supportsGlass: true
 * - isRoundable: true
 */
export abstract class SwimlaneShapeHandler extends BaseShapeHandler {
  supportsGlass(): boolean {
    return true;
  }

  isRoundable(): boolean {
    return true;
  }
}

export class ShapeRegistry {
  private handlers = new Map<string, ShapeHandlerCtor>();
  private defaultHandler: ShapeHandlerCtor | null = null;

  register(shape: string, handler: ShapeHandlerCtor): void {
    this.handlers.set(shape, handler);
  }

  setDefault(handler: ShapeHandlerCtor): void {
    this.defaultHandler = handler;
  }

  // Get handler constructor for a shape (for perimeter lookup)
  // Accepts lowercase shape names (e.g., 'startstate') and resolves to registered names
  getHandlerCtor(shape: string | undefined): ShapeHandlerCtor | null {
    if (!shape) return this.defaultHandler;
    // Try original shape name first
    if (this.handlers.has(shape)) {
      return this.handlers.get(shape) ?? this.defaultHandler;
    }
    // Try lowercase matching
    const lowerShape = shape.toLowerCase();
    for (const [key, ctor] of this.handlers) {
      if (key.toLowerCase() === lowerShape) {
        return ctor;
      }
    }
    return this.defaultHandler;
  }

  create(shape: string | undefined, renderCtx: RenderContext): ShapeHandler | null {
    const resolvedShape = shape ?? '';
    if (!resolvedShape) {
      return this.defaultHandler ? new this.defaultHandler(renderCtx) : null;
    }
    const ctor = this.handlers.get(resolvedShape);
    if (ctor) return new ctor(renderCtx);
    return this.defaultHandler ? new this.defaultHandler(renderCtx) : null;
  }
}
