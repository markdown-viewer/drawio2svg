import type { RenderContext, ShapeAttrs } from '../../../renderer.ts';
import { RectangleShapeHandler } from '../../shape-registry.ts';
import { renderOutlineLayer, renderSymbolLayer } from './shape.ts';

export class BpmnTask2Handler extends RectangleShapeHandler {
  constructor(renderCtx: RenderContext) {
    super(renderCtx);
  }

  render(attrs: ShapeAttrs): void {
    const {
      builder,
      currentGroup,
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

    const bpmnShapeType = this.getStyleValue(style, 'bpmnShapeType', 'task');
    const taskMarker = this.getStyleValue(style, 'taskMarker', 'abstract');
    const strokeWidth = this.getStyleNumber(style, 'strokeWidth', attrs.strokeWidth);
    const dashed = this.getStyleValue(style, 'dashed', false);
    const indent = this.getStyleNumber(style, 'indent', 3);
    const outlineIndent = 3;

    const baseStrokeWidth = bpmnShapeType === 'call' ? strokeWidth * 4 : strokeWidth;
    const isSubprocess = bpmnShapeType === 'subprocess';
    const isTransaction = bpmnShapeType === 'transaction';
    const innerInset = isTransaction ? outlineIndent : 2;

    const outerPath = createRectPath(x, y, width, height, true);
    const innerPath = createInsetRectPath(x, y, width, height, innerInset, false);
    const strokePath = isTransaction
      ? `${outerPath} ${createInsetRectPath(x, y, width, height, outlineIndent, true)}`
      : outerPath;

    const fill = builder.createPath(outerPath);
    fill.setAttribute('fill', attrs.fillColor === 'none' ? 'none' : attrs.fillColor);
    fill.setAttribute('stroke', 'none');
    fill.setAttribute('pointer-events', 'all');
    currentGroup.appendChild(fill);

    const inner = builder.createPath(innerPath);
    inner.setAttribute('fill', 'transparent');
    inner.setAttribute('stroke', 'none');
    inner.setAttribute('pointer-events', 'all');
    currentGroup.appendChild(inner);

    const stroke = builder.createPath(strokePath);
    stroke.setAttribute('fill', 'none');
    stroke.setAttribute('stroke', attrs.strokeColor === 'none' ? 'none' : attrs.strokeColor);
    stroke.setAttribute('stroke-miterlimit', '10');
    if (Number.isFinite(baseStrokeWidth) && baseStrokeWidth > 1) {
      stroke.setAttribute('stroke-width', String(baseStrokeWidth));
    }
    if (isSubprocess) {
      stroke.setAttribute('stroke-dasharray', '3 3');
    }
    stroke.setAttribute('pointer-events', 'all');
    currentGroup.appendChild(stroke);

    builder.setCanvasRoot(currentGroup);
    builder.save();
    const strokeColor = attrs.strokeColor === 'none' ? '#000000' : attrs.strokeColor;
    const fillColor = attrs.fillColor === 'none' ? '#ffffff' : attrs.fillColor;
    builder.setStrokeColor(strokeColor as string);
    builder.setFillColor(fillColor as string);
    builder.setStrokeWidth(strokeWidth);
    builder.setDashed(Boolean(dashed));
    if (bpmnShapeType === 'call') {
      builder.setStrokeWidth(strokeWidth);
    }
    builder.setDashed(false);
    builder.setShadow(false);

    const offsetBase = 14 + strokeWidth * 0.5;
    const baseOffsetY = bpmnShapeType === 'call' ? 14 + strokeWidth * 2 : offsetBase;
    const offsetY = isTransaction ? baseOffsetY + indent : baseOffsetY;

    this.renderLoopMarkers(builder, x, y, width, height, offsetY, style, attrs, getStencilShape, renderStencilShape);
    this.renderTaskMarker(builder, x, y, style, attrs, taskMarker, strokeWidth, bpmnShapeType, getStencilShape, renderStencilShape);
    this.renderEmbeddedEvent(builder, x, y, style, attrs, bpmnShapeType, strokeWidth);

    builder.restore();
  }

  private renderLoopMarkers(
    builder: RenderContext['builder'],
    x: number,
    y: number,
    width: number,
    height: number,
    offsetY: number,
    style: RenderContext['style'],
    attrs: ShapeAttrs,
    getStencilShape?: RenderContext['getStencilShape'],
    renderStencilShape?: RenderContext['renderStencilShape']
  ): void {
    if (!builder) return;
    const isLoopSub = this.getStyleValue(style, 'isLoopSub', false);
    const isLoopStandard = this.getStyleValue(style, 'isLoopStandard', false);
    const isLoopMultiParallel = this.getStyleValue(style, 'isLoopMultiParallel', false);
    const isLoopMultiSeq = this.getStyleValue(style, 'isLoopMultiSeq', false);
    const isLoopComp = this.getStyleValue(style, 'isLoopComp', false);
    const isAdHoc = this.getStyleValue(style, 'isAdHoc', false);

    let count = 0;
    if (isLoopStandard) count += 1;
    if (isLoopMultiParallel) count += 1;
    if (isLoopMultiSeq) count += 1;
    if (isLoopComp) count += 1;
    if (isLoopSub) count += 1;
    if (isAdHoc) count += 1;

    const iconSpaceX = 14;
    let currXOffset = -iconSpaceX * count * 0.5;

    builder.setStrokeWidth(1);

    if (isLoopStandard) {
      this.renderStencilByName(
        'mxgraph.bpmn.loop',
        x + width * 0.5 + currXOffset + 1,
        y + height - offsetY + 1,
        12,
        12,
        attrs,
        getStencilShape,
        renderStencilShape
      );
      currXOffset += iconSpaceX;
    }

    if (isLoopMultiParallel) {
      builder.translate(x + width * 0.5 + currXOffset + 1, y + height - offsetY + 1);
      builder.begin();
      builder.moveTo(2.4, 0);
      builder.lineTo(2.4, 12);
      builder.moveTo(6, 0);
      builder.lineTo(6, 12);
      builder.moveTo(9.6, 0);
      builder.lineTo(9.6, 12);
      builder.stroke();
      builder.translate(-(x + width * 0.5 + currXOffset + 1), -(y + height - offsetY + 1));
      currXOffset += iconSpaceX;
    }

    if (isLoopMultiSeq) {
      builder.translate(x + width * 0.5 + currXOffset + 1, y + height - offsetY + 1);
      builder.begin();
      builder.moveTo(0, 2.4);
      builder.lineTo(12, 2.4);
      builder.moveTo(0, 6);
      builder.lineTo(12, 6);
      builder.moveTo(0, 9.6);
      builder.lineTo(12, 9.6);
      builder.stroke();
      builder.translate(-(x + width * 0.5 + currXOffset + 1), -(y + height - offsetY + 1));
      currXOffset += iconSpaceX;
    }

    if (isLoopComp) {
      this.renderStencilByName(
        'mxgraph.bpmn.compensation',
        x + width * 0.5 + currXOffset,
        y + height - offsetY + 1,
        14,
        12,
        attrs,
        getStencilShape,
        renderStencilShape
      );
      currXOffset += iconSpaceX;
    }

    if (isLoopSub) {
      builder.translate(x + width * 0.5 + currXOffset, y + height - offsetY);
      builder.rect(0, 0, 14, 14);
      builder.stroke();
      builder.begin();
      builder.moveTo(4, 7);
      builder.lineTo(10, 7);
      builder.moveTo(7, 4);
      builder.lineTo(7, 10);
      builder.stroke();
      builder.translate(-(x + width * 0.5 + currXOffset), -(y + height - offsetY));
      currXOffset += iconSpaceX;
    }

    if (isAdHoc) {
      const strokeColor = attrs.strokeColor === 'none' ? '#000000' : attrs.strokeColor;
      const fillColor = attrs.fillColor === 'none' ? '#ffffff' : attrs.fillColor;
      builder.setStrokeColor('none');
      builder.setFillColor(strokeColor as string);
      this.renderStencilByName(
        'mxgraph.bpmn.ad_hoc',
        x + width * 0.5 + currXOffset + 1,
        y + height - offsetY + 4,
        12,
        6,
        { ...attrs, fillColor: strokeColor, strokeColor: 'none' },
        getStencilShape,
        renderStencilShape
      );
      currXOffset += iconSpaceX;
      builder.setStrokeColor(strokeColor as string);
      builder.setFillColor(fillColor as string);
      builder.setStrokeWidth(1);
    }
  }

  private renderTaskMarker(
    builder: RenderContext['builder'],
    x: number,
    y: number,
    _style: RenderContext['style'],
    attrs: ShapeAttrs,
    taskMarker: string,
    strokeWidth: number,
    bpmnShapeType: string,
    getStencilShape?: RenderContext['getStencilShape'],
    renderStencilShape?: RenderContext['renderStencilShape']
  ): void {
    if (!builder) return;
    const inlet = bpmnShapeType === 'call' ? strokeWidth * 2 : strokeWidth * 0.5;

    switch (taskMarker) {
      case 'service':
        this.renderStencilByName(
          'mxgraph.bpmn.service_task',
          x + inlet + 2,
          y + inlet + 2,
          16,
          16,
          attrs,
          getStencilShape,
          renderStencilShape
        );
        break;
      case 'send':
        this.renderSendMarker(builder, x + inlet + 4, y + inlet + 4, true, attrs);
        break;
      case 'receive':
        this.renderSendMarker(builder, x + inlet + 4, y + inlet + 4, false, attrs);
        break;
      case 'user':
        this.renderStencilByName(
          'mxgraph.bpmn.user_task',
          x + inlet + 2,
          y + inlet + 2,
          16,
          16,
          attrs,
          getStencilShape,
          renderStencilShape
        );
        break;
      case 'manual':
        this.renderStencilByName(
          'mxgraph.bpmn.manual_task',
          x + inlet + 3,
          y + inlet + 3,
          18,
          14,
          attrs,
          getStencilShape,
          renderStencilShape
        );
        break;
      case 'businessRule':
        this.renderStencilByName(
          'mxgraph.bpmn.business_rule_task',
          x + inlet + 4,
          y + inlet + 4,
          18,
          14,
          attrs,
          getStencilShape,
          renderStencilShape
        );
        break;
      case 'script':
        this.renderStencilByName(
          'mxgraph.bpmn.script_task',
          x + inlet + 3,
          y + inlet + 3,
          19,
          18,
          attrs,
          getStencilShape,
          renderStencilShape
        );
        break;
      default:
        break;
    }
  }

  private renderEmbeddedEvent(
    builder: RenderContext['builder'],
    x: number,
    y: number,
    style: RenderContext['style'],
    attrs: ShapeAttrs,
    bpmnShapeType: string,
    strokeWidth: number
  ): void {
    if (!builder) return;
    const outline = this.getStyleValue(style, 'outline', 'none');
    if (outline === 'none') return;

    const symbol = this.getStyleValue(style, 'symbol', 'standard');
    const inlet = bpmnShapeType === 'call' ? strokeWidth * 2 : strokeWidth * 0.5;
    const embeddedCtx = {
      ...this.renderCtx,
      x: x + inlet,
      y: y + inlet,
      width: 20,
      height: 20,
    };

    renderOutlineLayer(embeddedCtx, attrs, outline);
    if (symbol && symbol !== 'general') {
      renderSymbolLayer(embeddedCtx, attrs, symbol, outline);
    }
  }

  private renderSendMarker(
    builder: RenderContext['builder'],
    x: number,
    y: number,
    isFilled: boolean,
    attrs: ShapeAttrs
  ): void {
    if (!builder) return;
    const markerW = 18;
    const markerH = 13;
    const strokeColor = attrs.strokeColor === 'none' ? '#000000' : attrs.strokeColor;
    const fillColor = attrs.fillColor === 'none' ? '#ffffff' : attrs.fillColor;

    const rect = builder.createRect(x, y, markerW, markerH);
    rect.setAttribute('fill', isFilled ? strokeColor : fillColor);
    rect.setAttribute('stroke', isFilled ? fillColor : strokeColor);
    rect.setAttribute('pointer-events', 'all');
    this.renderCtx.currentGroup?.appendChild(rect);

    const path = builder.createPath(`M ${x} ${y} L ${x + markerW / 2} ${y + markerH / 2} L ${x + markerW} ${y}`);
    path.setAttribute('fill', 'none');
    path.setAttribute('stroke', isFilled ? fillColor : strokeColor);
    path.setAttribute('stroke-miterlimit', '10');
    path.setAttribute('pointer-events', 'all');
    this.renderCtx.currentGroup?.appendChild(path);
  }

  private renderStencilByName(
    name: string,
    x: number,
    y: number,
    width: number,
    height: number,
    attrs: ShapeAttrs,
    getStencilShape?: RenderContext['getStencilShape'],
    renderStencilShape?: RenderContext['renderStencilShape']
  ): void {
    if (!getStencilShape || !renderStencilShape) return;
    const fillColor = attrs.fillColor === 'none' ? '#ffffff' : attrs.fillColor;
    const strokeColor = attrs.strokeColor === 'none' ? '#000000' : attrs.strokeColor;
    const stencilStyle = {
      shape: name,
      fillColor,
      strokeColor,
      aspect: 'fixed',
    } as any;
    const stencilShape = getStencilShape(name);
    if (!stencilShape) return;
    renderStencilShape({ x, y, width, height, style: stencilStyle }, stencilShape);
  }
}

function createRectPath(
  x: number,
  y: number,
  width: number,
  height: number,
  closePath: boolean
): string {
  const round2 = (value: number): number => Number(value.toFixed(2));
  const x0 = round2(x);
  const y0 = round2(y);
  const x1 = round2(x + width);
  const y1 = round2(y + height);

  const parts = [
    `M ${x0} ${y0}`,
    `L ${x1} ${y0}`,
    `L ${x1} ${y1}`,
    `L ${x0} ${y1}`,
    `L ${x0} ${y0}`
  ];

  if (closePath) {
    parts.push('Z');
  }

  return parts.join(' ');
}

function createInsetRectPath(
  x: number,
  y: number,
  width: number,
  height: number,
  inset: number,
  closePath: boolean
): string {
  const round2 = (value: number): number => Number(value.toFixed(2));
  const x0 = round2(x + inset);
  const y0 = round2(y + inset);
  const x1 = round2(x + width - inset);
  const y1 = round2(y + height - inset);

  const parts = [
    `M ${x0} ${y0}`,
    `L ${x0} ${y1}`,
    `L ${x0} ${y1}`,
    `L ${x1} ${y1}`,
    `L ${x1} ${y0}`,
    `L ${x0} ${y0}`
  ];

  if (closePath) {
    parts.push('Z');
  }

  return parts.join(' ');
}