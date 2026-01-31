import type { RenderContext, ShapeAttrs } from '../../../renderer.ts';
import { RectangleShapeHandler } from '../../shape-registry.ts';
import { renderOutlineLayer, renderSymbolLayer } from './shape.ts';

export class BpmnTaskHandler extends RectangleShapeHandler {
  constructor(renderCtx: RenderContext) {
    super(renderCtx);
  }

  render(attrs: ShapeAttrs): void {
    const { builder, currentGroup, x, y, width, height, style, getStencilSvg, renderStencilShape } = this.renderCtx;
    if (!builder || !currentGroup) return;

    const strokeColor = attrs.strokeColor === 'none' ? 'none' : attrs.strokeColor;
    const fillColor = attrs.fillColor === 'none' ? 'none' : attrs.fillColor;
    const bpmnShapeType = (style.bpmnShapeType as string) || 'task';
    const isSubprocess = bpmnShapeType === 'subprocess';
    const isTransaction = bpmnShapeType === 'transaction';
    const isCall = bpmnShapeType === 'call';
    const indent = Number.isFinite(Number(style.indent)) ? Number(style.indent) : 3;
    const outlineIndent = 3;
    const strokeWidth = attrs.strokeWidth;
    const innerInset = isTransaction ? outlineIndent : 2;

    const outerPath = createRectPath(x, y, width, height, true);
    const innerPath = createInsetRectPath(x, y, width, height, innerInset, false);
    const strokePath = isTransaction
      ? `${outerPath} ${createInsetRectPath(x, y, width, height, outlineIndent, true)}`
      : outerPath;

    const fill = builder.createPath(outerPath);
    fill.setAttribute('fill', fillColor);
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
    stroke.setAttribute('stroke', strokeColor);
    stroke.setAttribute('stroke-miterlimit', '10');
    if (isCall && Number.isFinite(strokeWidth) && strokeWidth > 0) {
      stroke.setAttribute('stroke-width', '4');
    }
    if (isSubprocess) {
      stroke.setAttribute('stroke-dasharray', '3 3');
    }
    stroke.setAttribute('pointer-events', 'all');
    currentGroup.appendChild(stroke);

    const marker = (style.taskMarker as string) || 'abstract';
    if (marker === 'send' || marker === 'receive') {
      renderSendMarker(this.renderCtx, attrs, marker === 'send');
    } else if (marker === 'service') {
      renderStencilByName(this.renderCtx, 'mxgraph.bpmn.service_task', x + 2, y + 2, 16, 16, attrs, getStencilSvg, renderStencilShape);
    } else if (marker === 'user') {
      renderStencilByName(this.renderCtx, 'mxgraph.bpmn.user_task', x + 2, y + 2, 16, 16, attrs, getStencilSvg, renderStencilShape);
    } else if (marker === 'manual') {
      renderStencilByName(
        this.renderCtx,
        'mxgraph.bpmn.manual_task',
        x + 3,
        y + 3,
        18,
        14,
        attrs,
        getStencilSvg,
        renderStencilShape,
        'transparent'
      );
    } else if (marker === 'businessRule') {
      renderStencilByName(this.renderCtx, 'mxgraph.bpmn.business_rule_task', x + 4, y + 4, 18, 14, attrs, getStencilSvg, renderStencilShape);
    } else if (marker === 'script') {
      renderStencilByName(this.renderCtx, 'mxgraph.bpmn.script_task', x + 3, y + 3, 19, 18, attrs, getStencilSvg, renderStencilShape);
    }

    renderLoopMarkers(this.renderCtx, attrs, indent);
    renderEmbeddedEvent(this.renderCtx, attrs);
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

function renderSendMarker(renderCtx: RenderContext, attrs: ShapeAttrs, isFilled: boolean): void {
  const { builder, currentGroup, x, y } = renderCtx;
  if (!builder || !currentGroup) return;

  const markerX = x + 4;
  const markerY = y + 4;
  const markerW = 18;
  const markerH = 13;
  const strokeColor = attrs.strokeColor === 'none' ? '#000000' : attrs.strokeColor;
  const fillColor = attrs.fillColor === 'none' ? '#ffffff' : attrs.fillColor;

  const rect = builder.createRect(markerX, markerY, markerW, markerH);
  rect.setAttribute('fill', isFilled ? strokeColor : fillColor);
  rect.setAttribute('stroke', isFilled ? fillColor : strokeColor);
  rect.setAttribute('pointer-events', 'all');
  currentGroup.appendChild(rect);

  const path = builder.createPath(`M ${markerX} ${markerY} L ${markerX + markerW / 2} ${markerY + markerH / 2} L ${markerX + markerW} ${markerY}`);
  path.setAttribute('fill', 'none');
  path.setAttribute('stroke', isFilled ? fillColor : strokeColor);
  path.setAttribute('stroke-miterlimit', '10');
  path.setAttribute('pointer-events', 'all');
  currentGroup.appendChild(path);
}

function renderLoopMarkers(renderCtx: RenderContext, attrs: ShapeAttrs, indent: number): void {
  const { builder, currentGroup, x, y, width, height, style, getStencilSvg, renderStencilShape } = renderCtx;
  if (!builder || !currentGroup) return;

  const isSubprocess = style.isLoopSub === '1' || style.isLoopSub === true;
  const isLoopStandard = style.isLoopStandard === '1' || style.isLoopStandard === true;
  const isLoopMultiParallel = style.isLoopMultiParallel === '1' || style.isLoopMultiParallel === true;
  const isLoopMultiSeq = style.isLoopMultiSeq === '1' || style.isLoopMultiSeq === true;
  const isLoopComp = style.isLoopComp === '1' || style.isLoopComp === true;
  const isAdHoc = style.isAdHoc === '1' || style.isAdHoc === true;
  const strokeColor = attrs.strokeColor === 'none' ? '#000000' : attrs.strokeColor;

  let count = 0;
  if (isLoopStandard) count += 1;
  if (isLoopMultiParallel) count += 1;
  if (isLoopMultiSeq) count += 1;
  if (isLoopComp) count += 1;
  if (isSubprocess) count += 1;
  if (isAdHoc) count += 1;

  const iconSpaceX = 14;
  let currXOffset = -iconSpaceX * count * 0.5;
  const offsetY = 14 + (style.bpmnShapeType === 'transaction' ? indent : 0);
  const markerBaseY = y + height - offsetY + 1;

  if (isLoopStandard) {
    if (getStencilSvg && renderStencilShape) {
      renderStencilByName(renderCtx, 'mxgraph.bpmn.loop', x + width / 2 + currXOffset + 1, markerBaseY, 12, 12, attrs, getStencilSvg, renderStencilShape);
    } else {
      const markerX = x + width / 2 + currXOffset + 1;
      const markerY = markerBaseY;
      const path = builder.createPath(
        `M ${markerX + 2.93} ${markerY + 10.59} C ${markerX + 0.82} ${markerY + 8.9} ${markerX + 0.22} ${markerY + 5.85} ${markerX + 1.54} ${markerY + 3.44} ` +
          `C ${markerX + 2.86} ${markerY + 1.03} ${markerX + 5.68} ${markerY + 0} ${markerX + 8.16} ${markerY + 1.03} ` +
          `C ${markerX + 10.63} ${markerY + 2.06} ${markerX + 12} ${markerY + 4.83} ${markerX + 11.35} ${markerY + 7.52} ` +
          `C ${markerX + 10.71} ${markerY + 10.22} ${markerX + 8.25} ${markerY + 12} ${markerX + 5.6} ${markerY + 11.7} ` +
          `M ${markerX + 2.93} ${markerY + 7.81} L ${markerX + 2.93} ${markerY + 10.59} L ${markerX + 0} ${markerY + 9.76}`
      );
      path.setAttribute('fill', 'none');
      path.setAttribute('stroke', strokeColor);
      path.setAttribute('stroke-miterlimit', '10');
      path.setAttribute('pointer-events', 'all');
      currentGroup.appendChild(path);
    }
    currXOffset += iconSpaceX;
  }

  if (isLoopMultiParallel) {
    const markerX = x + width / 2 + currXOffset + 1;
    const markerY = markerBaseY;
    const lines = builder.createPath(
      `M ${markerX + 2.4} ${markerY} L ${markerX + 2.4} ${markerY + 12} ` +
        `M ${markerX + 6} ${markerY} L ${markerX + 6} ${markerY + 12} ` +
        `M ${markerX + 9.6} ${markerY} L ${markerX + 9.6} ${markerY + 12}`
    );
    lines.setAttribute('fill', 'none');
    lines.setAttribute('stroke', strokeColor);
    lines.setAttribute('stroke-miterlimit', '10');
    lines.setAttribute('pointer-events', 'all');
    currentGroup.appendChild(lines);
    currXOffset += iconSpaceX;
  }

  if (isLoopMultiSeq) {
    const markerX = x + width / 2 + currXOffset + 1;
    const markerY = markerBaseY;
    const lines = builder.createPath(
      `M ${markerX} ${markerY + 2.4} L ${markerX + 12} ${markerY + 2.4} ` +
        `M ${markerX} ${markerY + 6} L ${markerX + 12} ${markerY + 6} ` +
        `M ${markerX} ${markerY + 9.6} L ${markerX + 12} ${markerY + 9.6}`
    );
    lines.setAttribute('fill', 'none');
    lines.setAttribute('stroke', strokeColor);
    lines.setAttribute('stroke-miterlimit', '10');
    lines.setAttribute('pointer-events', 'all');
    currentGroup.appendChild(lines);
    currXOffset += iconSpaceX;
  }

  if (isLoopComp && getStencilSvg && renderStencilShape) {
    renderStencilByName(renderCtx, 'mxgraph.bpmn.compensation', x + width / 2 + currXOffset, markerBaseY, 14, 12, attrs, getStencilSvg, renderStencilShape);
    currXOffset += iconSpaceX;
  }

  if (isSubprocess) {
    const markerX = x + width / 2 + currXOffset;
    const markerY = y + height - offsetY;
    const rect = builder.createRect(markerX, markerY, 14, 14);
    rect.setAttribute('fill', 'none');
    rect.setAttribute('stroke', strokeColor);
    rect.setAttribute('pointer-events', 'all');
    currentGroup.appendChild(rect);

    const plus = builder.createPath(
      `M ${markerX + 4} ${markerY + 7} L ${markerX + 10} ${markerY + 7} M ${markerX + 7} ${markerY + 4} L ${markerX + 7} ${markerY + 10}`
    );
    plus.setAttribute('fill', 'none');
    plus.setAttribute('stroke', strokeColor);
    plus.setAttribute('stroke-miterlimit', '10');
    plus.setAttribute('pointer-events', 'all');
    currentGroup.appendChild(plus);
    currXOffset += iconSpaceX;
  }

  if (isAdHoc && getStencilSvg && renderStencilShape) {
    renderStencilByName(
      renderCtx,
      'mxgraph.bpmn.ad_hoc',
      x + width / 2 + currXOffset + 1,
      y + height - offsetY + 4,
      12,
      6,
      { ...attrs, fillColor: strokeColor, strokeColor: 'none' },
      getStencilSvg,
      renderStencilShape
    );
    currXOffset += iconSpaceX;
  }
}

function renderEmbeddedEvent(renderCtx: RenderContext, attrs: ShapeAttrs): void {
  const { builder, currentGroup, x, y, style } = renderCtx;
  if (!builder || !currentGroup) return;

  const outline = (style.outline as string) || 'none';
  if (outline === 'none') return;

  const symbol = (style.symbol as string) || 'standard';
  const embeddedCtx = { ...renderCtx, x, y, width: 20, height: 20 };

  renderOutlineLayer(embeddedCtx, attrs, outline);
  if (symbol && symbol !== 'general') {
    renderSymbolLayer(embeddedCtx, attrs, symbol, outline);
  }
}

function renderStencilByName(
  renderCtx: RenderContext,
  name: string,
  x: number,
  y: number,
  width: number,
  height: number,
  attrs: ShapeAttrs,
  getStencilSvg?: RenderContext['getStencilSvg'],
  renderStencilShape?: RenderContext['renderStencilShape'],
  fillOverride?: string
): void {
  const resolvedGetStencilSvg = getStencilSvg ?? renderCtx.getStencilSvg;
  const resolvedRenderStencilShape = renderStencilShape ?? renderCtx.renderStencilShape;
  if (!resolvedGetStencilSvg || !resolvedRenderStencilShape) return;
  const fillColor = fillOverride ?? (attrs.fillColor === 'none' ? '#ffffff' : attrs.fillColor);
  const strokeColor = attrs.strokeColor === 'none' ? '#000000' : attrs.strokeColor;
  const stencilStyle = {
    shape: name,
    fillColor,
    strokeColor,
    aspect: 'fixed',
  } as any;
  const svg = resolvedGetStencilSvg(stencilStyle);
  if (!svg) return;
  resolvedRenderStencilShape({ x, y, width, height, style: stencilStyle }, svg);
}
