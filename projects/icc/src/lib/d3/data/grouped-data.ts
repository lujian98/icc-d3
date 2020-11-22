export class IccGroupedData<T> {

  constructor(
    private options: any,
  ) {
  }

  getGroupedData(data: T[], isXGrouped: boolean): any[] {
    const options = isXGrouped ? { v: (d: any) => this.options.x(d) } : { v: (d: any) => this.options.y(d) };
    let tdata = [];
    data.forEach((d) => {
      let sk; let kv;
      for (const [k, v] of Object.entries(d)) {
        if (!Array.isArray(d[k])) {
          sk = k;
          kv = v;
        } else {
          tdata = d[k].map((r) => {
            const exist = tdata.filter((nd) => options.v(nd) === options.v(r));
            const o = exist.length === 0 ? {} : exist[0];
            if (exist.length === 0) {
              o[k] = [];
            }
            for (const [key, value] of Object.entries(r)) {
              if (options.v(r) === value) {
                o[key] = value;
              } else {
                const m = {};
                m[sk] = kv;
                m[key] = value;
                o[k].push(m);
              }
            }
            return o;
          });
        }
      }
    });
    return tdata;
  }
}

