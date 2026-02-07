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
      getStencilShape,
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
            5,
            5,
            10,
            10,
            undefined,
            style,
            getStencilShape,
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
            5,
            5,
            10,
            10,
            undefined,
            style,
            getStencilShape,
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
            5,
            5,
            10,
            10,
            undefined,
            style,
            getStencilShape,
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
            5,
            5,
            10,
            10,
            undefined,
            style,
            getStencilShape,
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
            5,
            5,
            10,
            10,
            undefined,
            style,
            getStencilShape,
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
            5,
            5,
            10,
            10,
            undefined,
            style,
            getStencilShape,
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
            5,
            5,
            10,
            10,
            undefined,
            style,
            getStencilShape,
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
            5,
            5,
            10,
            10,
            undefined,
            style,
            getStencilShape,
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
            5,
            5,
            10,
            10,
            undefined,
            style,
            getStencilShape,
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
            5,
            5,
            10,
            10,
            undefined,
            style,
            getStencilShape,
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
            5,
            5,
            10,
            10,
            undefined,
            style,
            getStencilShape,
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
            5,
            5,
            10,
            10,
            undefined,
            style,
            getStencilShape,
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
            5,
            5,
            10,
            10,
            undefined,
            style,
            getStencilShape,
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
            85,
            5,
            10,
            10,
            undefined,
            style,
            getStencilShape,
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
            86,
            3,
            8,
            14,
            undefined,
            style,
            getStencilShape,
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
            85,
            5,
            10,
            10,
            undefined,
            style,
            getStencilShape,
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
            85,
            5,
            10,
            10,
            undefined,
            style,
            getStencilShape,
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
            85,
            5,
            10,
            10,
            undefined,
            style,
            getStencilShape,
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
        e = this.getStyleValue(style, 'issueStatusWidth', 6.5 * d.length);
        builder.rect(width - e - 5, 5, e, 20);
        builder.fill();
        builder.text(width - 7, 15, 0, 0, d, 'right', 'middle', 0, 0, 0);
    }
    builder.restore();
  }

  // renderStencilByName is inherited from BaseShapeHandler
}
