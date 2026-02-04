// @ts-nocheck
import type { RenderContext, ShapeAttrs } from '../../../renderer.ts';
import { BaseShapeHandler } from '../../shape-registry.ts';

export class Archimate3ApplicationHandler extends BaseShapeHandler {
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

    builder.translate(x, y);
    this.renderBackground(builder, 0, 0, width, height, style, getStencilShape, renderStencilShape);
    builder.setShadow(!1);
    builder.translate(width - 20, 5);
    this.renderForeground(
      builder,
      width - 20,
      5,
      15,
      15,
      style,
      getStencilShape,
      renderStencilShape
    );
    builder.restore();
  }

  private renderBackground(
    builder: RenderContext['builder'],
    x: number,
    y: number,
    width: number,
    height: number,
    style: RenderContext['style'],
    getStencilShape?: RenderContext['getStencilShape'],
    renderStencilShape?: RenderContext['renderStencilShape']
  ): void {
    if (!builder) return;
    x = this.getStyleValue(style, 'archiType', 'square');
    if ('rounded' === x) {
      builder.roundrect(0, 0, width, height, 10, 10);
    } else if ('oct' === x && 20 <= width && 20 <= height) {
      builder.begin();
      builder.moveTo(0, 10);
      builder.lineTo(10, 0);
      builder.lineTo(width - 10, 0);
      builder.lineTo(width, 10);
      builder.lineTo(width, height - 10);
      builder.lineTo(width - 10, height);
      builder.lineTo(10, height);
      builder.lineTo(0, height - 10);
      builder.close();
      builder.fillAndStroke();
    } else {
      builder.rect(0, 0, width, height);
    }
    builder.fillAndStroke();
  }

  private renderForeground(
    builder: RenderContext['builder'],
    x: number,
    y: number,
    width: number,
    height: number,
    style: RenderContext['style'],
    getStencilShape?: RenderContext['getStencilShape'],
    renderStencilShape?: RenderContext['renderStencilShape']
  ): void {
    if (!builder) return;
    let f;
    f = this.getStyleValue(style, 'appType', '');
    builder.setDashed(!1);
    if (f === 'comp') {
      builder.translate(1, 0);
      this.renderExternal_mxArchiMate3Component_background(builder, x, y, width - 2, height, style);
    } else if (f === 'collab') {
      builder.translate(0, 3);
      this.renderExternal_mxArchiMate3Collaboration_background(
        builder,
        x,
        y,
        width,
        height - 6,
        style
      );
    } else if (f === 'interface') {
      builder.translate(0, 4);
      this.renderExternal_mxArchiMate3Interface_background(builder, x, y, width, height - 8, style);
    } else if (f === 'interface2') {
      builder.translate(0, 1);
      height -= 2;
      builder.begin();
      builder.moveTo(0, 0.5 * height);
      builder.lineTo(0.6 * width, 0.5 * height);
      builder.moveTo(width, 0);
      builder.arcTo(0.4 * width, 0.5 * height, 0, 0, 0, width, height);
      builder.stroke();
    } else if (f === 'facility') {
      this.renderExternal_mxArchiMate3Facility_background(builder, x, y, width, height, style);
    } else if (f === 'func') {
      this.renderExternal_mxArchiMate3Function_background(builder, x, y, width, height, style);
    } else if (f === 'gap') {
      this.renderExternal_mxArchiMate3GapIcon_background(builder, x, y, width, height, style);
    } else if (f === 'interaction') {
      this.renderExternal_mxArchiMate3Interaction_background(builder, x, y, width, height, style);
    } else if (f === 'location') {
      this.renderExternal_mxArchiMate3LocationIcon_background(builder, x, y, width, height, style);
    } else if (f === 'serv') {
      builder.translate(0, 3);
      this.renderExternal_mxArchiMate3Service_background(builder, x, y, width, height - 6, style);
    } else if (f === 'equipment') {
      this.renderExternal_mxArchiMate3Equipment_background(builder, x, y, width, height, style);
    } else if (f === 'event') {
      builder.translate(0, 3);
      this.renderExternal_mxArchiMate3Event_background(builder, x, y, width, height - 6, style);
    } else if (f === 'event2') {
      builder.translate(0, 3);
      this.renderExternal_mxArchiMate3Event2_background(builder, x, y, width, height - 6, style);
    } else if (f === 'node') {
      this.renderExternal_mxArchiMate3Node_background(builder, x, y, width, height, style);
    } else if (f !== 'generic') {
      if (f === 'netw') {
        this.renderExternal_mxArchiMate3Network_background(builder, x, y, width, height, style);
      } else if (f === 'commPath') {
        builder.translate(0, 5);
        height -= 10;
        builder.begin();
        builder.moveTo(0.1 * width, 0);
        builder.lineTo(0, 0.5 * height);
        builder.lineTo(0.1 * width, height);
        builder.moveTo(0.9 * width, 0);
        builder.lineTo(width, 0.5 * height);
        builder.lineTo(0.9 * width, height);
        builder.stroke();
        builder.setDashed(!0);
        builder.begin();
        builder.moveTo(0, 0.5 * height);
        builder.lineTo(width, 0.5 * height);
        builder.stroke();
      } else if (f === 'artifact') {
        builder.translate(2, 0);
        width -= 4;
        builder.begin();
        builder.moveTo(0, 0);
        builder.lineTo(0.7 * width, 0);
        builder.lineTo(width, 0.22 * height);
        builder.lineTo(width, height);
        builder.lineTo(0, height);
        builder.close();
        builder.moveTo(0.7 * width, 0);
        builder.lineTo(0.7 * width, 0.22 * height);
        builder.lineTo(width, 0.22 * height);
        builder.stroke();
      } else if (f === 'actor') {
        builder.translate(3, 0);
        this.renderExternal_mxArchiMate3Actor_background(builder, x, y, width - 6, height, style);
      } else if (f === 'role') {
        builder.translate(0, 3);
        this.renderExternal_mxArchiMate3Role_background(builder, x, y, width, height - 6, style);
      } else if (f === 'passive') {
        builder.translate(0, 3);
        this.renderExternal_mxArchiMate3Passive_background(builder, x, y, width, height - 6, style);
      } else if (f === 'plateau') {
        builder.translate(0, 2);
        this.renderExternal_mxArchiMate3Plateau_background(builder, x, y, width, height - 4, style);
      } else if (f === 'product') {
        builder.translate(0, 3);
        this.renderExternal_mxArchiMate3ProductSmall_background(
          builder,
          x,
          y,
          width,
          height - 6,
          style
        );
      } else if (f === 'contract') {
        builder.translate(0, 3);
        this.renderExternal_mxArchiMate3ContractSmall_background(
          builder,
          x,
          y,
          width,
          height - 6,
          style
        );
      } else if (f === 'proc') {
        builder.translate(0, 3);
        this.renderExternal_mxArchiMate3Process_background(builder, x, y, width, height - 6, style);
      } else if (f === 'deliverable') {
        builder.translate(0, 2);
        this.renderExternal_mxArchiMate3Deliverable_background(
          builder,
          x,
          y,
          width,
          height - 4,
          style
        );
      } else if (f === 'device') {
        this.renderExternal_mxArchiMate3Device_background(builder, x, y, width, height, style);
      } else if (f === 'driver') {
        this.renderExternal_mxArchiMate3Driver_background(builder, x, y, width, height, style);
      } else if (f === 'assess') {
        this.renderExternal_mxArchiMate3Assessment_background(builder, x, y, width, height, style);
      } else if (f === 'goal') {
        this.renderExternal_mxArchiMate3Goal_background(builder, x, y, width, height, style);
      } else if (f === 'grouping') {
        builder.translate(0, 2);
        height -= 4;
        builder.setDashed(!0);
        this.renderExternal_mxArchiMate3Grouping_background(builder, x, y, width, height, style);
      } else if (f === 'outcome') {
        this.renderExternal_mxArchiMate3Outcome_background(builder, x, y, width, height, style);
      } else if (f === 'principle') {
        this.renderExternal_mxArchiMate3Principle_background(builder, x, y, width, height, style);
      } else if (f === 'representation') {
        builder.translate(0, 3);
        this.renderExternal_mxArchiMate3RepresentationSmall_background(
          builder,
          x,
          y,
          width,
          height - 6,
          style
        );
      } else if (f === 'requirement') {
        builder.translate(0, 4);
        this.renderExternal_mxArchiMate3Requirement_background(
          builder,
          x,
          y,
          width,
          height - 8,
          style
        );
      } else if (f === 'constraint') {
        builder.translate(0, 4);
        this.renderExternal_mxArchiMate3Constraint_background(
          builder,
          x,
          y,
          width,
          height - 8,
          style
        );
      } else if (f === 'material') {
        builder.translate(0, 1);
        this.renderExternal_mxArchiMate3Material_background(
          builder,
          x,
          y,
          width,
          height - 2,
          style
        );
      } else if (f === 'meaning') {
        builder.translate(0, 2);
        height -= 4;
        'mxgraph.basic.cloud_callout'.drawShape(builder, this, 0, 0, width, height);
      } else if (f === 'distribution') {
        builder.translate(0, 4);
        this.renderExternal_mxArchiMate3Distribution_background(
          builder,
          x,
          y,
          width,
          height - 8,
          style
        );
      } else if (f === 'resource') {
        builder.translate(0, 1);
        this.renderExternal_mxArchiMate3Resource_background(
          builder,
          x,
          y,
          width,
          height - 2,
          style
        );
      } else if (f === 'capability') {
        this.renderExternal_mxArchiMate3Capability_background(builder, x, y, width, height, style);
      } else if (f === 'course') {
        this.renderExternal_mxArchiMate3Course_background(builder, x, y, width, height, style);
      } else if (f === 'sysSw') {
        this.renderExternal_mxArchiMate3SysSw_background(builder, x, y, width, height, style);
      } else if (f === 'artifact') {
        builder.translate(2, 0);
        this.renderExternal_mxArchiMate3Artifact_background(
          builder,
          x,
          y,
          width - 4,
          height,
          style
        );
      } else if (f === 'path') {
        builder.translate(0, 5);
        this.renderExternal_mxArchiMate3Path_background(builder, x, y, width, height - 10, style);
      } else if (f === 'amValue') {
        builder.translate(0, 3);
        mxEllipse.prototype.paintVertexShape(builder, 0, 0, width, height - 6);
      } else if (f === 'valueStream') {
        builder.translate(0, 2);
        this.renderExternal_mxArchiMate3ValueStream_background(
          builder,
          x,
          y,
          width,
          height - 4,
          style
        );
      } else if (f === 'workPackage') {
        builder.translate(0, 1);
        this.renderExternal_mxArchiMate3WorkPackage_background(
          builder,
          x,
          y,
          width,
          height - 2,
          style
        );
      }
    }
  }

  private renderExternal_mxArchiMate3Component_background(
    builder: RenderContext['builder'],
    x: number,
    y: number,
    width: number,
    height: number,
    style: RenderContext['style']
  ): void {
    if (!builder) return;
    builder.rect(0.25 * width, 0, 0.75 * width, height);
    builder.fillAndStroke();
    builder.rect(0, 0.25 * height, 0.5 * width, 0.15 * height);
    builder.fillAndStroke();
    builder.rect(0, 0.6 * height, 0.5 * width, 0.15 * height);
    builder.fillAndStroke();
  }

  private renderExternal_mxArchiMate3Collaboration_background(
    builder: RenderContext['builder'],
    x: number,
    y: number,
    width: number,
    height: number,
    style: RenderContext['style']
  ): void {
    if (!builder) return;
    builder.ellipse(0, 0, 0.6 * width, height);
    builder.fillAndStroke();
    builder.ellipse(0.4 * width, 0, 0.6 * width, height);
    builder.fillAndStroke();
  }

  private renderExternal_mxArchiMate3Interface_background(
    builder: RenderContext['builder'],
    x: number,
    y: number,
    width: number,
    height: number,
    style: RenderContext['style']
  ): void {
    if (!builder) return;
    builder.ellipse(0.5 * width, 0, 0.5 * width, height);
    builder.fillAndStroke();
    builder.begin();
    builder.moveTo(0, 0.5 * height);
    builder.lineTo(0.5 * width, 0.5 * height);
    builder.stroke();
  }

  private renderExternal_mxArchiMate3Facility_background(
    builder: RenderContext['builder'],
    x: number,
    y: number,
    width: number,
    height: number,
    style: RenderContext['style']
  ): void {
    if (!builder) return;
    builder.begin();
    builder.moveTo(0, height);
    builder.lineTo(0, 0);
    builder.lineTo(0.13 * width, 0);
    builder.lineTo(0.13 * width, 0.7 * height);
    builder.lineTo(0.42 * width, 0.55 * height);
    builder.lineTo(0.42 * width, 0.7 * height);
    builder.lineTo(0.71 * width, 0.55 * height);
    builder.lineTo(0.71 * width, 0.7 * height);
    builder.lineTo(width, 0.55 * height);
    builder.lineTo(width, height);
    builder.close();
    builder.fillAndStroke();
  }

  private renderExternal_mxArchiMate3Function_background(
    builder: RenderContext['builder'],
    x: number,
    y: number,
    width: number,
    height: number,
    style: RenderContext['style']
  ): void {
    if (!builder) return;
    builder.begin();
    builder.moveTo(0.5 * width, 0);
    builder.lineTo(width, 0.2 * height);
    builder.lineTo(width, height);
    builder.lineTo(0.5 * width, 0.8 * height);
    builder.lineTo(0, height);
    builder.lineTo(0, 0.2 * height);
    builder.close();
    builder.fillAndStroke();
  }

  private renderExternal_mxArchiMate3GapIcon_background(
    builder: RenderContext['builder'],
    x: number,
    y: number,
    width: number,
    height: number,
    style: RenderContext['style']
  ): void {
    if (!builder) return;
    builder.setDashed(!1);
    builder.translate(0, 2);
    height -= 4;
    builder.ellipse(0.15 * width, 0, 0.7 * width, height);
    builder.fillAndStroke();
    builder.begin();
    builder.moveTo(0, 0.35 * height);
    builder.lineTo(width, 0.35 * height);
    builder.moveTo(0, 0.65 * height);
    builder.lineTo(width, 0.65 * height);
    builder.stroke();
  }

  private renderExternal_mxArchiMate3Interaction_background(
    builder: RenderContext['builder'],
    x: number,
    y: number,
    width: number,
    height: number,
    style: RenderContext['style']
  ): void {
    if (!builder) return;
    builder.begin();
    builder.moveTo(0.55 * width, 0);
    builder.arcTo(0.45 * width, 0.5 * height, 0, 0, 1, 0.55 * width, height);
    builder.close();
    builder.moveTo(0.45 * width, 0);
    builder.arcTo(0.45 * width, 0.5 * height, 0, 0, 0, 0.45 * width, height);
    builder.close();
    builder.fillAndStroke();
  }

  private renderExternal_mxArchiMate3LocationIcon_background(
    builder: RenderContext['builder'],
    x: number,
    y: number,
    width: number,
    height: number,
    style: RenderContext['style']
  ): void {
    if (!builder) return;
    builder.translate(3, 0);
    width -= 6;
    builder.begin();
    builder.moveTo(0.5 * width, 0);
    builder.curveTo(0.2842 * width, 0, 0, 0.1006 * height, 0, 0.3001 * height);
    builder.curveTo(
      0,
      0.4071 * height,
      0.0776 * width,
      0.4777 * height,
      0.1524 * width,
      0.5485 * height
    );
    builder.curveTo(
      0.2901 * width,
      0.6788 * height,
      0.4275 * width,
      0.7993 * height,
      0.5 * width,
      height
    );
    builder.curveTo(
      0.5725 * width,
      0.7993 * height,
      0.7099 * width,
      0.6788 * height,
      0.8476 * width,
      0.5485 * height
    );
    builder.curveTo(
      0.9224 * width,
      0.4777 * height,
      width,
      0.4071 * height,
      width,
      0.3001 * height
    );
    builder.curveTo(width, 0.1006 * height, 0.7158 * width, 0, 0.5 * width, 0);
    builder.close();
    builder.fillAndStroke();
  }

  private renderExternal_mxArchiMate3Service_background(
    builder: RenderContext['builder'],
    x: number,
    y: number,
    width: number,
    height: number,
    style: RenderContext['style']
  ): void {
    if (!builder) return;
    x = Math.max(width - 0.5 * height, 0.5 * width);
    width = Math.min(0.5 * height, 0.5 * width);
    builder.begin();
    builder.moveTo(x, 0);
    builder.arcTo(0.5 * height, 0.5 * height, 0, 0, 1, x, height);
    builder.lineTo(width, height);
    builder.arcTo(0.5 * height, 0.5 * height, 0, 0, 1, width, 0);
    builder.close();
    builder.fillAndStroke();
  }

  private renderExternal_mxArchiMate3Equipment_background(
    builder: RenderContext['builder'],
    x: number,
    y: number,
    width: number,
    height: number,
    style: RenderContext['style']
  ): void {
    if (!builder) return;
    builder.begin();
    builder.moveTo(0.72 * width, 0.38 * height);
    builder.curveTo(
      0.78 * width,
      0.38 * width,
      0.85 * width,
      0.34 * height,
      0.85 * width,
      0.26 * height
    );
    builder.curveTo(
      0.85 * width,
      0.18 * width,
      0.78 * width,
      0.14 * height,
      0.73 * width,
      0.14 * height
    );
    builder.curveTo(
      0.64 * width,
      0.14 * width,
      0.59 * width,
      0.2 * height,
      0.59 * width,
      0.26 * height
    );
    builder.curveTo(
      0.59 * width,
      0.33 * height,
      0.65 * width,
      0.38 * width,
      0.72 * width,
      0.38 * height
    );
    builder.close();
    builder.moveTo(0.68 * width, 0.52 * height);
    builder.lineTo(0.67 * width, 0.45 * height);
    builder.lineTo(0.61 * width, 0.43 * height);
    builder.lineTo(0.56 * width, 0.48 * height);
    builder.lineTo(0.5 * width, 0.42 * height);
    builder.lineTo(0.54 * width, 0.36 * height);
    builder.lineTo(0.52 * width, 0.31 * height);
    builder.lineTo(0.45 * width, 0.31 * height);
    builder.lineTo(0.45 * width, 0.22 * height);
    builder.lineTo(0.52 * width, 0.21 * height);
    builder.lineTo(0.54 * width, 0.16 * height);
    builder.lineTo(0.5 * width, 0.11 * height);
    builder.lineTo(0.56 * width, 0.05 * height);
    builder.lineTo(0.62 * width, 0.09 * height);
    builder.lineTo(0.67 * width, 0.07 * height);
    builder.lineTo(0.68 * width, 0);
    builder.lineTo(0.77 * width, 0);
    builder.lineTo(0.78 * width, 0.07 * height);
    builder.lineTo(0.83 * width, 0.09 * height);
    builder.lineTo(0.89 * width, 0.05 * height);
    builder.lineTo(0.95 * width, 0.11 * height);
    builder.lineTo(0.91 * width, 0.16 * height);
    builder.lineTo(0.93 * width, 0.21 * height);
    builder.lineTo(width, 0.22 * height);
    builder.lineTo(width, 0.31 * height);
    builder.lineTo(0.93 * width, 0.31 * height);
    builder.lineTo(0.91 * width, 0.36 * height);
    builder.lineTo(0.95 * width, 0.41 * height);
    builder.lineTo(0.89 * width, 0.47 * height);
    builder.lineTo(0.83 * width, 0.43 * height);
    builder.lineTo(0.78 * width, 0.45 * height);
    builder.lineTo(0.77 * width, 0.52 * height);
    builder.lineTo(0.68 * width, 0.52 * height);
    builder.close();
    builder.moveTo(0.36 * width, 0.81 * height);
    builder.curveTo(
      0.44 * width,
      0.81 * height,
      0.52 * width,
      0.75 * height,
      0.52 * width,
      0.67 * height
    );
    builder.curveTo(
      0.52 * width,
      0.59 * height,
      0.45 * width,
      0.51 * height,
      0.35 * width,
      0.51 * height
    );
    builder.curveTo(
      0.27 * width,
      0.51 * height,
      0.19 * width,
      0.58 * height,
      0.19 * width,
      0.67 * height
    );
    builder.curveTo(
      0.19 * width,
      0.74 * height,
      0.27 * width,
      0.82 * height,
      0.36 * width,
      0.81 * height
    );
    builder.close();
    builder.moveTo(0.21 * width, 0.98 * height);
    builder.lineTo(0.22 * width, 0.89 * height);
    builder.lineTo(0.16 * width, 0.85 * height);
    builder.lineTo(0.08 * width, 0.88 * height);
    builder.lineTo(0.02 * width, 0.79 * height);
    builder.lineTo(0.09 * width, 0.74 * height);
    builder.lineTo(0.08 * width, 0.67 * height);
    builder.lineTo(0, 0.63 * height);
    builder.lineTo(0.03 * width, 0.53 * height);
    builder.lineTo(0.12 * width, 0.54 * height);
    builder.lineTo(0.16 * width, 0.48 * height);
    builder.lineTo(0.13 * width, 0.4 * height);
    builder.lineTo(0.22 * width, 0.35 * height);
    builder.lineTo(0.28 * width, 0.42 * height);
    builder.lineTo(0.36 * width, 0.41 * height);
    builder.lineTo(0.39 * width, 0.33 * height);
    builder.lineTo(0.5 * width, 0.36 * height);
    builder.lineTo(0.49 * width, 0.45 * height);
    builder.lineTo(0.55 * width, 0.49 * height);
    builder.lineTo(0.63 * width, 0.45 * height);
    builder.lineTo(0.69 * width, 0.54 * height);
    builder.lineTo(0.62 * width, 0.6 * height);
    builder.lineTo(0.63 * width, 0.67 * height);
    builder.lineTo(0.71 * width, 0.7 * height);
    builder.lineTo(0.68 * width, 0.8 * height);
    builder.lineTo(0.59 * width, 0.79 * height);
    builder.lineTo(0.55 * width, 0.85 * height);
    builder.lineTo(0.59 * width, 0.79 * height);
    builder.lineTo(0.55 * width, 0.85 * height);
    builder.lineTo(0.59 * width, 0.93 * height);
    builder.lineTo(0.49 * width, 0.98 * height);
    builder.lineTo(0.43 * width, 0.91 * height);
    builder.lineTo(0.36 * width, 0.92 * height);
    builder.lineTo(0.32 * width, height);
    builder.lineTo(0.21 * width, 0.98 * height);
    builder.close();
    builder.fillAndStroke();
  }

  private renderExternal_mxArchiMate3Event_background(
    builder: RenderContext['builder'],
    x: number,
    y: number,
    width: number,
    height: number,
    style: RenderContext['style']
  ): void {
    if (!builder) return;
    builder.begin();
    builder.moveTo(width - 0.5 * height, 0);
    builder.arcTo(0.5 * height, 0.5 * height, 0, 0, 1, width - 0.5 * height, height);
    builder.lineTo(0, height);
    builder.lineTo(0.5 * height, 0.5 * height);
    builder.lineTo(0, 0);
    builder.close();
    builder.fillAndStroke();
  }

  private renderExternal_mxArchiMate3Event2_background(
    builder: RenderContext['builder'],
    x: number,
    y: number,
    width: number,
    height: number,
    style: RenderContext['style']
  ): void {
    if (!builder) return;
    builder.begin();
    builder.moveTo(width - 0.5 * height, 0);
    builder.arcTo(0.5 * height, 0.5 * height, 0, 0, 1, width - 0.5 * height, height);
    builder.lineTo(0, height);
    builder.arcTo(0.5 * height, 0.5 * height, 0, 0, 0, 0, 0);
    builder.close();
    builder.fillAndStroke();
  }

  private renderExternal_mxArchiMate3Node_background(
    builder: RenderContext['builder'],
    x: number,
    y: number,
    width: number,
    height: number,
    style: RenderContext['style']
  ): void {
    if (!builder) return;
    builder.begin();
    builder.moveTo(0, 0.25 * height);
    builder.lineTo(0.25 * width, 0);
    builder.lineTo(width, 0);
    builder.lineTo(width, 0.75 * height);
    builder.lineTo(0.75 * width, height);
    builder.lineTo(0, height);
    builder.close();
    builder.moveTo(0, 0.25 * height);
    builder.lineTo(0.75 * width, 0.25 * height);
    builder.lineTo(0.75 * width, height);
    builder.moveTo(width, 0);
    builder.lineTo(0.75 * width, 0.25 * height);
    builder.fillAndStroke();
  }

  private renderExternal_mxArchiMate3Network_background(
    builder: RenderContext['builder'],
    x: number,
    y: number,
    width: number,
    height: number,
    style: RenderContext['style']
  ): void {
    if (!builder) return;
    builder.translate(0, 2);
    height -= 4;
    builder.begin();
    builder.moveTo(0.4 * width, 0.2 * height);
    builder.lineTo(0.85 * width, 0.2 * height);
    builder.lineTo(0.6 * width, 0.8 * height);
    builder.lineTo(0.15 * width, 0.8 * height);
    builder.close();
    builder.stroke();
    x = this.getStyleValue(this.renderCtx.style, 'strokeColor', '#000000');
    builder.setFillColor(x as string);
    builder.ellipse(0.25 * width, 0, 0.3 * width, 0.4 * height);
    builder.fill();
    builder.ellipse(0.7 * width, 0, 0.3 * width, 0.4 * height);
    builder.fill();
    builder.ellipse(0, 0.6 * height, 0.3 * width, 0.4 * height);
    builder.fill();
    builder.ellipse(0.45 * width, 0.6 * height, 0.3 * width, 0.4 * height);
    builder.fill();
  }

  private renderExternal_mxArchiMate3Actor_background(
    builder: RenderContext['builder'],
    x: number,
    y: number,
    width: number,
    height: number,
    style: RenderContext['style']
  ): void {
    if (!builder) return;
    builder.ellipse(0.2 * width, 0, 0.6 * width, 0.3 * height);
    builder.fillAndStroke();
    builder.begin();
    builder.moveTo(0.5 * width, 0.3 * height);
    builder.lineTo(0.5 * width, 0.75 * height);
    builder.moveTo(0, 0.45 * height);
    builder.lineTo(width, 0.45 * height);
    builder.moveTo(0, height);
    builder.lineTo(0.5 * width, 0.75 * height);
    builder.lineTo(width, height);
    builder.stroke();
  }

  private renderExternal_mxArchiMate3Role_background(
    builder: RenderContext['builder'],
    x: number,
    y: number,
    width: number,
    height: number,
    style: RenderContext['style']
  ): void {
    if (!builder) return;
    builder.begin();
    builder.moveTo(0.8 * width, 0);
    builder.lineTo(0.2 * width, 0);
    builder.arcTo(0.2 * width, 0.5 * height, 0, 0, 0, 0.2 * width, height);
    builder.lineTo(0.8 * width, height);
    builder.fillAndStroke();
    builder.ellipse(0.6 * width, 0, 0.4 * width, height);
    builder.fillAndStroke();
  }

  private renderExternal_mxArchiMate3Passive_background(
    builder: RenderContext['builder'],
    x: number,
    y: number,
    width: number,
    height: number,
    style: RenderContext['style']
  ): void {
    if (!builder) return;
    builder.begin();
    builder.moveTo(0, 0);
    builder.lineTo(width, 0);
    builder.lineTo(width, height);
    builder.lineTo(0, height);
    builder.close();
    builder.moveTo(0, 0.2 * height);
    builder.lineTo(width, 0.2 * height);
    builder.fillAndStroke();
  }

  private renderExternal_mxArchiMate3Plateau_background(
    builder: RenderContext['builder'],
    x: number,
    y: number,
    width: number,
    height: number,
    style: RenderContext['style']
  ): void {
    if (!builder) return;
    x = this.getStyleValue(this.renderCtx.style, 'strokeColor', '#000000');
    builder.setFillColor(x as string);
    builder.rect(0.4 * width, 0, 0.6 * width, 0.2 * height);
    builder.fill();
    builder.rect(0.2 * width, 0.4 * height, 0.6 * width, 0.2 * height);
    builder.fill();
    builder.rect(0, 0.8 * height, 0.6 * width, 0.2 * height);
    builder.fill();
  }

  private renderExternal_mxArchiMate3ProductSmall_background(
    builder: RenderContext['builder'],
    x: number,
    y: number,
    width: number,
    height: number,
    style: RenderContext['style']
  ): void {
    if (!builder) return;
    builder.begin();
    builder.moveTo(0, 0);
    builder.lineTo(width, 0);
    builder.lineTo(width, height);
    builder.lineTo(0, height);
    builder.close();
    builder.moveTo(0, 0.2 * height);
    builder.lineTo(0.5 * width, 0.2 * height);
    builder.lineTo(0.5 * width, 0);
    builder.fillAndStroke();
  }

  private renderExternal_mxArchiMate3ContractSmall_background(
    builder: RenderContext['builder'],
    x: number,
    y: number,
    width: number,
    height: number,
    style: RenderContext['style']
  ): void {
    if (!builder) return;
    builder.begin();
    builder.moveTo(0, 0);
    builder.lineTo(width, 0);
    builder.lineTo(width, height);
    builder.lineTo(0, height);
    builder.close();
    builder.moveTo(0, 0.2 * height);
    builder.lineTo(width, 0.2 * height);
    builder.moveTo(0, 0.8 * height);
    builder.lineTo(width, 0.8 * height);
    builder.fillAndStroke();
  }

  private renderExternal_mxArchiMate3Process_background(
    builder: RenderContext['builder'],
    x: number,
    y: number,
    width: number,
    height: number,
    style: RenderContext['style']
  ): void {
    if (!builder) return;
    builder.begin();
    builder.moveTo(0, 0.3 * height);
    builder.lineTo(0.6 * width, 0.3 * height);
    builder.lineTo(0.6 * width, 0);
    builder.lineTo(width, 0.5 * height);
    builder.lineTo(0.6 * width, height);
    builder.lineTo(0.6 * width, 0.7 * height);
    builder.lineTo(0, 0.7 * height);
    builder.close();
    builder.fillAndStroke();
  }

  private renderExternal_mxArchiMate3Deliverable_background(
    builder: RenderContext['builder'],
    x: number,
    y: number,
    width: number,
    height: number,
    style: RenderContext['style']
  ): void {
    if (!builder) return;
    builder.begin();
    builder.moveTo(0, 0);
    builder.lineTo(width, 0);
    builder.lineTo(width, 0.85 * height);
    builder.arcTo(0.35 * width, 0.35 * height, 0, 0, 0, 0.5 * width, 0.85 * height);
    builder.arcTo(0.35 * width, 0.35 * height, 0, 0, 1, 0, 0.85 * height);
    builder.close();
    builder.fillAndStroke();
  }

  private renderExternal_mxArchiMate3Device_background(
    builder: RenderContext['builder'],
    x: number,
    y: number,
    width: number,
    height: number,
    style: RenderContext['style']
  ): void {
    if (!builder) return;
    builder.roundrect(0, 0, width, 0.88 * height, 0.1 * width, 0.1 * height);
    builder.fillAndStroke();
    builder.begin();
    builder.moveTo(0.1 * width, 0.88 * height);
    builder.lineTo(0, height);
    builder.lineTo(width, height);
    builder.lineTo(0.9 * width, 0.88 * height);
    builder.fillAndStroke();
  }

  private renderExternal_mxArchiMate3Driver_background(
    builder: RenderContext['builder'],
    x: number,
    y: number,
    width: number,
    height: number,
    style: RenderContext['style']
  ): void {
    if (!builder) return;
    builder.begin();
    builder.moveTo(0, 0.5 * height);
    builder.lineTo(width, 0.5 * height);
    builder.moveTo(0.5 * width, 0);
    builder.lineTo(0.5 * width, height);
    builder.moveTo(0.145 * width, 0.145 * height);
    builder.lineTo(0.855 * width, 0.855 * height);
    builder.moveTo(0.145 * width, 0.855 * height);
    builder.lineTo(0.855 * width, 0.145 * height);
    builder.stroke();
    x = this.getStyleValue(this.renderCtx.style, 'strokeColor', '#000000');
    builder.setFillColor(x as string);
    builder.ellipse(0.35 * width, 0.35 * height, 0.3 * width, 0.3 * height);
    builder.fillAndStroke();
    builder.setStrokeWidth(2);
    builder.ellipse(0.1 * width, 0.1 * height, 0.8 * width, 0.8 * height);
    builder.stroke();
  }

  private renderExternal_mxArchiMate3Assessment_background(
    builder: RenderContext['builder'],
    x: number,
    y: number,
    width: number,
    height: number,
    style: RenderContext['style']
  ): void {
    if (!builder) return;
    builder.ellipse(0.2 * width, 0, 0.8 * width, 0.8 * height);
    builder.fillAndStroke();
    builder.begin();
    builder.moveTo(0, height);
    builder.lineTo(0.32 * width, 0.68 * height);
    builder.stroke();
  }

  private renderExternal_mxArchiMate3Goal_background(
    builder: RenderContext['builder'],
    x: number,
    y: number,
    width: number,
    height: number,
    style: RenderContext['style']
  ): void {
    if (!builder) return;
    builder.ellipse(0, 0, width, height);
    builder.fillAndStroke();
    builder.ellipse(0.15 * width, 0.15 * height, 0.7 * width, 0.7 * height);
    builder.stroke();
    x = this.getStyleValue(this.renderCtx.style, 'strokeColor', '#000000');
    builder.setFillColor(x as string);
    builder.ellipse(0.3 * width, 0.3 * height, 0.4 * width, 0.4 * height);
    builder.fillAndStroke();
  }

  private renderExternal_mxArchiMate3Grouping_background(
    builder: RenderContext['builder'],
    x: number,
    y: number,
    width: number,
    height: number,
    style: RenderContext['style']
  ): void {
    if (!builder) return;
    builder.begin();
    builder.moveTo(0, 0.3 * height);
    builder.lineTo(width, 0.3 * height);
    builder.lineTo(width, height);
    builder.lineTo(0, height);
    builder.close();
    builder.moveTo(0, 0.3 * height);
    builder.lineTo(0, 0);
    builder.lineTo(0.75 * width, 0);
    builder.lineTo(0.75 * width, 0.3 * height);
    builder.fillAndStroke();
  }

  private renderExternal_mxArchiMate3Outcome_background(
    builder: RenderContext['builder'],
    x: number,
    y: number,
    width: number,
    height: number,
    style: RenderContext['style']
  ): void {
    if (!builder) return;
    x = this.getStyleValue(this.renderCtx.style, 'strokeWidth', 1);
    builder.ellipse(0, 0.2 * width, 0.8 * width, 0.8 * height);
    builder.fillAndStroke();
    builder.ellipse(0.15 * width, 0.35 * width, 0.5 * width, 0.5 * height);
    builder.stroke();
    builder.ellipse(0.3 * width, 0.5 * width, 0.2 * width, 0.2 * height);
    builder.stroke();
    builder.setStrokeWidth(3 * x);
    builder.setLineCap('round');
    builder.begin();
    builder.moveTo(0.4 * width, 0.6 * height);
    builder.lineTo(0.9 * width, 0.1 * height);
    builder.moveTo(0.42 * width, 0.4 * height);
    builder.lineTo(0.4 * width, 0.6 * height);
    builder.lineTo(0.6 * width, 0.58 * height);
    builder.moveTo(0.8 * width, 0);
    builder.lineTo(0.75 * width, 0.25 * height);
    builder.lineTo(width, 0.2 * height);
    builder.stroke();
  }

  private renderExternal_mxArchiMate3Principle_background(
    builder: RenderContext['builder'],
    x: number,
    y: number,
    width: number,
    height: number,
    style: RenderContext['style']
  ): void {
    if (!builder) return;
    builder.begin();
    builder.moveTo(0.05 * width, 0.05 * height);
    builder.arcTo(2.3 * width, 2.3 * height, 0, 0, 1, 0.95 * width, 0.05 * height);
    builder.arcTo(2.3 * width, 2.3 * height, 0, 0, 1, 0.95 * width, 0.95 * height);
    builder.arcTo(2.3 * width, 2.3 * height, 0, 0, 1, 0.05 * width, 0.95 * height);
    builder.arcTo(2.3 * width, 2.3 * height, 0, 0, 1, 0.05 * width, 0.05 * height);
    builder.close();
    builder.fillAndStroke();
    x = this.getStyleValue(this.renderCtx.style, 'strokeColor', '#000000');
    builder.setFillColor(x as string);
    builder.begin();
    builder.moveTo(0.45 * width, 0.7 * height);
    builder.lineTo(0.42 * width, 0.15 * height);
    builder.lineTo(0.58 * width, 0.15 * height);
    builder.lineTo(0.55 * width, 0.7 * height);
    builder.close();
    builder.fill();
    builder.rect(0.45 * width, 0.75 * height, 0.1 * width, 0.1 * height);
    builder.fill();
  }

  private renderExternal_mxArchiMate3RepresentationSmall_background(
    builder: RenderContext['builder'],
    x: number,
    y: number,
    width: number,
    height: number,
    style: RenderContext['style']
  ): void {
    if (!builder) return;
    builder.begin();
    builder.moveTo(0, 0);
    builder.lineTo(width, 0);
    builder.lineTo(width, 0.85 * height);
    builder.arcTo(0.35 * width, 0.35 * height, 0, 0, 0, 0.5 * width, 0.85 * height);
    builder.arcTo(0.35 * width, 0.35 * height, 0, 0, 1, 0, 0.85 * height);
    builder.close();
    builder.moveTo(0, 0.2 * height);
    builder.lineTo(width, 0.2 * height);
    builder.fillAndStroke();
  }

  private renderExternal_mxArchiMate3Requirement_background(
    builder: RenderContext['builder'],
    x: number,
    y: number,
    width: number,
    height: number,
    style: RenderContext['style']
  ): void {
    if (!builder) return;
    builder.begin();
    builder.moveTo(0.25 * width, 0);
    builder.lineTo(width, 0);
    builder.lineTo(0.75 * width, height);
    builder.lineTo(0, height);
    builder.close();
    builder.fillAndStroke();
  }

  private renderExternal_mxArchiMate3Constraint_background(
    builder: RenderContext['builder'],
    x: number,
    y: number,
    width: number,
    height: number,
    style: RenderContext['style']
  ): void {
    if (!builder) return;
    builder.begin();
    builder.moveTo(0.25 * width, 0);
    builder.lineTo(width, 0);
    builder.lineTo(0.75 * width, height);
    builder.lineTo(0, height);
    builder.close();
    builder.moveTo(0.45 * width, 0);
    builder.lineTo(0.2 * width, height);
    builder.fillAndStroke();
  }

  private renderExternal_mxArchiMate3Material_background(
    builder: RenderContext['builder'],
    x: number,
    y: number,
    width: number,
    height: number,
    style: RenderContext['style']
  ): void {
    if (!builder) return;
    builder.begin();
    builder.moveTo(0, 0.5 * height);
    builder.lineTo(0.25 * width, 0);
    builder.lineTo(0.75 * width, 0);
    builder.lineTo(width, 0.5 * height);
    builder.lineTo(0.75 * width, height);
    builder.lineTo(0.25 * width, height);
    builder.close();
    builder.moveTo(0.15 * width, 0.5 * height);
    builder.lineTo(0.31 * width, 0.2 * height);
    builder.moveTo(0.69 * width, 0.2 * height);
    builder.lineTo(0.85 * width, 0.5 * height);
    builder.moveTo(0.68 * width, 0.8 * height);
    builder.lineTo(0.32 * width, 0.8 * height);
    builder.fillAndStroke();
  }

  private renderExternal_mxArchiMate3Distribution_background(
    builder: RenderContext['builder'],
    x: number,
    y: number,
    width: number,
    height: number,
    style: RenderContext['style']
  ): void {
    if (!builder) return;
    builder.begin();
    builder.moveTo(0.1 * width, 0.25 * height);
    builder.lineTo(0.9 * width, 0.25 * height);
    builder.lineTo(width, 0.5 * height);
    builder.lineTo(0.9 * width, 0.75 * height);
    builder.lineTo(0.1 * width, 0.75 * height);
    builder.lineTo(0, 0.5 * height);
    builder.fillAndStroke();
    builder.begin();
    builder.moveTo(0.2 * width, 0);
    builder.lineTo(0, 0.5 * height);
    builder.lineTo(0.2 * width, height);
    builder.moveTo(0.8 * width, 0);
    builder.lineTo(width, 0.5 * height);
    builder.lineTo(0.8 * width, height);
    builder.stroke();
  }

  private renderExternal_mxArchiMate3Resource_background(
    builder: RenderContext['builder'],
    x: number,
    y: number,
    width: number,
    height: number,
    style: RenderContext['style']
  ): void {
    if (!builder) return;
    builder.begin();
    builder.moveTo(0.51 * width, 0.34 * height);
    builder.lineTo(0.51 * width, 0.65 * height);
    builder.moveTo(0.35 * width, 0.34 * height);
    builder.lineTo(0.35 * width, 0.65 * height);
    builder.moveTo(0.19 * width, 0.34 * height);
    builder.lineTo(0.19 * width, 0.65 * height);
    builder.moveTo(0.91 * width, 0.4 * height);
    builder.curveTo(
      0.93 * width,
      0.39 * height,
      0.95 * width,
      0.39 * height,
      0.97 * width,
      0.4 * height
    );
    builder.curveTo(0.99 * width, 0.4 * height, width, 0.41 * height, width, 0.43 * height);
    builder.curveTo(width, 0.48 * height, width, 0.52 * height, width, 0.57 * height);
    builder.curveTo(width, 0.58 * height, 0.99 * width, 0.59 * height, 0.98 * width, 0.6 * height);
    builder.curveTo(
      0.96 * width,
      0.6 * height,
      0.93 * width,
      0.6 * height,
      0.91 * width,
      0.6 * height
    );
    builder.moveTo(0, 0.73 * height);
    builder.curveTo(0, 0.6 * height, 0, 0.43 * height, 0, 0.27 * height);
    builder.curveTo(0, 0.24 * height, 0.03 * width, 0.21 * height, 0.08 * width, 0.21 * height);
    builder.curveTo(
      0.33 * width,
      0.2 * height,
      0.61 * width,
      0.2 * height,
      0.84 * width,
      0.21 * height
    );
    builder.curveTo(
      0.88 * width,
      0.22 * height,
      0.89 * width,
      0.24 * height,
      0.9 * width,
      0.26 * height
    );
    builder.curveTo(
      0.91 * width,
      0.41 * height,
      0.91 * width,
      0.57 * height,
      0.9 * width,
      0.72 * height
    );
    builder.curveTo(
      0.9 * width,
      0.74 * height,
      0.88 * width,
      0.78 * height,
      0.83 * width,
      0.79 * height
    );
    builder.curveTo(
      0.57 * width,
      0.79 * height,
      0.32 * width,
      0.79 * height,
      0.06 * width,
      0.79 * height
    );
    builder.curveTo(0.02 * width, 0.78 * height, 0, 0.76 * height, 0, 0.73 * height);
    builder.close();
    builder.fillAndStroke();
  }

  private renderExternal_mxArchiMate3Capability_background(
    builder: RenderContext['builder'],
    x: number,
    y: number,
    width: number,
    height: number,
    style: RenderContext['style']
  ): void {
    if (!builder) return;
    builder.begin();
    builder.moveTo(width, 0);
    builder.lineTo(width, height);
    builder.lineTo(0, height);
    builder.lineTo(0, 0.67 * height);
    builder.lineTo(0.33 * width, 0.67 * height);
    builder.lineTo(0.33 * width, 0.33 * height);
    builder.lineTo(0.67 * width, 0.33 * height);
    builder.lineTo(0.67 * width, 0);
    builder.close();
    builder.moveTo(0.67 * width, 0.33 * height);
    builder.lineTo(width, 0.33 * height);
    builder.moveTo(0.33 * width, 0.67 * height);
    builder.lineTo(width, 0.67 * height);
    builder.moveTo(0.33 * width, 0.67 * height);
    builder.lineTo(0.33 * width, height);
    builder.moveTo(0.67 * width, 0.33 * height);
    builder.lineTo(0.67 * width, height);
    builder.fillAndStroke();
  }

  private renderExternal_mxArchiMate3Course_background(
    builder: RenderContext['builder'],
    x: number,
    y: number,
    width: number,
    height: number,
    style: RenderContext['style']
  ): void {
    if (!builder) return;
    x = this.getStyleValue(this.renderCtx.style, 'strokeWidth', 1);
    builder.ellipse(0.4 * width, 0, 0.6 * width, 0.6 * height);
    builder.fillAndStroke();
    builder.ellipse(0.5 * width, 0.1 * height, 0.4 * width, 0.4 * height);
    builder.stroke();
    builder.setStrokeWidth(3 * x);
    builder.setLineCap('round');
    builder.begin();
    builder.moveTo(0, height);
    builder.arcTo(0.7 * width, 0.7 * height, 0, 0, 1, 0.41 * width, 0.56 * height);
    builder.moveTo(0.14 * width, 0.54 * height);
    builder.lineTo(0.41 * width, 0.56 * height);
    builder.lineTo(0.3 * width, 0.78 * height);
    builder.stroke();
    x = this.getStyleValue(this.renderCtx.style, 'strokeColor', '#000000');
    builder.setFillColor(x as string);
    builder.ellipse(0.6 * width, 0.2 * height, 0.2 * width, 0.2 * height);
    builder.fill();
  }

  private renderExternal_mxArchiMate3SysSw_background(
    builder: RenderContext['builder'],
    x: number,
    y: number,
    width: number,
    height: number,
    style: RenderContext['style']
  ): void {
    if (!builder) return;
    builder.ellipse(0.3 * width, 0, 0.7 * width, 0.7 * height);
    builder.fillAndStroke();
    builder.ellipse(0, 0.02 * height, 0.98 * width, 0.98 * height);
    builder.fillAndStroke();
  }

  private renderExternal_mxArchiMate3Artifact_background(
    builder: RenderContext['builder'],
    x: number,
    y: number,
    width: number,
    height: number,
    style: RenderContext['style']
  ): void {
    if (!builder) return;
    builder.begin();
    builder.moveTo(0, 0);
    builder.lineTo(0.7 * width, 0);
    builder.lineTo(width, 0.22 * height);
    builder.lineTo(width, height);
    builder.lineTo(0, height);
    builder.close();
    builder.fillAndStroke();
    builder.begin();
    builder.moveTo(0.7 * width, 0);
    builder.lineTo(0.7 * width, 0.22 * height);
    builder.lineTo(width, 0.22 * height);
    builder.stroke();
  }

  private renderExternal_mxArchiMate3Path_background(
    builder: RenderContext['builder'],
    x: number,
    y: number,
    width: number,
    height: number,
    style: RenderContext['style']
  ): void {
    if (!builder) return;
    builder.begin();
    builder.moveTo(0.2 * width, height);
    builder.lineTo(0, 0.5 * height);
    builder.lineTo(0.2 * width, 0);
    builder.moveTo(0.8 * width, height);
    builder.lineTo(width, 0.5 * height);
    builder.lineTo(0.8 * width, 0);
    builder.stroke();
    builder.setDashed(!0);
    builder.begin();
    builder.moveTo(0, 0.5 * height);
    builder.lineTo(width, 0.5 * height);
    builder.stroke();
  }

  private renderExternal_mxArchiMate3ValueStream_background(
    builder: RenderContext['builder'],
    x: number,
    y: number,
    width: number,
    height: number,
    style: RenderContext['style']
  ): void {
    if (!builder) return;
    builder.begin();
    builder.moveTo(0, 0);
    builder.lineTo(0.75 * width, 0);
    builder.lineTo(width, 0.5 * height);
    builder.lineTo(0.75 * width, height);
    builder.lineTo(0 * width, height);
    builder.lineTo(0.25 * width, 0.5 * height);
    builder.close();
    builder.fillAndStroke();
  }

  private renderExternal_mxArchiMate3WorkPackage_background(
    builder: RenderContext['builder'],
    x: number,
    y: number,
    width: number,
    height: number,
    style: RenderContext['style']
  ): void {
    if (!builder) return;
    builder.begin();
    builder.moveTo(0.733 * width, 0.7765 * height);
    builder.lineTo(0.3308 * width, 0.7765 * height);
    builder.curveTo(
      0.1856 * width,
      0.7765 * height,
      0.034 * width,
      0.6281 * height,
      0.034 * width,
      0.3939 * height
    );
    builder.curveTo(
      0.0314 * width,
      0.2015 * height,
      0.1742 * width,
      0.0381 * height,
      0.3308 * width,
      0.0381 * height
    );
    builder.curveTo(
      0.5106 * width,
      0.0381 * height,
      0.6267 * width,
      0.2026 * height,
      0.6267 * width,
      0.3939 * height
    );
    builder.curveTo(
      0.6267 * width,
      0.4924 * height,
      0.5785 * width,
      0.603 * height,
      0.4776 * width,
      0.6743 * height
    );
    builder.stroke();
    x = this.getStyleValue(this.renderCtx.style, 'strokeColor', '#000000');
    builder.setFillColor(x as string);
    builder.begin();
    builder.moveTo(0.7247 * width, 0.908 * height);
    builder.lineTo(0.7247 * width, 0.6418 * height);
    builder.lineTo(0.9147 * width, 0.7749 * height);
    builder.close();
    builder.fillAndStroke();
  }
}
