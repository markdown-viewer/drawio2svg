import type { MxCell, MxGeometry, MxStyle } from '../../parser.ts';
import { getPerimeterPoint, type CellState, type Point } from '../../edge-router.ts';
import {
  DIRECTION_MASK_ALL,
  DIRECTION_MASK_EAST,
  DIRECTION_MASK_NORTH,
  DIRECTION_MASK_SOUTH,
  DIRECTION_MASK_WEST
} from '../../edge-router/styles/orthogonal/constants.ts';

// Type for perimeter function lookup
export type GetPerimeterFn = (shape: string | undefined) => ((bounds: CellState, next: Point, orthogonal: boolean, direction?: string) => Point) | null;

export interface EdgeTerminalContext {
  getAbsolutePosition: (cell: MxCell, cellMap: Map<string, MxCell>) => { x: number; y: number };
  isEdgeChildLabel: (cell: MxCell, cellMap: Map<string, MxCell>) => boolean;
  measureMultilineTextSize: (value: string, style: MxStyle, fontSize: number) => { width: number; height: number };
  getStencilSvg?: (style: MxStyle) => string | null;
  getPerimeterFn?: GetPerimeterFn;
}

export interface EdgeTerminalParams {
  terminalCell: MxCell | null;
  cellMap: Map<string, MxCell>;
  edgeStyle: MxStyle;
  edgeGeometry?: MxGeometry | null;
  edgeOrigin: Point;
  offsetX: number;
  offsetY: number;
  kind: 'source' | 'target';
}

export interface EdgeTerminalResult {
  state: CellState | null;
  fixedPoint: Point | null;
  isEdgeChildLabel: boolean;
  skipPerimeter?: boolean;
}

