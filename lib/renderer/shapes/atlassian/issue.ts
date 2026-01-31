// @ts-nocheck
import type { RenderContext, ShapeAttrs } from '../../../renderer.ts';
import { RectangleShapeHandler } from '../../shape-registry.ts';

export class AtlassianIssueHandler extends RectangleShapeHandler {
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
      getStencilSvg,
      renderStencilShape,
    } = this.renderCtx;
    if (!builder || !currentGroup) return;
    if (width <= 0 || height <= 0) return;

    builder.setCanvasRoot(currentGroup);
    builder.save();
    applyShapeAttrsToBuilder(builder, attrs);
    let d = x;
    let e = y;
    let c = height;

    builder.begin();
    builder.rect(x, y, width, height);
    builder.fillAndStroke();
    const __tx = d;
    const __ty = e;
    builder.translate(d, e);
    c = this.getStyleValue(style, 'issueType', 'task');
    e = this.getStyleValue(style, 'issuePriority', 'minor');
    d = this.getStyleValue(style, 'issueStatus', 'todo');
    builder.setStrokeColor('none' as string);
    switch (c) {
      case 'story':
        c = 'mxgraph.atlassian.story';
        if (null != c) {
          builder.setFillColor('#61B659' as string);
          this.renderStencilByName(
            c,
            __tx + 5,
            __ty + 5,
            10,
            10,
            '#61B659',
            style,
            getStencilSvg,
            renderStencilShape
          );
        }
        break;
      case 'task':
        c = 'mxgraph.atlassian.task';
        if (null != c) {
          builder.setFillColor('#5EA3E4' as string);
          this.renderStencilByName(
            c,
            __tx + 5,
            __ty + 5,
            10,
            10,
            '#5EA3E4',
            style,
            getStencilSvg,
            renderStencilShape
          );
        }
        break;
      case 'subTask':
        c = 'mxgraph.atlassian.subtask';
        if (null != c) {
          builder.setFillColor('#5EA3E4' as string);
          this.renderStencilByName(
            c,
            __tx + 5,
            __ty + 5,
            10,
            10,
            '#5EA3E4',
            style,
            getStencilSvg,
            renderStencilShape
          );
        }
        break;
      case 'feature':
        c = 'mxgraph.atlassian.new_feature';
        if (null != c) {
          builder.setFillColor('#61B659' as string);
          this.renderStencilByName(
            c,
            __tx + 5,
            __ty + 5,
            10,
            10,
            '#61B659',
            style,
            getStencilSvg,
            renderStencilShape
          );
        }
        break;
      case 'bug':
        c = 'mxgraph.atlassian.bug';
        if (null != c) {
          builder.setFillColor('#CE0000' as string);
          this.renderStencilByName(
            c,
            __tx + 5,
            __ty + 5,
            10,
            10,
            '#CE0000',
            style,
            getStencilSvg,
            renderStencilShape
          );
        }
        break;
      case 'techTask':
        c = 'mxgraph.atlassian.tech_task';
        if (null != c) {
          builder.setFillColor('#999C95' as string);
          this.renderStencilByName(
            c,
            __tx + 5,
            __ty + 5,
            10,
            10,
            '#999C95',
            style,
            getStencilSvg,
            renderStencilShape
          );
        }
        break;
      case 'epic':
        c = 'mxgraph.atlassian.epic';
        if (null != c) {
          builder.setFillColor('#9E4ADD' as string);
          this.renderStencilByName(
            c,
            __tx + 5,
            __ty + 5,
            10,
            10,
            '#9E4ADD',
            style,
            getStencilSvg,
            renderStencilShape
          );
        }
        break;
      case 'improvement':
        c = 'mxgraph.atlassian.improvement';
        if (null != c) {
          builder.setFillColor('#61B659' as string);
          this.renderStencilByName(
            c,
            __tx + 5,
            __ty + 5,
            10,
            10,
            '#61B659',
            style,
            getStencilSvg,
            renderStencilShape
          );
        }
        break;
      case 'fault':
        c = 'mxgraph.atlassian.fault';
        if (null != c) {
          builder.setFillColor('#F8902F' as string);
          this.renderStencilByName(
            c,
            __tx + 5,
            __ty + 5,
            10,
            10,
            '#F8902F',
            style,
            getStencilSvg,
            renderStencilShape
          );
        }
        break;
      case 'change':
        c = 'mxgraph.atlassian.change';
        if (null != c) {
          builder.setFillColor('#9E4ADD' as string);
          this.renderStencilByName(
            c,
            __tx + 5,
            __ty + 5,
            10,
            10,
            '#9E4ADD',
            style,
            getStencilSvg,
            renderStencilShape
          );
        }
        break;
      case 'access':
        c = 'mxgraph.atlassian.access';
        if (null != c) {
          builder.setFillColor('#F8902F' as string);
          this.renderStencilByName(
            c,
            __tx + 5,
            __ty + 5,
            10,
            10,
            '#F8902F',
            style,
            getStencilSvg,
            renderStencilShape
          );
        }
        break;
      case 'purchase':
        c = 'mxgraph.atlassian.purchase';
        if (null != c) {
          builder.setFillColor('#61B659' as string);
          this.renderStencilByName(
            c,
            __tx + 5,
            __ty + 5,
            10,
            10,
            '#61B659',
            style,
            getStencilSvg,
            renderStencilShape
          );
        }
        break;
      case 'itHelp':
        c = 'mxgraph.atlassian.it_help';
        if (null != c) {
          builder.setFillColor('#5EA3E4' as string);
          this.renderStencilByName(
            c,
            __tx + 5,
            __ty + 5,
            10,
            10,
            '#5EA3E4',
            style,
            getStencilSvg,
            renderStencilShape
          );
        }
    }
    switch (e) {
      case 'blocker':
        c = 'mxgraph.atlassian.no';
        if (null != c) {
          builder.setFillColor('#CE0000' as string);
          this.renderStencilByName(
            c,
            __tx + 85,
            __ty + 5,
            10,
            10,
            '#CE0000',
            style,
            getStencilSvg,
            renderStencilShape
          );
        }
        break;
      case 'critical':
        c = 'mxgraph.atlassian.critical';
        if (null != c) {
          builder.setFillColor('#CE0000' as string);
          this.renderStencilByName(
            c,
            __tx + 86,
            __ty + 3,
            8,
            14,
            '#CE0000',
            style,
            getStencilSvg,
            renderStencilShape
          );
        }
        break;
      case 'major':
        c = 'mxgraph.atlassian.double_up';
        if (null != c) {
          builder.setFillColor('#CE0000' as string);
          this.renderStencilByName(
            c,
            __tx + 85,
            __ty + 5,
            10,
            10,
            '#CE0000',
            style,
            getStencilSvg,
            renderStencilShape
          );
        }
        break;
      case 'minor':
        c = 'mxgraph.atlassian.double';
        if (null != c) {
          builder.setFillColor('#2A8735' as string);
          this.renderStencilByName(
            c,
            __tx + 85,
            __ty + 5,
            10,
            10,
            '#2A8735',
            style,
            getStencilSvg,
            renderStencilShape
          );
        }
        break;
      case 'trivial':
        c = 'mxgraph.atlassian.single';
        if (null != c) {
          builder.setFillColor('#9AA1B2' as string);
          this.renderStencilByName(
            c,
            __tx + 85,
            __ty + 5,
            10,
            10,
            '#9AA1B2',
            style,
            getStencilSvg,
            renderStencilShape
          );
        }
    }
    builder.setFillColor('#FFFFFD' as string);
    builder.setFontColor('#4E6B89' as string);
    switch (d) {
      case 'todo':
        builder.rect(width - 45, 5, 40, 20);
        builder.fill();
        builder.text(width - 25, 15, 0, 0, 'TO DO', 'center', 'middle', 0, 0, 0);
        break;
      case 'inProgress':
        builder.rect(width - 85, 5, 80, 20);
        builder.fill();
        builder.text(width - 45, 15, 0, 0, 'IN PROGRESS', 'center', 'middle', 0, 0, 0);
        break;
      case 'inReview':
        builder.rect(width - 75, 5, 70, 20);
        builder.fill();
        builder.text(width - 40, 15, 0, 0, 'IN REVIEW', 'center', 'middle', 0, 0, 0);
        break;
      case 'done':
        builder.rect(width - 45, 5, 40, 20);
        builder.fill();
        builder.text(width - 25, 15, 0, 0, 'DONE', 'center', 'middle', 0, 0, 0);
        break;
      default:
        ((e = this.getStyleValue(style, 'issueStatusWidth', 6.5 * d.length)),
          builder.rect(width - e - 5, 5, e, 20),
          builder.fill(),
          builder.text(width - 7, 15, 0, 0, d, 'right', 'middle', 0, null, 0, 0, 0));
    }
    builder.restore();
  }

  private renderStencilByName(
    name: string,
    x: number,
    y: number,
    width: number,
    height: number,
    fillColor: string | undefined,
    style: RenderContext['style'],
    getStencilSvg?: RenderContext['getStencilSvg'],
    renderStencilShape?: RenderContext['renderStencilShape']
  ): void {
    if (!getStencilSvg || !renderStencilShape) return;
    if (!name) return;
    const styleFill = this.getStyleValue(style, 'fillColor', '#ffffff') as string;
    const builderFill = this.renderCtx.builder?.getCurrentFillColor?.() ?? null;
    const rawFill = typeof fillColor === 'string' ? fillColor : undefined;
    let resolvedFill = rawFill ?? builderFill ?? styleFill;
    if (rawFill && builderFill && rawFill === styleFill && builderFill !== styleFill) {
      resolvedFill = builderFill;
    }
    if (
      (style.shape as string | undefined) === 'mxgraph.gcp2.hexIcon' &&
      rawFill === '#FCC64D' &&
      builderFill
    ) {
      resolvedFill = builderFill;
    }
    const shapeName = style.shape as string | undefined;
    const isGcpHexStencil =
      shapeName === 'mxgraph.gcp2.hexIcon' && String(name).startsWith('mxgraph.gcp2.');
    const aspect = isGcpHexStencil ? (style.aspect as any) : 'fixed';
    const stencilStyle = {
      shape: String(name),
      fillColor: resolvedFill,
      strokeColor: 'none',
      ...(aspect ? { aspect } : {}),
    } as any;
    const svg = getStencilSvg(stencilStyle);
    if (!svg) return;
    renderStencilShape({ x, y, width, height, style: stencilStyle }, svg);
  }
}
