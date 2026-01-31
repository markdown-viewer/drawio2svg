import type { RenderContext, ShapeAttrs } from '../../../renderer.ts';
import { RectangleShapeHandler } from '../../shape-registry.ts';
import { RectangleHandler } from './rectangle.ts';

export class FallbackShapeHandler extends RectangleShapeHandler {
  constructor(renderCtx: RenderContext) {
    super(renderCtx);
  }

  render(attrs: ShapeAttrs): void {
    const { getStencilSvg, renderStencilShape, style, cellGroup } = this.renderCtx;
    const stencilSvg = getStencilSvg ? getStencilSvg(style) : null;
    if (stencilSvg && renderStencilShape) {
      if (cellGroup) {
        cellGroup.setAttribute('data-stencil', '1');
      }
      renderStencilShape(this.renderCtx, stencilSvg);
      return;
    }
    new RectangleHandler(this.renderCtx).render(attrs);
  }
}
