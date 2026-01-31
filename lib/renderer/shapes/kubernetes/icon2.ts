// @ts-nocheck
import type { RenderContext, ShapeAttrs } from '../../../renderer.ts';
import { BaseShapeHandler } from '../../shape-registry.ts';

export class KubernetesIcon2Handler extends BaseShapeHandler {
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
      getStencilSvg,
      renderStencilShape,
    } = this.renderCtx;
    if (!builder || !currentGroup) return;
    if (width <= 0 || height <= 0) return;

    builder.setCanvasRoot(currentGroup);
    builder.save();
    applyShapeAttrsToBuilder(builder, attrs);
    let d = x;

    let f;
    let g;
    let h;
    let k;
    f = this.getStyleValue(style, 'prIcon', '');
    g = this.getStyleValue(style, 'fillColor', '#ffffff');
    h = this.getStyleValue(style, 'strokeColor', '#ffffff');
    k = this.getStyleValue(style, 'kubernetesLabel', 0);
    const __tx = d;
    const __ty = y;
    builder.translate(d, y);
    d = 'mxgraph.kubernetes.frame';
    builder.setFillColor(h as string);
    this.renderStencilByName(
      d,
      __tx + 0,
      __ty + 0,
      width,
      height,
      h,
      style,
      getStencilSvg,
      renderStencilShape
    );
    builder.setFillColor(g as string);
    this.renderStencilByName(
      d,
      __tx + 0.03 * width,
      __ty + 0.03 * height,
      0.94 * width,
      0.94 * height,
      g,
      style,
      getStencilSvg,
      renderStencilShape
    );
    g = 'mxgraph.kubernetes2.' + f;
    builder.setFillColor(h as string);
    builder.setFontColor(h as string);
    builder.setFontSize(Number.parseFloat(String(0.2 * Math.min(width, height))) || 0);
    d = h = Math.min(height, width);
    if (1 == k) {
      h *= 0.8;
      d = 0.9 * h;
    }
    if ('api' == f) {
      this.renderStencilByName(
        g,
        __tx + (0.5 * width - 0.3 * h),
        __ty + 0.2 * height,
        0.6 * h,
        0.6 * d,
        h,
        style,
        getStencilSvg,
        renderStencilShape
      );
      if (1 == k) {
        builder.text(0.5 * width, 0.75 * height, 0, 0, 'api', 'center', 'middle', 0, 0, 0);
      }
    } else if ('c_c_m' == f) {
      this.renderStencilByName(
        g,
        __tx + (0.5 * width - 0.3 * h),
        __ty + 0.2 * height,
        0.6 * h,
        0.6 * d,
        h,
        style,
        getStencilSvg,
        renderStencilShape
      );
      if (1 == k) {
        builder.text(0.5 * width, 0.75 * height, 0, 0, 'c-c-m', 'center', 'middle', 0, 0, 0);
      }
    } else if ('cm' == f) {
      this.renderStencilByName(
        g,
        __tx + (0.5 * width - 0.3 * h),
        __ty + 0.25 * height,
        0.6 * h,
        0.5 * d,
        h,
        style,
        getStencilSvg,
        renderStencilShape
      );
      if (1 == k) {
        builder.text(0.5 * width, 0.75 * height, 0, 0, 'cm', 'center', 'middle', 0, 0, 0);
      }
    } else if ('c_m' == f) {
      this.renderStencilByName(
        g,
        __tx + (0.5 * width - 0.3 * h),
        __ty + 0.2 * height,
        0.6 * h,
        0.6 * d,
        h,
        style,
        getStencilSvg,
        renderStencilShape
      );
      if (1 == k) {
        builder.text(0.5 * width, 0.75 * height, 0, 0, 'c-m', 'center', 'middle', 0, 0, 0);
      }
    } else if ('c_role' == f) {
      this.renderStencilByName(
        g,
        __tx + (0.5 * width - 0.25 * h),
        __ty + 0.2 * height,
        0.5 * h,
        0.6 * d,
        h,
        style,
        getStencilSvg,
        renderStencilShape
      );
      if (1 == k) {
        builder.text(0.5 * width, 0.75 * height, 0, 0, 'c-role', 'center', 'middle', 0, 0, 0);
      }
    } else if ('control_plane' == f) {
      this.renderStencilByName(
        g,
        __tx + (0.5 * width - 0.3 * h),
        __ty + 0.2 * height,
        0.6 * h,
        0.6 * d,
        h,
        style,
        getStencilSvg,
        renderStencilShape
      );
      if (1 == k) {
        builder.setFontSize(Number.parseFloat(String(0.12 * Math.min(width, height))) || 0);
        builder.text(
          0.5 * width,
          0.78 * height,
          0,
          0,
          'control\nplane',
          'center',
          'middle',
          0,
          0,
          0
        );
      }
    } else if ('crb' == f) {
      this.renderStencilByName(
        g,
        __tx + (0.5 * width - 0.25 * h),
        __ty + 0.3 * height,
        0.5 * h,
        0.3 * d,
        h,
        style,
        getStencilSvg,
        renderStencilShape
      );
      if (1 == k) {
        builder.text(0.5 * width, 0.75 * height, 0, 0, 'crb', 'center', 'middle', 0, 0, 0);
      }
    } else if ('crd' == f) {
      this.renderStencilByName(
        g,
        __tx + (0.5 * width - 0.25 * h),
        __ty + 0.2 * height,
        0.6 * h,
        0.6 * d,
        h,
        style,
        getStencilSvg,
        renderStencilShape
      );
      if (1 == k) {
        builder.text(0.5 * width, 0.75 * height, 0, 0, 'crd', 'center', 'middle', 0, 0, 0);
      }
    } else if ('cronjob' == f) {
      this.renderStencilByName(
        g,
        __tx + (0.5 * width - 0.3 * h),
        __ty + 0.2 * height,
        0.6 * h,
        0.6 * d,
        h,
        style,
        getStencilSvg,
        renderStencilShape
      );
      if (1 == k) {
        builder.text(0.5 * width, 0.75 * height, 0, 0, 'cronjob', 'center', 'middle', 0, 0, 0);
      }
    } else if ('deploy' == f) {
      this.renderStencilByName(
        g,
        __tx + (0.5 * width - 0.27 * h),
        __ty + 0.25 * height,
        0.6 * h,
        0.55 * d,
        h,
        style,
        getStencilSvg,
        renderStencilShape
      );
      if (1 == k) {
        builder.text(0.5 * width, 0.75 * height, 0, 0, 'deploy', 'center', 'middle', 0, 0, 0);
      }
    } else if ('ds' == f) {
      this.renderStencilByName(
        g,
        __tx + (0.5 * width - 0.3 * h),
        __ty + 0.2 * height,
        0.6 * h,
        0.6 * d,
        h,
        style,
        getStencilSvg,
        renderStencilShape
      );
      if (1 == k) {
        builder.text(0.5 * width, 0.75 * height, 0, 0, 'ds', 'center', 'middle', 0, 0, 0);
      }
    } else if ('ep' == f) {
      this.renderStencilByName(
        g,
        __tx + (0.5 * width - 0.3 * h),
        __ty + 0.2 * height,
        0.6 * h,
        0.6 * d,
        h,
        style,
        getStencilSvg,
        renderStencilShape
      );
      if (1 == k) {
        builder.text(0.5 * width, 0.75 * height, 0, 0, 'ep', 'center', 'middle', 0, 0, 0);
      }
    } else if ('etcd' == f) {
      this.renderStencilByName(
        g,
        __tx + (0.5 * width - 0.3 * h),
        __ty + 0.2 * height,
        0.6 * h,
        0.6 * d,
        h,
        style,
        getStencilSvg,
        renderStencilShape
      );
      if (1 == k) {
        builder.text(0.5 * width, 0.75 * height, 0, 0, 'etcd', 'center', 'middle', 0, 0, 0);
      }
    } else if ('group' == f) {
      this.renderStencilByName(
        g,
        __tx + (0.5 * width - 0.3 * h),
        __ty + 0.2 * height,
        0.6 * h,
        0.6 * d,
        h,
        style,
        getStencilSvg,
        renderStencilShape
      );
      if (1 == k) {
        builder.text(0.5 * width, 0.75 * height, 0, 0, 'group', 'center', 'middle', 0, 0, 0);
      }
    } else if ('hpa' == f) {
      this.renderStencilByName(
        g,
        __tx + (0.5 * width - 0.4 * h),
        __ty + 0.1 * height,
        0.8 * h,
        0.8 * d,
        h,
        style,
        getStencilSvg,
        renderStencilShape
      );
      if (1 == k) {
        builder.text(0.5 * width, 0.75 * height, 0, 0, 'hpa', 'center', 'middle', 0, 0, 0);
      }
    } else if ('ing' == f) {
      this.renderStencilByName(
        g,
        __tx + (0.5 * width - 0.3 * h),
        __ty + 0.2 * height,
        0.6 * h,
        0.6 * d,
        h,
        style,
        getStencilSvg,
        renderStencilShape
      );
      if (1 == k) {
        builder.text(0.5 * width, 0.75 * height, 0, 0, 'ing', 'center', 'middle', 0, 0, 0);
      }
    } else if ('job' == f) {
      this.renderStencilByName(
        g,
        __tx + (0.5 * width - 0.3 * h),
        __ty + 0.2 * height,
        0.6 * h,
        0.6 * d,
        h,
        style,
        getStencilSvg,
        renderStencilShape
      );
      if (1 == k) {
        builder.text(0.5 * width, 0.75 * height, 0, 0, 'job', 'center', 'middle', 0, 0, 0);
      }
    } else if ('k_proxy' == f) {
      this.renderStencilByName(
        g,
        __tx + (0.5 * width - 0.3 * h),
        __ty + 0.2 * height,
        0.6 * h,
        0.6 * d,
        h,
        style,
        getStencilSvg,
        renderStencilShape
      );
      if (1 == k) {
        builder.text(0.5 * width, 0.75 * height, 0, 0, 'k-proxy', 'center', 'middle', 0, 0, 0);
      }
    } else if ('kubelet' == f) {
      this.renderStencilByName(
        g,
        __tx + (0.5 * width - 0.3 * h),
        __ty + 0.2 * height,
        0.6 * h,
        0.6 * d,
        h,
        style,
        getStencilSvg,
        renderStencilShape
      );
      if (1 == k) {
        builder.text(0.5 * width, 0.75 * height, 0, 0, 'kubelet', 'center', 'middle', 0, 0, 0);
      }
    } else if ('limits' == f) {
      this.renderStencilByName(
        g,
        __tx + (0.5 * width - 0.3 * h),
        __ty + 0.2 * height,
        0.6 * h,
        0.6 * d,
        h,
        style,
        getStencilSvg,
        renderStencilShape
      );
      if (1 == k) {
        builder.text(0.5 * width, 0.75 * height, 0, 0, 'limits', 'center', 'middle', 0, 0, 0);
      }
    } else if ('netpol' == f) {
      this.renderStencilByName(
        g,
        __tx + (0.5 * width - 0.3 * h),
        __ty + 0.2 * height,
        0.6 * h,
        0.6 * d,
        h,
        style,
        getStencilSvg,
        renderStencilShape
      );
      if (1 == k) {
        builder.text(0.5 * width, 0.75 * height, 0, 0, 'netpol', 'center', 'middle', 0, 0, 0);
      }
    } else if ('node' == f) {
      this.renderStencilByName(
        g,
        __tx + (0.5 * width - 0.3 * h),
        __ty + 0.2 * height,
        0.6 * h,
        0.6 * d,
        h,
        style,
        getStencilSvg,
        renderStencilShape
      );
      if (1 == k) {
        builder.text(0.5 * width, 0.75 * height, 0, 0, 'node', 'center', 'middle', 0, 0, 0);
      }
    } else if ('ns' == f) {
      this.renderStencilByName(
        g,
        __tx + (0.5 * width - 0.3 * h),
        __ty + 0.2 * height,
        0.6 * h,
        0.6 * d,
        h,
        style,
        getStencilSvg,
        renderStencilShape
      );
      if (1 == k) {
        builder.text(0.5 * width, 0.75 * height, 0, 0, 'ns', 'center', 'middle', 0, 0, 0);
      }
    } else if ('pod' == f) {
      this.renderStencilByName(
        g,
        __tx + (0.5 * width - 0.3 * h),
        __ty + 0.2 * height,
        0.6 * h,
        0.6 * d,
        h,
        style,
        getStencilSvg,
        renderStencilShape
      );
      if (1 == k) {
        builder.text(0.5 * width, 0.75 * height, 0, 0, 'pod', 'center', 'middle', 0, 0, 0);
      }
    } else if ('psp' == f) {
      this.renderStencilByName(
        g,
        __tx + (0.5 * width - 0.3 * h),
        __ty + 0.2 * height,
        0.6 * h,
        0.6 * d,
        h,
        style,
        getStencilSvg,
        renderStencilShape
      );
      if (1 == k) {
        builder.text(0.5 * width, 0.75 * height, 0, 0, 'psp', 'center', 'middle', 0, 0, 0);
      }
    } else if ('pv' == f) {
      this.renderStencilByName(
        g,
        __tx + (0.5 * width - 0.3 * h),
        __ty + 0.2 * height,
        0.6 * h,
        0.6 * d,
        h,
        style,
        getStencilSvg,
        renderStencilShape
      );
      if (1 == k) {
        builder.text(0.5 * width, 0.75 * height, 0, 0, 'pv', 'center', 'middle', 0, 0, 0);
      }
    } else if ('pvc' == f) {
      this.renderStencilByName(
        g,
        __tx + (0.5 * width - 0.3 * h),
        __ty + 0.2 * height,
        0.6 * h,
        0.6 * d,
        h,
        style,
        getStencilSvg,
        renderStencilShape
      );
      if (1 == k) {
        builder.text(0.5 * width, 0.75 * height, 0, 0, 'pvc', 'center', 'middle', 0, 0, 0);
      }
    } else if ('quota' == f) {
      this.renderStencilByName(
        g,
        __tx + (0.5 * width - 0.3 * h),
        __ty + 0.2 * height,
        0.6 * h,
        0.6 * d,
        h,
        style,
        getStencilSvg,
        renderStencilShape
      );
      if (1 == k) {
        builder.text(0.5 * width, 0.75 * height, 0, 0, 'quota', 'center', 'middle', 0, 0, 0);
      }
    } else if ('rb' == f) {
      this.renderStencilByName(
        g,
        __tx + (0.5 * width - 0.3 * h),
        __ty + 0.2 * height,
        0.6 * h,
        0.6 * d,
        h,
        style,
        getStencilSvg,
        renderStencilShape
      );
      if (1 == k) {
        builder.text(0.5 * width, 0.75 * height, 0, 0, 'rb', 'center', 'middle', 0, 0, 0);
      }
    } else if ('role' == f) {
      this.renderStencilByName(
        g,
        __tx + (0.5 * width - 0.3 * h),
        __ty + 0.2 * height,
        0.6 * h,
        0.6 * d,
        h,
        style,
        getStencilSvg,
        renderStencilShape
      );
      if (1 == k) {
        builder.text(0.5 * width, 0.75 * height, 0, 0, 'role', 'center', 'middle', 0, 0, 0);
      }
    } else if ('rs' == f) {
      this.renderStencilByName(
        g,
        __tx + (0.5 * width - 0.3 * h),
        __ty + 0.2 * height,
        0.6 * h,
        0.6 * d,
        h,
        style,
        getStencilSvg,
        renderStencilShape
      );
      if (1 == k) {
        builder.text(0.5 * width, 0.75 * height, 0, 0, 'rs', 'center', 'middle', 0, 0, 0);
      }
    } else if ('sa' == f) {
      this.renderStencilByName(
        g,
        __tx + (0.5 * width - 0.3 * h),
        __ty + 0.2 * height,
        0.6 * h,
        0.6 * d,
        h,
        style,
        getStencilSvg,
        renderStencilShape
      );
      if (1 == k) {
        builder.text(0.5 * width, 0.75 * height, 0, 0, 'sa', 'center', 'middle', 0, 0, 0);
      }
    } else if ('sc' == f) {
      this.renderStencilByName(
        g,
        __tx + (0.5 * width - 0.3 * h),
        __ty + 0.2 * height,
        0.6 * h,
        0.6 * d,
        h,
        style,
        getStencilSvg,
        renderStencilShape
      );
      if (1 == k) {
        builder.text(0.5 * width, 0.75 * height, 0, 0, 'sc', 'center', 'middle', 0, 0, 0);
      }
    } else if ('sched' == f) {
      this.renderStencilByName(
        g,
        __tx + (0.5 * width - 0.3 * h),
        __ty + 0.2 * height,
        0.6 * h,
        0.6 * d,
        h,
        style,
        getStencilSvg,
        renderStencilShape
      );
      if (1 == k) {
        builder.text(0.5 * width, 0.75 * height, 0, 0, 'sched', 'center', 'middle', 0, 0, 0);
      }
    } else if ('secret' == f) {
      this.renderStencilByName(
        g,
        __tx + (0.5 * width - 0.3 * h),
        __ty + 0.2 * height,
        0.6 * h,
        0.6 * d,
        h,
        style,
        getStencilSvg,
        renderStencilShape
      );
      if (1 == k) {
        builder.text(0.5 * width, 0.75 * height, 0, 0, 'secret', 'center', 'middle', 0, 0, 0);
      }
    } else if ('sts' == f) {
      this.renderStencilByName(
        g,
        __tx + (0.5 * width - 0.3 * h),
        __ty + 0.2 * height,
        0.6 * h,
        0.6 * d,
        h,
        style,
        getStencilSvg,
        renderStencilShape
      );
      if (1 == k) {
        builder.text(0.5 * width, 0.75 * height, 0, 0, 'sts', 'center', 'middle', 0, 0, 0);
      }
    } else if ('svc' == f) {
      this.renderStencilByName(
        g,
        __tx + (0.5 * width - 0.3 * h),
        __ty + 0.2 * height,
        0.6 * h,
        0.6 * d,
        h,
        style,
        getStencilSvg,
        renderStencilShape
      );
      if (1 == k) {
        builder.text(0.5 * width, 0.75 * height, 0, 0, 'svc', 'center', 'middle', 0, 0, 0);
      }
    } else if ('user' == f) {
      this.renderStencilByName(
        g,
        __tx + (0.5 * width - 0.3 * h),
        __ty + 0.2 * height,
        0.6 * h,
        0.6 * d,
        h,
        style,
        getStencilSvg,
        renderStencilShape
      );
      if (1 == k) {
        builder.text(0.5 * width, 0.75 * height, 0, 0, 'user', 'center', 'middle', 0, 0, 0);
      }
    } else if ('vol' == f) {
      this.renderStencilByName(
        g,
        __tx + (0.5 * width - 0.3 * h),
        __ty + 0.2 * height,
        0.6 * h,
        0.6 * d,
        h,
        style,
        getStencilSvg,
        renderStencilShape
      );
      if (1 == k) {
        builder.text(0.5 * width, 0.75 * height, 0, 0, 'vol', 'center', 'middle', 0, 0, 0);
      }
    } else if (null != g) {
      this.renderStencilByName(
        g,
        __tx + 0.2 * width,
        __ty + 0.2 * height,
        0.6 * width,
        0.6 * height,
        h,
        style,
        getStencilSvg,
        renderStencilShape
      );
    }
    builder.restore();
  }

  private renderStencilByName(
    name: string,
    x: number,
    y: number,
    width: number,
    height: number,
    fillColor: string | undefined,
    style: RenderContext['style'],
    getStencilSvg?: RenderContext['getStencilSvg'],
    renderStencilShape?: RenderContext['renderStencilShape']
  ): void {
    if (!getStencilSvg || !renderStencilShape) return;
    if (!name) return;
    const styleFill = this.getStyleValue(style, 'fillColor', '#ffffff') as string;
    const builderFill = this.renderCtx.builder?.getCurrentFillColor?.() ?? null;
    const rawFill = typeof fillColor === 'string' ? fillColor : undefined;
    let resolvedFill = rawFill ?? builderFill ?? styleFill;
    if (rawFill && builderFill && rawFill === styleFill && builderFill !== styleFill) {
      resolvedFill = builderFill;
    }
    if (
      (style.shape as string | undefined) === 'mxgraph.gcp2.hexIcon' &&
      rawFill === '#FCC64D' &&
      builderFill
    ) {
      resolvedFill = builderFill;
    }
    const shapeName = style.shape as string | undefined;
    const isGcpHexStencil =
      shapeName === 'mxgraph.gcp2.hexIcon' && String(name).startsWith('mxgraph.gcp2.');
    const aspect = isGcpHexStencil ? (style.aspect as any) : 'fixed';
    const stencilStyle = {
      shape: String(name),
      fillColor: resolvedFill,
      strokeColor: 'none',
      ...(aspect ? { aspect } : {}),
    } as any;
    const svg = getStencilSvg(stencilStyle);
    if (!svg) return;
    renderStencilShape({ x, y, width, height, style: stencilStyle }, svg);
  }
}
