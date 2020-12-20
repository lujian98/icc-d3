export interface IccD3AxisOptions {
  axisLabel?: string;
  axisLabelDistance?: number;
  position?: 'top' | 'bottom' | 'left' | 'right';
  textAnchor?: 'middle' | 'start' | 'end';
  rotate?: number;
  fontSize?: number;
  unit?: string;
  // tickFormat?: Function;

  // showMaxMin?: boolean;
}

export const DEFAULT_D3XAXIS_OPTIONS: IccD3AxisOptions = {
  axisLabelDistance: 30,
  position: 'bottom',
  textAnchor: 'middle',
  rotate: 0
};

export const DEFAULT_D3YAXIS_OPTIONS: IccD3AxisOptions = {
  axisLabelDistance: -30,
  position: 'bottom',
  textAnchor: 'middle',
  rotate: -90
};


/*

  xAxis: {
    axisLabelDistance: 30,
    position: 'bottom',
    textAnchor: 'middle',
    rotate: 0
  }

axisLabel: ~ -,
dispatch: {...} + ~ -,
axisLabelDistance: ~ -,
staggerLabels: ~ -,
rotateLabels: ~ -,
rotateYLabel: ~ -,
showMaxMin: ~ -,
height: ~ -,
ticks: ~ -,
width: ~ -,
fontSize: ~ -,
margin: {...} + ~ -,
duration: ~ -,
scale: ~ -,
orient: ~ -,
tickValues: ~ -,
tickSubdivide: ~ -,
tickSize: ~ -,
tickPadding: ~ -,
tickFormat: ~ -,
domain: [...] + ~ -,
range: [...] + ~ -
*/
