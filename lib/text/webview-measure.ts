export interface TextLayoutResult {
  width: number;
  height: number;
  lineCount: number;
  lineHeight: number;
}

import { DEFAULT_FONT_FAMILY } from './constants.ts';

export function measureText(
  measureDiv: HTMLElement,
  text: string,
  fontSize: number,
  fontFamily?: string,
  fontWeight?: string,
  fontStyle?: string,
  isHtml?: boolean
): { width: number; height: number } {
  try {
    const safeFontFamily = fontFamily || DEFAULT_FONT_FAMILY;
    const safeFontWeight = fontWeight || 'normal';
    const safeFontStyle = fontStyle || 'normal';

    measureDiv.style.fontSize = fontSize + 'px';
    measureDiv.style.fontFamily = safeFontFamily;
    measureDiv.style.fontWeight = safeFontWeight;
    measureDiv.style.fontStyle = safeFontStyle;
    measureDiv.style.lineHeight = '1.2';

    const decodeEntities = (value: string) => {
      const textarea = document.createElement('textarea');
      textarea.innerHTML = value;
      return textarea.value;
    };

    const isHtmlValue = Boolean(isHtml);
    const hasHtmlTags = isHtmlValue && /<\/?[a-z][\s\S]*?>/i.test(text);

    measureDiv.innerHTML = '<div id="measure-wrapper" style="display:inline-block;"></div>';
    const wrapper = measureDiv.querySelector('#measure-wrapper') as HTMLElement | null;
    if (!wrapper) {
      return { width: 0, height: fontSize * 1.2 };
    }

    if (hasHtmlTags) {
      wrapper.innerHTML = text;
    } else if (isHtmlValue) {
      const decodedText = decodeEntities(text);
      wrapper.textContent = decodedText;
    } else {
      // For plain text, convert line breaks to HTML <br> for accurate measurement
      const htmlEncodedText = text
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/\r\n|\r|\n/g, '<br>');
      wrapper.innerHTML = htmlEncodedText;
    }

    // Always reset margins and padding for accurate measurement
    wrapper.style.margin = '0';
    wrapper.style.padding = '0';
    const elements = wrapper.querySelectorAll('*');
    elements.forEach((el) => {
      const htmlEl = el as HTMLElement;
      htmlEl.style.margin = '0';
      htmlEl.style.padding = '0';
    });

    const hasBlocks = hasHtmlTags && Boolean(wrapper.querySelector('div, p, li, ul, ol'));
    const contentText = wrapper.textContent || '';
    const hasLineBreaks = /<br\s*\/?>/i.test(text) || /\r|\n/.test(contentText);
    if (hasBlocks) {
      wrapper.style.whiteSpace = 'normal';
    } else if (hasLineBreaks) {
      wrapper.style.whiteSpace = 'pre-wrap';
    } else {
      wrapper.style.whiteSpace = 'nowrap';
    }

    const rect = wrapper.getBoundingClientRect();
    return { width: rect.width, height: rect.height || fontSize * 1.2 };
  } catch (error) {
    return { width: 0, height: fontSize * 1.2 };
  }
}

