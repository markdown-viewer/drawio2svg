import {
  DIRECTION_MASK_ALL,
  DIRECTION_MASK_EAST,
  DIRECTION_MASK_NORTH,
  DIRECTION_MASK_SOUTH,
  DIRECTION_MASK_WEST
} from './constants.ts';

export function reversePortConstraints(constraint: number): number {
  let result = 0;
  result = (constraint & DIRECTION_MASK_WEST) << 3;
  result |= (constraint & DIRECTION_MASK_NORTH) << 1;
  result |= (constraint & DIRECTION_MASK_SOUTH) >> 1;
  result |= (constraint & DIRECTION_MASK_EAST) >> 3;
  return result;
}

export function parsePortConstraint(value?: string): number {
  if (!value) return DIRECTION_MASK_ALL;
  const v = value.toLowerCase();
  let mask = 0;
  if (v.includes('west')) mask |= DIRECTION_MASK_WEST;
  if (v.includes('north')) mask |= DIRECTION_MASK_NORTH;
  if (v.includes('south')) mask |= DIRECTION_MASK_SOUTH;
  if (v.includes('east')) mask |= DIRECTION_MASK_EAST;
  return mask === 0 ? DIRECTION_MASK_ALL : mask;
}