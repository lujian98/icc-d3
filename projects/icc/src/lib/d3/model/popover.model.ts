import * as d3Format from 'd3-format';

export interface IccD3PopoverSerie {
  key: string;
  value: string;
  color?: string;
  hovered?: boolean;
}

export interface IccD3Popover {
  key?: string;
  value?: string;
  series: IccD3PopoverSerie[];
}

export interface IccD3PopoverOptions {
  totalLable?: string;
  axisFormatter?: Function;
  serieFormatter?: Function;
  valueFormatter?: Function;
  normalizedFormatter?: Function;
}

export const DEFAULT_D3POPOVER_OPTIONS: IccD3PopoverOptions = {
  totalLable: 'Total',
  axisFormatter: (d) => d,
  serieFormatter: (d) => d,
  valueFormatter: (d) => d3Format.format(',.2f')(d),
  normalizedFormatter: (d) => d3Format.format(',.2f')(d)
};

