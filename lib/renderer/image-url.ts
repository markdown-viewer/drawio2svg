/**
 * Normalize the platform image URLs (data URLs and clip art references).
 */
export function normalizeImageUrl(imageUrl: string): string {
  if (isPlaceholderImageUrl(imageUrl)) {
    return imageUrl;
  }

  const dataMatch = imageUrl.match(/^data:([^,]*?),(.*)$/s);
  if (!dataMatch) {
    return imageUrl;
  }

  const meta = dataMatch[1] || '';
  const payload = dataMatch[2] ?? '';
  if (/;base64/i.test(meta)) {
    return imageUrl;
  }

  const trimmedPayload = payload.replace(/\s+/g, '');
  const looksBase64 = !trimmedPayload.includes('%') &&
    /^[A-Za-z0-9+/=]+$/.test(trimmedPayload) &&
    trimmedPayload.length % 4 !== 1;

  if (looksBase64) {
    const metaWithBase64 = meta ? `${meta};base64` : 'base64';
    const padding = trimmedPayload.length % 4;
    const paddedPayload = padding === 0 ? trimmedPayload : trimmedPayload.padEnd(trimmedPayload.length + (4 - padding), '=');
    return `data:${metaWithBase64},${paddedPayload}`;
  }

  let decoded = payload;
  if (payload.includes('%')) {
    try {
      decoded = decodeURIComponent(payload);
    } catch {
      decoded = payload;
    }
  }

  const base64 = encodeBase64(decoded);
  const metaWithBase64 = meta ? `${meta};base64` : 'base64';
  return `data:${metaWithBase64},${base64}`;
}

export function encodeBase64(value: string): string {
  if (typeof Buffer !== 'undefined') {
    return Buffer.from(value, 'utf8').toString('base64');
  }
  if (typeof btoa !== 'undefined') {
    return btoa(unescape(encodeURIComponent(value)));
  }
  return value;
}

export function isPlaceholderImageUrl(imageUrl: string): boolean {
  if (!imageUrl) return false;
  if (/^(data:|https?:\/\/|file:\/\/|\/\/)/i.test(imageUrl)) {
    return false;
  }
  return /^(about:\/\/img\/clipart\/|img\/clipart\/|img\/lib\/clip_art\/)/i.test(imageUrl);
}
