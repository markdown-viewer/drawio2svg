import type { RenderContext, ShapeAttrs } from '../../../renderer.ts';
import { EllipseShapeHandler } from '../../shape-registry.ts';

export class BpmnShapeHandler extends EllipseShapeHandler {
  constructor(renderCtx: RenderContext) {
    super(renderCtx);
  }

  render(attrs: ShapeAttrs): void {
    const { style } = this.renderCtx;

    if ((style.shape as string) === 'mxgraph.bpmn.gateway2') {
      renderGateway2(this.renderCtx, attrs);
      return;
    }

    const background = (style.background as string) || 'none';
    const outline = (style.outline as string) || 'none';
    const symbol = (style.symbol as string) || 'general';

    if (background === 'gateway') {
      renderGateway(this.renderCtx, attrs);
      return;
    }

    if (background === 'none' && outline === 'none' && (symbol === 'general' || !symbol)) {
      return;
    }

    if (outline !== 'none') {
      renderOutlineLayer(this.renderCtx, attrs, outline);
    }

    if (symbol && symbol !== 'general') {
      renderSymbolLayer(this.renderCtx, attrs, symbol, outline);
    }
  }

}


export function renderOutlineLayer(renderCtx: RenderContext, attrs: ShapeAttrs, outline: string): void {
  const { builder, currentGroup, x, y, width, height } = renderCtx;
  if (!builder || !currentGroup) return;

  const cx = x + width / 2;
  const cy = y + height / 2;
  const rx = width / 2;
  const ry = height / 2;
  const strokeColor = attrs.strokeColor === 'none' ? 'none' : attrs.strokeColor;
  const fillColor = attrs.fillColor === 'none' ? 'none' : attrs.fillColor;

  const createOuter = (strokeWidth: number = attrs.strokeWidth, dashed?: boolean) => {
    const outer = builder.createEllipse(cx, cy, rx, ry);
    outer.setAttribute('fill', fillColor);
    outer.setAttribute('stroke', strokeColor);
    outer.setAttribute('stroke-width', String(strokeWidth));
    if (dashed) outer.setAttribute('stroke-dasharray', '3 3');
    outer.setAttribute('pointer-events', 'all');
    currentGroup.appendChild(outer);
  };

  switch (outline) {
    case 'standard':
    case 'eventInt':
      createOuter();
      break;
    case 'eventNonint':
      createOuter(undefined, true);
      break;
    case 'catching':
    case 'boundInt': {
      createOuter();
      const inset = 2;
      const inner = builder.createEllipse(cx, cy, Math.max(0, rx - inset), Math.max(0, ry - inset));
      inner.setAttribute('fill', 'none');
      inner.setAttribute('stroke', strokeColor);
      inner.setAttribute('stroke-width', String(attrs.strokeWidth));
      inner.setAttribute('pointer-events', 'all');
      currentGroup.appendChild(inner);
      break;
    }
    case 'boundNonint': {
      createOuter(undefined, true);
      const inset = 2;
      const inner = builder.createEllipse(cx, cy, Math.max(0, rx - inset), Math.max(0, ry - inset));
      inner.setAttribute('fill', 'none');
      inner.setAttribute('stroke', strokeColor);
      inner.setAttribute('stroke-width', String(attrs.strokeWidth));
      inner.setAttribute('pointer-events', 'all');
      currentGroup.appendChild(inner);
      break;
    }
    case 'throwing': {
      createOuter();
      const inset = 2;
      const innerRx = Math.max(0, (width * 0.96 - 2 * inset) / 2);
      const innerRy = Math.max(0, (height * 0.96 - 2 * inset) / 2);
      const inner = builder.createEllipse(
        x + width * 0.02 + inset + innerRx,
        y + height * 0.02 + inset + innerRy,
        innerRx,
        innerRy
      );
      inner.setAttribute('fill', 'none');
      inner.setAttribute('stroke', strokeColor);
      inner.setAttribute('stroke-width', String(attrs.strokeWidth));
      inner.setAttribute('pointer-events', 'all');
      currentGroup.appendChild(inner);
      break;
    }
    case 'end': {
      const outerStrokeWidth = Math.max(3, attrs.strokeWidth * 3);
      createOuter(outerStrokeWidth);
      break;
    }
    case 'none':
    default:
      break;
  }
}

