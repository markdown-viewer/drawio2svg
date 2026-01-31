// @ts-nocheck
import type { RenderContext, ShapeAttrs } from '../../../renderer.ts';
import { BaseShapeHandler } from '../../shape-registry.ts';

export class IosIPadHandler extends BaseShapeHandler {
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

    builder.translate(x, y);
    this.renderBackground(
      builder,
      x,
      y,
      width,
      height,
      style,
      getStencilSvg,
      renderStencilShape,
      25
    );
    builder.setShadow(!1);
    this.renderForeground(
      builder,
      x,
      y,
      width,
      height,
      style,
      getStencilSvg,
      renderStencilShape,
      25
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
    getStencilSvg?: RenderContext['getStencilSvg'],
    renderStencilShape?: RenderContext['renderStencilShape'],
    extra1?: any
  ): void {
    if (!builder) return;
    builder.setFillColor('#000000' as string);
    builder.setStrokeColor('#000000' as string);
    builder.roundrect(0, 0, width, height, extra1, extra1);
    builder.fillAndStroke();
  }

  private renderForeground(
    builder: RenderContext['builder'],
    x: number,
    y: number,
    width: number,
    height: number,
    style: RenderContext['style'],
    getStencilSvg?: RenderContext['getStencilSvg'],
    renderStencilShape?: RenderContext['renderStencilShape'],
    extra1?: any
  ): void {
    if (!builder) return;
    let g;
    builder.setStrokeWidth(1.5);
    builder.setStrokeColor('#999999' as string);
    builder.begin();
    builder.setStrokeColor('none' as string);
    builder.setFillColor('#808080' as string);
    builder.setGradient(
      '#808080',
      '#000000',
      0.325 * width,
      0,
      0.675 * width,
      0.5 * height,
      'south',
      1,
      1
    );
    builder.moveTo(0.325 * width, 0);
    builder.lineTo(width - extra1, 0);
    builder.arcTo(extra1, extra1, 0, 0, 1, width, extra1);
    builder.lineTo(width, 0.5 * height);
    builder.lineTo(0.7 * width, 0.5 * height);
    builder.close();
    builder.fillAndStroke();
    builder.begin();
    builder.setFillColor('#1f2923' as string);
    builder.setStrokeColor('#18211b' as string);
    builder.setStrokeWidth(1);
    x = this.getStyleValue(style, 'fillColor', '');
    y = this.getStyleValue(style, 'bgStyle', 'bgGreen');
    builder.setStrokeWidth(1);
    if (y === 'bgWhite') {
      (builder.setFillColor('#ffffff'),
        builder.rect(0.0928 * width, 0.08 * height, 0.8144 * width, 0.816 * height),
        builder.fill());
    } else if (y === 'bgGreen') {
      (builder.setFillColor('#1f2923'),
        builder.rect(0.0928 * width, 0.08 * height, 0.8144 * width, 0.816 * height),
        builder.fill());
    } else if (y === 'bgGray') {
      (builder.setFillColor('#dddddd'),
        builder.rect(0.0928 * width, 0.08 * height, 0.8144 * width, 0.816 * height),
        builder.fill());
    } else if (y === 'bgFlat') {
      (builder.setFillColor(x),
        builder.rect(0.0928 * width, 0.08 * height, 0.8144 * width, 0.816 * height),
        builder.fill());
    } else if (y === 'bgStriped') {
      x = width;
      y = height;
      builder.translate(0.0928 * width, 0.08 * height);
      width *= 0.8144;
      height *= 0.816;
      builder.setFillColor('#5D7585' as string);
      builder.rect(0, 0, width, height);
      builder.fillAndStroke();
      builder.setStrokeColor('#657E8F' as string);
      g = 7;
      for (builder.begin(); g < width; ) {
        (builder.moveTo(g, 0), builder.lineTo(g, height), (g += 7));
      }
      builder.stroke();
      builder.setStrokeColor('#18211b' as string);
      builder.begin();
      builder.rect(0, 0, width, height);
      builder.stroke();
      width = x;
      height = y;
      builder.translate(0.0928 * -width, 0.08 * -height);
    } else if (y === 'bgMap') {
      x = width;
      y = height;
      builder.translate(0.0928 * width, 0.08 * height);
      width *= 0.8144;
      height *= 0.816;
      builder.setFillColor('#ffffff' as string);
      builder.rect(0, 0, width, height);
      builder.fillAndStroke();
      builder.setFillColor('#96D1FF' as string);
      builder.setStrokeColor('#008cff' as string);
      builder.setStrokeWidth(0.5);
      builder.begin();
      builder.moveTo(0, 0);
      builder.lineTo(0.1171 * width, 0);
      builder.lineTo(0.1136 * width, 0.0438 * height);
      builder.lineTo(0.0993 * width, 0.054 * height);
      builder.lineTo(0, 0.0446 * height);
      builder.close();
      builder.fillAndStroke();
      builder.begin();
      builder.moveTo(0.1993 * width, 0);
      builder.lineTo(0.1914 * width, 0.03884 * height);
      builder.lineTo(0.1536 * width, 0.0362 * height);
      builder.lineTo(0.1586 * width, 0);
      builder.close();
      builder.fillAndStroke();
      builder.begin();
      builder.moveTo(0.24 * width, 0);
      builder.lineTo(0.2257 * width, 0.054 * height);
      builder.lineTo(0.2414 * width, 0.0674 * height);
      builder.lineTo(0.4707 * width, 0.0835 * height);
      builder.lineTo(0.5264 * width, 0.0906 * height);
      builder.lineTo(0.6429 * width, 0.0929 * height);
      builder.arcTo(0.0857 * width, 0.0536 * height, 0, 0, 0, 0.7193 * width, 0.0621 * height);
      builder.arcTo(0.48 * width, 0.2143 * height, 0, 0, 0, 0.7286 * width, 0);
      builder.close();
      builder.fillAndStroke();
      builder.begin();
      builder.moveTo(0.8 * width, 0);
      builder.lineTo(0.7886 * width, 0.04554 * height);
      builder.arcTo(0.0857 * width, 0.0536 * height, 0, 0, 0, 0.8164 * width, 0.0875 * height);
      builder.arcTo(0.1429 * width, 0.0893 * height, 0, 0, 0, 0.88 * width, 0.1036 * height);
      builder.lineTo(width, 0.1112 * height);
      builder.lineTo(width, 0);
      builder.close();
      builder.fillAndStroke();
      builder.begin();
      builder.moveTo(0, 0.0933 * height);
      builder.lineTo(0.08 * width, 0.1036 * height);
      builder.lineTo(0.1021 * width, 0.1246 * height);
      builder.lineTo(0.1007 * width, 0.1768 * height);
      builder.lineTo(0.0471 * width, 0.2241 * height);
      builder.lineTo(0, 0.2527 * height);
      builder.close();
      builder.fillAndStroke();
      builder.ellipse(0.1214 * width, 0.0603 * height, 0.0843 * width, 0.0576 * height);
      builder.fillAndStroke();
      builder.begin();
      builder.moveTo(0.1293 * width, 0.1924 * height);
      builder.lineTo(0.1729 * width, 0.142 * height);
      builder.lineTo(0.1407 * width, 0.1411 * height);
      builder.lineTo(0.14 * width, 0.1777 * height);
      builder.close();
      builder.fillAndStroke();
      builder.begin();
      builder.moveTo(0.4586 * width, 0.1241 * height);
      builder.lineTo(0.455 * width, 0.1835 * height);
      builder.lineTo(0.3893 * width, 0.2246 * height);
      builder.lineTo(0.2171 * width, 0.1362 * height);
      builder.lineTo(0.2171 * width, 0.1308 * height);
      builder.lineTo(0.2293 * width, 0.1214 * height);
      builder.lineTo(0.2857 * width, 0.1174 * height);
      builder.close();
      builder.fillAndStroke();
      builder.begin();
      builder.moveTo(0.5079 * width, 0.1134 * height);
      builder.lineTo(0.7307 * width, 0.1223 * height);
      builder.lineTo(0.7279 * width, 0.1625 * height);
      builder.lineTo(0.715 * width, 0.1772 * height);
      builder.lineTo(0.6929 * width, 0.1688 * height);
      builder.lineTo(0.625 * width, 0.1795 * height);
      builder.lineTo(0.4779 * width, 0.2835 * height);
      builder.lineTo(0.395 * width, 0.2299 * height);
      builder.lineTo(0.4657 * width, 0.1826 * height);
      builder.lineTo(0.4707 * width, 0.1223 * height);
      builder.close();
      builder.fillAndStroke();
      builder.begin();
      builder.moveTo(width, 0.1362 * height);
      builder.lineTo(0.7643 * width, 0.1237 * height);
      builder.lineTo(0.7543 * width, 0.1562 * height);
      builder.lineTo(0.7643 * width, 0.1585 * height);
      builder.lineTo(0.9186 * width, 0.2366 * height);
      builder.lineTo(width, 0.1732 * height);
      builder.close();
      builder.fillAndStroke();
      builder.begin();
      builder.moveTo(0.2079 * width, 0.1545 * height);
      builder.lineTo(0.3886 * width, 0.2536 * height);
      builder.lineTo(0.3414 * width, 0.2933 * height);
      builder.lineTo(0.1743 * width, 0.1969 * height);
      builder.close();
      builder.fillAndStroke();
      builder.begin();
      builder.moveTo(0.1579 * width, 0.2134 * height);
      builder.lineTo(0.3221 * width, 0.3067 * height);
      builder.lineTo(0.2957 * width, 0.3237 * height);
      builder.lineTo(0.1157 * width, 0.2424 * height);
      builder.close();
      builder.fillAndStroke();
      builder.begin();
      builder.moveTo(0.405 * width, 0.2656 * height);
      builder.lineTo(0.31 * width, 0.3353 * height);
      builder.lineTo(0.3693 * width, 0.3661 * height);
      builder.lineTo(0.4571 * width, 0.2982 * height);
      builder.close();
      builder.fillAndStroke();
      builder.begin();
      builder.moveTo(0.7121 * width, 0.1848 * height);
      builder.lineTo(0.6879 * width, 0.1754 * height);
      builder.lineTo(0.6329 * width, 0.1844 * height);
      builder.lineTo(0.61 * width, 0.2018 * height);
      builder.lineTo(0.6207 * width, 0.2085 * height);
      builder.lineTo(0.4986 * width, 0.2982 * height);
      builder.lineTo(0.535 * width, 0.3237 * height);
      builder.close();
      builder.fillAndStroke();
      builder.begin();
      builder.moveTo(0.5557 * width, 0.3379 * height);
      builder.lineTo(0.7464 * width, 0.1826 * height);
      builder.lineTo(0.8036 * width, 0.2076 * height);
      builder.lineTo(0.595 * width, 0.3616 * height);
      builder.close();
      builder.fillAndStroke();
      builder.begin();
      builder.moveTo(0.8293 * width, 0.2188 * height);
      builder.lineTo(0.8979 * width, 0.2509 * height);
      builder.lineTo(0.6936 * width, 0.4125 * height);
      builder.lineTo(0.6171 * width, 0.3737 * height);
      builder.close();
      builder.fillAndStroke();
      builder.begin();
      builder.moveTo(width, 0.2138 * height);
      builder.lineTo(0.6821 * width, 0.4603 * height);
      builder.lineTo(0.815 * width, 0.5277 * height);
      builder.lineTo(width, 0.4 * height);
      builder.close();
      builder.fillAndStroke();
      builder.begin();
      builder.moveTo(0, 0.317 * height);
      builder.lineTo(0.0971 * width, 0.2554 * height);
      builder.lineTo(0.4121 * width, 0.4143 * height);
      builder.lineTo(0.3736 * width, 0.4415 * height);
      builder.lineTo(0.315 * width, 0.4076 * height);
      builder.lineTo(0.3093 * width, 0.4116 * height);
      builder.lineTo(0.3686 * width, 0.4455 * height);
      builder.lineTo(0.285 * width, 0.5045 * height);
      builder.lineTo(0.1114 * width, 0.4134 * height);
      builder.lineTo(0.025 * width, 0.4603 * height);
      builder.lineTo(0.0371 * width, 0.4723 * height);
      builder.lineTo(0.1114 * width, 0.4371 * height);
      builder.lineTo(0.2871 * width, 0.5312 * height);
      builder.lineTo(0.1929 * width, 0.6058 * height);
      builder.lineTo(0.2271 * width, 0.6705 * height);
      builder.lineTo(0.17 * width, 0.7147 * height);
      builder.lineTo(0.0314 * width, 0.6321 * height);
      builder.lineTo(0, 0.6246 * height);
      builder.close();
      builder.fillAndStroke();
      builder.begin();
      builder.moveTo(0.48 * width, 0.3121 * height);
      builder.lineTo(0.5157 * width, 0.3375 * height);
      builder.lineTo(0.4314 * width, 0.3982 * height);
      builder.lineTo(0.3929 * width, 0.3786 * height);
      builder.close();
      builder.fillAndStroke();
      builder.begin();
      builder.moveTo(0.3086 * width, 0.5179 * height);
      builder.lineTo(0.53 * width, 0.3518 * height);
      builder.lineTo(0.5757 * width, 0.3745 * height);
      builder.lineTo(0.3479 * width, 0.5411 * height);
      builder.close();
      builder.fillAndStroke();
      builder.begin();
      builder.moveTo(0.5964 * width, 0.3884 * height);
      builder.lineTo(0.6736 * width, 0.4277 * height);
      builder.lineTo(0.445 * width, 0.5991 * height);
      builder.lineTo(0.3664 * width, 0.5531 * height);
      builder.lineTo(0.5057 * width, 0.4545 * height);
      builder.lineTo(0.5507 * width, 0.4754 * height);
      builder.lineTo(0.5571 * width, 0.4723 * height);
      builder.lineTo(0.5114 * width, 0.4504 * height);
      builder.close();
      builder.fillAndStroke();
      builder.begin();
      builder.moveTo(0.4793 * width, 0.6161 * height);
      builder.lineTo(0.6771 * width, 0.4643 * height);
      builder.lineTo(0.8086 * width, 0.5326 * height);
      builder.lineTo(0.7471 * width, 0.5817 * height);
      builder.lineTo(0.7214 * width, 0.567 * height);
      builder.lineTo(0.715 * width, 0.571 * height);
      builder.lineTo(0.7421 * width, 0.5871 * height);
      builder.lineTo(0.6014 * width, 0.6933 * height);
      builder.close();
      builder.fillAndStroke();
      builder.begin();
      builder.moveTo(width, 0.4371 * height);
      builder.lineTo(0.8443 * width, 0.546 * height);
      builder.lineTo(0.9071 * width, 0.5701 * height);
      builder.lineTo(width, 0.5022 * height);
      builder.close();
      builder.fillAndStroke();
      builder.begin();
      builder.moveTo(0.8407 * width, 0.5504 * height);
      builder.lineTo(0.8993 * width, 0.5759 * height);
      builder.lineTo(0.6757 * width, 0.7416 * height);
      builder.lineTo(0.6286 * width, 0.7139 * height);
      builder.close();
      builder.fillAndStroke();
      builder.begin();
      builder.moveTo(width, 0.5321 * height);
      builder.lineTo(0.6979 * width, 0.7549 * height);
      builder.lineTo(0.7457 * width, 0.7781 * height);
      builder.lineTo(0.9814 * width, 0.6094 * height);
      builder.lineTo(width, 0.6067 * height);
      builder.close();
      builder.fillAndStroke();
      builder.begin();
      builder.moveTo(width, 0.6254 * height);
      builder.lineTo(0.7664 * width, 0.792 * height);
      builder.lineTo(0.9586 * width, 0.9062 * height);
      builder.lineTo(width, 0.8786 * height);
      builder.close();
      builder.fillAndStroke();
      builder.begin();
      builder.moveTo(0.3093 * width, 0.5464 * height);
      builder.lineTo(0.4271 * width, 0.6152 * height);
      builder.lineTo(0.245 * width, 0.7643 * height);
      builder.lineTo(0.185 * width, 0.7228 * height);
      builder.lineTo(0.2493 * width, 0.6728 * height);
      builder.lineTo(0.2214 * width, 0.6143 * height);
      builder.close();
      builder.fillAndStroke();
      builder.begin();
      builder.moveTo(0, 0.65 * height);
      builder.lineTo(0.2179 * width, 0.7826 * height);
      builder.lineTo(0.1136 * width, 0.8424 * height);
      builder.close();
      builder.fillAndStroke();
      builder.begin();
      builder.moveTo(0, 0.7272 * height);
      builder.lineTo(0.0821 * width, 0.859 * height);
      builder.lineTo(0, 0.9085 * height);
      builder.close();
      builder.fillAndStroke();
      builder.begin();
      builder.moveTo(0.4529 * width, 0.6366 * height);
      builder.lineTo(0.575 * width, 0.7143 * height);
      builder.lineTo(0.39 * width, 0.8621 * height);
      builder.lineTo(0.2657 * width, 0.7902 * height);
      builder.close();
      builder.fillAndStroke();
      builder.begin();
      builder.moveTo(0, 0.9415 * height);
      builder.lineTo(0.1036 * width, 0.8821 * height);
      builder.lineTo(0.2343 * width, 0.959 * height);
      builder.lineTo(0.1721 * width, height);
      builder.lineTo(0, height);
      builder.close();
      builder.fillAndStroke();
      builder.begin();
      builder.moveTo(0.2586 * width, 0.7951 * height);
      builder.lineTo(0.3829 * width, 0.8674 * height);
      builder.lineTo(0.2543 * width, 0.9451 * height);
      builder.lineTo(0.1279 * width, 0.8692 * height);
      builder.close();
      builder.fillAndStroke();
      builder.begin();
      builder.moveTo(0.2836 * width, 0.9639 * height);
      builder.lineTo(0.4207 * width, 0.8772 * height);
      builder.lineTo(0.605 * width, 0.7321 * height);
      builder.lineTo(0.6521 * width, 0.7634 * height);
      builder.lineTo(0.3486 * width, height);
      builder.lineTo(0.3393 * width, height);
      builder.close();
      builder.fillAndStroke();
      builder.begin();
      builder.moveTo(0.3879 * width, height);
      builder.lineTo(0.6721 * width, 0.7759 * height);
      builder.lineTo(0.7171 * width, 0.7982 * height);
      builder.lineTo(0.4564 * width, height);
      builder.close();
      builder.fillAndStroke();
      builder.begin();
      builder.moveTo(0.4986 * width, height);
      builder.lineTo(0.7386 * width, 0.8125 * height);
      builder.lineTo(0.9307 * width, 0.925 * height);
      builder.lineTo(0.8264 * width, height);
      builder.close();
      builder.fillAndStroke();
      builder.begin();
      builder.moveTo(0.8671 * width, height);
      builder.lineTo(0.9464 * width, 0.9491 * height);
      builder.lineTo(width, 0.975 * height);
      builder.lineTo(width, height);
      builder.close();
      builder.fillAndStroke();
      builder.begin();
      builder.moveTo(0.2295 * width, height);
      builder.lineTo(0.2648 * width, 0.9792 * height);
      builder.lineTo(0.2981 * width, height);
      builder.close();
      builder.fillAndStroke();
      width = x;
      height = y;
      builder.translate(0.0928 * -width, 0.08 * -height);
    }
    builder.setStrokeWidth(1);
    builder.setStrokeColor('#18211b' as string);
    builder.rect(0.0928 * width, 0.08 * height, 0.8144 * width, 0.816 * height);
    builder.stroke();
    builder.setStrokeWidth(1.5);
    builder.setAlpha(0.8);
    builder.setStrokeColor('#dddddd' as string);
    builder.begin();
    builder.moveTo(0, extra1);
    builder.arcTo(extra1, extra1, 0, 0, 1, extra1, 0);
    builder.lineTo(width - extra1, 0);
    builder.arcTo(extra1, extra1, 0, 0, 1, width, extra1);
    builder.lineTo(width, height - extra1);
    builder.arcTo(extra1, extra1, 0, 0, 1, width - extra1, height);
    builder.lineTo(extra1, height);
    builder.arcTo(extra1, extra1, 0, 0, 1, 0, height - extra1);
    builder.close();
    builder.stroke();
    extra1 = 22.5;
    builder.begin();
    builder.setStrokeColor('#666666' as string);
    builder.begin();
    builder.moveTo(2.5, 2.5 + extra1);
    builder.arcTo(extra1, extra1, 0, 0, 1, 2.5 + extra1, 2.5);
    builder.lineTo(width - extra1 - 5, 2.5);
    builder.arcTo(extra1, extra1, 0, 0, 1, width - 2.5, extra1 + 2.5);
    builder.lineTo(width - 2.5, height - extra1 - 2.5);
    builder.arcTo(extra1, extra1, 0, 0, 1, width - extra1 - 2.5, height - 2.5);
    builder.lineTo(extra1 + 2.5, height - 2.5);
    builder.arcTo(extra1, extra1, 0, 0, 1, 2.5, height - extra1 - 2.5);
    builder.close();
    builder.stroke();
    builder.setAlpha(1);
    builder.ellipse(0.4948 * width, 0.0444 * height, 0.0103 * width, 0.008 * height);
    builder.setStrokeWidth(2.5);
    builder.setStrokeColor('#000000' as string);
    builder.setFillColor('#000099' as string);
    builder.fillAndStroke();
    builder.setGradient(
      '#bbbbbb',
      '#000000',
      0.4588 * width,
      0.912 * height,
      0.0825 * width,
      0.064 * height,
      'south',
      1,
      1
    );
    builder.ellipse(0.4588 * width, 0.912 * height, 0.0825 * width, 0.064 * height);
    builder.fill();
    builder.setAlpha(0.5);
    builder.ellipse(0.4588 * width, 0.912 * height, 0.0825 * width, 0.064 * height);
    builder.stroke();
    builder.begin();
    builder.setAlpha(0.85);
    builder.setFillColor('#000000' as string);
    builder.moveTo(0.4598 * width, 0.944 * height);
    builder.arcTo(0.0402 * width, 0.0296 * height, 0, 0, 1, 0.5402 * width, 0.944 * height);
    builder.arcTo(0.0825 * width, 0.064 * height, 0, 0, 1, 0.4598 * width, 0.944 * height);
    builder.close();
    builder.fillAndStroke();
    builder.begin();
    builder.setAlpha(0.7);
    builder.setStrokeWidth(1.5);
    builder.setStrokeColor('#dddddd' as string);
    builder.roundrect(
      0.4814 * width,
      0.9296 * height,
      0.0371 * width,
      0.0288 * height,
      0.00515 * height,
      0.004 * height
    );
    builder.stroke();
  }
}
