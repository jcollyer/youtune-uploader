import * as R from 'ramda';

export const capitalize = (string:string) => R.concat(R.toUpper(R.head(string)), R.tail(string));
