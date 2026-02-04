import type { RenderContext, ShapeAttrs } from '../../../renderer.ts';
import { RectangleShapeHandler } from '../../shape-registry.ts';
import { normalizeColor } from '../../color.ts';

export class Ios7ContactsBarHandler extends RectangleShapeHandler {
  constructor(renderCtx: RenderContext) {
    super(renderCtx);
  }

  render(attrs: ShapeAttrs): void {
    const { builder, currentGroup, x, y, width, height } = this.renderCtx;
    if (!builder || !currentGroup) return;

    if (width <= 0 || height <= 0) return;

    const format = (value: number): number => Number(value.toFixed(2));
    // Use fillColor from style, defaulting to white (#ffffff) like draw.io
    const rawFillColor = attrs.fillColor || '#ffffff';
    const fillColor = rawFillColor === 'none' ? 'none' : normalizeColor(rawFillColor);
    const strokeColor = attrs.strokeColor === 'none' ? 'none' : attrs.strokeColor;

    const background = builder.createRect(format(x), format(y), format(width), format(height), {
      fill: fillColor,
      stroke: 'none',
      'pointer-events': 'all'
    });
    currentGroup.appendChild(background);

    const baseX = 497;
    const baseY = 314;
    const baseW = 175;
    const baseH = 28;
    const scaleX = width / baseW;
    const scaleY = height / baseH;
    let coordIndex = 0;

    const basePath = [
      'M 520.13 318.97 L 508.06 328.31 L 520.13 337.64',
      'M 544.27 318.97 L 556.67 328.31 L 544.27 337.64',
      'M 586.11 322.21 L 592.21 322.21 L 592.21 337.33 L 575.12 337.33 L 575.12 322.21 L 581.22 322.21',
      'M 578.78 321.73 L 583.67 318.97 L 588.54 321.73',
      'M 583.67 318.97 L 583.67 331.94',
      'M 608.47 336.4 C 608.05 336.06 607.66 335.7 607.3 335.31 L 607.3 320.07 C 607.65 319.67 608.04 319.3 608.47 318.97 L 617.86 318.97 C 618.32 319.27 618.72 319.64 619.03 320.07 C 619.33 319.63 619.73 319.26 620.2 318.97 L 629.59 318.97 C 630.24 318.97 630.76 319.46 630.76 320.07 L 630.76 335.31 C 630.42 335.71 630.02 336.08 629.59 336.4 Z',
      'M 619.03 320.07 L 619.03 337.49',
      'M 642.5 318.97 L 663.92 318.97 L 663.92 321.19 L 666.3 321.19 L 666.3 335.54 L 644.88 335.54 L 644.88 333.34 L 642.5 333.34 Z',
      'M 644.88 333.34 L 644.88 321.19 L 663.92 321.19'
    ].join(' ');

    const numberPattern = /-?\d*\.?\d+(?:e[-+]?\d+)?/gi;
    const transformedPath = basePath.replace(numberPattern, (match) => {
      const num = parseFloat(match);
      const isX = coordIndex % 2 === 0;
      coordIndex += 1;
      const scaled = isX
        ? x + (num - baseX) * scaleX
        : y + (num - baseY) * scaleY;
      return format(scaled).toString();
    });

    const strokeWidth = format(width * (1.87 / 175));
    const tokens = transformedPath.match(/[MLCZ]|-?\d*\.?\d+(?:e[-+]?\d+)?/gi);
    if (tokens) {
      builder.setCanvasRoot(currentGroup);
      builder.save();
      builder.setFillColor(null);
      builder.setStrokeColor(strokeColor);
      builder.setStrokeWidth(strokeWidth);
      builder.setMiterLimit(10);
      builder.begin();

      let index = 0;
      while (index < tokens.length) {
        const command = tokens[index++].toUpperCase();
        if (command === 'M') {
          const x1 = parseFloat(tokens[index++]);
          const y1 = parseFloat(tokens[index++]);
          builder.moveTo(x1, y1);
        } else if (command === 'L') {
          const x1 = parseFloat(tokens[index++]);
          const y1 = parseFloat(tokens[index++]);
          builder.lineTo(x1, y1);
        } else if (command === 'C') {
          const x1 = parseFloat(tokens[index++]);
          const y1 = parseFloat(tokens[index++]);
          const x2 = parseFloat(tokens[index++]);
          const y2 = parseFloat(tokens[index++]);
          const x3 = parseFloat(tokens[index++]);
          const y3 = parseFloat(tokens[index++]);
          builder.curveTo(x1, y1, x2, y2, x3, y3);
        } else if (command === 'Z') {
          builder.close();
        }
      }

      builder.stroke();
      builder.restore();

      const iconPath = currentGroup.lastChild as Element | null;
      if (iconPath) {
        iconPath.setAttribute('pointer-events', 'all');
      }
    }
  }
}
