import * as d3Scale from 'd3-scale';
import * as d3Axis from 'd3-axis';

export type IccScaleColor = d3Scale.ScaleOrdinal<string, {}>;
export type IccScaleLinear = d3Scale.ScaleLinear<number, number>;
export type IccScaleTime = d3Scale.ScaleTime<number, number>;
export type IccScaleBand = d3Scale.ScaleBand<string>;
export type IccScale = IccScaleLinear | IccScaleTime | IccScaleBand;

export type IccScaleAxis = d3Axis.Axis<d3Axis.AxisDomain>;
