import type { RenderContext, ShapeAttrs } from '../../../renderer.ts';
import { RectangleShapeHandler } from '../../shape-registry.ts';

export class EmptyHandler extends RectangleShapeHandler {
  constructor(renderCtx: RenderContext) {
    super(renderCtx);
  }

  render(_attrs: ShapeAttrs): void {
    // Intentionally empty to match the platform output for unsupported shapes.
  }
}
