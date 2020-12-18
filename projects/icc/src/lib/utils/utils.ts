export class IccUtils {
  static clone<T>(data: T): T {
    return JSON.parse(JSON.stringify(data));
  }

  static dataSortByField<T>(data: T[], field: string | Function, direction: string): T[] {
    const order = direction === 'asc' ? 1 : -1;
    data.sort((d1, d2) => {
      const v1 = typeof field !== 'function' ? d1[field] : field(d1);
      const v2 = typeof field !== 'function' ? d2[field] : field(d2);
      let res = null;
      if (v1 == null && v2 != null) {
        res = -1;
      } else if (v1 != null && v2 == null) {
        res = 1;
      } else if (v1 == null && v2 == null) {
        res = 0;
      } else if (typeof v1 === 'string' && typeof v2 === 'string') {
        res = v1.localeCompare(v2);
      } else {
        res = (v1 < v2) ? -1 : (v1 > v2) ? 1 : 0;
      }
      return (order * res);
    });
    return data;
  }
}
