import type { CellState, Point } from '../../types.ts';
import { SegmentConnector } from '../segment.ts';
import {
  CENTER_MASK,
  DIRECTION_MASK_ALL,
  DIRECTION_MASK_EAST,
  DIRECTION_MASK_NORTH,
  DIRECTION_MASK_SOUTH,
  DIRECTION_MASK_WEST,
  SIDE_MASK,
  SOURCE_MASK,
  TARGET_MASK,
  dirVectors,
  limits,
  orthBuffer,
  orthPointsFallback,
  routePatterns,
  vertexSeperations,
  wayPoints1
} from './constants.ts';
import { parsePortConstraint, reversePortConstraints } from './port-constraints.ts';

// ============================================================================
// OrthConnector - local orthogonal router
// ============================================================================

export function OrthConnector(
  source: CellState | null,
  target: CellState | null,
  controlHints: Point[],
  result: Point[],
  p0: Point | null,
  pe: Point | null,
  sourceBuffer: number = orthBuffer,
  targetBuffer: number = orthBuffer
): void {
  // Note: In the platform this operates on scaled coordinates, we use scale=1

  const roundInternal = (value: number): number => Math.round(value * 10) / 10;
  const roundOutput = (value: number): number => Math.round(value * 10) / 10;
  const roundPoint = (pt: Point | null): Point | null => {
    if (!pt) return null;
    return { x: roundInternal(pt.x), y: roundInternal(pt.y) };
  };

  const getRotatedBounds = (x: number, y: number, width: number, height: number, rotation: number) => {
    if (!rotation) return { x, y, width, height };
    const cx = x + width / 2;
    const cy = y + height / 2;
    const rad = rotation * Math.PI / 180;
    const cos = Math.cos(rad);
    const sin = Math.sin(rad);
    const corners = [
      [x, y],
      [x + width, y],
      [x + width, y + height],
      [x, y + height]
    ];
    let minX = Infinity;
    let minY = Infinity;
    let maxX = -Infinity;
    let maxY = -Infinity;
    for (const [px, py] of corners) {
      const dx = px - cx;
      const dy = py - cy;
      const rx = cx + dx * cos - dy * sin;
      const ry = cy + dx * sin + dy * cos;
      minX = Math.min(minX, rx);
      minY = Math.min(minY, ry);
      maxX = Math.max(maxX, rx);
      maxY = Math.max(maxY, ry);
    }
    return { x: minX, y: minY, width: maxX - minX, height: maxY - minY };
  };

  p0 = roundPoint(p0);
  pe = roundPoint(pe);

  let sourceX = source != null ? source.x : (p0 != null ? p0.x : 0);
  let sourceY = source != null ? source.y : (p0 != null ? p0.y : 0);
  let sourceWidth = source != null ? source.width : 1;
  let sourceHeight = source != null ? source.height : 1;
  
  let targetX = target != null ? target.x : (pe != null ? pe.x : 0);
  let targetY = target != null ? target.y : (pe != null ? pe.y : 0);
  let targetWidth = target != null ? target.width : 1;
  let targetHeight = target != null ? target.height : 1;

  sourceX = roundInternal(sourceX);
  sourceY = roundInternal(sourceY);
  sourceWidth = roundInternal(sourceWidth);
  sourceHeight = roundInternal(sourceHeight);
  targetX = roundInternal(targetX);
  targetY = roundInternal(targetY);
  targetWidth = roundInternal(targetWidth);
  targetHeight = roundInternal(targetHeight);

  // Workaround for loop routing within buffer zone
  if (source != null && target != null && source === target) {
    targetBuffer = Math.max(sourceBuffer, targetBuffer);
    sourceBuffer = targetBuffer;
  }
  
  const totalBuffer = targetBuffer + sourceBuffer;
  let tooShort = false;
  
  // Checks minimum distance for fixed points and falls back to segment connector
  if (p0 != null && pe != null) {
    const dx = pe.x - p0.x;
    const dy = pe.y - p0.y;
    
    tooShort = dx * dx + dy * dy < totalBuffer * totalBuffer;
  }

  if (tooShort || (orthPointsFallback && (controlHints != null && controlHints.length > 0))) {
    SegmentConnector(source, target, controlHints, result, p0, pe);
    return;
  }

  // portConstraint [source, target]
  const portConstraint = [
    source ? (source.portConstraintMask ?? parsePortConstraint(source.portConstraint)) : DIRECTION_MASK_ALL,
    target ? (target.portConstraintMask ?? parsePortConstraint(target.portConstraint)) : DIRECTION_MASK_ALL
  ];

  if (source && source.rotation) {
    const rotated = getRotatedBounds(sourceX, sourceY, sourceWidth, sourceHeight, source.rotation);
    sourceX = rotated.x;
    sourceY = rotated.y;
    sourceWidth = rotated.width;
    sourceHeight = rotated.height;
  }

  if (target && target.rotation) {
    const rotated = getRotatedBounds(targetX, targetY, targetWidth, targetHeight, target.rotation);
    targetX = rotated.x;
    targetY = rotated.y;
    targetWidth = rotated.width;
    targetHeight = rotated.height;
  }
  
  if (sourceWidth == 0 || sourceHeight == 0 || targetWidth == 0 || targetHeight == 0) {
    return;
  }

  const dir = [0, 0];

  // geo -> [source, target] [x, y, width, height]
  const geo = [
    [sourceX, sourceY, sourceWidth, sourceHeight],
    [targetX, targetY, targetWidth, targetHeight]
  ];
  const buffer = [sourceBuffer, targetBuffer];

  for (let i = 0; i < 2; i++) {
    limits[i][1] = geo[i][0] - buffer[i];
    limits[i][2] = geo[i][1] - buffer[i];
    limits[i][4] = geo[i][0] + geo[i][2] + buffer[i];
    limits[i][8] = geo[i][1] + geo[i][3] + buffer[i];
  }
  
  // Work out which quad the target is in
  const sourceCenX = geo[0][0] + geo[0][2] / 2.0;
  const sourceCenY = geo[0][1] + geo[0][3] / 2.0;
  const targetCenX = geo[1][0] + geo[1][2] / 2.0;
  const targetCenY = geo[1][1] + geo[1][3] / 2.0;
  
  const dx = sourceCenX - targetCenX;
  const dy = sourceCenY - targetCenY;

  let quad = 0;

  // 0 | 1
  // -----
  // 3 | 2
  
  if (dx < 0) {
    if (dy < 0) {
      quad = 2;
    } else {
      quad = 1;
    }
  } else {
    if (dy <= 0) {
      quad = 3;
      
      // Special case on x = 0 and negative y
      if (dx == 0) {
        quad = 2;
      }
    }
  }

  // Check for connection constraints
  let currentTerm: Point | null = null;
  
  if (source != null) {
    currentTerm = p0;
  }

  const constraint = [[0.5, 0.5], [0.5, 0.5]];

  // The only assumed cases for the below is an unattached end
  if (!source) constraint[0] = [0, 0];
  if (!target) constraint[1] = [0, 0];

  for (let i = 0; i < 2; i++) {
    if (currentTerm != null) {
      constraint[i][0] = (currentTerm.x - geo[i][0]) / geo[i][2];
      
      if (Math.abs(currentTerm.x - geo[i][0]) <= 1) {
        dir[i] = DIRECTION_MASK_WEST;
      } else if (Math.abs(currentTerm.x - geo[i][0] - geo[i][2]) <= 1) {
        dir[i] = DIRECTION_MASK_EAST;
      }

      constraint[i][1] = (currentTerm.y - geo[i][1]) / geo[i][3];

      if (Math.abs(currentTerm.y - geo[i][1]) <= 1) {
        dir[i] = DIRECTION_MASK_NORTH;
      } else if (Math.abs(currentTerm.y - geo[i][1] - geo[i][3]) <= 1) {
        dir[i] = DIRECTION_MASK_SOUTH;
      }
    }

    currentTerm = null;
    
    if (target != null) {
      currentTerm = pe;
    }
  }

  const sourceTopDist = geo[0][1] - (geo[1][1] + geo[1][3]);
  const sourceLeftDist = geo[0][0] - (geo[1][0] + geo[1][2]);
  const sourceBottomDist = geo[1][1] - (geo[0][1] + geo[0][3]);
  const sourceRightDist = geo[1][0] - (geo[0][0] + geo[0][2]);

  vertexSeperations[1] = Math.max(sourceLeftDist - totalBuffer, 0);
  vertexSeperations[2] = Math.max(sourceTopDist - totalBuffer, 0);
  vertexSeperations[4] = Math.max(sourceBottomDist - totalBuffer, 0);
  vertexSeperations[3] = Math.max(sourceRightDist - totalBuffer, 0);

  // Start of source and target direction determination
  const dirPref: number[] = [];
  const horPref: number[] = [];
  const vertPref: number[] = [];

  horPref[0] = (sourceLeftDist >= sourceRightDist) ? DIRECTION_MASK_WEST : DIRECTION_MASK_EAST;
  vertPref[0] = (sourceTopDist >= sourceBottomDist) ? DIRECTION_MASK_NORTH : DIRECTION_MASK_SOUTH;

  horPref[1] = reversePortConstraints(horPref[0]);
  vertPref[1] = reversePortConstraints(vertPref[0]);
  
  const preferredHorizDist = sourceLeftDist >= sourceRightDist ? sourceLeftDist : sourceRightDist;
  const preferredVertDist = sourceTopDist >= sourceBottomDist ? sourceTopDist : sourceBottomDist;

  const prefOrdering = [[0, 0], [0, 0]];
  let preferredOrderSet = false;

  // If the preferred port isn't available, switch it
  for (let i = 0; i < 2; i++) {
    if (dir[i] != 0x0) {
      continue;
    }

    if ((horPref[i] & portConstraint[i]) == 0) {
      horPref[i] = reversePortConstraints(horPref[i]);
    }

    if ((vertPref[i] & portConstraint[i]) == 0) {
      vertPref[i] = reversePortConstraints(vertPref[i]);
    }

    prefOrdering[i][0] = vertPref[i];
    prefOrdering[i][1] = horPref[i];
  }

  if (preferredVertDist > 0 && preferredHorizDist > 0) {
    // Possibility of two segment edge connection
    if (((horPref[0] & portConstraint[0]) > 0) && ((vertPref[1] & portConstraint[1]) > 0)) {
      prefOrdering[0][0] = horPref[0];
      prefOrdering[0][1] = vertPref[0];
      prefOrdering[1][0] = vertPref[1];
      prefOrdering[1][1] = horPref[1];
      preferredOrderSet = true;
    } else if (((vertPref[0] & portConstraint[0]) > 0) && ((horPref[1] & portConstraint[1]) > 0)) {
      prefOrdering[0][0] = vertPref[0];
      prefOrdering[0][1] = horPref[0];
      prefOrdering[1][0] = horPref[1];
      prefOrdering[1][1] = vertPref[1];
      preferredOrderSet = true;
    }
  }
  
  if (preferredVertDist > 0 && !preferredOrderSet) {
    prefOrdering[0][0] = vertPref[0];
    prefOrdering[0][1] = horPref[0];
    prefOrdering[1][0] = vertPref[1];
    prefOrdering[1][1] = horPref[1];
    preferredOrderSet = true;
  }
  
  if (preferredHorizDist > 0 && !preferredOrderSet) {
    prefOrdering[0][0] = horPref[0];
    prefOrdering[0][1] = vertPref[0];
    prefOrdering[1][0] = horPref[1];
    prefOrdering[1][1] = vertPref[1];
    preferredOrderSet = true;
  }

  // Compact list if it contains gaps
  for (let i = 0; i < 2; i++) {
    if (dir[i] != 0x0) {
      continue;
    }

    if ((prefOrdering[i][0] & portConstraint[i]) == 0) {
      prefOrdering[i][0] = prefOrdering[i][1];
    }

    dirPref[i] = prefOrdering[i][0] & portConstraint[i];
    dirPref[i] |= (prefOrdering[i][1] & portConstraint[i]) << 8;
    dirPref[i] |= (prefOrdering[1 - i][i] & portConstraint[i]) << 16;
    dirPref[i] |= (prefOrdering[1 - i][1 - i] & portConstraint[i]) << 24;

    if ((dirPref[i] & 0xF) == 0) {
      dirPref[i] = dirPref[i] << 8;
    }
    
    if ((dirPref[i] & 0xF00) == 0) {
      dirPref[i] = (dirPref[i] & 0xF) | dirPref[i] >> 8;
    }
    
    if ((dirPref[i] & 0xF0000) == 0) {
      dirPref[i] = (dirPref[i] & 0xFFFF) | ((dirPref[i] & 0xF000000) >> 8);
    }

    dir[i] = dirPref[i] & 0xF;

    if (portConstraint[i] == DIRECTION_MASK_WEST ||
        portConstraint[i] == DIRECTION_MASK_NORTH ||
        portConstraint[i] == DIRECTION_MASK_EAST ||
        portConstraint[i] == DIRECTION_MASK_SOUTH) {
      dir[i] = portConstraint[i];
    }
  }

  // End of source and target direction determination

  let sourceIndex = dir[0] == DIRECTION_MASK_EAST ? 3 : dir[0];
  let targetIndex = dir[1] == DIRECTION_MASK_EAST ? 3 : dir[1];

  sourceIndex -= quad;
  targetIndex -= quad;

  if (sourceIndex < 1) {
    sourceIndex += 4;
  }
  
  if (targetIndex < 1) {
    targetIndex += 4;
  }

  const routePattern = routePatterns[sourceIndex - 1][targetIndex - 1];

  wayPoints1[0][0] = geo[0][0];
  wayPoints1[0][1] = geo[0][1];

  switch (dir[0]) {
    case DIRECTION_MASK_WEST:
      wayPoints1[0][0] -= sourceBuffer;
      wayPoints1[0][1] += constraint[0][1] * geo[0][3];
      break;
    case DIRECTION_MASK_SOUTH:
      wayPoints1[0][0] += constraint[0][0] * geo[0][2];
      wayPoints1[0][1] += geo[0][3] + sourceBuffer;
      break;
    case DIRECTION_MASK_EAST:
      wayPoints1[0][0] += geo[0][2] + sourceBuffer;
      wayPoints1[0][1] += constraint[0][1] * geo[0][3];
      break;
    case DIRECTION_MASK_NORTH:
      wayPoints1[0][0] += constraint[0][0] * geo[0][2];
      wayPoints1[0][1] -= sourceBuffer;
      break;
  }

  let currentIndex = 0;

  // Orientation, 0 horizontal, 1 vertical
  let lastOrientation = (dir[0] & (DIRECTION_MASK_EAST | DIRECTION_MASK_WEST)) > 0 ? 0 : 1;
  const initialOrientation = lastOrientation;
  let currentOrientation = 0;

  for (let i = 0; i < routePattern.length; i++) {
    const nextDirection = routePattern[i] & 0xF;

    // Rotate the index of this direction by the quad to get the real direction
    let directionIndex = nextDirection == DIRECTION_MASK_EAST ? 3 : nextDirection;

    directionIndex += quad;

    if (directionIndex > 4) {
      directionIndex -= 4;
    }

    const direction = dirVectors[directionIndex - 1];

    currentOrientation = (directionIndex % 2 > 0) ? 0 : 1;
    
    // Only update the current index if the point moved in the direction
    // of the current segment move
    if (currentOrientation != lastOrientation) {
      currentIndex++;
      wayPoints1[currentIndex][0] = wayPoints1[currentIndex - 1][0];
      wayPoints1[currentIndex][1] = wayPoints1[currentIndex - 1][1];
    }

    const tar = (routePattern[i] & TARGET_MASK) > 0;
    const sou = (routePattern[i] & SOURCE_MASK) > 0;
    let side = (routePattern[i] & SIDE_MASK) >> 5;
    side = side << quad;

    if (side > 0xF) {
      side = side >> 4;
    }

    const center = (routePattern[i] & CENTER_MASK) > 0;

    if ((sou || tar) && side < 9) {
      let limit = 0;
      const souTar = sou ? 0 : 1;

      if (center && currentOrientation == 0) {
        limit = geo[souTar][0] + constraint[souTar][0] * geo[souTar][2];
      } else if (center) {
        limit = geo[souTar][1] + constraint[souTar][1] * geo[souTar][3];
      } else {
        limit = limits[souTar][side];
      }
      
      if (currentOrientation == 0) {
        const lastX = wayPoints1[currentIndex][0];
        const deltaX = (limit - lastX) * direction[0];

        if (deltaX > 0) {
          wayPoints1[currentIndex][0] += direction[0] * deltaX;
        }
      } else {
        const lastY = wayPoints1[currentIndex][1];
        const deltaY = (limit - lastY) * direction[1];

        if (deltaY > 0) {
          wayPoints1[currentIndex][1] += direction[1] * deltaY;
        }
      }
    } else if (center) {
      // Which center we're travelling to depend on the current direction
      wayPoints1[currentIndex][0] += direction[0] * Math.abs(vertexSeperations[directionIndex] / 2);
      wayPoints1[currentIndex][1] += direction[1] * Math.abs(vertexSeperations[directionIndex] / 2);
    }

    if (currentIndex > 0 &&
        wayPoints1[currentIndex][currentOrientation] == wayPoints1[currentIndex - 1][currentOrientation]) {
      currentIndex--;
    } else {
      lastOrientation = currentOrientation;
    }
  }

  for (let i = 0; i <= currentIndex; i++) {
    if (i == currentIndex) {
      // Last point can cause last segment to be in same direction as jetty/approach
      const targetOrientation = (dir[1] & (DIRECTION_MASK_EAST | DIRECTION_MASK_WEST)) > 0 ? 0 : 1;
      const sameOrient = targetOrientation == initialOrientation ? 0 : 1;

      // (currentIndex + 1) % 2 is 0 for even number of points, 1 for odd
      if (sameOrient != (currentIndex + 1) % 2) {
        // The last point isn't required
        break;
      }
    }
    
    result.push({
      x: roundOutput(wayPoints1[i][0]),
      y: roundOutput(wayPoints1[i][1])
    });
  }

  // Removes duplicates
  let index = 1;
  
  while (index < result.length) {
    if (result[index - 1] == null || result[index] == null ||
      result[index - 1].x != result[index].x ||
      result[index - 1].y != result[index].y) {
      index++;
    } else {
      result.splice(index, 1);
    }
  }
}