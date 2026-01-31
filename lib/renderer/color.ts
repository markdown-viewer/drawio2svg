/**
 * Color and gradient helpers for renderer
 */

export function normalizeColor(color: unknown): string {
  if (color === null || color === undefined) return '';
  if (typeof color !== 'string') {
    if (typeof color === 'number') return String(color);
    return '';
  }
  if (!color) return color;
  
  // Convert hex colors to rgb format
  if (color.match(/^#[0-9a-fA-F]{6}$/)) {
    const r = parseInt(color.slice(1, 3), 16);
    const g = parseInt(color.slice(3, 5), 16);
    const b = parseInt(color.slice(5, 7), 16);
    return `rgb(${r}, ${g}, ${b})`;
  }
  
  // Convert 3-digit hex to rgb format
  if (color.match(/^#[0-9a-fA-F]{3}$/)) {
    const r = parseInt(color.slice(1, 2) + color.slice(1, 2), 16);
    const g = parseInt(color.slice(2, 3) + color.slice(2, 3), 16);
    const b = parseInt(color.slice(3, 4) + color.slice(3, 4), 16);
    return `rgb(${r}, ${g}, ${b})`;
  }
  
  // Color is already in rgb format or other valid format
  return color;
}

export function normalizeColorId(color: unknown): string {
  if (color === null || color === undefined) return '';
  if (typeof color !== 'string') {
    if (typeof color === 'number') return String(color);
    return '';
  }
  if (!color) return '';
  const hexMatch = color.match(/^#([0-9a-fA-F]{6})$/);
  if (hexMatch) return hexMatch[1].toLowerCase();
  const shortHexMatch = color.match(/^#([0-9a-fA-F]{3})$/);
  if (shortHexMatch) {
    const h = shortHexMatch[1];
    return `${h[0]}${h[0]}${h[1]}${h[1]}${h[2]}${h[2]}`.toLowerCase();
  }
  const rgbMatch = color.match(/^rgb\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)$/i);
  if (rgbMatch) {
    const r = parseInt(rgbMatch[1], 10);
    const g = parseInt(rgbMatch[2], 10);
    const b = parseInt(rgbMatch[3], 10);
    return [r, g, b].map(v => v.toString(16).padStart(2, '0')).join('');
  }
  return color.replace(/^#/, '').toLowerCase();
}

export function getGradientDirectionKey(direction?: string): string {
  switch (direction) {
    case 'east':
      return 'e';
    case 'west':
      return 'w';
    case 'north':
      return 'n';
    case 'south':
      return 's';
    default:
      return 's';
  }
}

export function getGradientCoords(directionKey: string): { x1: string; y1: string; x2: string; y2: string } {
  switch (directionKey) {
    case 'e':
      return { x1: '0%', y1: '0%', x2: '100%', y2: '0%' };
    case 'w':
      return { x1: '100%', y1: '0%', x2: '0%', y2: '0%' };
    case 'n':
      return { x1: '0%', y1: '100%', x2: '0%', y2: '0%' };
    case 's':
    default:
      return { x1: '0%', y1: '0%', x2: '0%', y2: '100%' };
  }
}