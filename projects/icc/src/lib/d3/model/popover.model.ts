
export interface IccD3PopoverSerie {
  key: string;
  value: string;
  color: string;
  hoved?: boolean;
}

export interface IccD3Popover {
  key?: string;
  value?: string;
  series: IccD3PopoverSerie[];
}
