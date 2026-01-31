import pako from 'pako';

export interface StencilBundle {
  get(groupOrPath: string, key?: string): string | null;
  getGroup(group: string): Record<string, string> | null;
  keys(group: string): string[];
  groups(): string[];
  isLoaded(group: string): boolean;
}

export interface StencilGroupSource {
  groups(): string[];
  load(group: string): string | null;
}

/**
 * Style properties for stencil color replacement
 */
export interface StencilColorStyle {
  fillColor?: string;
  strokeColor?: string;
  fontColor?: string;
  fillColor2?: string;
  fillColor3?: string;
  fillColor4?: string;
  fillColor5?: string;
  fillColor6?: string;
  fillColor7?: string;
  fillColor8?: string;
  strokeColor2?: string;
  strokeColor3?: string;
  strokeColor4?: string;
  strokeColor5?: string;
}

/**
 * Replace color placeholders in stencil SVG with actual colors from style
 * 
 * Supports placeholders:
 * - {{fillColor}}, {{strokeColor}}, {{fontColor}}
 * - {{fillColor2}} ~ {{fillColor8}}
 * - {{strokeColor2}} ~ {{strokeColor5}}
 * 
 * @param svg SVG string with placeholders
 * @param style Style object with color values
 * @returns SVG with colors applied
 */
export function applyStencilColors(svg: string, style: StencilColorStyle): string {
  const fill = style.fillColor || '#ffffff';
  const stroke = style.strokeColor || '#000000';
  const font = style.fontColor || '#000000';
  
  return svg
    .replace(/\{\{fillColor\}\}/gi, fill)
    .replace(/\{\{strokeColor\}\}/gi, stroke)
    .replace(/\{\{fontColor\}\}/gi, font)
    .replace(/\{\{fillColor([2-8])\}\}/gi, (_, n) => style[`fillColor${n}` as keyof StencilColorStyle] || fill)
    .replace(/\{\{strokeColor([2-5])\}\}/gi, (_, n) => style[`strokeColor${n}` as keyof StencilColorStyle] || stroke);
}

function decodeBase64(data: string): Uint8Array {
  if (typeof Buffer !== 'undefined') {
    return new Uint8Array(Buffer.from(data, 'base64'));
  }
  const binary = atob(data);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return bytes;
}

function inflateGroup(data: string): Record<string, string> {
  const bytes = decodeBase64(data);
  const inflated = pako.inflate(bytes);
  const text = new TextDecoder().decode(inflated);
  return JSON.parse(text) as Record<string, string>;
}

export function createStencilBundle(source: StencilGroupSource): StencilBundle {
  const cache: Record<string, Record<string, string>> = {};

  const decompressGroup = (group: string): Record<string, string> | null => {
    if (cache[group]) return cache[group];
    const data = source.load(group);
    if (!data) return null;
    cache[group] = inflateGroup(data);
    return cache[group];
  };

  return {
    get(groupOrPath: string, key?: string): string | null {
      if (key === undefined) {
        const idx = groupOrPath.indexOf('/');
        if (idx === -1) return null;
        const group = groupOrPath.substring(0, idx);
        key = groupOrPath.substring(idx + 1);
        const groupData = decompressGroup(group);
        return groupData ? groupData[key] || null : null;
      }
      const groupData = decompressGroup(groupOrPath);
      return groupData ? groupData[key] || null : null;
    },
    getGroup(group: string): Record<string, string> | null {
      return decompressGroup(group);
    },
    keys(group: string): string[] {
      const groupData = decompressGroup(group);
      return groupData ? Object.keys(groupData) : [];
    },
    groups(): string[] {
      return source.groups();
    },
    isLoaded(group: string): boolean {
      return !!cache[group];
    }
  };
}

export function createStencilBundleFromCompressedGroups(groups: Record<string, string>): StencilBundle {
  return createStencilBundle({
    groups: () => Object.keys(groups),
    load: (group) => groups[group] || null
  });
}
