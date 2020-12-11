import { IccD3Options } from './options.model';
import { IccD3PieOptions, } from './pie.model';

export interface IccD3RadialGaugeOptions extends IccD3PieOptions {
  lowerLimit?: number;
  upperLimit?: number;
  majorGraduations?: number;
  minorGraduations?: number;
  majorGraduationLenght?: number;
  minorGraduationLenght?: number;
  majorGraduationMarginTop?: number;
  majorGraduationDecimals?: number;
  majorGraduationTextSize?: number;
  valueUnit?: string;
  valueOffsetY?: number;
  valueDecimals?: number;
  valueTextSize?: number;
  textVerticalPadding?: number;
  textHorizontalPadding?: number;
}

export const DEFAULT_RADIAL_GAUGE_OPTIONS: IccD3Options = {
  radialGauge: {
    startAngle: Math.PI * -2 / 3,
    endAngle: Math.PI * 2 / 3,
    donut: 0.8,
    centerOffsetX: 0,
    centerOffsetY: 30 / 150,

    lowerLimit: 0,
    upperLimit: 100,
    majorGraduations: 6,
    minorGraduations: 10,
    majorGraduationDecimals: 1,
    majorGraduationLenght: 16 / 150,
    minorGraduationLenght: 10 / 150,
    majorGraduationMarginTop: 7 / 150,
    majorGraduationTextSize: 7 / 150,
    valueUnit: '',
    valueOffsetY: 50,
    valueDecimals: 2,
    valueTextSize: 7 / 150,
    textVerticalPadding: 5,
    textHorizontalPadding: 5,
  },
  zoom: {
    enabled: false
  }
};
