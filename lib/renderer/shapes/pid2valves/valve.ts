// @ts-nocheck
import type { RenderContext, ShapeAttrs } from '../../../renderer.ts';
import { BaseShapeHandler } from '../../shape-registry.ts';

export class Pid2valvesValveHandler extends BaseShapeHandler {
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

    const f = this.getStyleValue(style, 'valveType', 'gate');
    const g = this.getStyleValue(style, 'actuator', 'none');
    let h = 0;

    if ('none' !== g) {
      h = this.render_isAngleVariant(f) ? 0.3333 * height : 0.4 * height;
    }
    builder.translate(x, y);
    builder.setLineJoin('round');
    this.renderBackground(
      builder,
      x,
      y,
      width,
      height,
      style,
      getStencilShape,
      renderStencilShape,
      f,
      g,
      h
    );
    builder.setShadow(!1);
    this.renderForeground(
      builder,
      x,
      y,
      width,
      height,
      style,
      getStencilShape,
      renderStencilShape,
      f,
      g,
      h
    );
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
    renderStencilShape?: RenderContext['renderStencilShape'],
    extra1?: any,
    extra2?: any,
    extra3?: any
  ): void {
    if (!builder) return;
    if (extra2 !== 'none') {
      if (this.render_isAngleVariant(extra1)) {
        this.render_drawActuatorBg(builder, x, y, width, height / 1.2, extra2, extra3);
      } else {
        this.render_drawActuatorBg(builder, x, y, width, height, extra2, extra3);
      }
    }
    if (this.render_isGateVariant(extra1)) {
      this.render_drawGateVariantBg(builder, 0, 0, width, height, extra1, extra2, extra3);
    } else if (this.render_isAngleVariant(extra1)) {
      this.render_drawAngleVariantBg(builder, 0, 0, width, height, extra1, extra2, extra3);
    } else if (extra1 === 'butterfly') {
      this.render_drawButterflyValve(builder, 0, 0, width, height, extra2, extra3);
    } else if (extra1 === 'check') {
      this.render_drawCheckValve(builder, 0, 0, width, height, extra2, extra3);
    }
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
    extra1?: any,
    extra2?: any,
    extra3?: any
  ): void {
    if (!builder) return;
    extra1 = this.getStyleValue(style, 'valveType', 'gate');
    if (extra2 !== 'none') {
      if (this.render_isAngleVariant(extra1)) {
        this.render_drawActuatorFg(builder, x, y, width, height / 1.2, extra2, extra3);
      } else {
        this.render_drawActuatorFg(builder, x, y, width, height, extra2, extra3);
      }
    }
    if (this.render_isGateVariant(extra1)) {
      this.render_drawGateVariantFg(builder, 0, 0, width, height, extra1, extra2, extra3);
    }
    if (this.render_isAngleVariant(extra1)) {
      this.render_drawAngleVariantFg(builder, 0, 0, width, height, extra1, extra2, extra3);
    }
  }

  private render_drawActuatorBg(
    builder: RenderContext['builder'],
    p1: any,
    p2: any,
    p3: any,
    p4: any,
    p5: any
  ): void {
    if (!builder) return;
    if (this.render_isSquareVariant(p5)) {
      builder.translate(0.325 * p3, 0);
      this.render_drawSquareAct(builder, 0.35 * p3, 0.7 * p4, p5);
      builder.translate(0.325 * -p3, 0);
    } else if (p5 === 'man') {
      builder.translate(0.25 * p3, 0.15 * p4);
      this.render_drawManAct(builder, 0.5 * p3, 0.55 * p4);
      builder.translate(0.25 * -p3, 0.15 * -p4);
    } else if (p5 === 'diaph') {
      builder.translate(0.25 * p3, 0.1 * p4);
      this.render_drawDiaphAct(builder, 0.5 * p3, 0.6 * p4);
      builder.translate(0.25 * -p3, 0.1 * -p4);
    } else if (p5 === 'balDiaph') {
      builder.translate(0.25 * p3, 0.1 * p4);
      this.render_drawBalDiaphActBg(builder, 0.5 * p3, 0.6 * p4);
      builder.translate(0.25 * -p3, 0.1 * -p4);
    } else if (p5 === 'motor' || p5 === 'elHyd') {
      builder.translate(0.325 * p3, 0);
      this.render_drawCircleAct(builder, 0.35 * p3, 0.7 * p4, p5);
      builder.translate(0.325 * -p3, 0);
    } else if (p5 === 'spring') {
      builder.translate(0.36 * p3, 0);
      this.render_drawSpringAct(builder, 0.28 * p3, 0.7 * p4);
      builder.translate(0.36 * -p3, 0);
    } else if (p5 === 'solenoidManRes') {
      builder.translate(0.325 * p3, 0);
      this.render_drawSolenoidManResetAct(builder, 0.575 * p3, 0.7 * p4);
      builder.translate(0.325 * -p3, 0);
    } else if (p5 === 'singActing') {
      builder.translate(0.35 * p3, 0);
      this.render_drawSingActingActBg(builder, 0.65 * p3, 0.7 * p4);
      builder.translate(0.35 * -p3, 0);
    } else if (p5 === 'dblActing') {
      builder.translate(0.35 * p3, 0);
      this.render_drawDblActingActBg(builder, 0.65 * p3, 0.7 * p4);
      builder.translate(0.35 * -p3, 0);
    } else if (p5 === 'pilotCyl') {
      builder.translate(0.35 * p3, 0);
      this.render_drawPilotCylinderActBg(builder, 0.65 * p3, 0.7 * p4);
      builder.translate(0.35 * -p3, 0);
    } else if (p5 === 'angBlow') {
      builder.translate(0.5 * p3, 0.2 * p4);
      this.render_drawAngleBlowdownAct(builder, 0.4 * p3, 0.5 * p4);
      builder.translate(0.5 * -p3, 0.2 * -p4);
    }
  }

  private render_drawGateVariantBg(
    builder: RenderContext['builder'],
    p1: any,
    p2: any,
    p3: any,
    p4: any,
    p5: any,
    p6: any,
    p7: any
  ): void {
    if (!builder) return;
    if (p5 === 'gate') {
      this.render_drawGateValve(builder, p1, p2 + p7, p3, p4 - p7);
    } else if (p5 === 'ball' || p5 === 'globe') {
      builder.ellipse(p1 + 0.3 * p3, p2 + p7 + 0.18 * (p4 - p7), 0.4 * p3, 0.64 * (p4 - p7));
      builder.fillAndStroke();
      this.render_drawGateValve(builder, p1, p2 + p7, p3, p4 - p7);
    } else if (p5 === 'plug') {
      this.render_drawPlug(
        builder,
        p1 + 0.4 * p3,
        p2 + p7 + 0.25 * (p4 - p7),
        0.2 * p3,
        0.5 * (p4 - p7)
      );
      this.render_drawGateValve(builder, p1, p2 + p7, p3, p4 - p7);
    } else if (p5 === 'needle') {
      this.render_drawNeedle(
        builder,
        p1 + 0.45 * p3,
        p2 + p7 + 0.1 * (p4 - p7),
        0.1 * p3,
        0.9 * (p4 - p7)
      );
      this.render_drawGateValve(builder, p1, p2 + p7, p3, p4 - p7);
    } else if (p5 === 'selfDrain') {
      this.render_drawDrain(
        builder,
        p1 + 0.48 * p3,
        p2 + p7 + 0.5 * (p4 - p7),
        0.04 * p3,
        0.49 * (p4 - p7)
      );
      this.render_drawGateValve(builder, p1, p2 + p7, p3, p4 - p7);
    }
  }

  private render_drawAngleVariantBg(
    builder: RenderContext['builder'],
    p1: any,
    p2: any,
    p3: any,
    p4: any,
    p5: any,
    p6: any,
    p7: any
  ): void {
    if (!builder) return;
    if (p5 === 'angle') {
      this.render_drawAngleValve(builder, 0.2 * p3, p2 + p7, 0.8 * p3, p4 - p7);
    } else if (p5 === 'angleGlobe') {
      this.render_drawAngleGlobeValveBg(builder, 0.2 * p3, p2 + p7, 0.8 * p3, p4 - p7);
    } else if (p5 === 'threeWay') {
      this.render_drawThreeWayValve(builder, 0, p2 + p7, p3, p4 - p7);
    } else if (p5 === 'angBlow') {
      this.render_drawAngleBlowdownValve(builder, p1, p2 + p7, p3, p4 - p7);
    }
  }

  private render_drawButterflyValve(
    builder: RenderContext['builder'],
    p1: any,
    p2: any,
    p3: any,
    p4: any,
    p5: any,
    p6: any
  ): void {
    if (!builder) return;
    this.getStyleValue(this.renderCtx.style, 'fillColor', '#ffffff');
    this.getStyleValue(this.renderCtx.style, 'strokeColor', '#000000');
    p4 -= p6;
    builder.translate(p1, p2 + p6);
    builder.begin();
    builder.moveTo(0, 0);
    builder.lineTo(0, p4);
    builder.moveTo(p3, 0);
    builder.lineTo(p3, p4);
    builder.moveTo(0.05 * p3, 0.05 * p4);
    builder.lineTo(0.95 * p3, 0.95 * p4);
    builder.fillAndStroke();
    builder.ellipse(0.4 * p3, 0.33 * p4, 0.2 * p3, 0.33 * p4);
    builder.fillAndStroke();
    builder.translate(-p1, -p2);
  }

  private render_drawCheckValve(
    builder: RenderContext['builder'],
    p1: any,
    p2: any,
    p3: any,
    p4: any,
    p5: any,
    p6: any
  ): void {
    if (!builder) return;
    let h;
    p5 = this.getStyleValue(this.renderCtx.style, 'fillColor', '#ffffff');
    h = this.getStyleValue(this.renderCtx.style, 'strokeColor', '#000000');
    p4 -= p6;
    builder.translate(p1, p2 + p6);
    builder.begin();
    builder.moveTo(0, 0);
    builder.lineTo(0, p4);
    builder.moveTo(p3, 0);
    builder.lineTo(p3, p4);
    builder.moveTo(0.05 * p3, 0.05 * p4);
    builder.lineTo(0.95 * p3, 0.95 * p4);
    builder.fillAndStroke();
    builder.begin();
    builder.moveTo(0.8925 * p3, 0.815 * p4);
    builder.lineTo(0.957 * p3, 0.955 * p4);
    builder.lineTo(0.85 * p3, 0.928 * p4);
    builder.close();
    builder.setFillColor(h as string);
    builder.fillAndStroke();
    builder.setFillColor(p5 as string);
    builder.translate(-p1, -p2);
  }

  private render_drawActuatorFg(
    builder: RenderContext['builder'],
    p1: any,
    p2: any,
    p3: any,
    p4: any,
    p5: any
  ): void {
    if (!builder) return;
    if (p5 === 'balDiaph') {
      builder.translate(0.25 * p3, 0.1 * p4);
      this.render_drawBalDiaphActFg(builder, 0.5 * p3, 0.6 * p4);
      builder.translate(0.25 * -p3, 0.1 * -p4);
    } else if (p5 === 'singActing' || p5 === 'dblActing' || p5 === 'pilotCyl') {
      builder.translate(0.35 * p3, 0);
      this.render_drawActingActFg(builder, 0.65 * p3, 0.7 * p4);
      builder.translate(0.35 * -p3, 0);
    }
  }

  private render_drawGateVariantFg(
    builder: RenderContext['builder'],
    p1: any,
    p2: any,
    p3: any,
    p4: any,
    p5: any,
    p6: any,
    p7: any
  ): void {
    if (!builder) return;
    let k;
    this.getStyleValue(this.renderCtx.style, 'defState', 'open');
    p6 = this.getStyleValue(this.renderCtx.style, 'fillColor', '#ffffff');
    k = this.getStyleValue(this.renderCtx.style, 'strokeColor', '#000000');
    if (p5 === 'ball') {
      builder.ellipse(p1 + 0.3 * p3, p2 + p7 + 0.18 * (p4 - p7), 0.4 * p3, 0.64 * (p4 - p7));
      builder.fillAndStroke();
    } else if (p5 === 'globe') {
      builder.ellipse(p1 + 0.3 * p3, p2 + p7 + 0.18 * (p4 - p7), 0.4 * p3, 0.64 * (p4 - p7));
      builder.setFillColor(k as string);
      builder.fillAndStroke();
      builder.setFillColor(p6 as string);
    } else if (p5 === 'plug') {
      this.render_drawPlug(
        builder,
        p1 + 0.4 * p3,
        p2 + p7 + 0.25 * (p4 - p7),
        0.2 * p3,
        0.5 * (p4 - p7)
      );
    } else if (p5 === 'needle') {
      this.render_drawNeedle(
        builder,
        p1 + 0.45 * p3,
        p2 + p7 + 0.1 * (p4 - p7),
        0.1 * p3,
        0.9 * (p4 - p7)
      );
    } else if (p5 === 'selfDrain') {
      this.render_drawDrain(
        builder,
        p1 + 0.48 * p3,
        p2 + p7 + 0.5 * (p4 - p7),
        0.04 * p3,
        0.49 * (p4 - p7)
      );
    }
  }

  private render_drawAngleVariantFg(
    builder: RenderContext['builder'],
    p1: any,
    p2: any,
    p3: any,
    p4: any,
    p5: any,
    p6: any,
    p7: any
  ): void {
    if (!builder) return;
    this.getStyleValue(this.renderCtx.style, 'defState', 'open');
    p1 = this.getStyleValue(this.renderCtx.style, 'fillColor', '#ffffff');
    p2 = this.getStyleValue(this.renderCtx.style, 'strokeColor', '#000000');
    if (p5 === 'angleGlobe') {
      if ('none' === p6) {
        builder.ellipse(0.34 * p3, 0.175 * p4, 0.32 * p3, 0.4 * p4);
      } else {
        builder.ellipse(0.34 * p3, 0.45 * p4, 0.32 * p3, 0.2667 * p4);
      }
      builder.setFillColor(p2 as string);
      builder.fillAndStroke();
      builder.setFillColor(p1 as string);
    }
  }

  private render_isAngleVariant(p1: any): any {
    return p1 === 'angle' || p1 === 'angleGlobe' || p1 === 'threeWay' || p1 === 'angBlow' ? !0 : !1;
  }

  private render_isGateVariant(p1: any): any {
    return p1 === 'gate' ||
      p1 === 'ball' ||
      p1 === 'plug' ||
      p1 === 'needle' ||
      p1 === 'selfDrain' ||
      p1 === 'globe'
      ? !0
      : !1;
  }

  private render_drawSquareAct(builder: RenderContext['builder'], p1: any, p2: any, p3: any): void {
    if (!builder) return;
    let c;
    builder.rect(0, 0, p1, 0.5 * p2);
    builder.fillAndStroke();
    builder.begin();
    builder.moveTo(0.5 * p1, 0.5 * p2);
    builder.lineTo(0.5 * p1, p2);
    builder.stroke();
    c = '';
    if (p3 === 'pilot') {
      c = 'P';
    } else if (p3 === 'solenoid') {
      c = 'S';
    } else if (p3 === 'digital') {
      c = 'D';
    } else if (p3 === 'weight') {
      c = 'W';
    } else if (p3 === 'key') {
      c = 'K';
    }
    builder.setFontStyle(1);
    builder.setFontFamily('Helvetica');
    builder.setFontSize(Number.parseFloat(String(0.4 * Math.min(p1, p2))) || 0);
    builder.text(0.5 * p1, 0.25 * p2, 0, 0, c, 'center', 'middle', 0, 0, 0);
  }

  private render_drawManAct(builder: RenderContext['builder'], p1: any, p2: any): void {
    if (!builder) return;
    builder.begin();
    builder.moveTo(0, 0);
    builder.lineTo(p1, 0);
    builder.moveTo(0.5 * p1, 0);
    builder.lineTo(0.5 * p1, p2);
    builder.stroke();
  }

  private render_drawDiaphAct(builder: RenderContext['builder'], p1: any, p2: any): void {
    if (!builder) return;
    builder.begin();
    builder.moveTo(0.5 * p1, 0.2 * p2);
    builder.lineTo(0.5 * p1, p2);
    builder.stroke();
    builder.begin();
    builder.moveTo(0, 0.2 * p2);
    builder.arcTo(0.6 * p1, 0.4 * p2, 0, 0, 1, p1, 0.2 * p2);
    builder.close();
    builder.fillAndStroke();
  }

  private render_drawBalDiaphActBg(builder: RenderContext['builder'], p1: any, p2: any): void {
    if (!builder) return;
    builder.ellipse(0, 0, p1, 0.3 * p2);
    builder.fillAndStroke();
    builder.begin();
    builder.moveTo(0.5 * p1, 0.3 * p2);
    builder.lineTo(0.5 * p1, p2);
    builder.stroke();
  }

  private render_drawCircleAct(builder: RenderContext['builder'], p1: any, p2: any, p3: any): void {
    if (!builder) return;
    let c;
    builder.ellipse(0, 0, p1, 0.5 * p2);
    builder.fillAndStroke();
    builder.begin();
    builder.moveTo(0.5 * p1, 0.5 * p2);
    builder.lineTo(0.5 * p1, p2);
    builder.stroke();
    c = '';
    if (p3 === 'motor') {
      c = 'M';
    } else if (p3 === 'elHyd') {
      c = 'E/H';
    }
    builder.setFontStyle(1);
    builder.setFontFamily('Helvetica');
    builder.setFontSize(Number.parseFloat(String(0.4 * Math.min(p1, p2))) || 0);
    builder.text(0.5 * p1, 0.25 * p2, 0, 0, c, 'center', 'middle', 0, 0, 0);
  }

  private render_drawSpringAct(builder: RenderContext['builder'], p1: any, p2: any): void {
    if (!builder) return;
    builder.begin();
    builder.moveTo(0.5 * p1, 0);
    builder.lineTo(0.5 * p1, p2);
    builder.moveTo(0.32 * p1, 0.16 * p2);
    builder.lineTo(0.68 * p1, 0.08 * p2);
    builder.moveTo(0.21 * p1, 0.32 * p2);
    builder.lineTo(0.79 * p1, 0.2 * p2);
    builder.moveTo(0.1 * p1, 0.52 * p2);
    builder.lineTo(0.9 * p1, 0.36 * p2);
    builder.moveTo(0, 0.72 * p2);
    builder.lineTo(p1, 0.5 * p2);
    builder.stroke();
  }

  private render_drawSolenoidManResetAct(
    builder: RenderContext['builder'],
    p1: any,
    p2: any
  ): void {
    if (!builder) return;
    builder.rect(0, 0, 0.61 * p1, 0.46 * p2);
    builder.fillAndStroke();
    builder.begin();
    builder.moveTo(0.56 * p1, 0.6 * p2);
    builder.lineTo(0.78 * p1, 0.5 * p2);
    builder.lineTo(p1, 0.6 * p2);
    builder.lineTo(0.78 * p1, 0.7 * p2);
    builder.close();
    builder.fillAndStroke();
    builder.begin();
    builder.moveTo(0.305 * p1, 0.46 * p2);
    builder.lineTo(0.305 * p1, p2);
    builder.moveTo(0.305 * p1, 0.6 * p2);
    builder.lineTo(0.56 * p1, 0.6 * p2);
    builder.stroke();
    builder.setFontStyle(1);
    builder.setFontFamily('Helvetica');
    builder.setFontSize(Number.parseFloat(String(0.4 * Math.min(p1, p2))) || 0);
    builder.text(0.305 * p1, 0.23 * p2, 0, 0, 'S', 'center', 'middle', 0, 0, 0);
    builder.setFontStyle(0);
    builder.setFontSize(Number.parseFloat(String(0.15 * Math.min(p1, p2))) || 0);
    builder.text(0.78 * p1, 0.6 * p2, 0, 0, 'R', 'center', 'middle', 0, 0, 0);
  }

  private render_drawSingActingActBg(builder: RenderContext['builder'], p1: any, p2: any): void {
    if (!builder) return;
    builder.rect(0, 0, 0.46 * p1, 0.46 * p2);
    builder.fillAndStroke();
    builder.begin();
    builder.moveTo(0.23 * p1, 0.46 * p2);
    builder.lineTo(0.23 * p1, p2);
    builder.moveTo(0.46 * p1, 0.23 * p2);
    builder.lineTo(p1, 0.23 * p2);
    builder.moveTo(0.77 * p1, 0.15 * p2);
    builder.lineTo(0.69 * p1, 0.31 * p2);
    builder.moveTo(0.82 * p1, 0.15 * p2);
    builder.lineTo(0.74 * p1, 0.31 * p2);
    builder.stroke();
  }

  private render_drawDblActingActBg(builder: RenderContext['builder'], p1: any, p2: any): void {
    if (!builder) return;
    builder.rect(0, 0, 0.46 * p1, 0.46 * p2);
    builder.fillAndStroke();
    builder.begin();
    builder.moveTo(0.23 * p1, 0.46 * p2);
    builder.lineTo(0.23 * p1, p2);
    builder.moveTo(0.46 * p1, 0.115 * p2);
    builder.lineTo(p1, 0.115 * p2);
    builder.moveTo(0.77 * p1, 0.035 * p2);
    builder.lineTo(0.69 * p1, 0.195 * p2);
    builder.moveTo(0.82 * p1, 0.035 * p2);
    builder.lineTo(0.74 * p1, 0.195 * p2);
    builder.moveTo(0.46 * p1, 0.345 * p2);
    builder.lineTo(p1, 0.345 * p2);
    builder.moveTo(0.77 * p1, 0.265 * p2);
    builder.lineTo(0.69 * p1, 0.425 * p2);
    builder.moveTo(0.82 * p1, 0.265 * p2);
    builder.lineTo(0.74 * p1, 0.425 * p2);
    builder.stroke();
  }

  private render_drawPilotCylinderActBg(builder: RenderContext['builder'], p1: any, p2: any): void {
    if (!builder) return;
    builder.rect(0, 0, 0.46 * p1, 0.46 * p2);
    builder.fillAndStroke();
    builder.begin();
    builder.moveTo(0.23 * p1, 0.46 * p2);
    builder.lineTo(0.23 * p1, p2);
    builder.moveTo(0.46 * p1, 0.23 * p2);
    builder.lineTo(0.77 * p1, 0.23 * p2);
    builder.stroke();
    builder.rect(0.77 * p1, 0.115 * p2, 0.23 * p1, 0.23 * p2);
    builder.fillAndStroke();
    builder.setFontStyle(0);
    builder.setFontFamily('Helvetica');
    builder.setFontSize(Number.parseFloat(String(0.15 * Math.min(p1, p2))) || 0);
    builder.text(0.885 * p1, 0.23 * p2, 0, 0, 'P', 'center', 'middle', 0, 0, 0);
  }

  private render_drawAngleBlowdownAct(builder: RenderContext['builder'], p1: any, p2: any): void {
    if (!builder) return;
    builder.begin();
    builder.moveTo(0.34 * p1, 0);
    builder.lineTo(p1, 0.405 * p2);
    builder.moveTo(0, p2);
    builder.lineTo(0.665 * p1, 0.205 * p2);
    builder.stroke();
  }

  private render_isSquareVariant(p1: any): any {
    return p1 === 'pilot' ||
      p1 === 'solenoid' ||
      p1 === 'powered' ||
      p1 === 'digital' ||
      p1 === 'weight' ||
      p1 === 'key'
      ? !0
      : !1;
  }

  private render_drawGateValve(
    builder: RenderContext['builder'],
    p1: any,
    p2: any,
    p3: any,
    p4: any
  ): void {
    if (!builder) return;
    let f;
    let g;
    let h;
    f = this.getStyleValue(this.renderCtx.style, 'defState', 'open');
    g = this.getStyleValue(this.renderCtx.style, 'fillColor', '#ffffff');
    h = this.getStyleValue(this.renderCtx.style, 'strokeColor', '#000000');
    builder.translate(p1, p2);
    builder.begin();
    builder.moveTo(0, 0);
    builder.lineTo(0.5 * p3, 0.5 * p4);
    builder.lineTo(0, p4);
    builder.close();
    builder.moveTo(p3, 0);
    builder.lineTo(0.5 * p3, 0.5 * p4);
    builder.lineTo(p3, p4);
    builder.close();
    if (f === 'closed') {
      builder.setFillColor(h as string);
      builder.fillAndStroke();
      builder.setFillColor(g as string);
    } else {
      builder.fillAndStroke();
    }
    builder.translate(-p1, -p2);
  }

  private render_drawPlug(
    builder: RenderContext['builder'],
    p1: any,
    p2: any,
    p3: any,
    p4: any
  ): void {
    if (!builder) return;
    builder.translate(p1, p2);
    builder.begin();
    builder.moveTo(0, 0.5 * p4);
    builder.lineTo(0.5 * p3, 0);
    builder.lineTo(p3, 0.5 * p4);
    builder.lineTo(0.5 * p3, p4);
    builder.close();
    builder.fillAndStroke();
    builder.translate(-p1, -p2);
  }

  private render_drawNeedle(
    builder: RenderContext['builder'],
    p1: any,
    p2: any,
    p3: any,
    p4: any
  ): void {
    if (!builder) return;
    let f;
    let g;
    f = this.getStyleValue(this.renderCtx.style, 'fillColor', '#ffffff');
    g = this.getStyleValue(this.renderCtx.style, 'strokeColor', '#000000');
    builder.translate(p1, p2);
    builder.begin();
    builder.moveTo(0, 0);
    builder.lineTo(p3, 0);
    builder.lineTo(0.5 * p3, p4);
    builder.close();
    builder.setFillColor(g as string);
    builder.fillAndStroke();
    builder.setFillColor(f as string);
    builder.translate(-p1, -p2);
  }

  private render_drawDrain(
    builder: RenderContext['builder'],
    p1: any,
    p2: any,
    p3: any,
    p4: any
  ): void {
    if (!builder) return;
    let f;
    let g;
    f = this.getStyleValue(this.renderCtx.style, 'fillColor', '#ffffff');
    g = this.getStyleValue(this.renderCtx.style, 'strokeColor', '#000000');
    builder.translate(p1, p2);
    builder.begin();
    builder.moveTo(0.5 * p3, 0);
    builder.lineTo(0.5 * p3, 0.96 * p4);
    builder.stroke();
    builder.begin();
    builder.moveTo(0, 0.9 * p4);
    builder.lineTo(p3, 0.9 * p4);
    builder.lineTo(0.5 * p3, p4);
    builder.close();
    builder.setFillColor(g as string);
    builder.fillAndStroke();
    builder.setFillColor(f as string);
    builder.translate(-p1, -p2);
  }

  private render_drawAngleValve(
    builder: RenderContext['builder'],
    p1: any,
    p2: any,
    p3: any,
    p4: any
  ): void {
    if (!builder) return;
    builder.translate(p1, p2);
    builder.begin();
    builder.moveTo(0.375 * p3, 0.375 * p4);
    builder.lineTo(p3, 0);
    builder.lineTo(p3, 0.75 * p4);
    builder.close();
    builder.moveTo(0.375 * p3, 0.375 * p4);
    builder.lineTo(0.75 * p3, p4);
    builder.lineTo(0, p4);
    builder.close();
    builder.fillAndStroke();
    builder.translate(-p1, -p2);
  }

  private render_drawAngleGlobeValveBg(
    builder: RenderContext['builder'],
    p1: any,
    p2: any,
    p3: any,
    p4: any
  ): void {
    if (!builder) return;
    builder.translate(p1, p2);
    builder.ellipse(0.175 * p3, 0.175 * p4, 0.4 * p3, 0.4 * p4);
    builder.fillAndStroke();
    builder.begin();
    builder.moveTo(0.375 * p3, 0.375 * p4);
    builder.lineTo(p3, 0);
    builder.lineTo(p3, 0.75 * p4);
    builder.close();
    builder.moveTo(0.375 * p3, 0.375 * p4);
    builder.lineTo(0.75 * p3, p4);
    builder.lineTo(0, p4);
    builder.close();
    builder.fillAndStroke();
    builder.translate(-p1, -p2);
  }

  private render_drawThreeWayValve(
    builder: RenderContext['builder'],
    p1: any,
    p2: any,
    p3: any,
    p4: any
  ): void {
    if (!builder) return;
    builder.translate(p1, p2);
    builder.begin();
    builder.moveTo(0, 0);
    builder.lineTo(0.5 * p3, 0.375 * p4);
    builder.lineTo(0, 0.75 * p4);
    builder.close();
    builder.moveTo(p3, 0);
    builder.lineTo(0.5 * p3, 0.375 * p4);
    builder.lineTo(p3, 0.75 * p4);
    builder.close();
    builder.moveTo(0.5 * p3, 0.375 * p4);
    builder.lineTo(0.8 * p3, p4);
    builder.lineTo(0.2 * p3, p4);
    builder.close();
    builder.fillAndStroke();
    builder.translate(-p1, -p2);
  }

  private render_drawAngleBlowdownValve(
    builder: RenderContext['builder'],
    p1: any,
    p2: any,
    p3: any,
    p4: any
  ): void {
    if (!builder) return;
  }

  private render_drawBalDiaphActFg(builder: RenderContext['builder'], p1: any, p2: any): void {
    if (!builder) return;
    builder.begin();
    builder.moveTo(0, 0.15 * p2);
    builder.lineTo(p1, 0.15 * p2);
    builder.stroke();
  }

  private render_drawActingActFg(builder: RenderContext['builder'], p1: any, p2: any): void {
    if (!builder) return;
    builder.begin();
    builder.moveTo(0.23 * p1, 0.23 * p2);
    builder.lineTo(0.23 * p1, 0.46 * p2);
    builder.moveTo(0, 0.23 * p2);
    builder.lineTo(0.46 * p1, 0.23 * p2);
    builder.stroke();
  }
}
