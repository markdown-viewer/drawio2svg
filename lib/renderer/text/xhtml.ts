/**
 * Decode encoded HTML tags from the platform values.
 * Only decodes a safe subset to avoid breaking stereotype text like <<requirement>>.
 */
function decodeEncodedHtmlTags(html: string): string {
  if (!html || !html.includes('&lt;')) return html;

  const allowedTags = new Set([
    'br', 'div', 'span', 'p', 'b', 'i', 'u', 's', 'strike', 'strong', 'em',
    'sub', 'sup', 'font', 'small', 'big', 'code', 'pre',
    'table', 'tbody', 'thead', 'tfoot', 'tr', 'td', 'th',
    'ul', 'ol', 'li', 'img', 'a'
  ]);

  return html.replace(/&lt;(\/?)([a-zA-Z][\w:-]*)([\s\S]*?)&gt;/g, (match, slash, tag, rest) => {
    const tagName = String(tag).toLowerCase();
    if (!allowedTags.has(tagName)) return match;
    return `<${slash}${tag}${rest}>`;
  });
}

/**
 * Convert HTML to XHTML format for embedding in SVG foreignObject
 * Uses DOMParser to parse HTML and XMLSerializer to serialize as XHTML
 */
export function convertToXhtml(html: string, domParser: DOMParser): string {
  // Normalize raw stereotypes like <<use>> which HTML parsers treat as tags
  // This matches the platform's HTML parsing behavior for legacy files
  const htmlTagNames = new Set([
    'br', 'div', 'span', 'p', 'b', 'i', 'u', 's', 'strike', 'strong', 'em',
    'sub', 'sup', 'font', 'small', 'big', 'code', 'pre',
    'table', 'tbody', 'thead', 'tfoot', 'tr', 'td', 'th',
    'ul', 'ol', 'li', 'img', 'a',
    'use'
  ]);

  const normalizedRawHtml = html.replace(/<<\s*\/?\s*([a-zA-Z][\w:-]*)[^<>]*>>/g, (_match, tagName) => {
    const normalizedTag = String(tagName).toLowerCase();
    return htmlTagNames.has(normalizedTag) ? '<' : '<>';
  });

  const decodedHtml = decodeEncodedHtmlTags(normalizedRawHtml)
    .replace(/&amp;nbsp;|&nbsp;/g, '\u00a0')
    .replace(/&#x0?A;|&#10;|&#x0?D;|&#13;/gi, '\n');
  const hasTags = /<[^>]+>/.test(decodedHtml);
  let normalized = decodedHtml;
  if (!hasTags) {
    const parts = decodedHtml.split(/\r\n|\r|\n/);
    let trailingCount = 0;
    while (parts.length > 0 && parts[parts.length - 1] === '') {
      parts.pop();
      trailingCount++;
    }
    normalized = parts.join('<br>');
    if (trailingCount > 0) {
      normalized += '<div><br /></div>'.repeat(trailingCount);
    }
  }

  // Parse as HTML (match the platform's convertHtml behavior)
  const doc = domParser.parseFromString(normalized, 'text/html');
  const body = doc.getElementsByTagName('body')[0];
  if (!body) return html;

  // Serialize as XML (converts <br> to <br />)
  const serializer = new XMLSerializer();
  let xhtml = serializer.serializeToString(body);

  // Extract body content
  if (xhtml.startsWith('<body')) {
    const end = xhtml.indexOf('>');
    if (end !== -1) xhtml = xhtml.slice(end + 1);
  }
  if (xhtml.endsWith('</body>')) {
    xhtml = xhtml.slice(0, -7);
  }

  return xhtml;
}

/**
 * Set XHTML content on an element in an XML document (like SVG).
 * Cannot use innerHTML on XML documents, so we parse the content and import nodes.
 */
export function setXhtmlContent(element: Element, xhtmlContent: string, domParser: DOMParser): void {
  // Wrap in XHTML namespace for proper parsing
  const wrappedXhtml = `<div xmlns="http://www.w3.org/1999/xhtml">${xhtmlContent}</div>`;
  
  try {
    const doc = domParser.parseFromString(wrappedXhtml, 'application/xhtml+xml');
    const parsedDiv = doc.documentElement;
    
    // Check for parse errors
    const parseError = doc.getElementsByTagName('parsererror');
    if (parseError.length > 0) {
      // Fallback: use text content only
      element.textContent = xhtmlContent.replace(/<[^>]+>/g, '');
      return;
    }
    
    // Import and append all child nodes
    const ownerDoc = element.ownerDocument;
    const children = Array.from(parsedDiv.childNodes);
    for (const child of children) {
      const imported = ownerDoc.importNode(child, true);
      element.appendChild(imported);
    }
  } catch {
    // Fallback: use text content only
    element.textContent = xhtmlContent.replace(/<[^>]+>/g, '');
  }
}