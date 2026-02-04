import type { RenderContext, ShapeAttrs } from '../../../renderer.ts';
import { RectangleShapeHandler } from '../../shape-registry.ts';
import { RectangleHandler } from './rectangle.ts';

export class FallbackShapeHandler extends RectangleShapeHandler {
  constructor(renderCtx: RenderContext) {
    super(renderCtx);
  }

  render(attrs: ShapeAttrs): void {
    const { getStencilShape, renderStencilShape, style, cellGroup } = this.renderCtx;
    
    // Try to render as stencil shape
    const stencilShape = getStencilShape ? getStencilShape(style.shape || '') : null;
    if (stencilShape && renderStencilShape) {
      if (cellGroup) {
        cellGroup.setAttribute('data-stencil', 'true');
      }
      renderStencilShape(this.renderCtx, stencilShape);
      return;
    }
    
    // Fall back to rectangle if no stencil found
    new RectangleHandler(this.renderCtx).render(attrs);
  }
}
