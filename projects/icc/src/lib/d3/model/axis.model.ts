export interface IccD3AxisOptions {
  axisLabel?: string;
  axisLabelDistance?: number;
  position?: 'top' | 'bottom' | 'left' | 'right'; // TODO not used yet
  textAnchor?: 'middle' | 'start' | 'end';
  rotate?: number;
  tickSize?: number;
  tickPadding?: number;
  enableGrid?: boolean;

  fontSize?: number; // TODO not used yet
  unit?: string; // TODO not used yet

  // tickFormat?: Function;
  // showMaxMin?: boolean;
}

export const DEFAULT_D3XAXIS_OPTIONS: IccD3AxisOptions = {
  axisLabelDistance: 30,
  position: 'bottom',
  textAnchor: 'middle',
  rotate: 0,
  tickSize: 5,
  tickPadding: 5,
  enableGrid: true,
};

export const DEFAULT_D3YAXIS_OPTIONS: IccD3AxisOptions = {
  axisLabelDistance: -30,
  position: 'left',
  textAnchor: 'middle',
  rotate: -90,
  tickSize: 0,
  tickPadding: 5,
  enableGrid: true,
};


/*


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
