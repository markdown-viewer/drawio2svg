import type { RenderContext, ShapeAttrs } from '../../../renderer.ts';
import { EllipseShapeHandler } from '../../shape-registry.ts';

/**
 * LineEllipse shape - ellipse with a line through it
 * Based on LineEllipseShape from Shapes.js
 */
export class LineEllipseHandler extends EllipseShapeHandler {
  constructor(renderCtx: RenderContext) {
    super(renderCtx);
  }

  render(attrs: ShapeAttrs): void {
    const { builder, currentGroup, style, x, y, width, height, applyShapeAttrsToBuilder } = this.renderCtx;
    if (!builder || !currentGroup) return;

    const lineDirection = style.line as string;

    builder.setCanvasRoot(currentGroup);
    builder.save();
    applyShapeAttrsToBuilder(builder, attrs);

    // Draw ellipse
    builder.ellipse(x, y, width, height);
    builder.fillAndStroke();

    // Draw line through center
    // Supported values: 'vertical', 'diagonal', otherwise horizontal
    builder.setShadow(false);
    builder.begin();
    if (lineDirection === 'vertical') {
      builder.moveTo(x + width / 2, y);
      builder.lineTo(x + width / 2, y + height);
    } else if (lineDirection === 'diagonal') {
      // Business usecase chord, matching PlantUML USymbolUsecase.specialBusiness logic:
      // Uses RotatedEllipse(beta=pi/4) to find theta2 from theta1=20deg, then draws the
      // chord from (cx + rx*cos(-theta1), cy + ry*sin(-theta1)) to (cx + rx*cos(+theta2), cy + ry*sin(+theta2)).
      // This places a "\" shaped chord in the right portion of the ellipse.
      const rx = width / 2;
      const ry = height / 2;
      const cx = x + rx;
      const cy = y + ry;
      const theta1 = 20 * Math.PI / 180;
      // RotatedEllipse.getPoint(theta1).x with beta=pi/4:
      const z = rx * Math.cos(theta1) * Math.cos(Math.PI / 4) - ry * Math.sin(theta1) * Math.sin(Math.PI / 4);
      // RotatedEllipse.getOtherTheta: a=rx*cos(pi/4), b=ry*sin(pi/4)
      const a = rx * Math.cos(Math.PI / 4);
      const b = ry * Math.sin(Math.PI / 4);
      const sum = (2 * a * z) / (a * a + b * b);
      const theta2 = Math.acos(Math.max(-1, Math.min(1, sum - Math.cos(theta1))));
      const p1x = cx + rx * Math.cos(-theta1);
      const p1y = cy + ry * Math.sin(-theta1);
      const p2x = cx + rx * Math.cos(theta2);
      const p2y = cy + ry * Math.sin(theta2);
      builder.moveTo(p1x, p1y);
      builder.lineTo(p2x, p2y);
    } else {
      // Default: horizontal (including 'both' and any other value)
      builder.moveTo(x, y + height / 2);
      builder.lineTo(x + width, y + height / 2);
    }
    builder.stroke();

    builder.restore();
  }
}
