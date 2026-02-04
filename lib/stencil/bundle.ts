/**
 * Stencil Bundle V2
 * 
 * Provides loading and access for V2 stencil JSON format.
 */

import pako from 'pako';
import type { StencilShape } from './xml.ts';

export interface StencilBundle {
  get(groupOrPath: string, key?: string): StencilShape | null;
  getGroup(group: string): Record<string, StencilShape> | null;
  keys(group: string): string[];
  groups(): string[];
  isLoaded(group: string): boolean;
  version: 2;
}

export interface StencilGroupSource {
  groups(): string[];
  load(group: string): string | null;
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

function inflateGroup(data: string): Record<string, StencilShape> {
  const bytes = decodeBase64(data);
  const inflated = pako.inflate(bytes);
  const text = new TextDecoder().decode(inflated);
  return JSON.parse(text) as Record<string, StencilShape>;
}

export function createStencilBundle(source: StencilGroupSource): StencilBundle {
  const cache: Record<string, Record<string, StencilShape>> = {};

  const decompressGroup = (group: string): Record<string, StencilShape> | null => {
    if (cache[group]) return cache[group];
    const data = source.load(group);
    if (!data) return null;
    cache[group] = inflateGroup(data);
    return cache[group];
  };

  return {
    version: 2,
    get(groupOrPath: string, key?: string): StencilShape | null {
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
    getGroup(group: string): Record<string, StencilShape> | null {
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