export function renderSymbolLayer(renderCtx: RenderContext, attrs: ShapeAttrs, symbol: string, outline: string): void {
  const { builder, currentGroup, x, y, width, height, style } = renderCtx;
  if (!builder || !currentGroup) return;

  const { boxX, boxY, boxW, boxH } = getSymbolBox(x, y, width, height, symbol);
  let strokeColor = attrs.strokeColor === 'none' ? '#000000' : attrs.strokeColor;
  let fillColor = attrs.fillColor === 'none' ? 'none' : attrs.fillColor;
  const isInverse = outline === 'throwing' || outline === 'end';

  if (isInverse) {
    const swap = strokeColor;
    strokeColor = fillColor;
    fillColor = swap;
  }

  if (symbol === 'star') {
    fillColor = strokeColor;
  }

  switch (symbol) {
    case 'message':
      renderMessageSymbol(renderCtx, boxX, boxY, boxW, boxH, strokeColor, fillColor, isInverse, style, attrs.strokeWidth);
      break;
    case 'timer':
      renderTimerSymbol(renderCtx, boxX, boxY, boxW, boxH, strokeColor, fillColor, attrs.strokeWidth);
      break;
    case 'escalation':
      renderEscalationSymbol(renderCtx, boxX, boxY, boxW, boxH, strokeColor, fillColor, attrs.strokeWidth);
      break;
    case 'conditional':
      renderConditionalSymbol(renderCtx, boxX, boxY, boxW, boxH, strokeColor, fillColor, attrs.strokeWidth);
      break;
    case 'link':
      renderLinkSymbol(renderCtx, boxX, boxY, boxW, boxH, strokeColor, fillColor, attrs.strokeWidth);
      break;
    case 'error':
      renderErrorSymbol(renderCtx, boxX, boxY, boxW, boxH, strokeColor, fillColor, isInverse, attrs.strokeWidth);
      break;
    case 'cancel':
      renderCancelSymbol(renderCtx, boxX, boxY, boxW, boxH, strokeColor, fillColor, attrs.strokeWidth);
      break;
    case 'compensation':
      renderCompensationSymbol(renderCtx, boxX, boxY, boxW, boxH, strokeColor, fillColor, attrs.strokeWidth);
      break;
    case 'signal':
      renderSignalSymbol(renderCtx, boxX, boxY, boxW, boxH, strokeColor, fillColor, attrs.strokeWidth);
      break;
    case 'multiple':
      renderMultipleSymbol(renderCtx, boxX, boxY, boxW, boxH, strokeColor, fillColor, attrs.strokeWidth);
      break;
    case 'parallelMultiple':
      renderParallelMultipleSymbol(renderCtx, boxX, boxY, boxW, boxH, strokeColor, fillColor, attrs.strokeWidth);
      break;
    case 'terminate':
      renderTerminateSymbol(renderCtx, boxX, boxY, boxW, boxH, strokeColor, fillColor, attrs.strokeWidth);
      break;
    case 'exclusiveGw':
      renderExclusiveGwSymbol(renderCtx, boxX, boxY, boxW, boxH, strokeColor, fillColor, attrs.strokeWidth);
      break;
    case 'parallelGw':
      renderParallelGwSymbol(renderCtx, boxX, boxY, boxW, boxH, strokeColor, fillColor, attrs.strokeWidth);
      break;
    case 'complexGw':
      renderComplexGwSymbol(renderCtx, boxX, boxY, boxW, boxH, strokeColor, fillColor, attrs.strokeWidth);
      break;
    case 'star':
      renderStarSymbol(renderCtx, boxX, boxY, boxW, boxH, strokeColor, fillColor, attrs.strokeWidth);
      break;
    default:
      break;
  }
}

function getSymbolBox(x: number, y: number, width: number, height: number, symbol: string) {
  let boxX = x;
  let boxY = y;
  let boxW = width;
  let boxH = height;

  switch (symbol) {
    case 'message':
      boxX += width * 0.15;
      boxY += height * 0.3;
      boxW = width * 0.7;
      boxH = height * 0.4;
      break;
    case 'timer':
      boxX += width * 0.11;
      boxY += height * 0.11;
      boxW = width * 0.78;
      boxH = height * 0.78;
      break;
    case 'escalation':
      boxX += width * 0.19;
      boxY += height * 0.15;
      boxW = width * 0.62;
      boxH = height * 0.57;
      break;
    case 'conditional':
      boxX += width * 0.3;
      boxY += height * 0.16;
      boxW = width * 0.4;
      boxH = height * 0.68;
      break;
    case 'link':
      boxX += width * 0.27;
      boxY += height * 0.33;
      boxW = width * 0.46;
      boxH = height * 0.34;
      break;
    case 'error':
      boxX += width * 0.212;
      boxY += height * 0.243;
      boxW = width * 0.58;
      boxH = height * 0.507;
      break;
    case 'cancel':
      boxX += width * 0.22;
      boxY += height * 0.22;
      boxW = width * 0.56;
      boxH = height * 0.56;
      break;
    case 'compensation':
      boxX += width * 0.28;
      boxY += height * 0.35;
      boxW = width * 0.44;
      boxH = height * 0.3;
      break;
    case 'signal':
      boxX += width * 0.19;
      boxY += height * 0.15;
      boxW = width * 0.62;
      boxH = height * 0.57;
      break;
    case 'multiple':
      boxX += width * 0.2;
      boxY += height * 0.19;
      boxW = width * 0.6;
      boxH = height * 0.565;
      break;
    case 'parallelMultiple':
      boxX += width * 0.2;
      boxY += height * 0.2;
      boxW = width * 0.6;
      boxH = height * 0.6;
      break;
    case 'terminate':
      boxX += width * 0.05;
      boxY += height * 0.05;
      boxW = width * 0.9;
      boxH = height * 0.9;
      break;
    case 'exclusiveGw':
      boxX += width * 0.12;
      boxW = width * 0.76;
      break;
    default:
      break;
  }

  return { boxX, boxY, boxW, boxH };
}

