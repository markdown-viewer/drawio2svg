import type { RenderContext, ShapeAttrs } from '../../../renderer.ts';
import { RectangleShapeHandler } from '../../shape-registry.ts';

export class AndroidContextualSplitActionBarWhiteHandler extends RectangleShapeHandler {
  constructor(renderCtx: RenderContext) {
    super(renderCtx);
  }

  render(attrs: ShapeAttrs): void {
    const { builder, currentGroup, x, y, width, height } = this.renderCtx;
    if (!builder || !currentGroup) return;
    if (width <= 0 || height <= 0) return;

    const baseWidth = 185;
    const baseHeight = 70;
    const scaleX = width / baseWidth;
    const scaleY = height / baseHeight;
    const format = (value: number): number => Number(value.toFixed(2));
    const px = (value: number): number => format(x + value * scaleX);
    const py = (value: number): number => format(y + value * scaleY);

    const fill = attrs.fillColor === 'none' ? 'none' : attrs.fillColor;
    const stroke = attrs.strokeColor === 'none' ? 'none' : attrs.strokeColor;

    const topBar = builder.createRect(format(x), format(y), format(width), format(30 * scaleY), {
      fill,
      stroke: 'none',
      'pointer-events': 'all'
    });
    currentGroup.appendChild(topBar);

    const bottomBar = builder.createRect(format(x), format(y + 40 * scaleY), format(width), format(30 * scaleY), {
      fill,
      stroke: 'none',
      'pointer-events': 'all'
    });
    currentGroup.appendChild(bottomBar);

    const menuSquares = [46, 52.5, 59];
    for (const offsetY of menuSquares) {
      const square = builder.createRect(px(164.8), py(offsetY), format(5.32 * scaleX), format(5 * scaleY), {
        fill: stroke,
        stroke: 'none',
        'pointer-events': 'all'
      });
      currentGroup.appendChild(square);
    }

    builder.setCanvasRoot(currentGroup);
    builder.save();
    builder.setFillColor(null);
    builder.setStrokeColor(stroke);
    builder.setMiterLimit(10);
    builder.begin();
    builder.addPoints(
      [
        { x: px(37.21), y: py(6) },
        { x: px(37.21), y: py(24) }
      ],
      false,
      0,
      false
    );
    builder.stroke();
    builder.restore();

    const divider = currentGroup.lastChild as Element | null;
    if (divider) {
      divider.setAttribute('pointer-events', 'all');
    }

    const zeroRect = builder.createRect(format(x), format(y), 0, 0, {
      fill: 'none',
      stroke: '#000000',
      'pointer-events': 'all'
    });
    currentGroup.appendChild(zeroRect);

    builder.setCanvasRoot(currentGroup);
    builder.save();
    builder.setFillColor(null);
    builder.setStrokeColor(stroke);
    builder.setMiterLimit(10);
    builder.begin();
    builder.addPoints(
      [
        { x: px(6.38), y: py(13) },
        { x: px(12.76), y: py(20) },
        { x: px(25.52), y: py(6) }
      ],
      false,
      0,
      false
    );
    builder.stroke();
    builder.restore();

    const checkPath = currentGroup.lastChild as Element | null;
    if (checkPath) {
      checkPath.setAttribute('pointer-events', 'all');
    }
  }
}
