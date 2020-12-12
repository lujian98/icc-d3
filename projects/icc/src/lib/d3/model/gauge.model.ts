import { IccD3Options } from './options.model';
import { IccD3PieOptions, } from './pie.model';

export interface IccD3RadialGaugeOptions extends IccD3PieOptions {
  range?: any[];
  majorGraduations?: number;
  minorGraduations?: number;
  majorGraduationLenght?: number;
  minorGraduationLenght?: number;
  majorGraduationMarginTop?: number;
  majorGraduationDecimals?: number;
  majorGraduationTextSize?: number;
  valueUnit?: string;
  valueNullColor?: string;
  valueOffsetY?: number;
  valueDecimals?: number;
  valueTextSize?: number;
  textVerticalPadding?: number;
  textHorizontalPadding?: number;
  needleEndRadius?: number;
  needleCenterRadius?: number;
}

export const DEFAULT_RADIAL_GAUGE_OPTIONS: IccD3Options = {
  y0: (d) => d.range,
  axisEnabled: false,
  radialGauge: {
    range: [],
    startAngle: Math.PI * -2 / 3,
    endAngle: Math.PI * 2 / 3,
    donut: 0.8,
    centerOffsetX: 0,
    centerOffsetY: 30 / 150,
    majorGraduations: 8,
    minorGraduations: 10,
    majorGraduationDecimals: 1,
    majorGraduationLenght: 16 / 150,
    minorGraduationLenght: 10 / 150,
    majorGraduationMarginTop: 7 / 150,
    majorGraduationTextSize: 7 / 150,
    valueUnit: '',
    valueNullColor: 'gray',
    valueOffsetY: 50,
    valueDecimals: 2,
    valueTextSize: 7 / 150,
    textVerticalPadding: 5,
    textHorizontalPadding: 5,
    needleEndRadius: 2.5 / 150,
    needleCenterRadius: 6 / 150
  },
  popover: {
    valueFormatter: null,
  },
  legend: {
    enabled: false,
  },
  zoom: {
    enabled: false
  }
};