function renderMessageSymbol(
  renderCtx: RenderContext,
  x: number,
  y: number,
  width: number,
  height: number,
  strokeColor: string,
  fillColor: string,
  isInverse: boolean,
  style: RenderContext['style'],
  strokeWidth: number
): void {
  const { builder, currentGroup } = renderCtx;
  if (!builder || !currentGroup) return;

  const rect = builder.createRect(x, y, width, height);
  rect.setAttribute('fill', fillColor);
  rect.setAttribute('stroke', strokeColor);
  rect.setAttribute('stroke-width', String(strokeWidth));
  rect.setAttribute('pointer-events', 'all');
  currentGroup.appendChild(rect);

  const originalFill = String(style.fillColor ?? 'none');
  let lineStroke = strokeColor;
  if (originalFill === 'none' && isInverse) {
    lineStroke = '#ffffff';
  }

  const path = builder.createPath(`M ${x} ${y} L ${x + width * 0.5} ${y + height * 0.5} L ${x + width} ${y}`);
  path.setAttribute('fill', 'none');
  path.setAttribute('stroke', lineStroke);
  path.setAttribute('stroke-width', String(strokeWidth));
  path.setAttribute('pointer-events', 'all');
  currentGroup.appendChild(path);
}

function renderTimerSymbol(
  renderCtx: RenderContext,
  x: number,
  y: number,
  width: number,
  height: number,
  strokeColor: string,
  fillColor: string,
  strokeWidth: number
): void {
  const { builder, currentGroup } = renderCtx;
  if (!builder || !currentGroup) return;

  const cx = x + width / 2;
  const cy = y + height / 2;
  const rx = width / 2;
  const ry = height / 2;
  const ellipse = builder.createEllipse(cx, cy, rx, ry);
  ellipse.setAttribute('fill', fillColor);
  ellipse.setAttribute('stroke', strokeColor);
  ellipse.setAttribute('stroke-width', String(strokeWidth));
  ellipse.setAttribute('pointer-events', 'all');
  currentGroup.appendChild(ellipse);

  const path = [
    `M ${x + width * 0.5} ${y}`,
    `L ${x + width * 0.5} ${y + height * 0.0642}`,
    `M ${x + width * 0.7484} ${y + height * 0.0654}`,
    `L ${x + width * 0.7126} ${y + height * 0.1281}`,
    `M ${x + width * 0.93} ${y + height * 0.2471}`,
    `L ${x + width * 0.8673} ${y + height * 0.2854}`,
    `M ${x + width} ${y + height * 0.5}`,
    `L ${x + width * 0.9338} ${y + height * 0.5}`,
    `M ${x + width * 0.93} ${y + height * 0.7509}`,
    `L ${x + width * 0.8673} ${y + height * 0.7126}`,
    `M ${x + width * 0.7484} ${y + height * 0.9326}`,
    `L ${x + width * 0.7126} ${y + height * 0.8699}`,
    `M ${x + width * 0.5} ${y + height * 0.9338}`,
    `L ${x + width * 0.5} ${y + height}`,
    `M ${x + width * 0.2496} ${y + height * 0.9325}`,
    `L ${x + width * 0.2854} ${y + height * 0.8699}`,
    `M ${x + width * 0.068} ${y + height * 0.7509}`,
    `L ${x + width * 0.1307} ${y + height * 0.7126}`,
    `M ${x} ${y + height * 0.5}`,
    `L ${x + width * 0.0642} ${y + height * 0.5}`,
    `M ${x + width * 0.068} ${y + height * 0.2471}`,
    `L ${x + width * 0.1307} ${y + height * 0.2854}`,
    `M ${x + width * 0.2496} ${y + height * 0.0654}`,
    `L ${x + width * 0.2854} ${y + height * 0.1281}`,
    `M ${x + width * 0.5246} ${y + height * 0.0706}`,
    `L ${x + width * 0.5} ${y + height * 0.5}`,
    `L ${x + width * 0.7804} ${y + height * 0.5118}`
  ].join(' ');

  const ticks = builder.createPath(path);
  ticks.setAttribute('fill', 'none');
  ticks.setAttribute('stroke', strokeColor);
  ticks.setAttribute('stroke-width', String(strokeWidth));
  ticks.setAttribute('pointer-events', 'all');
  currentGroup.appendChild(ticks);
}

function renderEscalationSymbol(
  renderCtx: RenderContext,
  x: number,
  y: number,
  width: number,
  height: number,
  strokeColor: string,
  fillColor: string,
  strokeWidth: number
): void {
  const { builder, currentGroup } = renderCtx;
  if (!builder || !currentGroup) return;
  const path = `M ${x} ${y + height} L ${x + width * 0.5} ${y} L ${x + width} ${y + height} L ${x + width * 0.5} ${y + height * 0.5} Z`;
  const el = builder.createPath(path);
  el.setAttribute('fill', fillColor);
  el.setAttribute('stroke', strokeColor);
  el.setAttribute('stroke-width', String(strokeWidth));
  el.setAttribute('pointer-events', 'all');
  currentGroup.appendChild(el);
}

