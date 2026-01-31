import type { RenderContext, ShapeAttrs } from '../../../renderer.ts';
import { RectangleShapeHandler } from '../../shape-registry.ts';
import { NoteHandler } from '../misc/note.ts';

export class BpmnDataHandler extends RectangleShapeHandler {
  constructor(renderCtx: RenderContext) {
    super(renderCtx);
  }

  render(attrs: ShapeAttrs): void {
    const { builder, currentGroup, x, y, width, height, style } = this.renderCtx;
    if (!builder || !currentGroup) return;
    if (width <= 0 || height <= 0) return;

    new NoteHandler(this.renderCtx).render(attrs);

    const transferType = this.getStyleValue(style, 'bpmnTransferType', 'none');
    const isCollection = this.getStyleValue(style, 'isCollection', false);
    const fillColor = attrs.fillColor === 'none' ? '#ffffff' : attrs.fillColor;
    const strokeColor = attrs.strokeColor === 'none' ? '#000000' : attrs.strokeColor;

    builder.setCanvasRoot(currentGroup);
    builder.save();
    builder.setShadow(false);
    builder.setStrokeColor(strokeColor as string);
    builder.setFillColor(fillColor as string);

    if (transferType === 'input' || transferType === 'output') {
      const arrX = 3;
      const arrY = 3;
      const arrW = 14;
      const arrH = 12;
      builder.translate(arrX + x, arrY + y);
      builder.begin();
      builder.moveTo(0, arrH * 0.3);
      builder.lineTo(arrW * 0.55, arrH * 0.3);
      builder.lineTo(arrW * 0.55, 0);
      builder.lineTo(arrW, arrH * 0.5);
      builder.lineTo(arrW * 0.55, arrH);
      builder.lineTo(arrW * 0.55, arrH * 0.7);
      builder.lineTo(0, arrH * 0.7);
      builder.close();
      builder.translate(-(arrX + x), -(arrY + y));

      if (transferType === 'input') {
        builder.stroke();
      } else {
        builder.setFillColor(strokeColor as string);
        builder.fillAndStroke();
        builder.setFillColor(fillColor as string);
      }
    }

    if (isCollection) {
      builder.translate(x + width * 0.5 - 6, y + height - 12);
      builder.begin();
      builder.moveTo(2.4, 0);
      builder.lineTo(2.4, 12);
      builder.moveTo(6, 0);
      builder.lineTo(6, 12);
      builder.moveTo(9.6, 0);
      builder.lineTo(9.6, 12);
      builder.stroke();
      builder.translate(-(x + width * 0.5 - 6), -(y + height - 12));
    }

    builder.restore();
  }
}

export class BpmnData2Handler extends RectangleShapeHandler {
  constructor(renderCtx: RenderContext) {
    super(renderCtx);
  }

  render(attrs: ShapeAttrs): void {
    const { builder, currentGroup, x, y, width, height, style } = this.renderCtx;
    if (!builder || !currentGroup) return;
    if (width <= 0 || height <= 0) return;

    new NoteHandler(this.renderCtx).render(attrs);

    const transferType = this.getStyleValue(style, 'bpmnTransferType', 'none');
    const isCollection = this.getStyleValue(style, 'isCollection', false);
    const strokeWidth = this.getStyleNumber(style, 'strokeWidth', 1);
    const fillColor = attrs.fillColor === 'none' ? '#ffffff' : attrs.fillColor;
    const strokeColor = attrs.strokeColor === 'none' ? '#000000' : attrs.strokeColor;

    builder.setCanvasRoot(currentGroup);
    builder.save();
    builder.setShadow(false);
    builder.setStrokeWidth(1);
    builder.setStrokeColor(strokeColor as string);
    builder.setFillColor(fillColor as string);

    if (transferType === 'input' || transferType === 'output') {
      const arrX = 3 + strokeWidth * 0.5;
      const arrY = 3 + strokeWidth * 0.5;
      const arrW = 14;
      const arrH = 12;
      builder.translate(arrX + x, arrY + y);
      builder.begin();
      builder.moveTo(0, arrH * 0.3);
      builder.lineTo(arrW * 0.55, arrH * 0.3);
      builder.lineTo(arrW * 0.55, 0);
      builder.lineTo(arrW, arrH * 0.5);
      builder.lineTo(arrW * 0.55, arrH);
      builder.lineTo(arrW * 0.55, arrH * 0.7);
      builder.lineTo(0, arrH * 0.7);
      builder.close();
      builder.translate(-(arrX + x), -(arrY + y));

      if (transferType === 'input') {
        builder.stroke();
      } else {
        builder.setFillColor(strokeColor as string);
        builder.fillAndStroke();
        builder.setFillColor(fillColor as string);
      }
    }

    if (isCollection) {
      builder.translate(x + width * 0.5 - 6, y + height - 12 - strokeWidth * 0.5);
      builder.begin();
      builder.moveTo(2.4, 0);
      builder.lineTo(2.4, 12);
      builder.moveTo(6, 0);
      builder.lineTo(6, 12);
      builder.moveTo(9.6, 0);
      builder.lineTo(9.6, 12);
      builder.stroke();
      builder.translate(-(x + width * 0.5 - 6), -(y + height - 12 - strokeWidth * 0.5));
    }

    builder.restore();
  }
}