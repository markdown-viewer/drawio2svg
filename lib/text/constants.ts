export let DEFAULT_FONT_FAMILY = 'Arial, Helvetica, sans-serif';

export function setDefaultFontFamily(fontFamily: string): void {
	if (!fontFamily || !fontFamily.trim()) {
		return;
	}
	DEFAULT_FONT_FAMILY = fontFamily;
}