function renderConditionalSymbol(
  renderCtx: RenderContext,
  x: number,
  y: number,
  width: number,
  height: number,
  strokeColor: string,
  fillColor: string,
  strokeWidth: number
): void {
  const { builder, currentGroup } = renderCtx;
  if (!builder || !currentGroup) return;
  const rect = builder.createRect(x, y, width, height);
  rect.setAttribute('fill', fillColor);
  rect.setAttribute('stroke', strokeColor);
  rect.setAttribute('stroke-width', String(strokeWidth));
  rect.setAttribute('pointer-events', 'all');
  currentGroup.appendChild(rect);

  const path = [
    `M ${x} ${y + height * 0.1027} L ${x + width * 0.798} ${y + height * 0.1027}`,
    `M ${x} ${y + height * 0.3669} L ${x + width * 0.798} ${y + height * 0.3669}`,
    `M ${x} ${y + height * 0.6311} L ${x + width * 0.798} ${y + height * 0.6311}`,
    `M ${x} ${y + height * 0.8953} L ${x + width * 0.798} ${y + height * 0.8953}`
  ].join(' ');
  const lines = builder.createPath(path);
  lines.setAttribute('fill', 'none');
  lines.setAttribute('stroke', strokeColor);
  lines.setAttribute('stroke-width', String(strokeWidth));
  lines.setAttribute('pointer-events', 'all');
  currentGroup.appendChild(lines);
}

function renderLinkSymbol(
  renderCtx: RenderContext,
  x: number,
  y: number,
  width: number,
  height: number,
  strokeColor: string,
  fillColor: string,
  strokeWidth: number
): void {
  const { builder, currentGroup } = renderCtx;
  if (!builder || !currentGroup) return;
  const path = `M ${x} ${y + height * 0.76} L ${x} ${y + height * 0.24} L ${x + width * 0.63} ${y + height * 0.24} ` +
    `L ${x + width * 0.63} ${y} L ${x + width} ${y + height * 0.5} L ${x + width * 0.63} ${y + height} ` +
    `L ${x + width * 0.63} ${y + height * 0.76} Z`;
  const el = builder.createPath(path);
  el.setAttribute('fill', fillColor);
  el.setAttribute('stroke', strokeColor);
  el.setAttribute('stroke-width', String(strokeWidth));
  el.setAttribute('pointer-events', 'all');
  currentGroup.appendChild(el);
}

function renderErrorSymbol(
  renderCtx: RenderContext,
  x: number,
  y: number,
  width: number,
  height: number,
  strokeColor: string,
  fillColor: string,
  isInverse: boolean,
  strokeWidth: number
): void {
  const { builder, currentGroup } = renderCtx;
  if (!builder || !currentGroup) return;
  const path = `M ${x} ${y + height} L ${x + width * 0.3287} ${y + height * 0.123} ` +
    `L ${x + width * 0.6194} ${y + height * 0.6342} L ${x + width} ${y} ` +
    `L ${x + width * 0.6625} ${y + height * 0.939} L ${x + width * 0.3717} ${y + height * 0.5064} Z`;
  const el = builder.createPath(path);
  el.setAttribute('fill', fillColor);
  el.setAttribute('stroke', isInverse ? 'none' : strokeColor);
  el.setAttribute('stroke-width', String(strokeWidth));
  el.setAttribute('pointer-events', 'all');
  currentGroup.appendChild(el);
}

function renderCancelSymbol(
  renderCtx: RenderContext,
  x: number,
  y: number,
  width: number,
  height: number,
  strokeColor: string,
  fillColor: string,
  strokeWidth: number
): void {
  const { builder, currentGroup } = renderCtx;
  if (!builder || !currentGroup) return;
  const path = `M ${x + width * 0.1051} ${y} L ${x + width * 0.5} ${y + height * 0.3738} ` +
    `L ${x + width * 0.8909} ${y} L ${x + width} ${y + height * 0.1054} ` +
    `L ${x + width * 0.623} ${y + height * 0.5} L ${x + width} ${y + height * 0.8926} ` +
    `L ${x + width * 0.8909} ${y + height} L ${x + width * 0.5} ${y + height * 0.6242} ` +
    `L ${x + width * 0.1051} ${y + height} L ${x} ${y + height * 0.8926} ` +
    `L ${x + width * 0.373} ${y + height * 0.5} L ${x} ${y + height * 0.1054} Z`;
  const el = builder.createPath(path);
  el.setAttribute('fill', fillColor);
  el.setAttribute('stroke', strokeColor);
  el.setAttribute('stroke-width', String(strokeWidth));
  el.setAttribute('pointer-events', 'all');
  currentGroup.appendChild(el);
}

function renderCompensationSymbol(
  renderCtx: RenderContext,
  x: number,
  y: number,
  width: number,
  height: number,
  strokeColor: string,
  fillColor: string,
  strokeWidth: number
): void {
  const { builder, currentGroup } = renderCtx;
  if (!builder || !currentGroup) return;
  const path = `M ${x} ${y + height * 0.5} L ${x + width * 0.5} ${y} L ${x + width * 0.5} ${y + height} Z ` +
    `M ${x + width * 0.5} ${y + height * 0.5} L ${x + width} ${y} L ${x + width} ${y + height} Z`;
  const el = builder.createPath(path);
  el.setAttribute('fill', fillColor);
  el.setAttribute('stroke', strokeColor);
  el.setAttribute('stroke-width', String(strokeWidth));
  el.setAttribute('pointer-events', 'all');
  currentGroup.appendChild(el);
}

