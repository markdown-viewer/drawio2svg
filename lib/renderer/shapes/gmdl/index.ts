import type { ShapeRegistry } from '../../shape-registry.ts';
import { GmdlMarginRectHandler } from './margin-rect.ts';
import { GmdlPlayerHandler } from './player.ts';
import { GmdlProgressBarHandler } from './progress-bar.ts';
import { GmdlSlider2Handler } from './slider2.ts';
import { GmdlSliderDisabledHandler } from './slider-disabled.ts';
import { GmdlSliderDisabled2Handler } from './slider-disabled2.ts';
import { GmdlSliderDiscreteHandler } from './slider-discrete.ts';
import { GmdlSliderDiscreteDotsHandler } from './slider-discrete-dots.ts';
import { GmdlSliderFocusedHandler } from './slider-focused.ts';
import { GmdlSliderNormalHandler } from './slider-normal.ts';
import { GmdlSwitchHandler } from './switch.ts';

export function registerGmdlHandlers(registry: ShapeRegistry): void {
  registry.register('mxgraph.gmdl.marginRect', GmdlMarginRectHandler);
  registry.register('mxgraph.gmdl.player', GmdlPlayerHandler);
  registry.register('mxgraph.gmdl.progressBar', GmdlProgressBarHandler);
  registry.register('mxgraph.gmdl.slider2', GmdlSlider2Handler);
  registry.register('mxgraph.gmdl.sliderDisabled', GmdlSliderDisabledHandler);
  registry.register('mxgraph.gmdl.sliderDisabled2', GmdlSliderDisabled2Handler);
  registry.register('mxgraph.gmdl.sliderDiscrete', GmdlSliderDiscreteHandler);
  registry.register('mxgraph.gmdl.sliderDiscreteDots', GmdlSliderDiscreteDotsHandler);
  registry.register('mxgraph.gmdl.sliderFocused', GmdlSliderFocusedHandler);
  registry.register('mxgraph.gmdl.sliderNormal', GmdlSliderNormalHandler);
  registry.register('mxgraph.gmdl.switch', GmdlSwitchHandler);
}
