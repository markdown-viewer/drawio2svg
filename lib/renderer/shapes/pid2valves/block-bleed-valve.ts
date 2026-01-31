import type { RenderContext, ShapeAttrs } from '../../../renderer.ts';
import { ActorShapeHandler } from '../../shape-registry.ts';

export class Pid2valvesBlockBleedValveHandler extends ActorShapeHandler {
  constructor(renderCtx: RenderContext) {
    super(renderCtx);
  }

  render(attrs: ShapeAttrs): void {
    const { builder, currentGroup, x, y, width, height, applyShapeAttrsToBuilder, style } = this.renderCtx;
    if (!builder || !currentGroup) return;
    if (width <= 0 || height <= 0) return;

    const actuator = this.getStyleValue(style, 'actuator', 'none');
    const actH = actuator !== 'none' ? height * 0.2353 : 0;

    builder.setCanvasRoot(currentGroup);
    builder.save();
    applyShapeAttrsToBuilder(builder, attrs);
    builder.setLineJoin('round');
    builder.translate(x, y);

    this.drawValveBody(builder, 0, actH, width, height - actH, attrs);

    builder.restore();
  }

  private drawValveBody(
    builder: RenderContext['builder'],
    x: number,
    y: number,
    width: number,
    height: number,
    attrs: ShapeAttrs
  ): void {
    if (!builder) return;
    const fillColor = attrs.fillColor === 'none' ? '#ffffff' : attrs.fillColor;
    const strokeColor = attrs.strokeColor === 'none' ? '#000000' : attrs.strokeColor;

    builder.translate(x, y);
    builder.begin();
    builder.moveTo(0, 0);
    builder.lineTo(width * 0.5, height * 0.23);
    builder.lineTo(0, height * 0.46);
    builder.close();
    builder.moveTo(width * 0.5, height * 0.23);
    builder.lineTo(width, 0);
    builder.lineTo(width, height * 0.46);
    builder.close();
    builder.fillAndStroke();

    builder.begin();
    builder.moveTo(width * 0.5, height * 0.23);
    builder.lineTo(width * 0.5, height * 0.5);
    builder.stroke();

    builder.setFillColor(strokeColor as string);
    builder.begin();
    builder.moveTo(width * 0.3, height * 0.5);
    builder.lineTo(width * 0.7, height * 0.5);
    builder.lineTo(width * 0.5, height * 0.75);
    builder.close();
    builder.fillAndStroke();

    builder.begin();
    builder.moveTo(width * 0.3, height);
    builder.lineTo(width * 0.5, height * 0.75);
    builder.lineTo(width * 0.7, height);
    builder.fillAndStroke();
    builder.setFillColor(fillColor as string);
    builder.translate(-x, -y);
  }
}