function renderSignalSymbol(
  renderCtx: RenderContext,
  x: number,
  y: number,
  width: number,
  height: number,
  strokeColor: string,
  fillColor: string,
  strokeWidth: number
): void {
  const { builder, currentGroup } = renderCtx;
  if (!builder || !currentGroup) return;
  const path = `M ${x} ${y + height} L ${x + width * 0.5} ${y} L ${x + width} ${y + height} Z`;
  const el = builder.createPath(path);
  el.setAttribute('fill', fillColor);
  el.setAttribute('stroke', strokeColor);
  el.setAttribute('stroke-width', String(strokeWidth));
  el.setAttribute('pointer-events', 'all');
  currentGroup.appendChild(el);
}

function renderMultipleSymbol(
  renderCtx: RenderContext,
  x: number,
  y: number,
  width: number,
  height: number,
  strokeColor: string,
  fillColor: string,
  strokeWidth: number
): void {
  const { builder, currentGroup } = renderCtx;
  if (!builder || !currentGroup) return;
  const path = `M ${x} ${y + height * 0.39} L ${x + width * 0.5} ${y} L ${x + width} ${y + height * 0.39} ` +
    `L ${x + width * 0.815} ${y + height} L ${x + width * 0.185} ${y + height} Z`;
  const el = builder.createPath(path);
  el.setAttribute('fill', fillColor);
  el.setAttribute('stroke', strokeColor);
  el.setAttribute('stroke-width', String(strokeWidth));
  el.setAttribute('pointer-events', 'all');
  currentGroup.appendChild(el);
}

function renderParallelMultipleSymbol(
  renderCtx: RenderContext,
  x: number,
  y: number,
  width: number,
  height: number,
  strokeColor: string,
  fillColor: string,
  strokeWidth: number
): void {
  const { builder, currentGroup } = renderCtx;
  if (!builder || !currentGroup) return;
  const path = `M ${x + width * 0.38} ${y} L ${x + width * 0.62} ${y} L ${x + width * 0.62} ${y + height * 0.38} ` +
    `L ${x + width} ${y + height * 0.38} L ${x + width} ${y + height * 0.62} L ${x + width * 0.62} ${y + height * 0.62} ` +
    `L ${x + width * 0.62} ${y + height} L ${x + width * 0.38} ${y + height} L ${x + width * 0.38} ${y + height * 0.62} ` +
    `L ${x} ${y + height * 0.62} L ${x} ${y + height * 0.38} L ${x + width * 0.38} ${y + height * 0.38} Z`;
  const el = builder.createPath(path);
  el.setAttribute('fill', fillColor);
  el.setAttribute('stroke', strokeColor);
  el.setAttribute('stroke-width', String(strokeWidth));
  el.setAttribute('pointer-events', 'all');
  currentGroup.appendChild(el);
}

function renderTerminateSymbol(
  renderCtx: RenderContext,
  x: number,
  y: number,
  width: number,
  height: number,
  strokeColor: string,
  fillColor: string,
  strokeWidth: number
): void {
  const { builder, currentGroup } = renderCtx;
  if (!builder || !currentGroup) return;
  const cx = x + width / 2;
  const cy = y + height / 2;
  const ellipse = builder.createEllipse(cx, cy, width / 2, height / 2);
  ellipse.setAttribute('fill', fillColor);
  ellipse.setAttribute('stroke', strokeColor);
  ellipse.setAttribute('stroke-width', String(strokeWidth));
  ellipse.setAttribute('pointer-events', 'all');
  currentGroup.appendChild(ellipse);
}

function renderExclusiveGwSymbol(
  renderCtx: RenderContext,
  x: number,
  y: number,
  width: number,
  height: number,
  strokeColor: string,
  fillColor: string,
  strokeWidth: number
): void {
  const { builder, currentGroup } = renderCtx;
  if (!builder || !currentGroup) return;
  const path = `M ${x + width * 0.105} ${y} L ${x + width * 0.5} ${y + height * 0.38} ` +
    `L ${x + width * 0.895} ${y} L ${x + width} ${y + height * 0.11} ` +
    `L ${x + width * 0.6172} ${y + height * 0.5} L ${x + width} ${y + height * 0.89} ` +
    `L ${x + width * 0.895} ${y + height} L ${x + width * 0.5} ${y + height * 0.62} ` +
    `L ${x + width * 0.105} ${y + height} L ${x} ${y + height * 0.89} ` +
    `L ${x + width * 0.3808} ${y + height * 0.5} L ${x} ${y + height * 0.11} Z`;
  const el = builder.createPath(path);
  el.setAttribute('fill', strokeColor);
  el.setAttribute('stroke', fillColor);
  el.setAttribute('stroke-width', String(strokeWidth));
  el.setAttribute('pointer-events', 'all');
  currentGroup.appendChild(el);
}

