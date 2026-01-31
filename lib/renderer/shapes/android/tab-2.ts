import type { RenderContext, ShapeAttrs } from '../../../renderer.ts';
import { RectangleShapeHandler } from '../../shape-registry.ts';

export class AndroidTab2Handler extends RectangleShapeHandler {
  constructor(renderCtx: RenderContext) {
    super(renderCtx);
  }

  render(attrs: ShapeAttrs): void {
    const { builder, currentGroup, applyShapeAttrsToElement, x, y, width, height } = this.renderCtx;
    if (!builder || !currentGroup) return;
    if (width <= 0 || height <= 0) return;

    const baseX = 2;
    const baseY = 2;
    const baseWidth = 472;
    const baseHeight = 686;
    const scaleX = width / baseWidth;
    const scaleY = height / baseHeight;
    const format = (value: number): number => Number(value.toFixed(2));
    const px = (value: number): number => format(x + (value - baseX) * scaleX);
    const py = (value: number): number => format(y + (value - baseY) * scaleY);

    builder.setCanvasRoot(currentGroup);
    builder.save();
    builder.setFillColor(null);
    builder.setStrokeColor(null);
    builder.setMiterLimit(10);
    builder.begin();
    builder.moveTo(px(2), py(38));
    builder.curveTo(px(2), py(18.12), px(18.12), py(2), px(38), py(2));
    builder.lineTo(px(438), py(2));
    builder.curveTo(px(457.88), py(2), px(474), py(18.12), px(474), py(38));
    builder.lineTo(px(474), py(652));
    builder.curveTo(px(474), py(671.88), px(457.88), py(688), px(438), py(688));
    builder.lineTo(px(38), py(688));
    builder.curveTo(px(18.12), py(688), px(2), py(671.88), px(2), py(652));
    builder.close();
    builder.moveTo(px(54), py(54));
    builder.lineTo(px(54), py(638));
    builder.lineTo(px(419), py(638));
    builder.lineTo(px(419), py(54));
    builder.close();
    builder.fillAndStroke();
    builder.restore();

    const outlinePath = currentGroup.lastChild as Element | null;
    if (outlinePath) {
      applyShapeAttrsToElement(outlinePath, attrs);
      outlinePath.setAttribute('stroke-miterlimit', '10');
      outlinePath.setAttribute('pointer-events', 'all');
    }

    const stroke = attrs.strokeColor === 'none' ? 'none' : attrs.strokeColor;
    const fill = attrs.fillColor === 'none' ? 'none' : attrs.fillColor;
    const strokeWidth = attrs.strokeWidth || 1;

    const camera = builder.createEllipse(px(446), py(370), format(4 * scaleX), format(4 * scaleY), {
      fill,
      stroke,
      'stroke-width': strokeWidth,
      'pointer-events': 'all'
    });
    currentGroup.appendChild(camera);

    builder.setCanvasRoot(currentGroup);
    builder.save();
    builder.setFillColor(null);
    builder.setStrokeColor(stroke);
    builder.setStrokeWidth(strokeWidth);
    builder.setMiterLimit(10);
    builder.begin();
    builder.moveTo(px(7), py(43));
    builder.curveTo(px(7.43), py(27.92), px(18.99), py(15.5), px(34), py(14));
    builder.lineTo(px(444), py(14));
    builder.curveTo(px(459.01), py(15.5), px(470.57), py(27.92), px(471), py(43));
    builder.lineTo(px(471), py(649));
    builder.curveTo(px(471), py(665.57), px(457.57), py(679), px(441), py(679));
    builder.lineTo(px(34), py(679));
    builder.curveTo(px(18.61), py(677.45), px(6.92), py(664.46), px(7), py(649));
    builder.close();
    builder.stroke();
    builder.restore();

    const bezelPath = currentGroup.lastChild as Element | null;
    if (bezelPath) {
      bezelPath.setAttribute('pointer-events', 'all');
    }

    builder.setCanvasRoot(currentGroup);
    builder.save();
    builder.setFillColor(null);
    builder.setStrokeColor(stroke);
    builder.setStrokeWidth(strokeWidth);
    builder.setMiterLimit(10);
    builder.begin();
    builder.moveTo(px(269), py(14));
    builder.curveTo(px(269), py(11.24), px(271.24), py(9), px(274), py(9));
    builder.lineTo(px(398), py(9));
    builder.curveTo(px(400.76), py(9), px(403), py(11.24), px(403), py(14));
    builder.stroke();
    builder.restore();

    const speakerTop = currentGroup.lastChild as Element | null;
    if (speakerTop) {
      speakerTop.setAttribute('pointer-events', 'all');
    }

    builder.setCanvasRoot(currentGroup);
    builder.save();
    builder.setFillColor(null);
    builder.setStrokeColor(stroke);
    builder.setStrokeWidth(strokeWidth);
    builder.setMiterLimit(10);
    builder.begin();
    builder.moveTo(px(269), py(679));
    builder.curveTo(px(269), py(681.76), px(271.24), py(684), px(274), py(684));
    builder.lineTo(px(398), py(684));
    builder.curveTo(px(400.76), py(684), px(403), py(681.76), px(403), py(679));
    builder.stroke();
    builder.restore();

    const speakerBottom = currentGroup.lastChild as Element | null;
    if (speakerBottom) {
      speakerBottom.setAttribute('pointer-events', 'all');
    }

    builder.setCanvasRoot(currentGroup);
    builder.save();
    builder.setFillColor(null);
    builder.setStrokeColor(stroke);
    builder.setStrokeWidth(strokeWidth);
    builder.setMiterLimit(10);
    builder.begin();
    builder.addPoints(
      [
        { x: px(54), y: py(54) },
        { x: px(54), y: py(638) },
        { x: px(419), y: py(638) },
        { x: px(419), y: py(54) }
      ],
      false,
      0,
      true
    );
    builder.stroke();
    builder.restore();

    const screenPath = currentGroup.lastChild as Element | null;
    if (screenPath) {
      screenPath.setAttribute('pointer-events', 'all');
    }
  }
}
