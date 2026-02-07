// @ts-nocheck
import type { RenderContext, ShapeAttrs } from '../../../renderer.ts';
import { BaseShapeHandler } from '../../shape-registry.ts';

export class IbmBoxHandler extends BaseShapeHandler {
  constructor(renderCtx: RenderContext) {
    super(renderCtx);
  }

  render(attrs: ShapeAttrs): void {
    const {
      builder,
      currentGroup,
      applyShapeAttrsToBuilder,
      x,
      y,
      width,
      height,
      style,
      getStencilShape,
      renderStencilShape,
    } = this.renderCtx;
    if (!builder || !currentGroup) return;
    if (width <= 0 || height <= 0) return;

    builder.setCanvasRoot(currentGroup);
    builder.save();
    applyShapeAttrsToBuilder(builder, attrs);
    let d = x;

    builder.translate(d, y);
    builder.begin();
    builder.rect(0, 0, width, height);
    builder.fillAndStroke();
    d = this.getStyleValue(style, 'strokeColor', 'none');
    builder.setFillColor(d as string);
    builder.setStrokeColor('none' as string);
    switch (this.getStyleValue(style, 'prType', '')) {
      case 'cloud':
        d = 'mxgraph.ibm.cloudtag';
        this.renderStencilByName(
          d,
          0,
          0,
          25,
          25,
          undefined,
          style,
          getStencilShape,
          renderStencilShape
        );
        break;
      case 'vpc':
        d = 'mxgraph.ibm.vpctag';
        this.renderStencilByName(
          d,
          0,
          0,
          25,
          25,
          undefined,
          style,
          getStencilShape,
          renderStencilShape
        );
        break;
      case 'region':
        d = 'mxgraph.ibm.regiontag';
        this.renderStencilByName(
          d,
          0,
          0,
          25,
          25,
          undefined,
          style,
          getStencilShape,
          renderStencilShape
        );
        break;
      case 'zone':
        d = 'mxgraph.ibm.zonetag';
        this.renderStencilByName(
          d,
          0,
          0,
          25,
          25,
          undefined,
          style,
          getStencilShape,
          renderStencilShape
        );
        break;
      case 'subnet':
        d = 'mxgraph.ibm.subnettag';
        this.renderStencilByName(
          d,
          0,
          0,
          25,
          25,
          undefined,
          style,
          getStencilShape,
          renderStencilShape
        );
        break;
      case 'public':
        d = 'mxgraph.ibm.publictag';
        this.renderStencilByName(
          d,
          0,
          0,
          25,
          25,
          undefined,
          style,
          getStencilShape,
          renderStencilShape
        );
        break;
      case 'enterprise':
        d = 'mxgraph.ibm.enterprisetag';
        this.renderStencilByName(
          d,
          0,
          0,
          25,
          25,
          undefined,
          style,
          getStencilShape,
          renderStencilShape
        );
        break;
      case 'classic':
        d = 'mxgraph.ibm.classictag';
        this.renderStencilByName(
          d,
          0,
          0,
          25,
          25,
          undefined,
          style,
          getStencilShape,
          renderStencilShape
        );
    }
    builder.restore();
  }

  // renderStencilByName is inherited from BaseShapeHandler
}
