import type { SvgBuilder } from '../svg/index.ts';

// Shared placeholder SVG used across render paths.
export const PLACEHOLDER_SVG = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="64px" height="64px"><path fill="#e8eef5" d="M21.24,4.94H50a3,3,0,0,1,3,3v48a3,3,0,0,1-3,3H12a3,3,0,0,1-3-3V17.18a3,3,0,0,1,.88-2.12l9.24-9.24A3,3,0,0,1,21.24,4.94Z"/><path fill="#f5e6c8" d="M21 5L21 17 9 17 21 5z"/><path fill="#ffd97a" d="M20 24A4 4 0 1 0 20 32A4 4 0 1 0 20 24Z"/><path fill="#7ecec2" d="M35.5,45,26,35.5a1.5,1.5,0,0,0-2.1,0L14,45.5Z"/><path fill="#5bb8a8" d="M38,31.5a1,1,0,0,0-1.4,0L22,46H49a1,1,0,0,0,.7-1.7Z"/><path fill="#6b7a8c" d="M51,4H21.66a5,5,0,0,0-3.54,1.46L9.46,14.12A5,5,0,0,0,8,17.66V57a3,3,0,0,0,3,3H51a3,3,0,0,0,3-3V7A3,3,0,0,0,51,4ZM19.54,6.88A3,3,0,0,1,20,6.5V15a1,1,0,0,1-1,1H10.5a3,3,0,0,1,.38-.46ZM52,57a1,1,0,0,1-1,1H11a1,1,0,0,1-1-1V18h9a3,3,0,0,0,3-3V6H51a1,1,0,0,1,1,1Z"/><path fill="#6b7a8c" d="M49 44H25.41L37 32.41l8.29 8.29a1 1 0 0 0 1.41-1.41L38.41 31a2 2 0 0 0-2.83 0L29 37.59 26.41 35a2 2 0 0 0-2.83 0l-9 9H13a1 1 0 0 0-1 1 1 1 0 0 0 1 1H49a1 1 0 1 0 0-2zM25 36.41L27.59 39l-5 5H17.41zM20 32a4 4 0 1 0-4-4A4 4 0 0 0 20 32zm0-6.25A2.25 2.25 0 1 1 17.75 28 2.25 2.25 0 0 1 20 25.75z"/></svg>';

export const PLACEHOLDER_SVG_DATA_URI = `data:image/svg+xml;utf8,${encodeURIComponent(PLACEHOLDER_SVG)}`;

export function createPlaceholderInlineSvg(
	builder: SvgBuilder | null,
	x: number,
	y: number,
	width: number,
	height: number
): Element | null {
	if (!builder) return null;
	try {
		const parser = new DOMParser();
		const parsed = parser.parseFromString(PLACEHOLDER_SVG, 'image/svg+xml');
		const svgEl = parsed.documentElement as Element;
		const imported = builder.doc.importNode(svgEl, true) as Element;
		imported.setAttribute('x', String(x));
		imported.setAttribute('y', String(y));
		imported.setAttribute('width', String(width));
		imported.setAttribute('height', String(height));
		imported.setAttribute('preserveAspectRatio', 'none');
		if (!imported.getAttribute('viewBox')) {
			imported.setAttribute('viewBox', `0 0 ${width} ${height}`);
		}
		return imported;
	} catch {
		return null;
	}
}