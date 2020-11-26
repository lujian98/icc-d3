
export interface IccD3PopoverSerie {
  // key label: need this ??? key: string;
  value: string;
  color: string;
  hovered?: boolean;
}

export interface IccD3Popover {
  key?: string;
  value?: string;
  series: IccD3PopoverSerie[];
}

export interface IccD3PopoverOptions {
  totalLable?: string;
  axisFormatter?: Function; // labelFormatter
  serieFormatter?: Function; // key
  valueFormatter?: Function;
}

