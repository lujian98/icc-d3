
export interface IccD3PopoverSerie {
  key: string;
  value: string;
  color: string;
}

export interface IccD3Popover {
  key?: string;
  value?: string;
  series: IccD3PopoverSerie[];
}
