// @ts-nocheck
import type { RenderContext, ShapeAttrs } from '../../../renderer.ts';
import { BaseShapeHandler } from '../../shape-registry.ts';

export class MockupSpinnerHandler extends BaseShapeHandler {
  constructor(renderCtx: RenderContext) {
    super(renderCtx);
  }

  render(attrs: ShapeAttrs): void {
    const {
      builder,
      currentGroup,
      applyShapeAttrsToBuilder,
      x,
      y,
      width,
      height,
      style,
      getStencilShape,
      renderStencilShape,
    } = this.renderCtx;
    if (!builder || !currentGroup) return;
    if (width <= 0 || height <= 0) return;

    builder.setCanvasRoot(currentGroup);
    builder.save();
    applyShapeAttrsToBuilder(builder, attrs);

    const f = this.getStyleValue(style, 'spinLayout', 'right');

    builder.translate(x, y);
    this.renderBackground(builder, 0, 0, width, height, style, getStencilShape, renderStencilShape);
    builder.setShadow(!1);
    this.renderForeground(
      builder,
      0,
      0,
      width,
      height,
      style,
      getStencilShape,
      renderStencilShape,
      f
    );
    this.render_mainText(builder, width, height, f);
    builder.restore();
  }

  private renderBackground(
    builder: RenderContext['builder'],
    x: number,
    y: number,
    width: number,
    height: number,
    style: RenderContext['style'],
    getStencilShape?: RenderContext['getStencilShape'],
    renderStencilShape?: RenderContext['renderStencilShape']
  ): void {
    if (!builder) return;
    builder.setFillColor('#ffffff' as string);
    builder.roundrect(0, 0, width, height, 10, 10);
    builder.fillAndStroke();
  }

