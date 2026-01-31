import type { RenderContext, ShapeAttrs } from '../../../renderer.ts';
import { RectangleShapeHandler } from '../../shape-registry.ts';

/**
 * Vertical Button Bar - displays a vertical stack of buttons with one selected
 * 
 * Style properties:
 * - mainText: comma-separated button labels, prefix with + for selected (default: "+Button 1, Button 2, Button 3")
 * - textColor: normal text color (default: #666666)
 * - textColor2: selected text color (default: #ffffff)
 * - textSize: font size (default: 17)
 * - strokeColor: border color (default: #666666)
 * - strokeColor2: divider line color (default: #c4c4c4)
 * - fillColor: background color (default: #ffffff)
 * - fillColor2: selected button background (default: #008cff)
 */
export class MockupButtonsVerButtonBarHandler extends RectangleShapeHandler {
  constructor(renderCtx: RenderContext) {
    super(renderCtx);
  }

  render(_attrs: ShapeAttrs): void {
    const { builder, currentGroup, x, y, width, height, style } = this.renderCtx;
    if (!builder || !currentGroup) return;
    if (width <= 0 || height <= 0) return;

    // Parse style values
    const mainText = this.getStyleValue(style, 'mainText', '+Button 1, Button 2, Button 3').toString();
    const buttons = mainText.split(',');
    const textColor = this.getStyleValue(style, 'textColor', '#666666');
    const textColor2 = this.getStyleValue(style, 'textColor2', '#ffffff');
    const textSize = this.getStyleNumber(style, 'textSize', 17);
    const strokeColor = this.getStyleValue(style, 'strokeColor', '#666666');
    const strokeColor2 = this.getStyleValue(style, 'strokeColor2', '#c4c4c4');
    const fillColor = this.getStyleValue(style, 'fillColor', '#ffffff');
    const fillColor2 = this.getStyleValue(style, 'fillColor2', '#008cff');

    const buttonCount = buttons.length;
    let selectedIndex = -1;
    let maxTextWidth = 0;

    // Find selected button and calculate max text width
    for (let i = 0; i < buttonCount; i++) {
      let label = buttons[i];
      if (label.charAt(0) === '+') {
        label = label.substring(1);
        selectedIndex = i;
      }
      const textWidth = this.measureTextSize(label, String(textSize), 'Arial,Helvetica,sans-serif', 0).width;
      if (textWidth > maxTextWidth) {
        maxTextWidth = textWidth;
      }
    }

    // Calculate dimensions
    const rowHeight = Math.max(1.5 * textSize, 15);
    const totalHeight = buttonCount * rowHeight;
    const actualHeight = Math.max(height, totalHeight);
    const actualWidth = Math.max(width, 10 + maxTextWidth);
    const cornerRadius = 10;

    builder.setCanvasRoot(currentGroup);
    builder.save();
    builder.translate(x, y);

    // Draw background with rounded corners
    this.drawBackground(
      builder, actualWidth, actualHeight, cornerRadius,
      buttonCount, rowHeight, totalHeight,
      strokeColor, strokeColor2, fillColor, fillColor2, selectedIndex
    );

    // Draw button text
    builder.setShadow(false);
    builder.setFontStyle(1); // Bold
    builder.setFontSize(textSize);

    for (let i = 0; i < buttonCount; i++) {
      if (i === selectedIndex) {
        builder.setFontColor(textColor2);
      } else {
        builder.setFontColor(textColor);
      }
      const buttonY = (i * rowHeight + 0.5 * rowHeight) * actualHeight / totalHeight;
      this.drawButtonText(builder, actualWidth, buttonY, buttons[i], textSize);
    }

    builder.restore();
  }