function renderParallelGwSymbol(
  renderCtx: RenderContext,
  x: number,
  y: number,
  width: number,
  height: number,
  strokeColor: string,
  fillColor: string,
  strokeWidth: number
): void {
  const { builder, currentGroup } = renderCtx;
  if (!builder || !currentGroup) return;
  const path = `M ${x + width * 0.38} ${y} L ${x + width * 0.62} ${y} L ${x + width * 0.62} ${y + height * 0.38} ` +
    `L ${x + width} ${y + height * 0.38} L ${x + width} ${y + height * 0.62} L ${x + width * 0.62} ${y + height * 0.62} ` +
    `L ${x + width * 0.62} ${y + height} L ${x + width * 0.38} ${y + height} L ${x + width * 0.38} ${y + height * 0.62} ` +
    `L ${x} ${y + height * 0.62} L ${x} ${y + height * 0.38} L ${x + width * 0.38} ${y + height * 0.38} Z`;
  const el = builder.createPath(path);
  el.setAttribute('fill', strokeColor);
  el.setAttribute('stroke', fillColor);
  el.setAttribute('stroke-width', String(strokeWidth));
  el.setAttribute('pointer-events', 'all');
  currentGroup.appendChild(el);
}

function renderComplexGwSymbol(
  renderCtx: RenderContext,
  x: number,
  y: number,
  width: number,
  height: number,
  strokeColor: string,
  fillColor: string,
  strokeWidth: number
): void {
  const { builder, currentGroup } = renderCtx;
  if (!builder || !currentGroup) return;
  const path = `M ${x} ${y + height * 0.44} L ${x + width * 0.36} ${y + height * 0.44} ` +
    `L ${x + width * 0.1} ${y + height * 0.18} L ${x + width * 0.18} ${y + height * 0.1} ` +
    `L ${x + width * 0.44} ${y + height * 0.36} L ${x + width * 0.44} ${y} ` +
    `L ${x + width * 0.56} ${y} L ${x + width * 0.56} ${y + height * 0.36} ` +
    `L ${x + width * 0.82} ${y + height * 0.1} L ${x + width * 0.9} ${y + height * 0.18} ` +
    `L ${x + width * 0.64} ${y + height * 0.44} L ${x + width} ${y + height * 0.44} ` +
    `L ${x + width} ${y + height * 0.56} L ${x + width * 0.64} ${y + height * 0.56} ` +
    `L ${x + width * 0.9} ${y + height * 0.82} L ${x + width * 0.82} ${y + height * 0.9} ` +
    `L ${x + width * 0.56} ${y + height * 0.64} L ${x + width * 0.56} ${y + height} ` +
    `L ${x + width * 0.44} ${y + height} L ${x + width * 0.44} ${y + height * 0.64} ` +
    `L ${x + width * 0.18} ${y + height * 0.9} L ${x + width * 0.1} ${y + height * 0.82} ` +
    `L ${x + width * 0.36} ${y + height * 0.56} L ${x} ${y + height * 0.56} Z`;
  const el = builder.createPath(path);
  el.setAttribute('fill', strokeColor);
  el.setAttribute('stroke', fillColor);
  el.setAttribute('stroke-width', String(strokeWidth));
  el.setAttribute('pointer-events', 'all');
  currentGroup.appendChild(el);
}

function renderStarSymbol(
  renderCtx: RenderContext,
  x: number,
  y: number,
  width: number,
  height: number,
  strokeColor: string,
  fillColor: string,
  strokeWidth: number
): void {
  const { builder, currentGroup } = renderCtx;
  if (!builder || !currentGroup) return;
  let boxX = x + width / 5;
  let boxY = y + height / 6;
  let boxW = (width * 3) / 5;
  let boxH = (height * 2) / 3;
  const path = `M ${boxX} ${boxY + boxH / 4} L ${boxX + boxW / 3} ${boxY + boxH / 4} ` +
    `L ${boxX + boxW / 2} ${boxY} L ${boxX + (2 * boxW) / 3} ${boxY + boxH / 4} ` +
    `L ${boxX + boxW} ${boxY + boxH / 4} L ${boxX + (5 * boxW) / 6} ${boxY + boxH / 2} ` +
    `L ${boxX + boxW} ${boxY + (3 * boxH) / 4} L ${boxX + (2 * boxW) / 3} ${boxY + (3 * boxH) / 4} ` +
    `L ${boxX + boxW / 2} ${boxY + boxH} L ${boxX + boxW / 3} ${boxY + (3 * boxH) / 4} ` +
    `L ${boxX} ${boxY + (3 * boxH) / 4} L ${boxX + boxW / 6} ${boxY + boxH / 2} Z`;
  const el = builder.createPath(path);
  el.setAttribute('fill', fillColor);
  el.setAttribute('stroke', strokeColor);
  el.setAttribute('stroke-width', String(strokeWidth));
  el.setAttribute('pointer-events', 'all');
  currentGroup.appendChild(el);
}

