
export abstract class IccAbstractScale {
  abstract getScale(range: any[], reverse: boolean): any;
  abstract updateRange(scale: any, range: [], reverse: boolean): void;
  abstract setXDomain(scale: any, data: any[]): void;
  abstract setYDomain(scale: any, data: any[]): void;

  constructor(
    protected options: any,
  ) {
  }
}

