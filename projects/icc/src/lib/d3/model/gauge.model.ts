import { IccD3Options } from './options.model';
import { IccD3PieOptions,  } from './pie.model';

export interface IccD3RadialGaugeOptions extends IccD3PieOptions {
  majorGraduations?: number;
  minorGraduations?: number;
}

export const DEFAULT_RADIAL_GAUGE_OPTIONS: IccD3Options = {
  radialGauge: {
    startAngle: Math.PI * -2 / 3,
    endAngle: Math.PI * 2 / 3,
    donut: 0.8,
    majorGraduations: 6,
    minorGraduations: 10
  },
  zoom: {
    enabled: false
  }
};