  private renderForeground(
    builder: RenderContext['builder'],
    x: number,
    y: number,
    width: number,
    height: number,
    style: RenderContext['style'],
    getStencilShape?: RenderContext['getStencilShape'],
    renderStencilShape?: RenderContext['renderStencilShape'],
    extra1?: any
  ): void {
    if (!builder) return;
    let c;
    let f;
    let g;
    c = this.getStyleValue(style, 'spinStyle', 'normal');
    f = this.getStyleValue(style, 'adjStyle', 'triangle');
    g = this.getStyleValue(style, 'fillColor', '#ffffff');
    builder.setFillColor(g as string);
    if (c === 'normal') {
      if (extra1 === 'right') {
        builder.begin();
        builder.moveTo(width - 20, 0);
        builder.lineTo(width - 20, height);
        builder.moveTo(width - 20, 0.5 * height);
        builder.lineTo(width, 0.5 * height);
        builder.stroke();
      } else if (extra1 === 'left') {
        builder.begin();
        builder.moveTo(20, 0);
        builder.lineTo(20, height);
        builder.moveTo(20, 0.5 * height);
        builder.lineTo(0, 0.5 * height);
        builder.stroke();
      } else if (extra1 === 'top') {
        builder.begin();
        builder.moveTo(0, 15);
        builder.lineTo(width, 15);
        builder.moveTo(0.5 * width, 15);
        builder.lineTo(0.5 * width, 0);
        builder.stroke();
      } else if (extra1 === 'bottom') {
        builder.begin();
        builder.moveTo(0, height - 15);
        builder.lineTo(width, height - 15);
        builder.moveTo(0.5 * width, height - 15);
        builder.lineTo(0.5 * width, height);
        builder.stroke();
      } else if (extra1 === 'vertical') {
        builder.begin();
        builder.moveTo(0, 15);
        builder.lineTo(width, 15);
        builder.moveTo(0, height - 15);
        builder.lineTo(width, height - 15);
        builder.stroke();
      } else if (extra1 === 'horizontal') {
        builder.begin();
        builder.moveTo(20, 0);
        builder.lineTo(20, height);
        builder.moveTo(width - 20, 0);
        builder.lineTo(width - 20, height);
        builder.stroke();
      }
    }
    builder.setStrokeColor(g as string);
    if (extra1 === 'right') {
      if (f === 'triangle') {
        builder.begin();
        builder.moveTo(width - 14, 0.25 * height + 4.5);
        builder.lineTo(width - 10, 0.25 * height - 2.5);
        builder.lineTo(width - 6, 0.25 * height + 4.5);
        builder.close();
        builder.fillAndStroke();
      } else if (f === 'plusMinus') {
        builder.begin();
        builder.moveTo(width - 10, 0.25 * height - 4);
        builder.lineTo(width - 10, 0.25 * height + 4);
        builder.moveTo(width - 14, 0.25 * height);
        builder.lineTo(width - 6, 0.25 * height);
        builder.stroke();
      } else if (f === 'arrow') {
        builder.begin();
        builder.moveTo(width - 14, 0.25 * height + 1.5);
        builder.lineTo(width - 10, 0.25 * height - 2.5);
        builder.lineTo(width - 6, 0.25 * height + 1.5);
        builder.close();
        builder.moveTo(width - 10, 0.25 * height + 4.5);
        builder.lineTo(width - 10, 0.25 * height - 2.5);
        builder.fillAndStroke();
      }
    } else if (extra1 === 'left') {
      if (f === 'triangle') {
        builder.begin();
        builder.moveTo(14, 0.25 * height + 4.5);
        builder.lineTo(10, 0.25 * height - 2.5);
        builder.lineTo(6, 0.25 * height + 4.5);
        builder.close();
        builder.fillAndStroke();
      } else if (f === 'plusMinus') {
        builder.begin();
        builder.moveTo(10, 0.25 * height - 4);
        builder.lineTo(10, 0.25 * height + 4);
        builder.moveTo(14, 0.25 * height);
        builder.lineTo(6, 0.25 * height);
        builder.stroke();
      } else if (f === 'arrow') {
        builder.begin();
        builder.moveTo(14, 0.25 * height + 1.5);
        builder.lineTo(10, 0.25 * height - 2.5);
        builder.lineTo(6, 0.25 * height + 1.5);
        builder.close();
        builder.moveTo(10, 0.25 * height + 4.5);
        builder.lineTo(10, 0.25 * height - 2.5);
        builder.fillAndStroke();
      }
    } else if (extra1 === 'top') {
      if (f === 'triangle') {
        builder.begin();
        builder.moveTo(0.75 * width + 4, 12);
        builder.lineTo(0.75 * width, 5);
        builder.lineTo(0.75 * width - 4, 12);
        builder.close();
        builder.fillAndStroke();
      } else if (f === 'plusMinus') {
        builder.begin();
        builder.moveTo(0.75 * width, 3.5);
        builder.lineTo(0.75 * width, 11.5);
        builder.moveTo(0.75 * width + 4, 7.5);
        builder.lineTo(0.75 * width - 4, 7.5);
        builder.stroke();
      } else if (f === 'arrow') {
        builder.begin();
        builder.moveTo(0.75 * width + 4, 9);
        builder.lineTo(0.75 * width, 5);
        builder.lineTo(0.75 * width - 4, 9);
        builder.close();
        builder.moveTo(0.75 * width, 12);
        builder.lineTo(0.75 * width, 5);
        builder.fillAndStroke();
      }
    } else if (extra1 === 'bottom') {
      if (f === 'triangle') {
        builder.begin();
        builder.moveTo(0.75 * width + 4, height - 5);
        builder.lineTo(0.75 * width, height - 12);
        builder.lineTo(0.75 * width - 4, height - 5);
        builder.close();
        builder.fillAndStroke();
      } else if (f === 'plusMinus') {
        builder.begin();
        builder.moveTo(0.75 * width, height - 3.5);
        builder.lineTo(0.75 * width, height - 11.5);
        builder.moveTo(0.75 * width + 4, height - 7.5);
        builder.lineTo(0.75 * width - 4, height - 7.5);
        builder.stroke();
      } else if (f === 'arrow') {
        builder.begin();
        builder.moveTo(0.75 * width + 4, height - 6);
        builder.lineTo(0.75 * width, height - 10);
        builder.lineTo(0.75 * width - 4, height - 6);
        builder.close();
        builder.moveTo(0.75 * width, height - 3);
        builder.lineTo(0.75 * width, height - 10);
        builder.fillAndStroke();
      }
    } else if (extra1 === 'vertical') {
      if (f === 'triangle') {
        builder.begin();
        builder.moveTo(0.5 * width + 4, 12);
        builder.lineTo(0.5 * width, 5);
        builder.lineTo(0.5 * width - 4, 12);
        builder.close();
        builder.fillAndStroke();
      } else if (f === 'plusMinus') {
        builder.begin();
        builder.moveTo(0.5 * width, 3.5);
        builder.lineTo(0.5 * width, 11.5);
        builder.moveTo(0.5 * width + 4, 7.5);
        builder.lineTo(0.5 * width - 4, 7.5);
        builder.stroke();
      } else if (f === 'arrow') {
        builder.begin();
        builder.moveTo(0.5 * width + 4, 9);
        builder.lineTo(0.5 * width, 5);
        builder.lineTo(0.5 * width - 4, 9);
        builder.close();
        builder.moveTo(0.5 * width, 12);
        builder.lineTo(0.5 * width, 5);
        builder.fillAndStroke();
      }
    } else if (extra1 === 'horizontal') {
      if (f === 'triangle') {
        builder.begin();
        builder.moveTo(width - 6, 0.5 * height + 4.5);
        builder.lineTo(width - 10, 0.5 * height - 2.5);
        builder.lineTo(width - 14, 0.5 * height + 4.5);
        builder.close();
        builder.fillAndStroke();
      } else if (f === 'plusMinus') {
        builder.begin();
        builder.moveTo(width - 10, 0.5 * height - 4);
        builder.lineTo(width - 10, 0.5 * height + 4);
        builder.moveTo(width - 14, 0.5 * height);
        builder.lineTo(width - 6, 0.5 * height);
        builder.stroke();
      } else if (f === 'arrow') {
        builder.begin();
        builder.moveTo(width - 14, 0.5 * height + 1.5);
        builder.lineTo(width - 10, 0.5 * height - 2.5);
        builder.lineTo(width - 6, 0.5 * height + 1.5);
        builder.close();
        builder.moveTo(width - 10, 0.5 * height + 4.5);
        builder.lineTo(width - 10, 0.5 * height - 2.5);
        builder.fillAndStroke();
      }
    }
    if (extra1 === 'right') {
      if (f === 'triangle') {
        builder.begin();
        builder.moveTo(width - 14, 0.75 * height - 4.5);
        builder.lineTo(width - 10, 0.75 * height + 2.5);
        builder.lineTo(width - 6, 0.75 * height - 4.5);
        builder.close();
        builder.fillAndStroke();
      } else if (f === 'plusMinus') {
        builder.begin();
        builder.moveTo(width - 14, 0.75 * height);
        builder.lineTo(width - 6, 0.75 * height);
        builder.stroke();
      } else if (f === 'arrow') {
        builder.begin();
        builder.moveTo(width - 14, 0.75 * height - 1.5);
        builder.lineTo(width - 10, 0.75 * height + 2.5);
        builder.lineTo(width - 6, 0.75 * height - 1.5);
        builder.close();
        builder.moveTo(width - 10, 0.75 * height - 4.5);
        builder.lineTo(width - 10, 0.75 * height + 2.5);
        builder.fillAndStroke();
      }
    } else if (extra1 === 'left') {
      if (f === 'triangle') {
        builder.begin();
        builder.moveTo(14, 0.75 * height - 4.5);
        builder.lineTo(10, 0.75 * height + 2.5);
        builder.lineTo(6, 0.75 * height - 4.5);
        builder.close();
        builder.fillAndStroke();
      } else if (f === 'plusMinus') {
        builder.begin();
        builder.moveTo(14, 0.75 * height);
        builder.lineTo(6, 0.75 * height);
        builder.stroke();
      } else if (f === 'arrow') {
        builder.begin();
        builder.moveTo(14, 0.75 * height - 1.5);
        builder.lineTo(10, 0.75 * height + 2.5);
        builder.lineTo(6, 0.75 * height - 1.5);
        builder.close();
        builder.moveTo(10, 0.75 * height - 4.5);
        builder.lineTo(10, 0.75 * height + 2.5);
        builder.fillAndStroke();
      }
    } else if (extra1 === 'top') {
      if (f === 'triangle') {
        builder.begin();
        builder.moveTo(0.25 * width + 4, 5);
        builder.lineTo(0.25 * width, 12);
        builder.lineTo(0.25 * width - 4, 5);
        builder.close();
        builder.fillAndStroke();
      } else if (f === 'plusMinus') {
        builder.begin();
        builder.moveTo(0.25 * width + 4, 7.5);
        builder.lineTo(0.25 * width - 4, 7.5);
        builder.stroke();
      } else if (f === 'arrow') {
        builder.begin();
        builder.moveTo(0.25 * width + 4, 6);
        builder.lineTo(0.25 * width, 10);
        builder.lineTo(0.25 * width - 4, 6);
        builder.close();
        builder.moveTo(0.25 * width, 3);
        builder.lineTo(0.25 * width, 10);
        builder.fillAndStroke();
      }
    } else if (extra1 === 'bottom') {
      if (f === 'triangle') {
        builder.begin();
        builder.moveTo(0.25 * width + 4, height - 12);
        builder.lineTo(0.25 * width, height - 5);
        builder.lineTo(0.25 * width - 4, height - 12);
        builder.close();
        builder.fillAndStroke();
      } else if (f === 'plusMinus') {
        builder.begin();
        builder.moveTo(0.25 * width + 4, height - 7.5);
        builder.lineTo(0.25 * width - 4, height - 7.5);
        builder.stroke();
      } else if (f === 'arrow') {
        builder.begin();
        builder.moveTo(0.25 * width + 4, height - 9);
        builder.lineTo(0.25 * width, height - 5);
        builder.lineTo(0.25 * width - 4, height - 9);
        builder.close();
        builder.moveTo(0.25 * width, height - 12);
        builder.lineTo(0.25 * width, height - 5);
        builder.fillAndStroke();
      }
    } else if (extra1 === 'vertical') {
      if (f === 'triangle') {
        builder.begin();
        builder.moveTo(0.5 * width + 4, height - 12);
        builder.lineTo(0.5 * width, height - 5);
        builder.lineTo(0.5 * width - 4, height - 12);
        builder.close();
        builder.fillAndStroke();
      } else if (f === 'plusMinus') {
        builder.begin();
        builder.moveTo(0.5 * width + 4, height - 7.5);
        builder.lineTo(0.5 * width - 4, height - 7.5);
        builder.stroke();
      } else if (f === 'arrow') {
        builder.begin();
        builder.moveTo(0.5 * width + 4, height - 9);
        builder.lineTo(0.5 * width, height - 5);
        builder.lineTo(0.5 * width - 4, height - 9);
        builder.close();
        builder.moveTo(0.5 * width, height - 12);
        builder.lineTo(0.5 * width, height - 5);
        builder.fillAndStroke();
      }
    } else if (extra1 === 'horizontal') {
      if (f === 'triangle') {
        builder.begin();
        builder.moveTo(6, 0.5 * height - 4.5);
        builder.lineTo(10, 0.5 * height + 2.5);
        builder.lineTo(14, 0.5 * height - 4.5);
        builder.close();
        builder.fillAndStroke();
      } else if (f === 'plusMinus') {
        builder.begin();
        builder.moveTo(14, 0.5 * height);
        builder.lineTo(6, 0.5 * height);
        builder.stroke();
      } else if (f === 'arrow') {
        builder.begin();
        builder.moveTo(14, 0.5 * height - 1.5);
        builder.lineTo(10, 0.5 * height + 2.5);
        builder.lineTo(6, 0.5 * height - 1.5);
        builder.close();
        builder.moveTo(10, 0.5 * height - 4.5);
        builder.lineTo(10, 0.5 * height + 2.5);
        builder.fillAndStroke();
      }
    }
  }