export function measureTextLayout(
  measureDiv: HTMLElement,
  text: string,
  fontSize: number,
  fontFamily?: string,
  fontWeight?: string,
  fontStyle?: string,
  containerWidth?: number,
  isHtml?: boolean
): TextLayoutResult {
  try {
    const safeFontFamily = fontFamily || DEFAULT_FONT_FAMILY;
    const safeFontWeight = fontWeight || 'normal';
    const safeFontStyle = fontStyle || 'normal';

    measureDiv.style.fontSize = fontSize + 'px';
    measureDiv.style.fontFamily = safeFontFamily;
    measureDiv.style.fontWeight = safeFontWeight;
    measureDiv.style.fontStyle = safeFontStyle;
    measureDiv.style.lineHeight = '1.2';

    const decodeEntities = (value: string) => {
      const textarea = document.createElement('textarea');
      textarea.innerHTML = value;
      return textarea.value;
    };

    const isHtmlValue = Boolean(isHtml);
    const hasHtmlTags = isHtmlValue && /<\/?[a-z][\s\S]*?>/i.test(text);

    measureDiv.innerHTML = '<div id="measure-wrapper" style="display:inline-block;"></div>';
    const wrapper = measureDiv.querySelector('#measure-wrapper') as HTMLElement | null;
    if (!wrapper) {
      const defaultLineHeight = Math.round(fontSize * 1.2);
      return { width: 0, height: defaultLineHeight, lineCount: 1, lineHeight: defaultLineHeight };
    }

    const hasHtmlLineBreak = isHtmlValue && /<br\s*\/?>/i.test(text);
    const hasTextLineBreak = /\r|\n/.test(text);
    const hasLineBreaks = hasHtmlLineBreak || hasTextLineBreak;
    const hasBlockTags = isHtmlValue && /<(div|p|li|ul|ol|table|tr|td|th)\b/i.test(text);

    // Set container width for wrapping calculation
    // Use double container: outer for measuring actual size, inner for triggering wrap
    if (containerWidth !== undefined && containerWidth > 0) {
      // Outer wrapper: overflow visible, position relative to contain the inner
      wrapper.style.width = 'auto';
      wrapper.style.display = 'inline-block';
      wrapper.style.overflow = 'visible';
      wrapper.style.position = 'relative';
      
      // Inner container: fixed width triggers wrapping, but content can overflow
      const innerWrapper = document.createElement('div');
      innerWrapper.style.width = containerWidth + 'px';
      innerWrapper.style.whiteSpace = 'normal';
      innerWrapper.style.wordWrap = 'normal';
      (innerWrapper.style as CSSStyleDeclaration).overflowWrap = 'normal';
      innerWrapper.style.overflow = 'visible';
      wrapper.appendChild(innerWrapper);
      
      if (hasHtmlTags) {
        innerWrapper.innerHTML = text;
      } else if (isHtmlValue) {
        const decodedText = decodeEntities(text);
        innerWrapper.textContent = decodedText;
      } else {
        const htmlEncodedText = text
          .replace(/&/g, '&amp;')
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;')
          .replace(/\r\n|\r|\n/g, '<br>');
        innerWrapper.innerHTML = htmlEncodedText;
      }
      
      // Reset margins and padding
      innerWrapper.style.margin = '0';
      innerWrapper.style.padding = '0';
      const elements = innerWrapper.querySelectorAll('*');
      elements.forEach((el) => {
        const htmlEl = el as HTMLElement;
        htmlEl.style.margin = '0';
        htmlEl.style.padding = '0';
      });
      
      // Get computed line height
      const computedStyle = window.getComputedStyle(innerWrapper);
      const computedLineHeight = parseFloat(computedStyle.lineHeight);
      const rawLineHeight = Number.isFinite(computedLineHeight) ? computedLineHeight : Math.round(fontSize * 1.2);
      const lineHeight = Math.max(1, Math.round(rawLineHeight));

      // Use scrollWidth to get actual content width (includes overflow)
      const actualWidth = Math.max(innerWrapper.scrollWidth, innerWrapper.getBoundingClientRect().width);
      const rect = innerWrapper.getBoundingClientRect();
      const rawHeight = rect.height || lineHeight;
      const lineCount = Math.max(1, Math.round(rawHeight / lineHeight));
      const height = Math.max(lineHeight, Math.round(rawHeight));

      return {
        width: actualWidth,
        height,
        lineCount,
        lineHeight
      };
    } else if (hasBlockTags) {
      wrapper.style.width = 'auto';
      wrapper.style.whiteSpace = 'normal';
    } else if (hasLineBreaks) {
      wrapper.style.width = 'auto';
      wrapper.style.whiteSpace = 'pre-wrap';
    } else {
      wrapper.style.width = 'auto';
      wrapper.style.whiteSpace = 'nowrap';
    }

    if (hasHtmlTags) {
      wrapper.innerHTML = text;
    } else if (isHtmlValue) {
      const decodedText = decodeEntities(text);
      wrapper.textContent = decodedText;
    } else {
      // For plain text, convert line breaks to HTML <br> for accurate measurement
      // This ensures consistent rendering measurement with how drawio calculates text bounds
      const htmlEncodedText = text
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/\r\n|\r|\n/g, '<br>');
      wrapper.innerHTML = htmlEncodedText;
    }

    // Always reset margins and padding for accurate measurement
    wrapper.style.margin = '0';
    wrapper.style.padding = '0';
    const elements = wrapper.querySelectorAll('*');
    elements.forEach((el) => {
      const htmlEl = el as HTMLElement;
      htmlEl.style.margin = '0';
      htmlEl.style.padding = '0';
    });

    // Get computed line height
    const computedStyle = window.getComputedStyle(wrapper);
    const computedLineHeight = parseFloat(computedStyle.lineHeight);
    const rawLineHeight = Number.isFinite(computedLineHeight) ? computedLineHeight : Math.round(fontSize * 1.2);
    const lineHeight = Math.max(1, Math.round(rawLineHeight));

    const rect = wrapper.getBoundingClientRect();
    const rawHeight = rect.height || lineHeight;
    const lineCount = Math.max(1, Math.round(rawHeight / lineHeight));
    const height = Math.max(lineHeight, Math.round(rawHeight));

    return {
      width: rect.width,
      height,
      lineCount,
      lineHeight
    };
  } catch (error) {
    const defaultLineHeight = Math.round(fontSize * 1.2);
    return { width: 0, height: defaultLineHeight, lineCount: 1, lineHeight: defaultLineHeight };
  }
}