function renderGateway(renderCtx: RenderContext, attrs: ShapeAttrs): void {
  const { builder, currentGroup, x, y, width, height, style, applyShapeAttrsToElement } = renderCtx;
  if (!builder || !currentGroup) return;

  builder.setCanvasRoot(currentGroup);
  builder.save();
  builder.setFillColor(null);
  builder.setStrokeColor(null);
  builder.begin();
  builder.addPoints(
    [
      { x: x + width / 2, y },
      { x: x + width, y: y + height / 2 },
      { x: x + width / 2, y: y + height },
      { x, y: y + height / 2 }
    ],
    false,
    0,
    true
  );
  builder.fillAndStroke();
  builder.restore();

  const diamond = currentGroup.lastChild as Element | null;
  if (diamond) {
    applyShapeAttrsToElement(diamond, attrs);
    diamond.setAttribute('stroke-miterlimit', '10');
  }

  const outline = (style.outline as string) || '';
  const symbol = (style.symbol as string) || '';
  if (outline === 'catching' && symbol === 'multiple') {
    const size = Math.min(width, height);
    const cx = x + width / 2;
    const cy = y + height / 2;
    const outerR = size * 0.25;
    const innerR = outerR * 0.84;

    const outer = builder.createEllipse(cx, cy, outerR, outerR);
    outer.setAttribute('fill', attrs.fillColor === 'none' ? 'none' : attrs.fillColor);
    outer.setAttribute('stroke', attrs.strokeColor === 'none' ? 'none' : attrs.strokeColor);
    outer.setAttribute('pointer-events', 'all');
    currentGroup.appendChild(outer);

    const inner = builder.createEllipse(cx, cy, innerR, innerR);
    inner.setAttribute('fill', 'none');
    inner.setAttribute('stroke', attrs.strokeColor === 'none' ? 'none' : attrs.strokeColor);
    inner.setAttribute('pointer-events', 'all');
    currentGroup.appendChild(inner);

    const starOuter = size * 0.15;
    const starInner = starOuter * 0.45;
    const points: { x: number; y: number }[] = [];
    for (let i = 0; i < 5; i += 1) {
      const angleOuter = -Math.PI / 2 + (i * 2 * Math.PI) / 5;
      const angleInner = angleOuter + Math.PI / 5;
      points.push({ x: cx + Math.cos(angleOuter) * starOuter, y: cy + Math.sin(angleOuter) * starOuter });
      points.push({ x: cx + Math.cos(angleInner) * starInner, y: cy + Math.sin(angleInner) * starInner });
    }
    builder.setCanvasRoot(currentGroup);
    builder.save();
    builder.setFillColor(attrs.fillColor === 'none' ? 'none' : attrs.fillColor);
    builder.setStrokeColor(attrs.strokeColor === 'none' ? 'none' : attrs.strokeColor);
    builder.setMiterLimit(10);
    builder.begin();
    builder.addPoints(points, false, 0, true);
    builder.fillAndStroke();
    builder.restore();
    const star = currentGroup.lastChild as Element | null;
    if (star) {
      star.setAttribute('pointer-events', 'all');
    }
  }

  if (symbol.startsWith('paral')) {
    const size = Math.min(width, height);
    const outer = size * 0.25;
    const inner = size * 0.06;
    const cx = x + width / 2;
    const cy = y + height / 2;
    const plusFill = attrs.strokeColor === 'none' ? '#000000' : attrs.strokeColor;
    const plusStroke = attrs.fillColor === 'none' ? '#ffffff' : attrs.fillColor;
    builder.setCanvasRoot(currentGroup);
    builder.save();
    builder.setFillColor(plusFill);
    builder.setStrokeColor(plusStroke);
    builder.setMiterLimit(10);
    builder.begin();
    builder.addPoints(
      [
        { x: cx - inner, y: cy - outer },
        { x: cx + inner, y: cy - outer },
        { x: cx + inner, y: cy - inner },
        { x: cx + outer, y: cy - inner },
        { x: cx + outer, y: cy + inner },
        { x: cx + inner, y: cy + inner },
        { x: cx + inner, y: cy + outer },
        { x: cx - inner, y: cy + outer },
        { x: cx - inner, y: cy + inner },
        { x: cx - outer, y: cy + inner },
        { x: cx - outer, y: cy - inner },
        { x: cx - inner, y: cy - inner }
      ],
      false,
      0,
      true
    );
    builder.fillAndStroke();
    builder.restore();
  }
}