  private render_mainText(builder: RenderContext['builder'], p1: any, p2: any, p3: any): void {
    if (!builder) return;
    let c;
    let f;
    let g;
    c = this.getStyleValue(this.renderCtx.style, 'mainText', '100').toString();
    f = this.getStyleValue(this.renderCtx.style, 'textSize', '17');
    g = this.getStyleValue(this.renderCtx.style, 'textColor', '#666666');
    builder.setFontSize(Number.parseFloat(String(f)) || 0);
    builder.setFontColor(g as string);
    if (p3 === 'right') {
      builder.text(0.5 * (p1 - 20), 0.5 * p2, 0, 0, c, 'center', 'middle', 0, 0, 0);
    } else if (p3 === 'left') {
      builder.text(0.5 * (p1 + 20), 0.5 * p2, 0, 0, c, 'center', 'middle', 0, 0, 0);
    } else if (p3 === 'top') {
      builder.text(0.5 * p1, 0.5 * (p2 + 15), 0, 0, c, 'center', 'middle', 0, 0, 0);
    } else if (p3 === 'bottom') {
      builder.text(0.5 * p1, 0.5 * (p2 - 15), 0, 0, c, 'center', 'middle', 0, 0, 0);
    } else if (p3 === 'vertical') {
      builder.text(0.5 * p1, 0.5 * p2, 0, 0, c, 'center', 'middle', 0, 0, 0);
    } else if (p3 === 'horizontal') {
      builder.text(0.5 * p1, 0.5 * p2, 0, 0, c, 'center', 'middle', 0, 0, 0);
    }
  }
}
