import type { TextMeasureProvider, TextLayoutResult } from './measure.ts';
import { measureText, measureTextLayout } from './webview-measure.ts';
import { DEFAULT_FONT_FAMILY } from './constants.ts';
import gui from 'gui';
import coroutine from 'coroutine';

export interface WebViewTextMeasureProvider extends TextMeasureProvider {
  dispose(): void;
}

export function createWebViewProvider(): WebViewTextMeasureProvider {
  const win = gui.open({
    width: 800,
    height: 600,
    visible: false
  });

  win.unref();

  const measureTextSource = measureText.toString();
  const measureTextLayoutSource = measureTextLayout.toString();

  // Initialize DOM-based measurement environment
  win.setHtml(`
    <!DOCTYPE html>
    <html>
    <body>
      <div id="measure" style="position:absolute;visibility:hidden;"></div>
      <script>
        const measureDiv = document.getElementById('measure');
        const measureText = ${measureTextSource};
        const measureTextLayout = ${measureTextLayoutSource};
        window.measureText = function(text, fontSize, fontFamily, fontWeight, fontStyle, isHtml) {
          return measureText(measureDiv, text, fontSize, fontFamily, fontWeight, fontStyle, isHtml);
        };
        window.measureTextLayout = function(text, fontSize, fontFamily, fontWeight, fontStyle, containerWidth, isHtml) {
          return measureTextLayout(measureDiv, text, fontSize, fontFamily, fontWeight, fontStyle, containerWidth, isHtml);
        };
        window.ready = true;
      </script>
    </body>
    </html>
  `);

  // Wait for page ready (with timeout to avoid hanging)
  const maxWaitMs = 5000;
  const start = Date.now();
  while (true) {
    let ready = false;
    try {
      ready = Boolean(win.eval('window.ready'));
    } catch (error) {
      ready = false;
    }
    if (ready) break;
    if (Date.now() - start > maxWaitMs) {
      throw new Error('WebView provider init timeout: window.ready not set');
    }
    coroutine.sleep(1);
  }

  return {
    measureText(text, fontSize, fontFamily, fontWeight, fontStyle, isHtml) {
      const escapedText = JSON.stringify(text);
      const defaultFontFamily = DEFAULT_FONT_FAMILY;
      const result = win.eval(
        `window.measureText(${escapedText}, ${fontSize}, '${fontFamily || defaultFontFamily}', '${fontWeight || 'normal'}', '${fontStyle || 'normal'}', ${isHtml ? 'true' : 'false'})`
      );
      return result;
    },
    measureTextLayout(text, fontSize, fontFamily, fontWeight, fontStyle, containerWidth, isHtml): TextLayoutResult {
      const escapedText = JSON.stringify(text);
      const containerWidthArg = containerWidth !== undefined ? containerWidth : 'undefined';
      const defaultFontFamily = DEFAULT_FONT_FAMILY;
      const result = win.eval(
        `window.measureTextLayout(${escapedText}, ${fontSize}, '${fontFamily || defaultFontFamily}', '${fontWeight || 'normal'}', '${fontStyle || 'normal'}', ${containerWidthArg}, ${isHtml ? 'true' : 'false'})`
      );
      return result;
    },
    dispose() {
      win.close();
    }
  };
}