function renderGateway2(renderCtx: RenderContext, attrs: ShapeAttrs): void {
  const { builder, currentGroup, x, y, width, height, style, applyShapeAttrsToElement } = renderCtx;
  if (!builder || !currentGroup) return;

  builder.setCanvasRoot(currentGroup);
  builder.save();
  builder.setFillColor(null);
  builder.setStrokeColor(null);
  builder.begin();
  builder.addPoints(
    [
      { x: x + width / 2, y },
      { x: x + width, y: y + height / 2 },
      { x: x + width / 2, y: y + height },
      { x, y: y + height / 2 }
    ],
    false,
    0,
    true
  );
  builder.fillAndStroke();
  builder.restore();

  const diamond = currentGroup.lastChild as Element | null;
  if (diamond) {
    applyShapeAttrsToElement(diamond, attrs);
    diamond.setAttribute('stroke-miterlimit', '10');
  }

  const gwType = (style.gwType as string) || '';

  const cx = x + width / 2;
  const cy = y + height / 2;
  const r = Math.min(width, height) / 2;
  const round2 = (value: number): number => Number(value.toFixed(2));
  if (gwType === 'exclusive') {
    const fillColor = attrs.strokeColor === 'none' ? '#000000' : attrs.strokeColor;
    const strokeColor = attrs.strokeColor === 'none' ? '#000000' : attrs.strokeColor;
    const points = [
      { x: round2(cx + r * -0.3), y: round2(cy + r * -0.5) },
      { x: round2(cx + r * 0.0), y: round2(cy + r * -0.12) },
      { x: round2(cx + r * 0.3), y: round2(cy + r * -0.5) },
      { x: round2(cx + r * 0.38), y: round2(cy + r * -0.39) },
      { x: round2(cx + r * 0.089), y: round2(cy + r * 0.0) },
      { x: round2(cx + r * 0.38), y: round2(cy + r * 0.39) },
      { x: round2(cx + r * 0.3), y: round2(cy + r * 0.5) },
      { x: round2(cx + r * 0.0), y: round2(cy + r * 0.12) },
      { x: round2(cx + r * -0.3), y: round2(cy + r * 0.5) },
      { x: round2(cx + r * -0.38), y: round2(cy + r * 0.39) },
      { x: round2(cx + r * -0.0905), y: round2(cy + r * 0.0) },
      { x: round2(cx + r * -0.38), y: round2(cy + r * -0.39) }
    ];

    builder.setCanvasRoot(currentGroup);
    builder.save();
    builder.setFillColor(fillColor);
    builder.setStrokeColor(strokeColor);
    builder.setStrokeWidth(attrs.strokeWidth);
    builder.setMiterLimit(10);
    builder.begin();
    builder.addPoints(points, false, 0, true);
    builder.fillAndStroke();
    builder.restore();

    const marker = currentGroup.lastChild as Element | null;
    if (marker) {
      marker.setAttribute('pointer-events', 'all');
    }
  }

  if (gwType === 'parallel') {
    const fillColor = attrs.strokeColor === 'none' ? '#000000' : attrs.strokeColor;
    const strokeColor = attrs.strokeColor === 'none' ? '#000000' : attrs.strokeColor;
    const o = r * 0.12;
    const l = r * 0.5;
    const plusPoints = [
      { x: round2(cx - o), y: round2(cy - l) },
      { x: round2(cx + o), y: round2(cy - l) },
      { x: round2(cx + o), y: round2(cy - o) },
      { x: round2(cx + l), y: round2(cy - o) },
      { x: round2(cx + l), y: round2(cy + o) },
      { x: round2(cx + o), y: round2(cy + o) },
      { x: round2(cx + o), y: round2(cy + l) },
      { x: round2(cx - o), y: round2(cy + l) },
      { x: round2(cx - o), y: round2(cy + o) },
      { x: round2(cx - l), y: round2(cy + o) },
      { x: round2(cx - l), y: round2(cy - o) },
      { x: round2(cx - o), y: round2(cy - o) }
    ];

    builder.setCanvasRoot(currentGroup);
    builder.save();
    builder.setFillColor(fillColor);
    builder.setStrokeColor(strokeColor);
    builder.setStrokeWidth(attrs.strokeWidth);
    builder.setMiterLimit(10);
    builder.begin();
    builder.addPoints(plusPoints, false, 0, true);
    builder.fillAndStroke();
    builder.restore();

    const marker = currentGroup.lastChild as Element | null;
    if (marker) {
      marker.setAttribute('pointer-events', 'all');
    }
  }

  const symbol = (style.symbol as string) || '';
  const outline = (style.outline as string) || '';
  if (symbol === 'error' && outline.startsWith('event')) {
    const innerR = Math.min(width, height) * 0.3;
    const inner = builder.createEllipse(cx, cy, innerR, innerR);
    inner.setAttribute('fill', attrs.fillColor === 'none' ? 'none' : attrs.fillColor);
    inner.setAttribute('stroke', attrs.strokeColor === 'none' ? 'none' : attrs.strokeColor);
    inner.setAttribute('pointer-events', 'all');
    currentGroup.appendChild(inner);

    const errorPoints = [
      { x: round2(cx + innerR * -0.576), y: round2(cy + innerR * 0.5) },
      { x: round2(cx + innerR * -0.1945), y: round2(cy + innerR * -0.3895) },
      { x: round2(cx + innerR * 0.1425), y: round2(cy + innerR * 0.129) },
      { x: round2(cx + innerR * 0.584), y: round2(cy + innerR * -0.514) },
      { x: round2(cx + innerR * 0.1925), y: round2(cy + innerR * 0.438) },
      { x: round2(cx + innerR * -0.145), y: round2(cy + innerR * -0.0005) }
    ];

    builder.setCanvasRoot(currentGroup);
    builder.save();
    builder.setFillColor(attrs.fillColor === 'none' ? 'none' : attrs.fillColor);
    builder.setStrokeColor(attrs.strokeColor === 'none' ? 'none' : attrs.strokeColor);
    builder.setStrokeWidth(attrs.strokeWidth);
    builder.setMiterLimit(7);
    builder.begin();
    builder.addPoints(errorPoints, false, 0, true);
    builder.fillAndStroke();
    builder.restore();
  }
}

