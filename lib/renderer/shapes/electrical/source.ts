// @ts-nocheck
import type { RenderContext, ShapeAttrs } from '../../../renderer.ts';
import { BaseShapeHandler } from '../../shape-registry.ts';

export class ElectricalSignalSourcesSourceHandler extends BaseShapeHandler {
  constructor(renderCtx: RenderContext) {
    super(renderCtx);
  }

  render(attrs: ShapeAttrs): void {
    const { builder, currentGroup, applyShapeAttrsToBuilder, x, y, width, height, style } =
      this.renderCtx;
    if (!builder || !currentGroup) return;
    if (width <= 0 || height <= 0) return;

    builder.setCanvasRoot(currentGroup);
    builder.save();
    applyShapeAttrsToBuilder(builder, attrs);
    let d = x;
    let e = y;

    let f;
    builder.translate(d, e);
    d = this.getStyleValue(style, 'elSourceType', 'independent');
    e = this.getStyleValue(style, 'elSignalType', 'none');
    switch (d) {
      case 'independent':
        builder.ellipse(0, 0, width, height);
        builder.fillAndStroke();
        break;
      case 'dependent':
        (builder.begin(),
          builder.moveTo(0, 0.5 * height),
          builder.lineTo(0.5 * width, 0),
          builder.lineTo(width, 0.5 * height),
          builder.lineTo(0.5 * width, height),
          builder.lineTo(0, 0.5 * height),
          builder.close(),
          builder.fillAndStroke());
    }
    switch (e) {
      case 'ac':
        builder.begin();
        builder.moveTo(0.3 * width, 0.5 * height);
        builder.quadTo(0.34 * width, 0.35 * height, 0.4 * width, 0.35 * height);
        builder.quadTo(0.46 * width, 0.35 * height, 0.5 * width, 0.5 * height);
        builder.quadTo(0.53 * width, 0.65 * height, 0.6 * width, 0.65 * height);
        builder.quadTo(0.66 * width, 0.65 * height, 0.7 * width, 0.5 * height);
        builder.stroke();
        break;
      case 'square':
        builder.begin();
        builder.moveTo(0.3 * width, 0.5 * height);
        builder.lineTo(0.3 * width, 0.35 * height);
        builder.lineTo(0.5 * width, 0.35 * height);
        builder.lineTo(0.5 * width, 0.65 * height);
        builder.lineTo(0.7 * width, 0.65 * height);
        builder.lineTo(0.7 * width, 0.5 * height);
        builder.stroke();
        break;
      case 'triangular':
        builder.begin();
        builder.moveTo(0.3 * width, 0.65 * height);
        builder.lineTo(0.4 * width, 0.35 * height);
        builder.lineTo(0.5 * width, 0.65 * height);
        builder.lineTo(0.6 * width, 0.35 * height);
        builder.lineTo(0.7 * width, 0.65 * height);
        builder.stroke();
        break;
      case 'sawtooth':
        builder.begin();
        builder.moveTo(0.24 * width, 0.65 * height);
        builder.lineTo(0.42 * width, 0.35 * height);
        builder.lineTo(0.42 * width, 0.65 * height);
        builder.lineTo(0.58 * width, 0.35 * height);
        builder.lineTo(0.58 * width, 0.65 * height);
        builder.lineTo(0.76 * width, 0.35 * height);
        builder.lineTo(0.76 * width, 0.65 * height);
        builder.stroke();
        break;
      case 'noise':
        builder.begin();
        builder.moveTo(0.5 * width, 0.17 * height);
        builder.lineTo(0.5 * width, 0.5 * height);
        builder.moveTo(0.18 * width, 0.42 * height);
        builder.lineTo(0.5 * width, 0.5 * height);
        builder.moveTo(0.32 * width, 0.78 * height);
        builder.lineTo(0.5 * width, 0.5 * height);
        builder.moveTo(0.82 * width, 0.42 * height);
        builder.lineTo(0.5 * width, 0.5 * height);
        builder.moveTo(0.68 * width, 0.78 * height);
        builder.lineTo(0.5 * width, 0.5 * height);
        builder.stroke();
        break;
      case 'ideal':
        builder.begin();
        builder.moveTo(0, 0.5 * height);
        builder.lineTo(width, 0.5 * height);
        builder.stroke();
        break;
      case 'expSquib':
        builder.ellipse(0, 0.43 * height, 0.14 * width, 0.14 * height);
        builder.stroke();
        builder.ellipse(0.86 * width, 0.43 * height, 0.14 * width, 0.14 * height);
        builder.stroke();
        builder.begin();
        builder.moveTo(0.83 * width, 0.63 * height);
        builder.lineTo(0.73 * width, 0.73 * height);
        builder.lineTo(0.27 * width, 0.27 * height);
        builder.lineTo(0.17 * width, 0.37 * height);
        builder.stroke();
        builder.begin();
        d = this.getStyleValue(style, 'strokeColor', '#000000');
        builder.setFillColor(d as string);
        builder.moveTo(0.2 * width, 0.25 * height);
        builder.lineTo(0.13 * width, 0.4 * height);
        builder.lineTo(0.28 * width, 0.33 * height);
        builder.close();
        builder.fillAndStroke();
        break;
      case 'pulse':
        builder.begin();
        builder.moveTo(0.3 * width, 0.65 * height);
        builder.lineTo(0.4 * width, 0.65 * height);
        builder.lineTo(0.4 * width, 0.35 * height);
        builder.lineTo(0.6 * width, 0.35 * height);
        builder.lineTo(0.6 * width, 0.65 * height);
        builder.lineTo(0.7 * width, 0.65 * height);
        builder.stroke();
        break;
      case 'invPulse':
        builder.begin();
        builder.moveTo(0.3 * width, 0.35 * height);
        builder.lineTo(0.4 * width, 0.35 * height);
        builder.lineTo(0.4 * width, 0.65 * height);
        builder.lineTo(0.6 * width, 0.65 * height);
        builder.lineTo(0.6 * width, 0.35 * height);
        builder.lineTo(0.7 * width, 0.35 * height);
        builder.stroke();
        break;
      case 'chopSquare':
        builder.begin();
        builder.moveTo(0.3 * width, 0.5 * height);
        builder.lineTo(0.33 * width, 0.35 * height);
        builder.lineTo(0.47 * width, 0.35 * height);
        builder.lineTo(0.53 * width, 0.65 * height);
        builder.lineTo(0.67 * width, 0.65 * height);
        builder.lineTo(0.7 * width, 0.5 * height);
        builder.stroke();
        break;
      case 'stepOn':
        builder.begin();
        builder.moveTo(0.3 * width, 0.65 * height);
        builder.lineTo(0.5 * width, 0.65 * height);
        builder.lineTo(0.5 * width, 0.35 * height);
        builder.lineTo(0.7 * width, 0.35 * height);
        builder.stroke();
        break;
      case 'stepOff':
        builder.begin();
        builder.moveTo(0.3 * width, 0.35 * height);
        builder.lineTo(0.5 * width, 0.35 * height);
        builder.lineTo(0.5 * width, 0.65 * height);
        builder.lineTo(0.7 * width, 0.65 * height);
        builder.stroke();
        break;
      case 'dc1':
        builder.begin();
        builder.moveTo(0.17 * width, 0.5 * height);
        builder.lineTo(0.83 * width, 0.5 * height);
        builder.moveTo(0.67 * width, 0.42 * height);
        builder.lineTo(0.83 * width, 0.5 * height);
        builder.lineTo(0.67 * width, 0.58 * height);
        builder.stroke();
        break;
      case 'dc2':
        builder.begin();
        builder.moveTo(0.5 * width, 0.17 * height);
        builder.lineTo(0.5 * width, 0.83 * height);
        builder.moveTo(0.42 * width, 0.67 * height);
        builder.lineTo(0.5 * width, 0.83 * height);
        builder.lineTo(0.58 * width, 0.67 * height);
        builder.stroke();
        break;
      case 'dc3':
        e = Math.max(3, 0.05 * Math.min(height, width));
        f = 3;
        if ('dependent' == d) {
          f += 3;
        }
        builder.begin();
        builder.moveTo(0.5 * width - e, 0.05 * height + f);
        builder.lineTo(0.5 * width + e, 0.05 * height + f);
        builder.moveTo(0.5 * width, 0.05 * height - e + f);
        builder.lineTo(0.5 * width, 0.05 * height + e + f);
        builder.moveTo(0.5 * width - e, 0.95 * height - f);
        builder.lineTo(0.5 * width + e, 0.95 * height - f);
        builder.stroke();
    }
    builder.restore();
  }
}