export function buildEdgeTerminal(
  ctx: EdgeTerminalContext,
  params: EdgeTerminalParams
): EdgeTerminalResult {
  const { terminalCell, cellMap, edgeStyle, edgeGeometry, edgeOrigin, offsetX, offsetY, kind } = params;

  const getPortConstraintMask = (terminalStyle: MxStyle, edgeStyle: MxStyle, rotation: number, isSource: boolean): number => {
    const raw = terminalStyle.portConstraint ?? (isSource ? edgeStyle.sourcePortConstraint : edgeStyle.targetPortConstraint);
    if (raw == null) return DIRECTION_MASK_ALL;
    const directions = raw.toString().toLowerCase();
    let mask = 0;

    const rotationEnabled = terminalStyle.portConstraintRotation === 1 || terminalStyle.portConstraintRotation === '1' || terminalStyle.portConstraintRotation === true;
    let quad = 0;
    if (rotationEnabled) {
      if (rotation > 45) {
        quad = 1;
        if (rotation >= 135) {
          quad = 2;
        }
      } else if (rotation < -45) {
        quad = 3;
        if (rotation <= -135) {
          quad = 2;
        }
      }
    }

    if (directions.includes('north')) {
      switch (quad) {
        case 0: mask |= DIRECTION_MASK_NORTH; break;
        case 1: mask |= DIRECTION_MASK_EAST; break;
        case 2: mask |= DIRECTION_MASK_SOUTH; break;
        case 3: mask |= DIRECTION_MASK_WEST; break;
      }
    }
    if (directions.includes('west')) {
      switch (quad) {
        case 0: mask |= DIRECTION_MASK_WEST; break;
        case 1: mask |= DIRECTION_MASK_NORTH; break;
        case 2: mask |= DIRECTION_MASK_EAST; break;
        case 3: mask |= DIRECTION_MASK_SOUTH; break;
      }
    }
    if (directions.includes('south')) {
      switch (quad) {
        case 0: mask |= DIRECTION_MASK_SOUTH; break;
        case 1: mask |= DIRECTION_MASK_WEST; break;
        case 2: mask |= DIRECTION_MASK_NORTH; break;
        case 3: mask |= DIRECTION_MASK_EAST; break;
      }
    }
    if (directions.includes('east')) {
      switch (quad) {
        case 0: mask |= DIRECTION_MASK_EAST; break;
        case 1: mask |= DIRECTION_MASK_SOUTH; break;
        case 2: mask |= DIRECTION_MASK_WEST; break;
        case 3: mask |= DIRECTION_MASK_NORTH; break;
      }
    }

    return mask;
  };

  if (terminalCell?.geometry) {
    const absPos = ctx.getAbsolutePosition(terminalCell, cellMap);
    const isEdgeChildLabel = ctx.isEdgeChildLabel(terminalCell, cellMap);
    const terminalOffsetX = isEdgeChildLabel ? 0 : offsetX;
    const terminalOffsetY = isEdgeChildLabel ? 0 : offsetY;

    const shapeType = terminalCell.style.shape as string | undefined;
    const isWaypoint = shapeType === 'waypoint';
    const rotationValue = parseFloat(terminalCell.style.rotation as string);
    const rotation = !isEdgeChildLabel && Number.isFinite(rotationValue) ? rotationValue : 0;
    const state: CellState = {
      x: absPos.x + terminalOffsetX,
      y: absPos.y + terminalOffsetY,
      width: terminalCell.geometry.width,
      height: terminalCell.geometry.height,
      shape: shapeType,
      geometryRelative: terminalCell.geometry.relative === true,
      geometryRelativeX: terminalCell.geometry.x,
      rotation,
      portConstraint: terminalCell.style.portConstraint as string,
      perimeter: terminalCell.style.perimeter as string,
      direction: terminalCell.style.direction as string,
      strokeWidth: parseFloat(terminalCell.style.strokeWidth as string) || 1,
      backboneSize: terminalCell.style.backboneSize !== undefined
        ? parseFloat(terminalCell.style.backboneSize as string)
        : undefined,
      perimeterSpacing: terminalCell.style.perimeterSpacing !== undefined
        ? parseFloat(terminalCell.style.perimeterSpacing as string)
        : undefined
    };
    state.portConstraintMask = getPortConstraintMask(terminalCell.style, edgeStyle, rotation, kind === 'source');

    const shapeName = terminalCell.style.shape as string | undefined;
    const isStencil = !!(shapeName && shapeName.startsWith('mxgraph.'));
    const isElectricalStencil = !!(shapeName && shapeName.startsWith('mxgraph.electrical.'));
    const hasFixedAspectStyle = (terminalCell.style.aspect as string) === 'fixed'
      || (terminalCell.style.imageAspect as string) === '1';

    if (isStencil && ctx.getStencilSvg) {
      const stencilSvg = ctx.getStencilSvg(terminalCell.style);
      if (stencilSvg) {
        const viewBoxMatch = stencilSvg.match(/viewBox\s*=\s*"([^"]+)"/i);
        const widthMatch = stencilSvg.match(/\bwidth\s*=\s*"([^"]+)"/i);
        const heightMatch = stencilSvg.match(/\bheight\s*=\s*"([^"]+)"/i);
        let srcW = 0;
        let srcH = 0;
        if (viewBoxMatch) {
          const nums = viewBoxMatch[1].split(/[\s,]+/).map((n) => parseFloat(n));
          if (nums.length >= 4) {
            srcW = nums[2];
            srcH = nums[3];
          }
        }
        if (!srcW || !srcH) {
          const w = widthMatch ? parseFloat(widthMatch[1]) : 0;
          const h = heightMatch ? parseFloat(heightMatch[1]) : 0;
          srcW = Number.isFinite(w) ? w : 0;
          srcH = Number.isFinite(h) ? h : 0;
        }
        if (srcW > 0 && srcH > 0 && state.width > 0 && state.height > 0) {
          const scaleX = state.width / srcW;
          const scaleY = state.height / srcH;
          const aspectDiff = Math.abs(scaleX - scaleY);
          const fixedAspect = hasFixedAspectStyle || (isElectricalStencil && aspectDiff <= 0.05);
          const skipFixedAspectShapes = new Set([
            'mxgraph.citrix2.citrix_gateway_service',
            'mxgraph.citrix2.switch',
            'mxgraph.citrix2.thin_client',
            'mxgraph.citrix2.web_saas_apps'
          ]);
          const allowFixedAspectAdjustment = !skipFixedAspectShapes.has(shapeName || '');
          if (fixedAspect && allowFixedAspectAdjustment) {
            const scale = Math.min(scaleX, scaleY);
            const renderW = srcW * scale;
            const renderH = srcH * scale;
            const extraX = (state.width - renderW) / 2;
            const extraY = (state.height - renderH) / 2;
            state.x += extraX;
            state.y += extraY;
            state.width = renderW;
            state.height = renderH;
          }
        }
      }
    }

    const isText = shapeType === 'text' || terminalCell.style.text === true || terminalCell.style.text === '1';
    if (isText && terminalCell.value && state.width === 0 && state.height === 0) {
      const fontSize = parseFloat(terminalCell.style.fontSize as string) || 12;
      const { width: textWidth, height: textHeight } = ctx.measureMultilineTextSize(
        terminalCell.value,
        terminalCell.style,
        fontSize
      );
      const labelWidth = isEdgeChildLabel ? Math.min(textWidth, fontSize * 2) : textWidth;
      const labelHeight = isEdgeChildLabel ? Math.min(textHeight, fontSize * 1.2) : textHeight;
      state.x -= labelWidth / 2;
      state.y -= labelHeight / 2;
      state.width = labelWidth;
      state.height = labelHeight;
    }

    const getConnectionPoint = (
      constraintX: number,
      constraintY: number,
      constraintDx: number,
      constraintDy: number,
      usePerimeter: boolean
    ): Point => {
      let bounds = {
        x: state.x,
        y: state.y,
        width: state.width,
        height: state.height
      };
      const perimeterSpacing = Number.isFinite(state.perimeterSpacing as number)
        ? (state.perimeterSpacing as number)
        : 0;
      if (perimeterSpacing !== 0) {
        bounds = {
          x: bounds.x - perimeterSpacing,
          y: bounds.y - perimeterSpacing,
          width: bounds.width + perimeterSpacing * 2,
          height: bounds.height + perimeterSpacing * 2
        };
      }
      const direction = (state.direction || '').toString().toLowerCase();
      const center = {
        x: bounds.x + bounds.width / 2,
        y: bounds.y + bounds.height / 2
      };
      const edgeScale = edgeGeometry ? (edgeGeometry as unknown as { scale?: number }).scale : undefined;
      const viewScale = typeof edgeScale === 'number' ? edgeScale : 1;

      if (direction === 'north' || direction === 'south') {
        const t = (bounds.width - bounds.height) / 2;
        bounds = {
          x: bounds.x + t,
          y: bounds.y - t,
          width: bounds.height,
          height: bounds.width
        };
      }

      let point: Point = {
        x: bounds.x + constraintX * bounds.width + constraintDx * viewScale,
        y: bounds.y + constraintY * bounds.height + constraintDy * viewScale
      };

      let flipH = terminalCell.style.flipH === '1' || terminalCell.style.flipH === true;
      let flipV = terminalCell.style.flipV === '1' || terminalCell.style.flipV === true;
      if (shapeName && shapeName.startsWith('mxgraph.')) {
        const stencilFlipH = terminalCell.style.stencilFlipH === '1' || terminalCell.style.stencilFlipH === true;
        const stencilFlipV = terminalCell.style.stencilFlipV === '1' || terminalCell.style.stencilFlipV === true;
        flipH = flipH || stencilFlipH;
        flipV = flipV || stencilFlipV;
      }

      if (direction === 'north' || direction === 'south') {
        const temp = flipH;
        flipH = flipV;
        flipV = temp;
      }

      if (flipH) {
        point.x = 2 * center.x - point.x;
      }
      if (flipV) {
        point.y = 2 * center.y - point.y;
      }

      const anchorPointDirection = terminalCell.style.anchorPointDirection !== 0 && terminalCell.style.anchorPointDirection !== '0' && terminalCell.style.anchorPointDirection !== false;
      if (direction && anchorPointDirection) {
        let rotationSteps = 0;
        if (direction === 'north') rotationSteps = 270;
        else if (direction === 'west') rotationSteps = 180;
        else if (direction === 'south') rotationSteps = 90;

        if (rotationSteps !== 0) {
          let cos = 0;
          let sin = 0;
          if (rotationSteps === 90) sin = 1;
          else if (rotationSteps === 180) cos = -1;
          else if (rotationSteps === 270) sin = -1;
          const dx = point.x - center.x;
          const dy = point.y - center.y;
          point = {
            x: center.x + dx * cos - dy * sin,
            y: center.y + dx * sin + dy * cos
          };
        }
      }

      const rotation = state.rotation || 0;
      if (usePerimeter) {
        const perimeterStateBase = rotation !== 0 ? { ...state, rotation: 0 } : state;
        const perimeterState = perimeterSpacing !== 0
          ? {
              ...perimeterStateBase,
              x: perimeterStateBase.x - perimeterSpacing,
              y: perimeterStateBase.y - perimeterSpacing,
              width: perimeterStateBase.width + perimeterSpacing * 2,
              height: perimeterStateBase.height + perimeterSpacing * 2
            }
          : perimeterStateBase;
        point = getPerimeterPoint(perimeterState, point, false, ctx.getPerimeterFn);
      }

      if (rotation !== 0) {
        const rad = rotation * Math.PI / 180;
        const cos = Math.cos(rad);
        const sin = Math.sin(rad);
        const dx = point.x - center.x;
        const dy = point.y - center.y;
        point = {
          x: center.x + dx * cos - dy * sin,
          y: center.y + dx * sin + dy * cos
        };
      }

      return {
        x: point.x,
        y: point.y
      };
    };

    const isSource = kind === 'source';
    const axisX = isSource ? edgeStyle.exitX : edgeStyle.entryX;
    const axisY = isSource ? edgeStyle.exitY : edgeStyle.entryY;
    if (!isWaypoint && axisX !== undefined && axisY !== undefined) {
      const ex = parseFloat(axisX as string);
      const ey = parseFloat(axisY as string);
      if (!isNaN(ex) && !isNaN(ey)) {
        const dxRaw = isSource ? edgeStyle.exitDx : edgeStyle.entryDx;
        const dyRaw = isSource ? edgeStyle.exitDy : edgeStyle.entryDy;
        const deltaX = parseFloat(dxRaw as string) || 0;
        const deltaY = parseFloat(dyRaw as string) || 0;
        const perimeterRaw = parseFloat((isSource ? edgeStyle.exitPerimeter : edgeStyle.entryPerimeter) as string);
        const usePerimeter = !Number.isFinite(perimeterRaw) || perimeterRaw !== 0;
        const forceCenterPerimeter = state.perimeter === 'centerPerimeter';
        const point = getConnectionPoint(ex, ey, deltaX, deltaY, usePerimeter || forceCenterPerimeter);
        return {
          state,
          fixedPoint: point,
          isEdgeChildLabel,
          skipPerimeter: true
        };
      }
    }

    return { state, fixedPoint: null, isEdgeChildLabel };
  }

  if (kind === 'source' && edgeGeometry?.sourcePoint) {
    return {
      state: null,
      fixedPoint: {
        x: edgeGeometry.sourcePoint.x + edgeOrigin.x,
        y: edgeGeometry.sourcePoint.y + edgeOrigin.y
      },
      isEdgeChildLabel: false
    };
  }

  if (kind === 'target' && edgeGeometry?.targetPoint) {
    return {
      state: null,
      fixedPoint: {
        x: edgeGeometry.targetPoint.x + edgeOrigin.x,
        y: edgeGeometry.targetPoint.y + edgeOrigin.y
      },
      isEdgeChildLabel: false
    };
  }

  return { state: null, fixedPoint: null, isEdgeChildLabel: false };
}
