
export abstract class IccAbstractScale {
  abstract getScale(range: any[], reverse: boolean);
  abstract updateRange(scale: any, range: [], reverse: boolean)
  abstract setXDomain(scale: any, data: any[]);
  abstract setYDomain(scale: any, data: any[]);

  constructor(
    protected options: any,
  ) {
  }
}

