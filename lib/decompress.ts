/**
 * Diagram Decompression Utilities
 * 
 * Diagram files can store content in compressed format:
 * base64 → inflate (raw deflate) → URL decode
 */

import pako from 'pako';

/**
 * Decode compressed diagram content
 * @param compressed - Base64 encoded, deflated, URL encoded content
 * @returns Decompressed XML string, or null if decompression fails
 */
function decompressContent(compressed: string): string | null {
    try {
        // Base64 decode
        const buffer = Buffer.from(compressed, 'base64');

        // Inflate (raw deflate, no header)
        const inflated = pako.inflateRaw(buffer, { to: 'string' });

        // URL decode
        return decodeURIComponent(inflated);
    } catch (e) {
        return null;
    }
}

/**
 * Decompress an XML file content
 * 
 * Finds all <diagram> tags with compressed content and decompresses them.
 * Compressed content is detected by checking if it doesn't start with '<'.
 * 
 * @param xml - Full XML content (may contain compressed diagrams)
 * @returns Decompressed XML content with all diagrams in plain XML format
 */
export function decompress(xml: string): string {
    // Match all <diagram ...>...</diagram> tags
    const diagramRegex = /<diagram([^>]*)>([\s\S]*?)<\/diagram>/g;

    return xml.replace(diagramRegex, (match, attrs, innerContent) => {
        const trimmed = innerContent.trim();

        // Check if content is compressed (not starting with '<')
        if (trimmed && !trimmed.startsWith('<')) {
            const decompressed = decompressContent(trimmed);
            if (decompressed) {
                return `<diagram${attrs}>${decompressed}</diagram>`;
            }
        }
        return match;
    });
}