  private drawBackground(
    builder: NonNullable<RenderContext['builder']>,
    w: number,
    h: number,
    r: number,
    buttonCount: number,
    rowHeight: number,
    totalHeight: number,
    strokeColor: string,
    strokeColor2: string,
    fillColor: string,
    fillColor2: string,
    selectedIndex: number
  ): void {
    // Draw main background rounded rect
    builder.begin();
    builder.setStrokeColor(strokeColor);
    builder.setFillColor(fillColor);
    builder.moveTo(0, r);
    builder.arcTo(r, r, 0, 0, 1, r, 0);
    builder.lineTo(w - r, 0);
    builder.arcTo(r, r, 0, 0, 1, w, r);
    builder.lineTo(w, h - r);
    builder.arcTo(r, r, 0, 0, 1, w - r, h);
    builder.lineTo(r, h);
    builder.arcTo(r, r, 0, 0, 1, 0, h - r);
    builder.close();
    builder.fillAndStroke();

    // Draw divider lines (skip around selected button)
    builder.setStrokeColor(strokeColor2);
    builder.begin();
    for (let i = 1; i < buttonCount; i++) {
      // Skip lines adjacent to selected button
      if (i !== selectedIndex && i !== selectedIndex + 1) {
        const lineY = i * rowHeight * h / totalHeight;
        builder.moveTo(0, lineY);
        builder.lineTo(w, lineY);
      }
    }
    builder.stroke();

    // Draw selected button highlight
    if (selectedIndex >= 0) {
      builder.setFillColor(fillColor2);
      if (selectedIndex === 0) {
        // First button - rounded top corners
        builder.begin();
        const selHeight = rowHeight * h / totalHeight;
        builder.moveTo(0, r);
        builder.arcTo(r, r, 0, 0, 1, r, 0);
        builder.lineTo(w - r, 0);
        builder.arcTo(r, r, 0, 0, 1, w, r);
        builder.lineTo(w, selHeight);
        builder.lineTo(0, selHeight);
        builder.close();
        builder.fill();
      } else if (selectedIndex === buttonCount - 1) {
        // Last button - rounded bottom corners
        builder.begin();
        const selY = h - rowHeight * h / totalHeight;
        builder.moveTo(0, selY);
        builder.lineTo(w, selY);
        builder.lineTo(w, h - r);
        builder.arcTo(r, r, 0, 0, 1, w - r, h);
        builder.lineTo(r, h);
        builder.arcTo(r, r, 0, 0, 1, 0, h - r);
        builder.close();
        builder.fill();
      } else {
        // Middle button - no rounded corners
        builder.begin();
        const selY = selectedIndex * rowHeight * h / totalHeight;
        const selHeight = (selectedIndex + 1) * rowHeight * h / totalHeight;
        builder.moveTo(0, selY);
        builder.lineTo(w, selY);
        builder.lineTo(w, selHeight);
        builder.lineTo(0, selHeight);
        builder.close();
        builder.fill();
      }
    }

    // Redraw outer stroke
    builder.begin();
    builder.setStrokeColor(strokeColor);
    builder.setFillColor(fillColor);
    builder.moveTo(0, r);
    builder.arcTo(r, r, 0, 0, 1, r, 0);
    builder.lineTo(w - r, 0);
    builder.arcTo(r, r, 0, 0, 1, w, r);
    builder.lineTo(w, h - r);
    builder.arcTo(r, r, 0, 0, 1, w - r, h);
    builder.lineTo(r, h);
    builder.arcTo(r, r, 0, 0, 1, 0, h - r);
    builder.close();
    builder.stroke();
  }

  private drawButtonText(
    builder: NonNullable<RenderContext['builder']>,
    w: number,
    centerY: number,
    label: string,
    fontSize: number
  ): void {
    // Remove + prefix if present
    if (label.charAt(0) === '+') {
      label = label.substring(1);
    }
    builder.begin();
    builder.setFontSize(fontSize);
    builder.text(w * 0.5, centerY, 0, 0, label, 'center', 'middle');
  }

  private measureTextSize(
    text: any,
    fontSize: number | string,
    fontFamily: string,
    fontStyle?: number | string
  ): { width: number; height: number } {
    try {
      const provider = this.renderCtx?.getTextMeasureProvider?.();
      if (!provider || !provider.measureText) return { width: 0, height: 0 };
      const raw = text == null ? '' : String(text);
      const size = typeof fontSize === 'string' ? parseFloat(fontSize) : fontSize;
      let fontWeight = 'normal';
      let fontStyleNormalized = 'normal';
      const style = typeof fontStyle === 'string' ? parseInt(fontStyle, 10) : (fontStyle || 0);
      if ((style & 1) === 1) fontWeight = 'bold';
      if ((style & 2) === 2) fontStyleNormalized = 'italic';
      return provider.measureText(
        raw,
        size,
        fontFamily,
        fontWeight,
        fontStyleNormalized,
        false
      );
    } catch {
      return { width: 0, height: 0 };
    }
  }
}
