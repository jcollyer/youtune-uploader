export const sortByProp = (a:any, b:any, prop:any) => {
  if (!a || !b) return 0;
  if (!a[prop] && !b[prop]) return 0;
  if (!b[prop]) return 1;
  if (!a[prop]) return -1;
  if (a[prop] > b[prop]) return 1;
  if (a[prop] < b[prop]) return -1;
  return 0;
};

export const sortByName = (a:any, b:any) => {
  if (!a || !b) return 0;
  if (a.name < b.name) return -1;
  if (a.name > b.name) return 1;
  return 0;
};

export const sortByOrder = (a:any, b:any) => {
  if (!a || !b) return 0;
  if (a.order < b.order) return -1;
  if (a.order > b.order) return 1;
  return 0;
};

export const sortItemsByOrder = (items:any) => items.sort(sortByOrder);
