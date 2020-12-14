import { IccD3Options } from './options.model';
import { IccD3PieOptions, } from './pie.model';

export interface IccD3RadialGaugeOptions extends IccD3PieOptions {
  range?: any[];
  enableGradients?: boolean;
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
  margin: { top: 10, right: 10, bottom: 10, left: 10 },
  axisEnabled: false,
  drawColor: (d, i) => i, // use default colors or defined colors if range colors are not defined
  radialGauge: {
    range: [],
    startAngle: Math.PI * -2 / 3,
    endAngle: Math.PI * 2 / 3,
    padAngle: 0.000,
    donut: 0.8,
    enableGradients: false,
    centerOffsetX: 0,
    centerOffsetY: 0,
    majorGraduations: 8,
    minorGraduations: 10,
    majorGraduationDecimals: 1,
    majorGraduationLenght: 16 / 150,
    minorGraduationLenght: 10 / 150,
    majorGraduationMarginTop: 7 / 150,
    majorGraduationTextSize: 7 / 150,
    valueUnit: '',
    valueNullColor: 'gray',
    valueOffsetY: 20 / 150,
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
